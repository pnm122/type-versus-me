import { CursorColor, CursorPosition } from '$shared/types/Cursor'

export interface Cursor {
  id: number
  color: CursorColor
  position: CursorPosition
}