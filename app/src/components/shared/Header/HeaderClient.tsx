'use client'

import Link from 'next/link'
import styles from './style.module.scss'
import Account from '../Account/Account'
import { Session } from 'next-auth'
import { User } from '@prisma/client'
import Pill from '@/components/base/Pill/Pill'
import { useGlobalState } from '@/context/GlobalState'
import { useEffect, useState } from 'react'

interface Props {
	session: Session | null
	user: User | null
}

export default function HeaderClient({ session, user }: Props) {
	const [mounted, setMounted] = useState(false)
	const { activeUserCount } = useGlobalState()

	useEffect(() => {
		setMounted(true)
	}, [])

	return (
		<header className={styles['header']}>
			<div className={styles['header__left']}>
				<Link href="/" className={styles['home']}>
					taptaptap.live
				</Link>
				<Pill
					text={`${mounted ? activeUserCount : 1} online`}
					backgroundColor="var(--positive-light)"
					foregroundColor="var(--positive)"
					icon={<div className={styles['dot']} />}
				/>
			</div>
			<Account session={session} user={user} />
		</header>
	)
}
