import Skeleton from '@/components/base/Skeleton/Skeleton'
import styles from './style.module.scss'
import { userStatsDisplayNames } from '@/utils/displayNameMappings'

export default function StatsLoading() {
	return (
		<div className={styles['stats']}>
			<h2 className={styles['stats__heading']}>Your stats</h2>
			<div className={styles['stats__filters']}>
				<Skeleton width="94px" height="24px" />
				<Skeleton width="150px" height="24px" />
			</div>
			<div className={styles['stat-boxes']}>
				{Object.keys(userStatsDisplayNames).map((key) => (
					<div key={key} className={styles['stat-box']}>
						<Skeleton width={`${Math.random() * 25 + 50}px`} height="1.65rem" />
						<h4 className={styles['stat-box__name']}>
							{userStatsDisplayNames[key as keyof typeof userStatsDisplayNames]}
						</h4>
					</div>
				))}
			</div>
		</div>
	)
}
