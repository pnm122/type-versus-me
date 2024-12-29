import { CursorColor } from '../types/Cursor'
import CursorColors from './CursorColors'

export function generateColor(
	colors: Readonly<CursorColor[]> | CursorColor[] = CursorColors
): CursorColor {
	return colors[Math.round(Math.random() * (colors.length - 1))]!
}

export function generateColorFromPreference(
	preferred: CursorColor,
	taken: CursorColor[]
): CursorColor {
	const available = CursorColors.reduce<CursorColor[]>(
		(acc, color) => (taken.includes(color) ? acc : [...acc, color]),
		[]
	)

	if (available.includes(preferred)) return preferred
	else return generateColor(available)
}
