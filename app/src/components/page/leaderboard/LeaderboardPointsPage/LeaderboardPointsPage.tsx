'use client'

import styles from './style.module.scss'
import { CursorColor } from '$shared/types/Cursor'
import Table, { TableColumnsFrom, TableRow } from '@/components/base/Table/Table'
import UserAndCursor from '@/components/shared/UserAndCursor/UserAndCursor'
import { User } from '@prisma/client'
import LevelIndicator from '@/components/shared/LevelIndicator/LevelIndicator'
import { getLevel } from '@/utils/level'
import Link from 'next/link'
import Pagination from '@/components/base/Pagination/Pagination'
import { MAX_ITEMS_PER_PAGE, MIN_ITEMS_PER_PAGE } from '@/app/leaderboard/points/params'
import { useTransition } from 'react'
import { useUpdateParams } from '@/app/leaderboard/points/hooks'
import formatNumber from '@/utils/formatNumber'

export default function LeaderboardPointsPage({
	leaderboard,
	page,
	itemsPerPage,
	totalUserCount
}: {
	leaderboard: User[]
	page: number
	itemsPerPage: number
	totalUserCount: number
}) {
	const updateParams = useUpdateParams()
	const [isPending, startTransition] = useTransition()

	type RowData = Pick<User, 'username' | 'points'>

	const rows: TableRow<RowData>[] = leaderboard.map((u) => ({
		username: u.username,
		points: u.points,
		key: u.id
	}))

	const columns: TableColumnsFrom<RowData> = {
		username: {
			displayName: 'User',
			width: '250px'
		},
		points: {
			displayName: 'Points'
		}
	}

	function onPaginationChange(page: number, itemsPerPage: number) {
		startTransition(() => {
			updateParams({ page, itemsPerPage })
		})
	}

	return (
		<div className={styles['page']}>
			<div className={styles['page__heading']}>
				<h1 className={styles['title']}>Leaderboard</h1>
				<Pagination
					page={page}
					itemsPerPage={itemsPerPage}
					onChange={onPaginationChange}
					numItems={totalUserCount}
					minItemsPerPage={MIN_ITEMS_PER_PAGE}
					maxItemsPerPage={MAX_ITEMS_PER_PAGE}
					loading={isPending}
					style="detached"
					hideItemsPerPage
					hideItemCount
				/>
			</div>
			<div>
				<Table
					rows={rows}
					columns={columns}
					render={{
						username(value, { points }) {
							const { cursorColor, id } = leaderboard.find((u) => u.username === value)!

							return (
								<Link href={`/profile/${id}`} className={styles['username']}>
									<UserAndCursor size="small" username={value} color={cursorColor as CursorColor} />
									<LevelIndicator
										level={getLevel(points)}
										size="small"
										unlocked
										hideItem
										hideOutline
									/>
								</Link>
							)
						},
						points(value) {
							return formatNumber(value)
						}
					}}
				/>
				<Pagination
					page={page}
					itemsPerPage={itemsPerPage}
					onChange={onPaginationChange}
					numItems={totalUserCount}
					minItemsPerPage={MIN_ITEMS_PER_PAGE}
					maxItemsPerPage={MAX_ITEMS_PER_PAGE}
					loading={isPending}
				/>
			</div>
		</div>
	)
}
