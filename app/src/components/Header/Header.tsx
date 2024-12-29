'use client'

import Link from 'next/link'
import styles from './style.module.scss'
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher'
import ActiveUserCount from '../ActiveUserCount/ActiveUserCount'

export default function Header() {
	return (
		<header className={styles['header']}>
			<div className={styles['header__left']}>
				<Link href="/" className={styles['home']}>
					taptaptap.live
				</Link>
				<ActiveUserCount />
			</div>
			<ThemeSwitcher />
		</header>
	)
}
