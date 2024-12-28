'use client'

import Link from 'next/link'
import styles from './style.module.scss'
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher'

export default function Header() {
	return (
		<header className={styles['header']}>
			<Link href="/" className={styles['header__home']}>
				taptaptap.live
			</Link>
			<ThemeSwitcher />
		</header>
	)
}
