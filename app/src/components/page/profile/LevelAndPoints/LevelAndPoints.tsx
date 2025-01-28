import styles from './style.module.scss'
import { getLevel, getMinPointsForCurrentLevel, getMinPointsForNextLevel } from '@/utils/level'
import LevelIndicator from '@/components/shared/LevelIndicator/LevelIndicator'
import formatNumber from '@/utils/formatNumber'
import { User } from '@prisma/client'

interface Props {
	user: User
}

// TODO: Improve a11y of progress
export default function LevelAndPoints({ user: { points } }: Props) {
	const level = getLevel(points)
	const minPointsForCurrentLevel = getMinPointsForCurrentLevel(points)
	const minPointsForNextLevel = getMinPointsForNextLevel(points)
	const earnedInCurrentLevelFraction =
		(points - minPointsForCurrentLevel) / (minPointsForNextLevel - minPointsForCurrentLevel)
	const firstVisibleLevel = Math.max(1, level - 1)

	const currentProgressWidthPct =
		(level <= 1 ? 100 / 6 : 100 / 2) + earnedInCurrentLevelFraction * (100 / 3)

	return (
		<div className={styles['container']}>
			<h2 className={styles['container__points']}>{formatNumber(points)} points</h2>
			<h3 className={styles['container__points-to-next-level']}>
				{formatNumber(minPointsForNextLevel - points)} point
				{minPointsForNextLevel - points > 1 ? 's' : ''} to level {formatNumber(level + 1)}
			</h3>
			<div className={styles['levels']}>
				<div className={styles['progress']}>
					<div
						className={styles['progress__current']}
						style={{ width: `${currentProgressWidthPct}%` }}
					/>
				</div>
				{Array(3)
					.fill(null)
					.map((_, index) => (
						<LevelIndicator
							key={firstVisibleLevel + index}
							level={firstVisibleLevel + index}
							unlocked={level >= firstVisibleLevel + index}
						/>
					))}
			</div>
		</div>
	)
}
