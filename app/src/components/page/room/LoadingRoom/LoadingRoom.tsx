import Skeleton from '@/components/base/Skeleton/Skeleton'
import styles from './style.module.scss'
import dataStyles from '@/components/page/room/RoomData/style.module.scss'

export default function LoadingRoom() {
	return (
		<main className={styles['page']} aria-label="Loading room data">
			<Skeleton height="8rem" />
			<div className={dataStyles['data']}>
				<div className={dataStyles['data__users']}>
					<Skeleton height="1.5rem" />
					<Skeleton height="1.5rem" />
					<Skeleton height="1.5rem" />
				</div>
				<Skeleton height="2px" />
				<div className={dataStyles['data__room']}>
					<div className={dataStyles['room-metadata']}>
						<div className={styles['room-metadata__title']}>
							<Skeleton height="1.75rem" width="7rem" />
							<Skeleton height="1.25rem" width="3rem" />
						</div>
					</div>
				</div>
			</div>
		</main>
	)
}
