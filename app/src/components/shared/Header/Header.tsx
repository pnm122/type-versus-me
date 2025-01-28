'use client'

import Link from 'next/link'
import styles from './style.module.scss'
import Account from '../Account/Account'
import Pill from '@/components/base/Pill/Pill'
import { useEffect, useState } from 'react'
import { useActiveUserCount } from '@/hooks/useActiveUserCount'
import { useTimeout } from '@/hooks/useTimeout'
import Loader from '@/components/base/Loader/Loader'
import { useSocket } from '@/context/Socket'

export default function Header() {
	const [mounted, setMounted] = useState(false)
	const [showLoader, setShowLoader] = useState(false)
	const activeUserCount = useActiveUserCount()
	const socket = useSocket()
	const { clearTimeout } = useTimeout(
		() => {
			if (socket.state !== 'valid') setShowLoader(true)
		},
		2000,
		[socket.state === 'valid']
	)

	useEffect(() => {
		if (socket.state === 'valid') {
			clearTimeout()
			setShowLoader(false)
		}
	}, [socket.state])

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
				{showLoader && <Loader size={16} />}
			</div>
			<Account />
		</header>
	)
}
