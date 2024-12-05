import createClasses from "@/utils/createClasses"
import { Fragment, KeyboardEvent, useCallback, useEffect, useLayoutEffect, useRef } from "react"
import styles from './style.module.scss'

interface Props {
  text: string
  typed: string
  onChange: (s: string) => void
}

type WordRegionType = 'match' | 'no-match' | 'original-only' | 'typed-only'

interface Word {
  /** Whether this word was typed and submitted correctly */
  correct: boolean
  /** Regions within the current word */
  regions: WordRegion[]
  /** Start index of the word, based on text displayed to user */
  start: number
  /** Distance to word currently being typed. Positive if before, 0 if current, and negative if after. */
  distanceToCurrent: number
}

interface WordRegion {
  /** Type for this region */
  type: WordRegionType
  /** Text within the region */
  text: string
}

export default function Typer({
  text,
  typed,
  onChange
}: Props) {
  const typer = useRef<HTMLDivElement>(null)
  const cursor = useRef<HTMLDivElement>(null)
  const cursorBlinkingTimeout = useRef<NodeJS.Timeout | null>(null)

  const textRegions = text.split(' ').reduce<Word[]>((acc, word, index) => {
    const typedWords = typed.split(' ')
    return [
      ...acc,
      {
        correct: index < typedWords.length - 1 && word === typedWords[index],
        regions: getWordRegions(word, typedWords[index]),
        // Add one to account for spaces between words
        start: acc.reduce((a, curr) => a + getWordLength(curr) + 1, 0),
        distanceToCurrent: typedWords.length - 1 - index
      }
    ]
  }, [])

  const displayedText = textRegions.map(w => w.regions.map(r => r.text).join('')).join(' ')

  const cursorPosition = displayedText.split(' ').reduce((acc, word, index) => {
    const typedWords = typed.split(' ')
    if(index >= typedWords.length) return acc
    if(index === typedWords.length - 1) return acc + typedWords.at(-1)!.length

    // add 1 to account for space between words
    return acc + word.length + 1
  }, 0)

  const cursorAtStartOfWord = !!textRegions.find(w => w.start === cursorPosition)

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    e.preventDefault()

    const previousWordCorrect = textRegions.find(w => w.distanceToCurrent === 1)?.correct

    if((e.key === 'Backspace' || e.key === 'Delete')) {
      if(typed.length === 0 || (previousWordCorrect && cursorAtStartOfWord)) {
        return
      }
      
      onChange(typed.slice(0, -1))
    }

    if(e.key.length > 1) {
      return
    }

    onChange(`${typed}${e.key}`)
  }

  function getWordLength(word: Word) {
    return word.regions.reduce((acc, region) => acc + region.text.length, 0)
  }

  function getTextFromWord(word: Word) {
    return word.regions.map(r => r.text).join('')
  }

  function getCharacterType(original: string | undefined, compare: string | undefined): WordRegionType {
    if(!original) {
      return 'typed-only'
    } else if(!compare) {
      return 'original-only'
    } else if(original === compare) {
      return 'match'
    } else {
      return 'no-match'
    }
  }

  function getWordRegions(word: string, compare: string | undefined): WordRegion[] {
    if(!compare) {
      return [{
        type: 'original-only',
        text: word
      }]
    }

    return Array(Math.max(word.length, compare.length)).fill(null).reduce<WordRegion[]>((acc, _, index) => {
      const wordChar = word[index]
      const compareChar = compare[index]
      
      const charType = getCharacterType(wordChar, compareChar)
      
      // Add to the last region if this character is the same type of region
      if(acc.at(-1)?.type === charType) {
        return [
          ...acc.slice(0, -1),
          {
            type: acc.at(-1)!.type,
            text: `${acc.at(-1)!.text}${charType === 'typed-only' ? compareChar : wordChar}`
          }
        ]
      }

      return [
        ...acc,
        {
          type: charType,
          text: charType === 'typed-only' ? compareChar : wordChar
        }
      ]
    }, [])
  }

  function setCursorPosition() {
    if(!typer.current || !cursor.current) return

    const typedElements = typer.current.querySelectorAll(`.${styles['character']}`)
    const { left: typerLeft, top: typerTop } = typer.current!.getBoundingClientRect()
    const { left: charLeft, top: charTop } = Array.from(typedElements!).at(cursorPosition)!.getBoundingClientRect()

    cursor.current.style.transform = `translate(${charLeft - typerLeft}px, ${charTop - typerTop}px)`
    cursor.current.classList.remove(styles['cursor--blinking'])
    // Stop the previous timer if it exists
    if(cursorBlinkingTimeout.current) {
      clearTimeout(cursorBlinkingTimeout.current)
    }
    // Wait until after cursor transform transition is done to start blinking again
    cursorBlinkingTimeout.current = setTimeout(() => {
      cursor.current?.classList.add(styles['cursor--blinking'])
      cursorBlinkingTimeout.current = null
    }, 100)
  }
  
  // Move the cursor to the current letter when typed text changes
  useLayoutEffect(() => {
    window.addEventListener('resize', setCursorPosition)
    setCursorPosition()

    return () => {
      window.removeEventListener('resize', setCursorPosition)
    }
  }, [text, typed])

  return (
    <>
      <div
        onKeyDown={onKeyDown}
        tabIndex={0}
        className={styles['typer']}
        ref={typer}>
        <div className={styles['cursor']} ref={cursor}></div>
        {textRegions.map((word, index) => (
          <Fragment key={index}>
            <span
              className={createClasses({
                [styles['word']]: true,
                [styles['word--incorrect']]: !word.correct && word.distanceToCurrent > 0
              })}
            >
              {word.regions.map(wordRegion => (
                Array.from(wordRegion.text).map((char, index) => (
                  <span
                    key={index}
                    className={createClasses({
                      [styles['character']]: true,
                      [styles[wordRegion.type]]: true
                    })}
                  >
                    {char}
                  </span>
                ))
              ))}
            </span>
            <span className={styles['character']}>
              {' '}
            </span>
          </Fragment>
        ))}
      </div>
    </>
  )
}
