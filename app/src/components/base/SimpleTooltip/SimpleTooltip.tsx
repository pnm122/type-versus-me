'use client'

import createClasses from '@/utils/createClasses'
import styles from './style.module.scss'
import { useTheme } from 'next-themes'

type Props = React.PropsWithChildren<{
	id?: string
	className?: string
	position?:
		| 'top-left'
		| 'top-center'
		| 'top-right'
		| 'bottom-right'
		| 'bottom-center'
		| 'bottom-left'
}>

export default function SimpleTooltip({ id, className, position = 'top-center', children }: Props) {
	const { theme } = useTheme()

	return (
		<div data-theme={theme === 'light' ? 'dark' : 'light'} style={{ display: 'contents' }}>
			<div
				id={id}
				className={createClasses({
					[styles['tooltip']]: true,
					[styles[`tooltip--${position}`]]: true,
					...(className ? { [className]: true } : {})
				})}
			>
				{children}
			</div>
		</div>
	)
}
