'use client'

import Link from 'next/link'
import styles from './style.module.scss'
import Account from '../Account/Account'
import Pill from '@/components/base/Pill/Pill'
import { useEffect, useState } from 'react'
import { useActiveUserCount } from '@/hooks/useActiveUserCount'

export default function Header() {
	const [mounted, setMounted] = useState(false)
	const activeUserCount = useActiveUserCount()

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
			<Account />
		</header>
	)
}
