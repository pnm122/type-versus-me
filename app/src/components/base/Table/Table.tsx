import IndeterminateProgress from '@/components/base/IndeterminateProgress/IndeterminateProgress'
import styles from './style.module.scss'
import TableRow from './TableRow'

export interface TableProps<T extends TableData> {
	/** Configuration for each column in the table */
	columns: TableColumnsFrom<T>
	/** Table data */
	rows: TableRow<T>[]
	/** Optional render functions for every cell. By default, cells are rendered with `.toString()` called on the data. */
	render?: Partial<{
		[K in keyof T]: RenderFunction<T, K>
	}>
	/** Optional expanded content for rows. Maps from row keys to a render function. */
	expandRender?: {
		[key: string | number | symbol]: (row: TableRow<T>) => React.ReactNode
	}
	/**
	 * Whether the table is loading. `show-data` - the data in the table will still be shown with the loading state. A number will show skeleton content for that many rows. `false` - no loading state is shown.
	 * @default false
	 **/
	loading?: 'show-data' | number | false
	/** Max width for the table. If the table overflows this width, a scrollbar will be shown */
	maxWidth?: string
	/** Content to show when no data is present in the table. */
	noData?: React.ReactNode
}

export type TableData = Record<string, any>

export interface TableColumn {
	/** Name to display for the column. Can be any JSX, if you need something more customizable. */
	displayName: React.ReactNode
	/**
	 * Width of the column. Can use any valid grid sizing, i.e. 120px, auto, minmax(0, 2fr), etc.
	 * @default "minmax(min-content, 1fr)"
	 * */
	width?: string
	/**
	 * How to align a column.
	 * @default "left"
	 */
	align?: 'left' | 'center' | 'right'
}

export type TableColumnsFrom<T extends TableData> = {
	[K in keyof T]: TableColumn
}

export type TableRow<T extends TableData> = {
	[K in keyof T]: T[K]
} & {
	key: string | number | symbol
}

export type TableRowsFrom<T extends TableData> = TableRow<T>[]

type RenderFunction<T extends TableData, K extends keyof T> = (
	value: T[K],
	row: TableRow<T>
) => React.ReactNode

const toCSSAlignMap: {
	[key in Required<TableColumn>['align']]: React.CSSProperties['alignItems']
} = {
	left: 'flex-start',
	center: 'center',
	right: 'flex-end'
}

export function getCSSAlignStyle(align: TableColumn['align']) {
	return {
		'--table-cell-alignment': toCSSAlignMap[align ?? 'left']
	} as React.CSSProperties
}

export default function Table<T extends Record<string, any>>({
	columns,
	rows,
	render,
	expandRender,
	loading,
	maxWidth,
	noData
}: TableProps<T>) {
	const anyRowIsExpandable =
		!(typeof loading === 'number') && !!expandRender && Object.keys(expandRender).length !== 0

	function getGridTemplateColumns() {
		const expandColumn = anyRowIsExpandable ? ['var(--table-expand-cell-width)'] : []
		return expandColumn
			.concat(
				Object.keys(columns).map((key) => {
					const width = columns[key].width
					if (width) return width
					return 'minmax(min-content, 1fr)'
				})
			)
			.join(' ')
	}

	return (
		<table
			style={{
				maxWidth,
				overflow: 'auto',
				gridTemplateColumns: getGridTemplateColumns()
			}}
			className={styles['table']}
		>
			<thead>
				<tr className={styles['table__heading']}>
					{loading === 'show-data' && (
						<th className={styles['loader']}>
							<IndeterminateProgress />
						</th>
					)}
					{anyRowIsExpandable && <th className={styles['cell']}></th>}
					{Object.keys(columns).map((key) => (
						<th className={styles['cell']} style={getCSSAlignStyle(columns[key].align)} key={key}>
							{columns[key].displayName}
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{typeof loading === 'number' ? (
					Array(loading)
						.fill(null)
						.map((_, index) => (
							<TableRow
								key={index}
								hasNoData={false}
								{...{ render, expandRender, loading, columns }}
							/>
						))
				) : rows.length === 0 ? (
					<TableRow hasNoData={true} noData={noData} />
				) : (
					rows.map((row) => (
						<TableRow
							key={row.key.toString()}
							hasNoData={false}
							{...{ row, render, expandRender, loading, columns }}
						/>
					))
				)}
			</tbody>
		</table>
	)
}
