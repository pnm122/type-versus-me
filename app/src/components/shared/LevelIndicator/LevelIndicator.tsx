import createClasses from '@/utils/createClasses'
import styles from './style.module.scss'
import { UNLOCKS } from '@/utils/unlocks'
import formatNumber from '@/utils/formatNumber'

interface Props {
	level: number
	unlocked: boolean
	hideItem?: boolean
	hideOutline?: boolean
	size?: 'small' | 'medium'
	className?: string
}

export default function LevelIndicator({
	level,
	unlocked,
	hideItem = false,
	hideOutline = false,
	size = 'medium',
	className
}: Props) {
	const unlock = UNLOCKS[level]

	return (
		<div
			className={createClasses({
				[styles['indicator']]: true,
				[styles['indicator--unlocked']]: unlocked,
				[styles['indicator--has-item']]: !!unlock && !hideItem,
				[styles['indicator--small-text']]: level >= 100 && level < 1000,
				[styles['indicator--extra-small-text']]: level >= 1000,
				[styles['indicator--hide-outline']]: hideOutline,
				[styles[`indicator--${size}`]]: true,
				...(className ? { [className]: true } : {})
			})}
		>
			{formatNumber(level)}
		</div>
	)
}
