import CursorColors from '../utils/CursorColors'

export type CursorColor = typeof CursorColors[number]

export interface CursorPosition {
  word: number
  letter: number
}