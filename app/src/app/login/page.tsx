// import styles from './style.module.scss'

'use client'

import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function Page() {
	const searchParams = useSearchParams()
	const callbackUrl = searchParams.get('callbackUrl') ?? '/'

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault()
		await signIn('google', { callbackUrl })
	}

	return (
		<form onSubmit={onSubmit}>
			<button type="submit">Sign in with Google</button>
		</form>
	)
}

export default function Login() {
	return (
		<Suspense>
			<Page />
		</Suspense>
	)
}
