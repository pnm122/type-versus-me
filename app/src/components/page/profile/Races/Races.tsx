import { Suspense } from 'react'
import RacesLoading from './RacesLoading'
import RacesContentServer from './RacesContentServer'

export default async function Races({
	searchParams,
	userId
}: {
	searchParams: Record<string, string | string[]>
	userId: string
}) {
	return (
		<Suspense fallback={<RacesLoading searchParams={searchParams} />}>
			<RacesContentServer searchParams={searchParams} userId={userId} />
		</Suspense>
	)
}
