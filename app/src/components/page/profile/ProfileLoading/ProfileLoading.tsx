import Skeleton from '@/components/base/Skeleton/Skeleton'
import RacesLoading from '@/components/page/profile/Races/RacesLoading'
import StatsLoading from '@/components/page/profile/Stats/StatsLoading'
import styles from '@/components/page/profile/ProfileInner/style.module.scss'

interface Props {
	searchParams: Record<string, string | string[]>
}

export default function ProfileLoading({ searchParams }: Props) {
	return (
		<main className={styles['page']}>
			<section className={styles['page__top']}>
				<div className={styles['user']}>
					<div className={styles['user__preview-and-edit']}>
						<Skeleton height="40px" width="240px" />
					</div>
					<Skeleton height="116px" width="100%" className={styles['level-and-points-skeleton']} />
				</div>
				<StatsLoading />
			</section>
			<RacesLoading searchParams={searchParams} />
		</main>
	)
}
