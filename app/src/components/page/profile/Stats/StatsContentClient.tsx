'use client'

import { memo, useTransition } from 'react'
import CategoryFilter from '@/components/page/profile/Filter/CategoryFilter'
import styles from './style.module.scss'
import createClasses from '@/utils/createClasses'
import NumWordsFilter from '@/components/page/profile/Filter/NumWordsFilter'
import IndeterminateProgress from '@/components/base/IndeterminateProgress/IndeterminateProgress'
import { userStatsDisplayNames } from '@/utils/displayNameMappings'
import { UserStats } from '$shared/types/Database'
import {
	CATEGORY_PARAM_KEY,
	MAX_WORDS_PARAM_KEY,
	MIN_WORDS_PARAM_KEY
} from '@/components/page/profile/Stats/utils'
import formatNumber from '@/utils/formatNumber'
import CountUp from 'react-countup'

const StatsContentClient = memo(
	({ stats }: { stats: UserStats | null }) => {
		const [isPending, startTransition] = useTransition()

		return (
			<div className={styles['stats']}>
				<h2 className={styles['stats__heading']}>Stats</h2>
				<div className={styles['stats__filters']}>
					<CategoryFilter paramKey={CATEGORY_PARAM_KEY} transition={[isPending, startTransition]} />
					<NumWordsFilter
						minWordsParamKey={MIN_WORDS_PARAM_KEY}
						maxWordsParamKey={MAX_WORDS_PARAM_KEY}
						transition={[isPending, startTransition]}
					/>
				</div>
				<div className={styles['stat-boxes']}>
					{Object.keys(userStatsDisplayNames).map((key) => (
						<div
							key={key}
							className={createClasses({
								[styles['stat-box']]: true,
								[styles['stat-box--pending']]: isPending
							})}
						>
							{isPending && <IndeterminateProgress />}
							<h3 className={styles['stat-box__stat']}>
								{stats === null ? (
									'-'
								) : stats[key as keyof typeof stats] < 0 ? (
									0
								) : (
									<CountUp
										start={0}
										end={Math.round(stats[key as keyof typeof stats])}
										duration={1}
										formattingFn={(n) =>
											`${formatNumber(n, true)}${['maxWPM', 'avgWPM'].includes(key) ? 'wpm' : ''}`
										}
									/>
								)}
							</h3>
							<h4 className={styles['stat-box__name']}>
								{userStatsDisplayNames[key as keyof typeof userStatsDisplayNames]}
							</h4>
						</div>
					))}
				</div>
			</div>
		)
	},
	(prev, next) =>
		prev.stats?.avgWPM === next.stats?.avgWPM &&
		prev.stats?.maxWPM === next.stats?.maxWPM &&
		prev.stats?.racesPlayed === next.stats?.racesPlayed &&
		prev.stats?.racesWon === next.stats?.racesWon &&
		prev.stats?.wordsTyped === next.stats?.wordsTyped
)

StatsContentClient.displayName = 'StatsContentClient'

export default StatsContentClient
