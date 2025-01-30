import { CursorColor } from '../types/Cursor'
import CursorColors from './CursorColors'

export function generateColor(
	colors: Readonly<CursorColor[]> | CursorColor[] = CursorColors
): CursorColor {
	return colors[Math.round(Math.random() * (colors.length - 1))]!
}
