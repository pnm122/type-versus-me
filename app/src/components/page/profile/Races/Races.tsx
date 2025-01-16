import { Suspense } from 'react'
import RacesLoading from './RacesLoading'
import RacesContentServer from './RacesContentServer'

export default async function Races({
	searchParams
}: {
	searchParams: Record<string, string | string[]>
}) {
	return (
		<Suspense fallback={<RacesLoading searchParams={searchParams} />}>
			<RacesContentServer />
		</Suspense>
	)
}
