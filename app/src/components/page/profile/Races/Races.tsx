import { Suspense } from 'react'
import RacesLoading from './RacesLoading'
import RacesContentServer from './RacesContentServer'

export default async function Races() {
	return (
		<Suspense fallback={<RacesLoading />}>
			<RacesContentServer />
		</Suspense>
	)
}
