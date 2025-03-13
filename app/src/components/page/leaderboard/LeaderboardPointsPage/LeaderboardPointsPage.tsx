'use client'

import styles from './style.module.scss'
import { CursorColor } from '$shared/types/Cursor'
import Table, { TableColumnsFrom, TableRow } from '@/components/base/Table/Table'
import UserAndCursor from '@/components/shared/UserAndCursor/UserAndCursor'
import { User } from '@prisma/client'
import LevelIndicator from '@/components/shared/LevelIndicator/LevelIndicator'
import { getLevel } from '@/utils/level'
import Link from 'next/link'

export default function LeaderboardPointsPage({ leaderboard }: { leaderboard: User[] }) {
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

	return (
		<Table
			rows={rows}
			columns={columns}
			render={{
				username(value, { points }) {
					const { cursorColor, id } = leaderboard.find((u) => u.username === value)!

					return (
						<Link href={`/profile/${id}`} className={styles['username']}>
							<UserAndCursor size="small" username={value} color={cursorColor as CursorColor} />
							<LevelIndicator level={getLevel(points)} size="small" unlocked hideItem hideOutline />
						</Link>
					)
				}
			}}
		/>
	)
}
