export interface Cursor {
  id: number
  color: CursorColor
  position: CursorPosition
}

export type CursorColor = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink'

export interface CursorPosition {
  word: number
  letter: number
}