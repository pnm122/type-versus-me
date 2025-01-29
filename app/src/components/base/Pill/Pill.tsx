import createClasses from '@/utils/createClasses'
import styles from './style.module.scss'

interface Props {
	backgroundColor?: string
	foregroundColor?: string
	className?: string
	icon?: React.ReactNode
	text: React.ReactNode
	lowercase?: boolean
	size?: 'medium' | 'large'
}

export default function Pill({
	backgroundColor,
	foregroundColor,
	icon,
	text,
	lowercase = false,
	size = 'medium',
	className
}: Props) {
	return (
		<div
			style={
				{
					'--_pill-background': backgroundColor,
					'--_pill-foreground': foregroundColor
				} as React.CSSProperties
			}
			className={createClasses({
				[styles['pill']]: true,
				[styles['pill--lowercase']]: lowercase,
				[styles[`pill--${size}`]]: true,
				...(className ? { [className]: true } : {})
			})}
		>
			{icon}
			{text}
		</div>
	)
}
