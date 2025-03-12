'use client'

import Link from 'next/link'
import styles from './style.module.scss'
import { usePathname } from 'next/navigation'

interface Props {
	href: string
}

export default function HeaderLink({ href, children }: React.PropsWithChildren<Props>) {
	const path = usePathname()

	return (
		<li className={styles['link']}>
			<Link
				className={styles['link__anchor']}
				href={href}
				aria-current={path.split('?').at(0) === href ? 'page' : undefined}
			>
				{children}
			</Link>
		</li>
	)
}
