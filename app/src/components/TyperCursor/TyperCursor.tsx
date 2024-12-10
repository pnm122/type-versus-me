import { Cursor } from "@/types/Cursor"
import { useEffect, useRef } from "react"
import styles from './style.module.scss'
import typerStyles from '../Typer/style.module.scss'
import createClasses from "@/utils/createClasses"
import { CursorPosition } from "$shared/types/Cursor"



type Props = Cursor & {
  currentCursorPosition: CursorPosition
  typer: React.RefObject<HTMLDivElement>
  opponent?: boolean
}

export default function TyperCursor({
  id,
  color,
  position,
  currentCursorPosition,
  typer,
  opponent = false
}: Props) {
  const cursor = useRef<HTMLDivElement>(null)
  const cursorBlinkingTimeout = useRef<NodeJS.Timeout | null>(null)

  function hideCursor() {
    if(!cursor.current) return
    cursor.current.style.display = 'none'
  }

  function showCursor() {
    if(!cursor.current) return
    cursor.current.style.display = ''
  }

  function setCursorPosition() {
    if(!typer.current || !cursor.current || position.word < 0 || position.letter < 0) {
      return hideCursor()
    }
    
    const wordElement = typer.current.querySelectorAll(`.${typerStyles['word']}`).item(position.word)
    if(!wordElement) return hideCursor()
    const charElements = [
      ...Array.from(wordElement.querySelectorAll(`.${typerStyles['character']}`)),
      // Include the space after the word since the cursor can be attached to it too
      wordElement.nextSibling as Element
    ]
    const charAtCursor = charElements[
      position.letter >= charElements.length
        ? charElements.length - 1
        : position.letter
    ]
    
    // hide cursor if an invalid position
    if(!charAtCursor) {
      return hideCursor()
    }

    showCursor()

    const { left: typerLeft, top: typerTop } = typer.current.getBoundingClientRect()
    const { left: charLeft, top: charTop } = charAtCursor.getBoundingClientRect()

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

  // useEffect instead of useLayout effect so that the cursor position is calculated
  // AFTER the lines have been shifted in the Typer's useLayoutEffect
  useEffect(() => {
    setCursorPosition()
    window.addEventListener('resize', setCursorPosition)

    return () => {
      window.removeEventListener('resize', setCursorPosition)
    }
  }, [position, currentCursorPosition])

  return (
    <div
      className={createClasses({
        [styles['cursor']]: true,
        [styles[`cursor--${color}`]]: true,
        [styles['cursor--opponent']]: opponent
      })}
      ref={cursor}
    />
  )
}
