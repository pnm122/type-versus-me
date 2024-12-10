import { CursorColor } from "$shared/types/Cursor";

const COLORS: CursorColor[] = [
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'purple',
  'pink'
]

export default function generateColor(): CursorColor {
  return COLORS[Math.round(Math.random() * (COLORS.length - 1))]
}