import createClasses from "@/utils/createClasses"
import { KeyboardEvent, useEffect } from "react"
import styles from './style.module.scss'

interface Props {
  text: string
  typed: string
  onChange: (s: string) => void
}

type WordRegionType = 'match' | 'no-match' | 'original-only' | 'typed-only'

interface WordRegion {
  type: WordRegionType
  text: string
}

export default function Typer({
  text,
  typed,
  onChange
}: Props) {
  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    e.preventDefault()

    if(typed.length !== 0 && (e.key === 'Backspace' || e.key === 'Delete')) {
      onChange(typed.slice(0, -1))
    }

    if(e.key.length > 1) {
      return
    }

    onChange(`${typed}${e.key}`)
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

  function getTextRegions(original: string, compare: string) {
    const compareWords = compare.split(' ')
    return original.split(' ').map((word, index) => {
      return {
        incorrect: index < compareWords.length - 1 && word !== compareWords[index],
        regions: getWordRegions(word, compareWords[index])
      }
    })

    
  }

  useEffect(() => {
    console.log(getTextRegions(text, typed).slice(0, 2).map(r => r.regions.map(x => x.text)))
  }, [text, typed])

  return (
    <>
      <div
        onKeyDown={onKeyDown}
        tabIndex={0}
        className={styles['typer']}>
        {getTextRegions(text, typed).map((textRegion, index) => (
          <>
            <span
              key={index}
              className={createClasses({
                [styles['word']]: true,
                [styles['word--incorrect']]: textRegion.incorrect
              })}
            >
              {textRegion.regions.map((wordRegion, index) => (
                <span
                  key={index}
                  className={createClasses({
                    [styles[wordRegion.type]]: true
                  })}
                >
                  {wordRegion.text}
                </span>
              ))}
            </span>
            <span className={styles['word']}>
              {' '}
            </span>
          </>
        ))}
      </div>
    </>
  )
}
