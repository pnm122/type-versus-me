import Pill from '@/components/base/Pill/Pill'
import createClasses from '@/utils/createClasses'
import React from 'react'
import PixelarticonsTrophy from '~icons/pixelarticons/trophy'
import styles from './style.module.scss'
import { ScoreAndRace } from '../utils'

export default function Placement({
	placement,
	score
}: {
	placement: number
	score: ScoreAndRace
}) {
	const allUsersFailed = score.race.scores.every((s) => s.failed)
	const displayText = allUsersFailed
		? '-'
		: placement === 1
			? '1st'
			: placement === 2
				? '2nd'
				: placement === 3
					? '3rd'
					: `${placement}th`

	return (
		<Pill
			size="large"
			className={createClasses({
				[styles['placement']]: true,
				[styles['placement--podium']]: !allUsersFailed && placement >= 1 && placement <= 3,
				[styles['placement--first']]: !allUsersFailed && placement === 1,
				[styles['placement--second']]: !allUsersFailed && placement === 2,
				[styles['placement--third']]: !allUsersFailed && placement === 3
			})}
			text={displayText}
			icon={!allUsersFailed && placement === 1 && <PixelarticonsTrophy />}
			lowercase
		/>
	)
}
