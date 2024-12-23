import { CursorColor } from '$shared/types/Cursor'
import createClasses from '@/utils/createClasses'
import styles from './style.module.scss'

interface Props {
	color: CursorColor
	disabled?: boolean
	size?: 'small' | 'medium' | 'large'
}

export default function CursorPreview({ color, disabled, size = 'medium' }: Props) {
	return (
		<div
			className={createClasses({
				[styles['cursor']]: true,
				[styles[`cursor--${size}`]]: true
			})}
			style={{ backgroundColor: disabled ? 'var(--on-disabled)' : `var(--cursor-${color})` }}
		/>
	)
}
