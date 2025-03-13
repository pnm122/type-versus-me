export const MIN_ITEMS_PER_PAGE = 5
export const MAX_ITEMS_PER_PAGE = 25
export const DEFAULT_ITEMS_PER_PAGE = 10

export type LeaderboardPointsParams = 'page' | 'itemsPerPage'

export function transformPageParam(value?: string | string[]) {
	const testValue = parseInt(typeof value === 'string' ? value : value ? value[0] : '')
	if (Number.isNaN(testValue) || testValue < 0) {
		return 0
	}

	return testValue
}

export function transformItemsPerPageParam(value?: string | string[]) {
	const testValue = parseInt(typeof value === 'string' ? value : value ? value[0] : '')
	if (Number.isNaN(testValue)) {
		return DEFAULT_ITEMS_PER_PAGE
	} else if (testValue < MIN_ITEMS_PER_PAGE) {
		return MIN_ITEMS_PER_PAGE
	} else if (testValue > MAX_ITEMS_PER_PAGE) {
		return MAX_ITEMS_PER_PAGE
	}

	return testValue
}
