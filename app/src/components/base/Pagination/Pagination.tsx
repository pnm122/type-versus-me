'use client'

import createClasses from '@/utils/createClasses'
import styles from './style.module.scss'
import Input from '@/components/base/Input/Input'
import React, { useEffect, useId, useState } from 'react'
import IconButton from '@/components/base/Button/IconButton'
import PixelarticonsChevronLeft from '~icons/pixelarticons/chevron-left'
import PixelarticonsChevronRight from '~icons/pixelarticons/chevron-right'

interface Props {
	/** Total number of items. */
	numItems: number
	/** Number of items per page. */
	itemsPerPage: number
	/**
	 * Minimum number of items per page.
	 * @default 5
	 */
	minItemsPerPage?: number
	/**
	 * Maximum number of items per page.
	 * @default 50
	 */
	maxItemsPerPage?: number
	/** 0-based page the user is currently on. */
	page: number
	/** Callback for when the page or itemsPerPage changes. */
	onChange?(page: number, itemsPerPage: number): void
	/** Whether to hide the input to change the number of items per page. */
	hideItemsPerPage?: boolean
	/** Whether to hide the text that shows the total number of items and the items currently shown (i.e. "1-10 of 37") */
	hideItemCount?: boolean
	/**
	 * Style of the pagination.
	 * `table` - show background and borders, aligned for use with a `Table` component
	 * `detached` - no background or borders, aligned for use without being attached to a `Table` component
	 * @default "table"
	 */
	style?: 'table' | 'detached'
	/** Whether to show a loading state for the pagination. If set to `true`, all inputs and buttons will be disabled */
	loading?: boolean
	/** Optional class(es) to add to the pagination. */
	className?: string
}

export default function Pagination({
	numItems,
	itemsPerPage,
	minItemsPerPage = 5,
	maxItemsPerPage = 50,
	page,
	onChange,
	hideItemsPerPage,
	hideItemCount,
	loading,
	style = 'table'
}: Props) {
	const id = useId()
	const [shownItemsPerPage, setShownItemsPerPage] = useState(itemsPerPage.toString())
	const [shownPage, setShownPage] = useState((numItems > 0 ? page + 1 : 0).toString())

	const startItem = numItems > 0 ? itemsPerPage * page + 1 : 0
	const lastShownPage = Math.ceil(numItems / itemsPerPage)

	useEffect(() => {
		setShownItemsPerPage(itemsPerPage.toString())
	}, [itemsPerPage, numItems])

	useEffect(() => {
		setShownPage((numItems > 0 ? page + 1 : 0).toString())
	}, [page, numItems])

	function onItemsPerPageSubmit(e: React.FocusEvent | React.FormEvent) {
		e.preventDefault()

		const newItemsPerPage = parseInt(shownItemsPerPage)
		if (
			!Number.isNaN(newItemsPerPage) &&
			newItemsPerPage >= minItemsPerPage &&
			newItemsPerPage <= maxItemsPerPage &&
			newItemsPerPage !== itemsPerPage
		) {
			// Go to page closest to the start of the current page
			const distToClosestPageBelow = (itemsPerPage * page) % newItemsPerPage
			const distToClosestPageAbove = newItemsPerPage - distToClosestPageBelow
			const newPage =
				distToClosestPageBelow <= distToClosestPageAbove
					? Math.min(
							(itemsPerPage * page - distToClosestPageBelow) / newItemsPerPage,
							Math.ceil(numItems / newItemsPerPage) - 1
						)
					: Math.min(
							(itemsPerPage * page + distToClosestPageAbove) / newItemsPerPage,
							Math.ceil(numItems / newItemsPerPage) - 1
						)
			onChange?.(newPage, newItemsPerPage)
		}
	}

	function onPageSubmit(e: React.FocusEvent | React.FormEvent) {
		e.preventDefault()

		const newPage = parseInt(shownPage)
		if (
			!Number.isNaN(newPage) &&
			newPage >= 1 &&
			newPage <= lastShownPage &&
			newPage !== page + 1
		) {
			onChange?.(newPage - 1, itemsPerPage)
		}
	}

	return (
		<div
			className={createClasses({
				[styles['pagination']]: true,
				[styles['pagination--detached']]: style === 'detached'
			})}
		>
			{!hideItemsPerPage && (
				<form className={styles['items-per-page']} onSubmit={onItemsPerPageSubmit}>
					<p className={styles['items-per-page__text']}>Items per page:</p>
					<Input
						id={`${id}-items-per-page`}
						wrapperClassName={styles['items-per-page__input']}
						text={shownItemsPerPage}
						onChange={(e) => setShownItemsPerPage(e.target.value)}
						onBlur={onItemsPerPageSubmit}
						disabled={loading}
						type="number"
						min={minItemsPerPage}
						max={maxItemsPerPage}
					/>
				</form>
			)}
			{!hideItemCount && (
				<div className={styles['item-count']}>
					<p className={styles['item-count__text']}>
						{startItem}-{Math.min(startItem + itemsPerPage - 1, numItems)} of {numItems}
					</p>
				</div>
			)}
			<div className={styles['page-change-controls']}>
				<form className={styles['page-changer']} onSubmit={onPageSubmit}>
					<Input
						id={`${id}-page`}
						wrapperClassName={styles['page-changer__input']}
						text={shownPage}
						onChange={(e) => setShownPage(e.target.value)}
						onBlur={onPageSubmit}
						disabled={loading}
						type="number"
						min={1}
						max={lastShownPage}
					/>
					<span className={styles['page-changer__text']}>of {lastShownPage}</span>
				</form>
				<div className={styles['page-change-buttons']}>
					<IconButton
						aria-label="Previous page"
						disabled={page <= 0 || loading}
						onClick={() => onChange?.(page - 1, itemsPerPage)}
						icon={<PixelarticonsChevronLeft />}
						style="tertiary"
						className={styles['page-change-buttons__button']}
					/>
					<IconButton
						aria-label="Next page"
						disabled={page >= lastShownPage - 1 || loading}
						onClick={() => onChange?.(page + 1, itemsPerPage)}
						icon={<PixelarticonsChevronRight />}
						style="tertiary"
						className={styles['page-change-buttons__button']}
					/>
				</div>
			</div>
		</div>
	)
}
