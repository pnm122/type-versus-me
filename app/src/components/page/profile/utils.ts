import { roomCategories } from '$shared/types/Room'
import { isValidRoomCategory } from '$shared/utils/validators'

// export function transformMinWords(value: string | string[] | undefined) {}

// export function transformMaxWords(value: string | string[] | undefined) {}

export function transformCategory(value: string | string[] | undefined) {
	const testValue = typeof value === 'string' ? [value] : value ? value : []
	if (testValue.every((v) => isValidRoomCategory(v))) {
		return testValue
	}

	return roomCategories.map((v) => v)
}
