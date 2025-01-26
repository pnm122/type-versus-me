import styles from './style.module.scss'

export default function StartTime({ startTime }: { startTime: Date }) {
	const currentTime = new Date()
	const difference = currentTime.getTime() - startTime.getTime()
	const MS_PER_SECOND = 1000
	const MS_PER_MINUTE = MS_PER_SECOND * 60
	const MS_PER_HOUR = MS_PER_MINUTE * 60
	const MS_PER_DAY = MS_PER_HOUR * 24

	const displayText =
		difference < MS_PER_MINUTE
			? `${Math.round(difference / MS_PER_SECOND)} seconds ago`
			: difference < MS_PER_HOUR
				? `${Math.round(difference / MS_PER_MINUTE)} minutes ago`
				: difference < MS_PER_DAY
					? `${Math.round(difference / MS_PER_HOUR)} hours ago`
					: difference < 7 * MS_PER_DAY
						? `${Math.round(difference / MS_PER_DAY)} days ago`
						: Intl.DateTimeFormat().format(startTime)

	return <span className={styles['time']}>{displayText}</span>
}
