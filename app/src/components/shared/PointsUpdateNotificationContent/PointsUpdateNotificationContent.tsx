import CountUp from 'react-countup'
import styles from './style.module.scss'
import formatNumber from '@/utils/formatNumber'
import { getLevel, getMinPointsForCurrentLevel, getMinPointsForNextLevel } from '@/utils/level'
import LevelIndicator from '../LevelIndicator/LevelIndicator'

interface Props {
	prevPoints: number
	nextPoints: number
}

export default function PointsUpdateNotificationContent({ prevPoints, nextPoints }: Props) {
	const prevLevel = getLevel(prevPoints)
	const nextLevel = getLevel(nextPoints)
	const minPointsForNextLevel = getMinPointsForNextLevel(nextPoints)

	function position(points: number, scale: number) {
		const minPoints = getMinPointsForCurrentLevel(points)
		const minPointsNextLevel = getMinPointsForNextLevel(points)

		return ((points - minPoints) * scale) / (minPointsNextLevel - minPoints)
	}

	const distanceBetweenLevels = 200
	const startOffset = -1 * distanceBetweenLevels - position(prevPoints, distanceBetweenLevels)
	const endOffset =
		-1 * distanceBetweenLevels -
		(nextLevel - prevLevel) * distanceBetweenLevels -
		position(nextPoints, distanceBetweenLevels)

	const animationDelay = 1.5
	const animationDuration = 3

	return (
		<div
			className={styles['content']}
			style={
				{
					'--animation-duration': `${animationDuration}s`,
					'--animation-delay': `${animationDelay}s`
				} as React.CSSProperties
			}
		>
			<div className={styles['points']}>
				<div className={styles['points-top']}>
					<h1 className={styles['points-top__total']}>
						<CountUp
							start={prevPoints}
							end={nextPoints}
							duration={animationDuration}
							delay={animationDelay}
							formattingFn={(n) => `${formatNumber(n)} points`}
						/>
					</h1>
					<CountUp
						start={nextPoints - prevPoints}
						end={0}
						duration={animationDuration}
						delay={animationDelay}
						formattingFn={(n) => `+${formatNumber(n)}`}
						className={styles['points-top__add']}
					/>
				</div>
				<CountUp
					start={minPointsForNextLevel - prevPoints}
					end={minPointsForNextLevel - nextPoints}
					duration={animationDuration}
					delay={animationDelay}
					formattingFn={(n) => `${formatNumber(n)} points to level ${nextLevel + 1}`}
					className={styles['points-to-next-level']}
				/>
			</div>
			<div className={styles['progress']}>
				<div className={styles['progress__bar']} />
				<ul
					className={styles['level-indicators']}
					style={
						{
							'--item-gap': `${distanceBetweenLevels}px`,
							'--start-offset': `${startOffset}px`,
							'--end-offset': `${endOffset}px`
						} as React.CSSProperties
					}
				>
					{Array(nextLevel - prevLevel + 3)
						.fill(null)
						.map((_, index) => (
							<li key={index} className={styles['level-indicators__item']}>
								<LevelIndicator
									level={prevLevel - 1 + index}
									unlocked={prevLevel - 1 + index <= nextLevel}
									className={styles['indicator']}
								/>
							</li>
						))}
				</ul>
			</div>
		</div>
	)
}
