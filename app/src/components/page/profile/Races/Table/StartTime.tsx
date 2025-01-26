import styles from './style.module.scss'

export default function StartTime({ startTime }: { startTime: Date }) {
	const currentTime = new Date()
	const difference = currentTime.getTime() - startTime.getTime()
	const MS_PER_HOUR = 1000 * 60 * 60
	const ONE_DAY = MS_PER_HOUR * 24

	const displayText =
		difference < ONE_DAY
			? `${Math.round(difference / MS_PER_HOUR)} hours ago`
			: difference < 7 * ONE_DAY
				? `${Math.round(difference / ONE_DAY)} days ago`
				: Intl.DateTimeFormat().format(startTime)

	return <span className={styles['time']}>{displayText}</span>
}
