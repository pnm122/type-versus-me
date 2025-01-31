import Link from 'next/link'
import styles from './style.module.scss'
import Skeleton from '@/components/base/Skeleton/Skeleton'

export default function HeaderLoading() {
	return (
		<header className={styles['header']}>
			<div className={styles['header__left']}>
				<Link href="/" className={styles['home']}>
					typevs.me
				</Link>
				<Skeleton width="72px" height="18px" />
			</div>
			<Skeleton width="120px" height="1.5rem" />
		</header>
	)
}
