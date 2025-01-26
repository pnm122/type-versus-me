import { MAX_TEST_WORDS, MIN_TEST_WORDS } from '$shared/constants'
import { isValidRoomCategory } from '$shared/utils/validators'

export function transformMinWords(value: string | string[] | undefined) {
	const testValue = parseInt(typeof value === 'string' ? value : value ? value[0] : '')
	if (Number.isNaN(testValue) || testValue < MIN_TEST_WORDS) {
		return MIN_TEST_WORDS
	} else if (testValue > MAX_TEST_WORDS) {
		return MAX_TEST_WORDS
	}

	return testValue
}

export function transformMaxWords(value: string | string[] | undefined) {
	const testValue = parseInt(typeof value === 'string' ? value : value ? value[0] : '')
	if (Number.isNaN(testValue) || testValue > MAX_TEST_WORDS) {
		return MAX_TEST_WORDS
	} else if (testValue < MIN_TEST_WORDS) {
		return MIN_TEST_WORDS
	}

	return testValue
}

export function transformCategory(value: string | string[] | undefined) {
	const testValue = typeof value === 'string' ? [value] : value ? value : []
	return testValue.filter((v) => isValidRoomCategory(v))
}

export function transformAllNumWords<T extends Record<string, any>>(
	value: T,
	minWordsKey: keyof T,
	maxWordsKey: keyof T
) {
	return {
		...value,
		[minWordsKey]: value[minWordsKey] > value[maxWordsKey] ? value[maxWordsKey] : value[minWordsKey]
	}
}
