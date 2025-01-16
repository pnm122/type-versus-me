import styles from './style.module.scss'
import Table from '@/components/base/Table/Table'
import Pagination from '@/components/base/Pagination/Pagination'
import Skeleton from '@/components/base/Skeleton/Skeleton'
import { racesTableColumns } from './table'
import { ITEMS_PER_PAGE_PARAM_KEY, PAGE_PARAM_KEY, transformItemsPerPageParam } from './utils'

export default function RacesLoading({
	searchParams
}: {
	searchParams: Record<string, string | string[]>
}) {
	const itemsPerPage = transformItemsPerPageParam(searchParams[ITEMS_PER_PAGE_PARAM_KEY])
	const page = transformItemsPerPageParam(searchParams[PAGE_PARAM_KEY])

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
					itemsPerPage={itemsPerPage}
					page={page}
					style="detached"
					hideItemsPerPage
					hideItemCount
					loading
				/>
			</div>
			<div className={styles['table']}>
				<Table loading={itemsPerPage} maxWidth="100%" columns={racesTableColumns} rows={[]} />
				<Pagination numItems={0} itemsPerPage={itemsPerPage} page={page} loading />
			</div>
		</section>
	)
}
