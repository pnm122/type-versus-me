export const MIN_ITEMS_PER_PAGE = 5
export const MAX_ITEMS_PER_PAGE = 25
export const PAGE_PARAM_KEY = 'races-page'
export const ITEMS_PER_PAGE_PARAM_KEY = 'races-items-per-page'

export function transformItemsPerPageParam(value: string | string[] | undefined) {
	const itemsPerPage = parseInt(typeof value === 'string' ? value : !value ? '' : value[0])
	if (Number.isNaN(itemsPerPage)) return 10
	if (itemsPerPage < MIN_ITEMS_PER_PAGE) return MIN_ITEMS_PER_PAGE
	if (itemsPerPage > MAX_ITEMS_PER_PAGE) return MAX_ITEMS_PER_PAGE
	return itemsPerPage
}

export function transformPageParam(value: string | string[] | undefined) {
	const page = parseInt(typeof value === 'string' ? value : !value ? '' : value[0])
	if (Number.isNaN(page) || page < 0) return 0
	return page
}
