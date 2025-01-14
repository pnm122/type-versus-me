import styles from './style.module.scss'

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
	 * Whether the table is loading. `show-data` - will show current table content while loading. A number will show skeleton content for that many rows. `false` - no loading state is shown.
	 * @default false
	 **/
	loading?: 'show-data' | number | false
	/** Max width for the table. If the table overflows this width, a scrollbar will be shown */
	maxWidth?: string
}

export type TableData = Record<string, any>

export interface TableColumn {
	/** Name to display for the column. Can be any JSX, if you need something more customizable. */
	displayName: React.ReactNode
	/**
	 * Width of the column. Can use any valid grid sizing, i.e. 120px, auto, minmax(0, 2fr), etc.
	 * @default "minmax(0, 1fr)"
	 * */
	width?: string
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

export default function Table<T extends Record<string, any>>({
	columns,
	rows,
	render,
	// eslint-disable-next-line
	expandRender,
	// eslint-disable-next-line
	loading,
	maxWidth
}: TableProps<T>) {
	function withoutKey(row: TableRow<T>) {
		// eslint-disable-next-line
		const { key, ...rest } = row
		return rest
	}

	function getGridTemplateColumns() {
		return Object.keys(columns)
			.map((key) => {
				const width = columns[key].width
				if (width) return width
				return `minmax(0, 1fr)`
			})
			.join(' ')
	}

	return (
		<div
			style={{
				maxWidth,
				overflow: 'auto',
				display: maxWidth ? 'block' : 'contents'
			}}
		>
			<table
				style={{
					gridTemplateColumns: getGridTemplateColumns()
				}}
				className={styles['table']}
			>
				<thead>
					<tr className={styles['table__row']}>
						{Object.keys(columns).map((key) => (
							<th key={key}>{columns[key].displayName}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.map((row) => (
						<tr key={row.key.toString()} className={styles['table__row']}>
							{Object.keys(withoutKey(row)).map((columnKey) => (
								<td key={`${row.key.toString()}-${columnKey}`} className={styles['data']}>
									{render?.[columnKey]
										? render[columnKey](row[columnKey], row)
										: row[columnKey].toString()}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
