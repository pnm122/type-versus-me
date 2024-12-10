import createClasses from "@/utils/createClasses"
import { Fragment, KeyboardEvent, useEffect, useLayoutEffect, useRef, useState } from "react"
import styles from './style.module.scss'
import { Cursor } from "@/types/Cursor"
import TyperCursor from "../TyperCursor/TyperCursor"
import { CursorColor, CursorPosition } from "$shared/types/Cursor"

export type TyperStats = Stats & {
  perWordStats: PerWordStats[]
}

type PerWordStats = Stats & {
  aggregateRawWPM: number
  aggregateNetWPM: number
}

interface Stats {
  /** Number of errors made while typing */
  errorsMade: number
  /** Number of errors still left in typed text */
  errorsLeft: number
  /** Number of correct keystrokes made while typing */
  correctMade: number
  /** Number of correct keystrokes left in typed text */
  correctLeft: number
  /** Start time in ms since epoch */
  startTime: number
  /** End time in ms since epoch */
  endTime: number
  /** Words per minute without accounting for errors. (Keystrokes / 5) / (Elapsed time in minutes) */
  rawWPM: number
  /** Words for minute, counting only correct keystrokes. (Correct keystrokes / 5) / (Elapsed time in minutes) */
  netWPM: number
  /** Percentage of correct keystrokes. (Correct keystrokes) / (Total keystrokes) */
  accuracy: number
}

interface LineInfo {
  /** Lines and their distance from the top of the Typer */
  lines: number[]
  /** Line the cursor is currently on */
  currentLine: number,
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
   * Callback for when the test is finished by correctly typing the entire text
   * @param stats statistics from the test
   **/
  onFinish: (stats: TyperStats) => void
  /**
   * Other players' cursors to show within the Typer
   */
  cursors?: Cursor[]
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
  onFinish,
  cursors
}: Props) {
  function getInitialStats(numWords = 0): TyperStats {
    const INIT: Stats = {
      errorsMade: 0,
      errorsLeft: 0,
      correctMade: 0,
      correctLeft: 0,
      startTime: -1,
      endTime: -1,
      rawWPM: -1,
      netWPM: -1,
      accuracy: 0
    }

    return {
      ...INIT,
      perWordStats: Array<PerWordStats>(numWords).fill({
        ...INIT,
        aggregateRawWPM: -1,
        aggregateNetWPM: -1
      })
    }
  }

  // TODO: Replace with context
  const cursorColor: CursorColor = 'blue'
  // TODO: Replace with context
  const userID = 0

  const typer = useRef<HTMLDivElement>(null)
  const stats = useRef<TyperStats>(getInitialStats())

  const [typed, setTyped] = useState('')

  const textRegions = getTextRegions(text, typed)

  const displayedText = textRegions.map(w => w.regions.map(r => r.text).join('')).join(' ')

  const cursorPosition = getCursorPosition(typed)

  const cursorAtStartOfWord = cursorPosition.letter === 0

  function getCursorPosition(typed: string) {
    return {
      word: Math.max(words(typed).length - 1, 0),
      letter: typed === '' ? 0 : words(typed).at(-1)!.length
    }
  }

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

    // Disallow pressing space on the last word
    if(e.key === ' ' && textRegions.at(-1)?.distanceToCurrent === 0) {
      return
    }

    if(e.key.length > 1 && !['Backspace', 'Delete'].includes(e.key)) {
      return
    }

    if(['Backspace', 'Delete'].includes(e.key)) {
      if(typed.length === 0) return

      return handleChange(typed.slice(0, -1))
    }

    const newTyped = `${typed}${e.key}`

    if(stats.current.startTime === -1 && typed.length === 0) {
      handleStart()
    }

    handleChange(newTyped)

    // Finish event AFTER change event to ensure all stats are updated
    if(text === newTyped) {
      handleFinish()
    }
  }

  function isIncorrect(word: Word) {
    return !word.correct && word.distanceToCurrent > 0
  }

  function getTotalCorrectAndErrors(regions: Word[]) {
    interface CorrectAndErrors {
      correct: number
      errors: number
    }

    function sum(a: CorrectAndErrors, b: CorrectAndErrors) {
      return {
        correct: a.correct + b.correct,
        errors: a.errors + b.errors
      }
    }

    return regions.reduce((acc, w) => (
      sum(
        {
          // Correctly placed spaces count as correct keystrokes
          correct: isSubmitted(w) && isRightLength(w) ? acc.correct + 1 : acc.correct,
          // Incorrectly placed spaces count as incorrect keystrokes
          errors: isSubmitted(w) && !isRightLength(w) ? acc.errors + 1 : acc.errors,
        },
        w.regions.reduce((acc, r) => (
          r.type === 'no-match' || r.type === 'typed-only'
            ? { ...acc, errors: acc.errors + r.text.length }
            : r.type === 'match'
              ? { ...acc, correct: acc.correct + r.text.length }
              : acc
        ), { correct: 0, errors: 0 })
      )
    ), { correct: 0, errors: 0 })
  }

  function handleChange(newTyped: string) {
    const newRegions = getTextRegions(text, newTyped)
    const { correct: newCorrect, errors: newErrors } = getTotalCorrectAndErrors(newRegions)
    const { correct: oldCorrect, errors: oldErrors } = getTotalCorrectAndErrors(textRegions)

    const errorsMade = newErrors > oldErrors ? stats.current.errorsMade + 1 : stats.current.errorsMade
    const correctMade = newCorrect > oldCorrect ? stats.current.correctMade + 1 : stats.current.correctMade

    stats.current = {
      ...stats.current,
      errorsMade,
      errorsLeft: newErrors,
      correctMade,
      correctLeft: newCorrect,
      netWPM: (correctMade / 5) / ((Date.now() - stats.current.startTime) / 60000),
      rawWPM: ((correctMade + errorsMade) / 5) / ((Date.now() - stats.current.startTime) / 60000),
      accuracy: correctMade * 100 / (correctMade + errorsMade)
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

  /**
   * Split a piece of text into words
   */
  function words(str: string) {
    return str.split(' ')
  }

  function isSubmitted(word: Word) {
    return word.distanceToCurrent > 0
  }

  function isRightLength(word: Word) {
    return word.regions.every(r => r.type === 'match' || r.type === 'no-match')
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

  /**
   * Get information about the lines of text as they appear in the DOM
   * @returns the position of each line relative to the top of the typer, as well as the line the cursor is currently on
   */
  function getLineInfo(cursorPosition: CursorPosition): LineInfo {
    const inner = typer.current!.querySelector<HTMLElement>(`.${styles['typer__inner']}`)!
    const initialTransform = inner.style.transform
    inner.style.transform = ''

    const currentWordElement = typer.current!.querySelectorAll(`.${styles['word']}`).item(cursorPosition.word)
    const currentWordCharElements = [
      ...Array.from(currentWordElement.querySelectorAll(`.${styles['character']}`)),
      // Include the space after the word since the cursor can be attached to it too
      currentWordElement.nextSibling as Element
    ]
    const { top: typerTop } = inner.getBoundingClientRect()
    const { top: charTop } = currentWordCharElements[cursorPosition.letter].getBoundingClientRect()

    const allCharElements = typer.current!.querySelectorAll(`.${styles['character']}`)

    // Get a list of all lines' distance to the top of the typer
    const lines = Array.from(allCharElements).reduce<number[]>((acc, elem) => {
      const top = elem.getBoundingClientRect().top - typerTop
      if(acc.includes(top)) {
        return acc
      } else {
        return [...acc, top]
      }
    }, [])
    const currentLine = lines.findIndex(l => charTop - typerTop === l)

    inner.style.transform = initialTransform

    return {
      lines,
      currentLine
    }
  }

  function setLinePosition() {
    if(!typer.current) return

    const inner = typer.current.querySelector<HTMLElement>(`.${styles['typer__inner']}`)!

    const { lines, currentLine } = getLineInfo(cursorPosition)

    // Move the text of the typer so that the middle line is always where the cursor is, beginning with the second line
    if(currentLine > 1) {
      inner.style.transform = `translateY(-${lines[currentLine - 1]}px)`
    } else {
      inner.style.transform = ''
    }
  }

  useLayoutEffect(() => {
    window.addEventListener('resize', setLinePosition)
    setLinePosition()

    return () => {
      window.removeEventListener('resize', setLinePosition)
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
        {!finished && (
          <>
            <TyperCursor
              id={userID}
              color={cursorColor}
              position={cursorPosition}
              currentCursorPosition={cursorPosition}
              typer={typer}
            />
            {cursors?.map(c => (
              <TyperCursor
                key={c.id}
                typer={typer}
                opponent={true}
                currentCursorPosition={cursorPosition}
                {...c}
              />
            ))}
          </>
        )}
        {/*
          Need extra nested divs:
            * text is the container with a set height and no overflow, sibling to cursor so the cursor isn't cut off
            * inner is moved as needed to keep the cursor on the middle line
        */}
        <div className={styles['typer__inner']}>
          {textRegions.map((word, index) => (
            <Fragment key={index}>
              <span
                className={createClasses({
                  [styles['word']]: true,
                  [styles['word--incorrect']]: isIncorrect(word)
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
      </div>
    </>
  )
}
