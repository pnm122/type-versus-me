'use client'

import { useState, useTransition } from 'react'
import CategoryFilter from '@/components/page/profile/Filter/CategoryFilter'
import styles from './style.module.scss'
import NumWordsFilter from '@/components/page/profile/Filter/NumWordsFilter'
import Table, { TableRowsFrom } from '@/components/base/Table/Table'
import Pill from '@/components/base/Pill/Pill'
import { roomCategoryDisplayNames } from '@/utils/displayNameMappings'
import Pagination from '@/components/base/Pagination/Pagination'
import { racesTableColumns, RacesTableData } from '@/components/page/profile/Races/table'

export default function RacesContentClient() {
	const transition = useTransition()
	const [itemsPerPage, setItemsPerPage] = useState(10)
	const [page, setPage] = useState(0)

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

	return (
		<section className={styles['races']}>
			<div className={styles['header']}>
				<div className={styles['header__main']}>
					<h2 className={styles['heading']}>Your races</h2>
					<div className={styles['filters']}>
						<CategoryFilter paramKey="races-category" transition={transition} />
						<NumWordsFilter
							minWordsParamKey="races-min-words"
							maxWordsParamKey="races-max-words"
							transition={transition}
						/>
					</div>
				</div>
				<Pagination
					numItems={rows.length}
					itemsPerPage={itemsPerPage}
					page={page}
					onPageChange={(p) => setPage(p)}
					maxItemsPerPage={25}
					style="detached"
					hideItemsPerPage
					hideItemCount
				/>
			</div>
			<div className={styles['table']}>
				<Table
					loading={transition[0] ? 'show-data' : undefined}
					maxWidth="100%"
					columns={racesTableColumns}
					rows={rows.slice(0, itemsPerPage)}
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
					itemsPerPage={itemsPerPage}
					page={page}
					onPageChange={(p) => setPage(p)}
					onItemsPerPageChange={(n) => setItemsPerPage(n)}
					maxItemsPerPage={25}
				/>
			</div>
		</section>
	)
}
