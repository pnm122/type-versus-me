import Link from 'next/link'
import styles from './style.module.scss'
import ActiveUserCount from '@/components/shared/ActiveUserCount/ActiveUserCount'
import Account from '@/components/shared/Account/Account'
import { auth } from '@/auth'
import { getUser } from '@/utils/database/user'

export default async function Header() {
	const session = await auth()
	const user = session?.user?.id ? await getUser(session?.user?.id) : null

	return (
		<header className={styles['header']}>
			<div className={styles['header__left']}>
				<Link href="/" className={styles['home']}>
					taptaptap.live
				</Link>
				<ActiveUserCount />
			</div>
			<Account session={session} user={user} />
		</header>
	)
}
