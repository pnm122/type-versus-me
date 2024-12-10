import { CursorColor, CursorPosition } from "./Cursor"

export interface User {
  id: string
  username: string
  color: CursorColor
  score?: TestScore
  state?: UserState
}

export interface TestScore {
  cursorPosition: CursorPosition
  netWPM: number
}

export type UserState = 'not-ready' | 'ready' | 'in-progress' | 'complete' | 'failed'