import { getUserScores } from '@/utils/database/user'
import {
	transformAllNumWords,
	transformCategory,
	transformMaxWords,
	transformMinWords
} from '../utils'
import RacesContentClient from './RacesContentClient'
import {
	CATEGORY_PARAM_KEY,
	ITEMS_PER_PAGE_PARAM_KEY,
	MAX_WORDS_PARAM_KEY,
	MIN_WORDS_PARAM_KEY,
	PAGE_PARAM_KEY,
	transformItemsPerPageParam,
	transformPageParam
} from './utils'
import { User } from 'next-auth'

export default async function RacesContentServer({
	searchParams,
	user
}: {
	searchParams: Record<string, string | string[]>
	user: User
}) {
	const category = transformCategory(searchParams[CATEGORY_PARAM_KEY])
	const _minWords = transformMinWords(searchParams[MIN_WORDS_PARAM_KEY])
	const _maxWords = transformMaxWords(searchParams[MAX_WORDS_PARAM_KEY])
	const { minWords, maxWords } = transformAllNumWords(
		{ minWords: _minWords, maxWords: _maxWords },
		'minWords',
		'maxWords'
	)
	const page = transformPageParam(searchParams[PAGE_PARAM_KEY])
	const itemsPerPage = transformItemsPerPageParam(searchParams[ITEMS_PER_PAGE_PARAM_KEY])

	const { data: scores } = await getUserScores(user.id!, page, itemsPerPage, {
		category,
		minWords,
		maxWords
	})

	return <RacesContentClient scores={scores} userId={user.id!} />
}
