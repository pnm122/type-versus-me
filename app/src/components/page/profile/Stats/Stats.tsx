import { Suspense } from 'react'
import StatsLoading from './StatsLoading'
import StatsContentServer from './StatsContentServer'
import {
	transformAllNumWords,
	transformCategory,
	transformMaxWords,
	transformMinWords
} from '@/components/page/profile/utils'
import { CATEGORY_PARAM_KEY, MAX_WORDS_PARAM_KEY, MIN_WORDS_PARAM_KEY } from './utils'
import { User } from 'next-auth'

export default async function Stats({
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

	return (
		<Suspense fallback={<StatsLoading />}>
			<StatsContentServer filters={{ category, minWords, maxWords }} user={user} />
		</Suspense>
	)
}
