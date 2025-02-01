import Login from '@/components/page/login/Login/Login'
import { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
	title: 'Login',
	description: 'Login to typevs.me to start saving your stats and unlocking new items!'
}

export default function Page() {
	return (
		// Need a suspense https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
		<Suspense>
			<Login />
		</Suspense>
	)
}
