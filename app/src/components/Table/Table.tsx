interface Props<T extends Record<string, any>> {
	/** Configuration for each column in the table */
	columns: {
		[K in keyof T]: Column
	}
	/** Table data */
	rows: Row<T>[]
	/** Optional render functions for every cell. By default, cells are rendered with `.toString()` called on the data. */
	render?: Partial<{
		[K in keyof T]: RenderFunction<T, K>
	}>
	/** Optional expanded content for rows. Maps from row keys to a render function. */
	expandRender?: {
		[key: string | number | symbol]: (row: Row<T>) => React.ReactNode
	}
	/**
	 * Whether the table is loading. `show-data` - will show current table content while loading. A number will show skeleton content for that many rows. `false` - no loading state is shown.
	 * @default false
	 **/
	loading?: 'show-data' | number | false
}

interface Column {
	width?: string
}

type Row<T extends Record<string, any>> = {
	[K in keyof T]: T[K]
} & {
	key: string | number | symbol
}

type RenderFunction<T extends Record<string, any>, K extends keyof T> = (
	value: T[K],
	row: Row<T>
) => React.ReactNode

export default function Table<T extends Record<string, any>>({
	// eslint-disable-next-line
	columns,
	// eslint-disable-next-line
	rows,
	// eslint-disable-next-line
	render,
	// eslint-disable-next-line
	expandRender,
	// eslint-disable-next-line
	loading
}: Props<T>) {
	return <div>Table</div>
}
