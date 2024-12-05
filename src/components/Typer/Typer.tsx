import createClasses from "@/utils/createClasses"
import { Fragment, KeyboardEvent, useEffect, useLayoutEffect, useRef, useState } from "react"
import styles from './style.module.scss'

export type TyperStats = Stats & {
  perWordStats: Stats[]
}

interface Stats {
  errorsMade: number
  errorsLeft: number
  correct: number
  startTime: number
  endTime: number
  rawWPM: number
  netWPM: number
}

interface Props {
  /** Text to display in the Typer */
  text: string
  /** Whether the test has been finished */
  finished: boolean
  /**
   * Callback for when a user input should cause the typed text to change
   **/
  onChange: (stats: TyperStats) => void
  /**
   * Callback for when the first onChange event is fired after initialization/reset
   * @param t time when starting the test
   **/
  onStart: (t: number) => void
  /**
   * Callback for when the test is finished by either correctly typing the last word or pressing Space/Enter on the last word.
   * @param stats statistics from the test
   **/
  onFinish: (stats: TyperStats) => void
}

type WordRegionType = 'match' | 'no-match' | 'original-only' | 'typed-only'

interface Word {
  /** Whether this word was typed and submitted correctly */
  correct: boolean
  /** Regions within the current word */
  regions: WordRegion[]
  /** Index of the first character of the word, based on text displayed to user */
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
  finished,
  onChange,
  onStart,
  onFinish
}: Props) {

  function getInitialStats(numWords = 0): TyperStats {
    const INIT: Stats = {
      errorsMade: 0,
      errorsLeft: 0,
      correct: 0,
      startTime: -1,
      endTime: -1,
      rawWPM: -1,
      netWPM: -1,
    }

    return {
      ...INIT,
      perWordStats: Array<Stats>(numWords).fill(INIT)
    }
  }

  const typer = useRef<HTMLDivElement>(null)
  const cursor = useRef<HTMLDivElement>(null)
  const cursorBlinkingTimeout = useRef<NodeJS.Timeout | null>(null)
  const stats = useRef<TyperStats>(getInitialStats())

  const [typed, setTyped] = useState('')

  const textRegions = getTextRegions(text, typed)

  const displayedText = textRegions.map(w => w.regions.map(r => r.text).join('')).join(' ')

  const cursorPosition = words(displayedText).reduce((acc, word, index) => {
    const typedWords = words(typed)
    if(index >= typedWords.length) return acc
    if(index === typedWords.length - 1) return acc + typedWords.at(-1)!.length

    // add 1 to account for space between words
    return acc + word.length + 1
  }, 0)

  const cursorAtStartOfWord = !!textRegions.find(w => w.start === cursorPosition)

  function getTextRegions(tempText: string, tempTyped: string) {
    return words(tempText).reduce<Word[]>((acc, word, index, arr) => {
      const typedWords = words(tempTyped)
      const isNotLastWordAndCorrect = index < typedWords.length - 1 && word === typedWords[index]
      const isLastWordAndCorrect = index === arr.length - 1 && word === typedWords[index]
      return [
        ...acc,
        {
          correct: isNotLastWordAndCorrect || isLastWordAndCorrect,
          regions: getWordRegions(word, typedWords[index]),
          // Add one to account for spaces between words
          start: acc.reduce((a, curr) => a + getWordLength(curr) + 1, 0),
          distanceToCurrent: typedWords.length - 1 - index
        }
      ]
    }, [])
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    e.preventDefault()

    if(finished) {
      return
    }

    if(e.key === ' ' && cursorAtStartOfWord) {
      return
    }

    if(e.key.length > 1 && !['Backspace', 'Delete'].includes(e.key)) {
      return
    }

    const previousWordCorrect = textRegions.find(w => w.distanceToCurrent === 1)?.correct

    if(['Backspace', 'Delete'].includes(e.key)) {
      if(typed.length === 0 || (previousWordCorrect && cursorAtStartOfWord)) {
        return
      }
      
      return handleChange(typed.slice(0, -1))
    }

    if((e.key === ' ' || e.key === 'Enter') && words(text).length === words(typed).length) {
      return handleFinish()
    }

    const newTyped = `${typed}${e.key}`

    if(finishedWithCorrectLastWord(text, newTyped)) {
      handleFinish()
    }

    if(stats.current.startTime === -1 && typed.length === 0) {
      handleStart()
    }

    handleChange(newTyped)
  }

  function getNumberOfErrorsTotal(regions: Word[]) {
    return regions.reduce((acc, w) => (
      acc + w.regions.reduce((acc, r) => (
        r.type === 'no-match' || r.type === 'typed-only'
          ? acc + r.text.length
          : acc
      ), 0)
    ), 0)
  }

  function getNumberOfCorrectTotal(regions: Word[]) {
    return regions.reduce((acc, w) => (
      acc + w.regions.reduce((acc, r) => (
        r.type === 'match'
          ? acc + r.text.length
          : acc
      ), w.distanceToCurrent > 0 ? 1 : 0)
    ), 0)
  }

  function handleChange(newTyped: string) {
    const newRegions = getTextRegions(text, newTyped)
    const newErrorsLeft = getNumberOfErrorsTotal(newRegions)
    const oldErrorsLeft = getNumberOfErrorsTotal(textRegions)
    const correct = getNumberOfCorrectTotal(newRegions)
    
    stats.current = {
      ...stats.current,
      errorsMade: newErrorsLeft > oldErrorsLeft ? stats.current.errorsMade + 1 : stats.current.errorsMade,
      errorsLeft: newErrorsLeft,
      correct,
      netWPM: (correct / 5) / ((Date.now() - stats.current.startTime) / 60000),
      rawWPM: ((correct + newErrorsLeft) / 5) / ((Date.now() - stats.current.startTime) / 60000)
    }

    setTyped(newTyped)
    onChange(stats.current)
  }

  function handleStart() {
    stats.current.startTime = Date.now()
    onStart(stats.current.startTime)
  }

  function handleFinish() {
    stats.current.endTime = Date.now()
    onFinish(stats.current)
  }

  function finishedWithCorrectLastWord(testText: string, testTyped: string) {
    const textWords = words(testText)
    const typedWords = words(testTyped)

    return textWords.length === typedWords.length && textWords.at(-1) === typedWords.at(-1)
  }

  /**
   * Split a piece of text into words
   */
  function words(str: string) {
    return str.split(' ')
  }

  function getWordLength(word: Word) {
    return word.regions.reduce((acc, region) => acc + region.text.length, 0)
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

  useEffect(() => {
    stats.current = getInitialStats(words(text).length)
    setTyped('')
  }, [text])

  return (
    <>
      <div
        onKeyDown={onKeyDown}
        tabIndex={finished ? -1 : 0}
        className={createClasses({
          [styles['typer']]: true,
          [styles['typer--finished']]: finished
        })}
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
