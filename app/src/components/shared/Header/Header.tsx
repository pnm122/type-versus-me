import { Suspense } from 'react'
import HeaderLoading from './HeaderLoading'
import HeaderServer from './HeaderServer'

export default async function Header() {
	return (
		<Suspense fallback={<HeaderLoading />}>
			<HeaderServer />
		</Suspense>
	)
}
