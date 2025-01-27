import styles from './style.module.scss'

export default function StartTime({ startTime }: { startTime: Date }) {
	const MS_PER_SECOND = 1000
	const MS_PER_MINUTE = MS_PER_SECOND * 60
	const MS_PER_HOUR = MS_PER_MINUTE * 60
	const MS_PER_DAY = MS_PER_HOUR * 24

	const currentTime = new Date()
	const difference = currentTime.getTime() - startTime.getTime()

	const secondsAgo = Math.round(difference / MS_PER_SECOND)
	const minutesAgo = Math.round(difference / MS_PER_MINUTE)
	const hoursAgo = Math.round(difference / MS_PER_HOUR)
	const daysAgo = Math.round(difference / MS_PER_DAY)

	const displayText =
		secondsAgo < 60
			? `${secondsAgo} second${secondsAgo > 1 ? 's' : ''} ago`
			: difference < MS_PER_HOUR
				? `${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`
				: difference < MS_PER_DAY
					? `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`
					: difference < 7 * MS_PER_DAY
						? `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`
						: Intl.DateTimeFormat().format(startTime)

	return <span className={styles['time']}>{displayText}</span>
}
