'use client'

import styles from './style.module.scss'
import GoogleSignIn from '@/components/shared/GoogleSignIn/GoogleSignIn'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'

export default function Login() {
	const searchParams = useSearchParams()
	const callbackUrl = searchParams.get('callbackUrl') ?? '/'

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault()
		await signIn('google', { callbackUrl })
	}

	return (
		<main className={styles['page']}>
			<form onSubmit={onSubmit} className={styles['form']}>
				<div className={styles['form__text']}>
					<h1 className={styles['heading']}>Login or Sign Up</h1>
				</div>
				<GoogleSignIn type="submit" />
			</form>
		</main>
	)
}
