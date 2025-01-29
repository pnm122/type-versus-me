'use client'

import React, { useId, useState } from 'react'
import {
	getCSSAlignStyle,
	TableData,
	TableProps,
	TableRow as TableRowType
} from '@/components/base/Table/Table'
import styles from './style.module.scss'
import Collapsible from '@/components/base/Collapsible/Collapsible'
import createClasses from '@/utils/createClasses'
import PixelarticonsChevronUp from '~icons/pixelarticons/chevron-up'
import Skeleton from '@/components/base/Skeleton/Skeleton'

type CommonProps<T extends TableData> = {
	row?: TableRowType<T>
} & Pick<TableProps<T>, 'render' | 'expandRender' | 'loading' | 'columns'>

type Props<T extends TableData> =
	| ({
			hasNoData: false
			noData?: null
	  } & CommonProps<T>)
	| ({
			hasNoData: true
			noData: TableProps<T>['noData']
	  } & Partial<CommonProps<T>>)

export default function TableRow<T extends TableData>({
	hasNoData,
	noData,
	row,
	render,
	expandRender,
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

	const hasExpandContent = !!expandRender?.[row?.key ?? '']
	const anyRowIsExpandable =
		!(typeof loading === 'number') && !!expandRender && Object.keys(expandRender).length !== 0

	if (hasNoData) {
		return (
			<tr className={styles['table__row']}>
				<td
					className={createClasses({
						[styles['no-data']]: true,
						[styles['cell']]: true
					})}
				>
					{noData ?? 'There is no data.'}
				</td>
			</tr>
		)
	}

	const rowRender = (
		<tr
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
			{typeof loading === 'number' ? (
				Object.keys(columns).map((key) => (
					<td key={key} className={styles['cell']}>
						<Skeleton height="1.5rem" width={`${Math.random() * 50 + 50}%`} />
					</td>
				))
			) : (
				<>
					{anyRowIsExpandable && (
						<td className={styles['cell']} style={getCSSAlignStyle('center')}>
							{hasExpandContent && <PixelarticonsChevronUp className={styles['expand-arrow']} />}
						</td>
					)}
					{row &&
						Object.keys(withoutKey(row)).map((columnKey) => (
							<td
								key={`${row.key.toString()}-${columnKey}`}
								className={styles['cell']}
								style={getCSSAlignStyle(columns[columnKey].align)}
							>
								{render?.[columnKey]
									? render[columnKey](row[columnKey], row)
									: row[columnKey].toString()}
							</td>
						))}
				</>
			)}
		</tr>
	)

	if (anyRowIsExpandable) {
		return (
			<tbody className={styles['row-with-expand-tbody']}>
				{rowRender}
				{row && hasExpandContent && (
					<tr className={styles['table__row']}>
						<td className={styles['expand']} id={id}>
							<Collapsible open={expanded}>
								<div className={styles['expand__content']}>{expandRender[row.key](row)}</div>
							</Collapsible>
						</td>
					</tr>
				)}
			</tbody>
		)
	}

	return rowRender
}
