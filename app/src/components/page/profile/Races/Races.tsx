import { Suspense } from 'react'
import RacesLoading from './RacesLoading'
import RacesContentServer from './RacesContentServer'
import { User } from 'next-auth'

export default async function Races({
	searchParams,
	// eslint-disable-next-line
	user
}: {
	searchParams: Record<string, string | string[]>
	user: User
}) {
	return (
		<Suspense fallback={<RacesLoading searchParams={searchParams} />}>
			<RacesContentServer />
		</Suspense>
	)
}
