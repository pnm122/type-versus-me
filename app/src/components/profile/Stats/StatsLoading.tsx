import Skeleton from '@/components/Skeleton/Skeleton'
import styles from './style.module.scss'
import statDisplayNames from './statDisplayNames'

export default function StatsLoading() {
	return (
		<div className={styles['stats']}>
			<h2 className={styles['stats__heading']}>Your stats</h2>
			<div className={styles['stats__filters']}>
				<Skeleton width="94px" height="24px" />
				<Skeleton width="150px" height="24px" />
			</div>
			<div className={styles['stat-boxes']}>
				{Object.keys(statDisplayNames).map((key) => (
					<div key={key} className={styles['stat-box']}>
						<Skeleton width={`${Math.random() * 25 + 50}px`} height="1.65rem" />
						<h4 className={styles['stat-box__name']}>
							{statDisplayNames[key as keyof typeof statDisplayNames]}
						</h4>
					</div>
				))}
			</div>
		</div>
	)
}
