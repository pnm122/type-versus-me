import { Suspense } from 'react'
import StatsLoading from './StatsLoading'
import StatsContentServer from './StatsContentServer'

export default async function Stats() {
	return (
		<Suspense fallback={<StatsLoading />}>
			<StatsContentServer />
		</Suspense>
	)
}
