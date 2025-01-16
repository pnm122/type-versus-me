'use client'

import { useTransition } from 'react'
import CategoryFilter from '@/components/page/profile/Filter/CategoryFilter'
import styles from './style.module.scss'
import NumWordsFilter from '@/components/page/profile/Filter/NumWordsFilter'
import Table, { TableRowsFrom } from '@/components/base/Table/Table'
import Pill from '@/components/base/Pill/Pill'
import { roomCategoryDisplayNames } from '@/utils/displayNameMappings'
import Pagination from '@/components/base/Pagination/Pagination'
import { racesTableColumns, RacesTableData } from '@/components/page/profile/Races/table'
import { useRouter } from 'next/navigation'
import newParamsURL from '@/utils/newParamsURL'
import useSafeParams from '@/hooks/useSafeParams'
import {
	ITEMS_PER_PAGE_PARAM_KEY,
	MAX_ITEMS_PER_PAGE,
	MIN_ITEMS_PER_PAGE,
	PAGE_PARAM_KEY,
	transformItemsPerPageParam,
	transformPageParam
} from './utils'

export default function RacesContentClient() {
	interface Params {
		[PAGE_PARAM_KEY]: number
		[ITEMS_PER_PAGE_PARAM_KEY]: number
	}

	const [isPending, startTransition] = useTransition()
	const router = useRouter()
	const [safeParams, searchParams] = useSafeParams<Params>({
		[PAGE_PARAM_KEY]: transformPageParam,
		[ITEMS_PER_PAGE_PARAM_KEY]: transformItemsPerPageParam
	})

	const row: RacesTableData = {
		time: new Date(2023, 10, 20),
		netWPM: 114,
		accuracy: 100,
		placement: 1,
		category: 'top-1000',
		numWords: 25
	}

	const rows: TableRowsFrom<RacesTableData> = Array(50)
		.fill(row)
		.map((v, i) => ({ key: i, ...v }))

	function onPaginationChange(newPage: number, newItemsPerPage: number) {
		startTransition(() => {
			router.push(
				newParamsURL(searchParams, {
					[PAGE_PARAM_KEY]: newPage.toString(),
					[ITEMS_PER_PAGE_PARAM_KEY]: newItemsPerPage.toString()
				})
			)
		})
	}

	return (
		<section className={styles['races']}>
			<div className={styles['header']}>
				<div className={styles['header__main']}>
					<h2 className={styles['heading']}>Your races</h2>
					<div className={styles['filters']}>
						<CategoryFilter paramKey="races-category" transition={[isPending, startTransition]} />
						<NumWordsFilter
							minWordsParamKey="races-min-words"
							maxWordsParamKey="races-max-words"
							transition={[isPending, startTransition]}
						/>
					</div>
				</div>
				<Pagination
					numItems={rows.length}
					itemsPerPage={safeParams[ITEMS_PER_PAGE_PARAM_KEY]}
					page={safeParams[PAGE_PARAM_KEY]}
					onChange={onPaginationChange}
					minItemsPerPage={MIN_ITEMS_PER_PAGE}
					maxItemsPerPage={MAX_ITEMS_PER_PAGE}
					loading={isPending}
					style="detached"
					hideItemsPerPage
					hideItemCount
				/>
			</div>
			<div className={styles['table']}>
				<Table
					loading={isPending ? 'show-data' : undefined}
					maxWidth="100%"
					columns={racesTableColumns}
					rows={rows.slice(0, safeParams[ITEMS_PER_PAGE_PARAM_KEY])}
					render={{
						time(value) {
							return Intl.DateTimeFormat('en-US').format(value)
						},
						netWPM(value) {
							return (
								<Pill
									text={value.toString()}
									backgroundColor="var(--primary)"
									foregroundColor="var(--black)"
								/>
							)
						},
						category(value) {
							return roomCategoryDisplayNames[value]
						}
					}}
					expandRender={{
						0: () => {
							return 'Expanded content'
						}
					}}
				/>
				<Pagination
					numItems={rows.length}
					itemsPerPage={safeParams[ITEMS_PER_PAGE_PARAM_KEY]}
					page={safeParams[PAGE_PARAM_KEY]}
					onChange={onPaginationChange}
					minItemsPerPage={MIN_ITEMS_PER_PAGE}
					maxItemsPerPage={MAX_ITEMS_PER_PAGE}
					loading={isPending}
				/>
			</div>
		</section>
	)
}
