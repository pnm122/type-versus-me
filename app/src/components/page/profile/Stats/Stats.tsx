import { Suspense } from 'react'
import StatsLoading from './StatsLoading'
import StatsContentServer from './StatsContentServer'
import { transformCategory } from '@/components/page/profile/utils'
import { CATEGORY_PARAM_KEY } from './utils'
import { User } from 'next-auth'

export default async function Stats({
	searchParams,
	user
}: {
	searchParams: Record<string, string | string[]>
	user: User
}) {
	const category = transformCategory(searchParams[CATEGORY_PARAM_KEY])

	return (
		<Suspense fallback={<StatsLoading />}>
			<StatsContentServer filters={{ category }} user={user} />
		</Suspense>
	)
}
