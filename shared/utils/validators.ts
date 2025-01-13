import { CursorColor } from '$shared/types/Cursor'
import { roomCategories } from '$shared/types/Room'
import CursorColors from './CursorColors'

/**
 * Check if a username is valid.
 * Must be an alphanumeric (+ underscores) string with length >= 3 and <= 16
 */
export function isValidUsername(username: any) {
	if (typeof username !== 'string') {
		return false
	}

	if (username.length < 3 || username.length > 16) {
		return false
	}

	if (username.match(/[^a-zA-Z0-9_]/)) {
		return false
	}

	return true
}

/**
 * Check if a color is valid.
 */
export function isValidColor(color: any): color is CursorColor {
	return CursorColors.includes(color)
}

export function isValidRoomCategory(category: any): category is (typeof roomCategories)[number] {
	return roomCategories.includes(category)
}
