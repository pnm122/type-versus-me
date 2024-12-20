import { CursorColor } from "$shared/types/Cursor"
import createClasses from "@/utils/createClasses"
import { Fragment, useEffect, useRef, useState } from "react"
import styles from './style.module.scss'
import TyperCursor from "../TyperCursor/TyperCursor"
import { getCursorPosition, getTextRegions } from "@/utils/typer"

interface Props {
  cursorColor?: CursorColor
  text: string
  className?: string
}

export default function TyperPreview({
  cursorColor,
  text,
  className
}: Props) {
  const [cursorPosition, setCursorPosition] = useState(0)
  const preview = useRef<HTMLSpanElement | null>(null)
  const timeout = useRef<NodeJS.Timeout | null>(null)

  const typed = text.slice(0, cursorPosition)

  const textRegions = getTextRegions(text, typed)

  function nextDelay() {
    return (Math.random() * 125) + 100
  }

  function next(pos: number, forwards: boolean) {
    if(pos === 0) {
      timeout.current = setTimeout(() => {
        setCursorPosition(1)
        next(1, true)
      }, 2500)
    } else if(pos === text.length) {
      timeout.current = setTimeout(() => {
        setCursorPosition(text.length - 1)
        next(text.length - 1, false)
      }, 2500)
    } else if(forwards) {
      timeout.current = setTimeout(() => {
        setCursorPosition(pos + 1)
        next(pos + 1, true)
      }, nextDelay())
    } else {
      timeout.current = setTimeout(() => {
        setCursorPosition(pos - 1)
        next(pos - 1, false)
      }, nextDelay())
    }
  }

  useEffect(() => {
    setCursorPosition(0)
    next(0, true)

    return () => {
      if(timeout.current) {
        clearTimeout(timeout.current)
      }
    }
  }, [text])

  return (
    <span
      ref={preview}
      className={createClasses({
        [styles['typer-preview']]: true,
        ...(className ? { [className]: true } : {})
      })}>
      <TyperCursor
        typer={preview}
        color={cursorColor ?? 'blue'}
        position={getCursorPosition(typed)}
        wordClassName={styles['word']}
        characterClassName={styles['character']}
      />
      {textRegions.map((word, index) => (
        <Fragment key={index}>
          <span className={styles['word']}>
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
    </span>
  )
}
