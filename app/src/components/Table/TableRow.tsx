import React, { useId, useState } from 'react'
import { getCSSAlignStyle, TableData, TableProps, TableRow as TableRowType } from './Table'
import styles from './style.module.scss'
import Collapsible from '../Collapsible/Collapsible'
import createClasses from '@/utils/createClasses'
import PixelarticonsChevronUp from '~icons/pixelarticons/chevron-up'

type Props<T extends TableData> = {
	row: TableRowType<T>
} & Pick<TableProps<T>, 'render' | 'expandRender' | 'loading' | 'columns'>

export default function TableRow<T extends TableData>({
	row,
	render,
	expandRender,
	// eslint-disable-next-line
	loading,
	columns
}: Props<T>) {
	const [expanded, setExpanded] = useState(false)
	const id = useId()

	function withoutKey(row: TableRowType<T>) {
		// eslint-disable-next-line
		const { key, ...rest } = row
		return rest
	}

	function toggleExpanded() {
		setExpanded((e) => !e)
	}

	function onKeyDown(e: React.KeyboardEvent) {
		if ([' ', 'Enter'].includes(e.key)) {
			e.preventDefault()
			toggleExpanded()
		}
	}

	const hasExpandContent = !!expandRender?.[row.key]
	const anyRowIsExpandable = !!expandRender && Object.keys(expandRender).length !== 0

	return (
		<tr
			key={row.key.toString()}
			className={createClasses({
				[styles['table__row']]: true,
				[styles['table__row--has-expand-content']]: hasExpandContent
			})}
			{...(hasExpandContent && {
				tabIndex: 0,
				onClick: toggleExpanded,
				onKeyDown,
				'aria-expanded': expanded,
				'aria-controls': id
			})}
		>
			{anyRowIsExpandable && (
				<td className={styles['cell']} style={getCSSAlignStyle('center')}>
					{hasExpandContent && <PixelarticonsChevronUp className={styles['expand-arrow']} />}
				</td>
			)}
			{Object.keys(withoutKey(row)).map((columnKey) => (
				<td
					key={`${row.key.toString()}-${columnKey}`}
					className={styles['cell']}
					style={getCSSAlignStyle(columns[columnKey].align)}
				>
					{render?.[columnKey] ? render[columnKey](row[columnKey], row) : row[columnKey].toString()}
				</td>
			))}
			{hasExpandContent && (
				<td className={styles['expand']} id={id}>
					<Collapsible open={expanded}>
						<div className={styles['expand__content']}>{expandRender[row.key](row)}</div>
					</Collapsible>
				</td>
			)}
		</tr>
	)
}
