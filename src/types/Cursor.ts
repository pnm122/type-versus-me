export interface Cursor {
  id: number
  color: CursorColor
  position: number
}

export type CursorColor = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink'