import { TableColumnsFrom, TableRow } from '@/components/base/Table/Table'
import { User } from '@prisma/client'

export type RowData = Pick<User, 'username' | 'points'>
export type Row = TableRow<RowData>

export const columns: TableColumnsFrom<RowData> = {
	username: {
		displayName: 'User',
		width: '250px'
	},
	points: {
		displayName: 'Points'
	}
}
