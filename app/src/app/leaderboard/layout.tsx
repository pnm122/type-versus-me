import styles from './style.module.scss'

export default function LeaderboardLayout({ children }: React.PropsWithChildren) {
	return <main className={styles['page']}>{children}</main>
}
