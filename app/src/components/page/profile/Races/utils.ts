import { Prisma } from '@prisma/client'

export type ScoreAndRace = Prisma.ScoreGetPayload<{
	include: {
		race: {
			include: {
				scores: true
			}
		}
	}
}>

export const MIN_ITEMS_PER_PAGE = 5
export const MAX_ITEMS_PER_PAGE = 25
export const PAGE_PARAM_KEY = 'races-page'
export const ITEMS_PER_PAGE_PARAM_KEY = 'races-items-per-page'
export const CATEGORY_PARAM_KEY = 'races-category'
export const MIN_WORDS_PARAM_KEY = 'races-min-words'
export const MAX_WORDS_PARAM_KEY = 'races-max-words'

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

export function getPlacement(userId: string, scores: ScoreAndRace['race']['scores']): number {
	return scores.sort((a, b) => b.netWPM - a.netWPM).findIndex((s) => s.userId === userId) + 1
}
