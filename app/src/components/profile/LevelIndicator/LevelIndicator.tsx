import createClasses from '@/utils/createClasses'
import styles from './style.module.scss'
import { UNLOCKS } from '@/utils/unlocks'
import formatNumber from '@/utils/formatNumber'

interface Props {
	level: number
	unlocked: boolean
}

export default function LevelIndicator({ level, unlocked }: Props) {
	const unlock = UNLOCKS[level]

	return (
		<div
			className={createClasses({
				[styles['indicator']]: true,
				[styles['indicator--unlocked']]: unlocked,
				[styles['indicator--has-item']]: !!unlock,
				[styles['indicator--small-text']]: level >= 100,
				[styles['indicator--extra-small-text']]: level >= 1000
			})}
		>
			{formatNumber(level)}
		</div>
	)
}
