import Link from 'next/link'
import styles from './style.module.scss'
import ActiveUserCount from '../ActiveUserCount/ActiveUserCount'
import Account from '../Account/Account'
import { auth } from '@/auth'

export default async function Header() {
	const session = await auth()

	return (
		<header className={styles['header']}>
			<div className={styles['header__left']}>
				<Link href="/" className={styles['home']}>
					taptaptap.live
				</Link>
				<ActiveUserCount />
			</div>
			<Account session={session} />
		</header>
	)
}
