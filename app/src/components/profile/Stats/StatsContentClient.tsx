'use client'

import { useTransition } from 'react'
import CategoryFilter from './CategoryFilter'
import styles from './style.module.scss'
import createClasses from '@/utils/createClasses'

export default function StatsContentClient() {
	const [isPending, startTransition] = useTransition()

	// TODO: get data from db
	const stats = {
		maxWPM: 107,
		wordsTyped: 1843,
		racesPlayed: 55,
		racesWon: 21
	}

	const statDisplayNames = {
		maxWPM: 'best words per minute',
		wordsTyped: 'words typed',
		racesPlayed: 'races played',
		racesWon: 'races won'
	}

	return (
		<div className={styles['stats']}>
			<h2 className={styles['stats__heading']}>Your stats</h2>
			<div className={styles['stats__filters']}>
				<CategoryFilter transition={[isPending, startTransition]} />
			</div>
			<div className={styles['stat-boxes']}>
				{Object.keys(stats).map((key) => (
					<div
						key={key}
						className={createClasses({
							[styles['stat-box']]: true,
							[styles['stat-box--pending']]: isPending
						})}
					>
						<h3 className={styles['stat-box__stat']}>
							{stats[key as keyof typeof stats]}
							{key === 'maxWPM' ? 'wpm' : ''}
						</h3>
						<h4 className={styles['stat-box__name']}>
							{statDisplayNames[key as keyof typeof statDisplayNames]}
						</h4>
					</div>
				))}
			</div>
		</div>
	)
}
