'use client'

import { roomCategories, RoomSettings } from '$shared/types/Room'
import Button from '@/components/Button/Button'
import FilterWithDropdown from '@/components/FilterWithDropdown/FilterWithDropdown'
import newParamsURL from '@/utils/newParamsURL'
import { useRouter, useSearchParams } from 'next/navigation'
import { TransitionStartFunction, useRef, useState } from 'react'
import styles from './style.module.scss'
import FilterChip from '@/components/FilterChip/FilterChip'
import { isValidRoomCategory } from '$shared/utils/validators'

interface Props {
	transition: [boolean, TransitionStartFunction]
}

export default function CategoryFilter({ transition }: Props) {
	const PARAM_KEY = 'stats-category'

	const searchParams = useSearchParams()
	const router = useRouter()
	const [open, setOpen] = useState(false)
	const [selectedFilters, setSelectedFilters] = useState<RoomSettings['category'][]>([])
	const focusOnOpenRef = useRef<HTMLButtonElement>(null)
	const filterWithDropdownRef = useRef<HTMLDivElement>(null)
	const startTransition = transition[1]
	const validParamFilters = searchParams.getAll(PARAM_KEY).filter((p) => isValidRoomCategory(p))

	function toggleFilter(filter: RoomSettings['category']) {
		setSelectedFilters((s) => (s.includes(filter) ? s.filter((f) => f !== filter) : [...s, filter]))
	}

	function onSave() {
		startTransition(() => {
			router.push(
				newParamsURL<{ [PARAM_KEY]: RoomSettings['category'][] }>(searchParams, {
					[PARAM_KEY]: selectedFilters
				})
			)
		})
		setOpen(false)
	}

	function onOpen() {
		setSelectedFilters(validParamFilters)
		setOpen(true)
	}

	const filterDisplayNames: { [key in RoomSettings['category']]: string } = {
		quote: 'Quotes',
		'top-100': 'Top 100 words',
		'top-1000': 'Top 1000 words'
	}

	return (
		<FilterWithDropdown
			ref={filterWithDropdownRef}
			open={open}
			onOpen={onOpen}
			onClose={() => setOpen(false)}
			name="Category"
			selected={validParamFilters.map((key) => filterDisplayNames[key])}
			dropdownProps={{
				focusOnOpenRef,
				className: styles['dropdown']
			}}
			className={styles['filter']}
		>
			<h1 className={styles['dropdown__heading']}>Category</h1>
			<div className={styles['dropdown__filter-chips']}>
				{roomCategories.map((category, index) => (
					<FilterChip
						key={category}
						ref={index === 0 ? focusOnOpenRef : undefined}
						label={filterDisplayNames[category as RoomSettings['category']]}
						selected={selectedFilters.includes(category as RoomSettings['category'])}
						onClick={() => toggleFilter(category as RoomSettings['category'])}
					/>
				))}
			</div>
			<Button onClick={onSave}>Save</Button>
		</FilterWithDropdown>
	)
}
