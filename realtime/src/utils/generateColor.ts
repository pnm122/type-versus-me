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

export function generateColor(colors: CursorColor[] = COLORS): CursorColor {
  return colors[Math.round(Math.random() * (colors.length - 1))]
}

export function generateColorFromPreference(preferred: CursorColor, taken: CursorColor[]): CursorColor {
  const available = COLORS.reduce<CursorColor[]>((acc, color) => (
    taken.includes(color)
      ? acc
      : [...acc, color]
  ),
  [])

  if(available.includes(preferred)) return preferred
  else return generateColor(available)
}