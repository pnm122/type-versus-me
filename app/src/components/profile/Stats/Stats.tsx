import styles from './style.module.scss'

export default function Stats() {
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
			<div className={styles['stat-boxes']}>
				{Object.keys(stats).map((key) => (
					<div key={key} className={styles['stat-box']}>
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
