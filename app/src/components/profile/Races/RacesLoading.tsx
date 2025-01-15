import styles from './style.module.scss'
import Table from '@/components/Table/Table'
import Pagination from '@/components/Pagination/Pagination'
import Skeleton from '@/components/Skeleton/Skeleton'
import { racesTableColumns } from './table'

export default function RacesLoading() {
	return (
		<section className={styles['races']}>
			<div className={styles['header']}>
				<div className={styles['header__main']}>
					<h2 className={styles['heading']}>Your races</h2>
					<div className={styles['filters']}>
						<Skeleton width="94px" height="24px" />
						<Skeleton width="150px" height="24px" />
					</div>
				</div>
				<Pagination
					numItems={0}
					itemsPerPage={10}
					page={0}
					style="detached"
					hideItemsPerPage
					hideItemCount
					loading
				/>
			</div>
			<div className={styles['table']}>
				<Table loading={10} maxWidth="100%" columns={racesTableColumns} rows={[]} />
				<Pagination numItems={0} itemsPerPage={10} page={0} loading />
			</div>
		</section>
	)
}
