'use client'

import Link from 'next/link'
import styles from './style.module.scss'
import HeaderDropdown from '../HeaderDropdown/HeaderDropdown'
import { useEffect, useState } from 'react'
import { useActiveUserCount } from '@/hooks/useActiveUserCount'
import { useTimeout } from '@/hooks/useTimeout'
import Loader from '@/components/base/Loader/Loader'
import { useSocket } from '@/context/Socket'
import formatNumber from '@/utils/formatNumber'
import HeaderLink from './HeaderLink'
import { usePathname } from 'next/navigation'

export default function Header() {
	const [showLoader, setShowLoader] = useState(false)
	const activeUserCount = useActiveUserCount()
	const socket = useSocket()
	const path = usePathname()
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

	return (
		<header className={styles['header']}>
			<div className={styles['header__left']}>
				<div className={styles['home']}>
					<Link href="/" className={styles['home__link']}>
						typevs.me
					</Link>
					<div className={styles['home__separator']} />
					<span className={styles['home__user-count']}>
						{formatNumber(activeUserCount, true)} online
					</span>
					<div className={styles['home__loader']}>{showLoader && <Loader size={16} />}</div>
				</div>
				<ul className={styles['header__links']}>
					<HeaderLink href="/leaderboard/points" isCurrentPage={path.startsWith('/leaderboard')}>
						Leaderboard
					</HeaderLink>
				</ul>
			</div>
			<HeaderDropdown />
		</header>
	)
}
