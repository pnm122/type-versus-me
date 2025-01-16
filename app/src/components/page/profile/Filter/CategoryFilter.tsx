'use client'

import { roomCategories, RoomSettings } from '$shared/types/Room'
import Button from '@/components/base/Button/Button'
import FilterWithDropdown from '@/components/base/FilterWithDropdown/FilterWithDropdown'
import newParamsURL from '@/utils/newParamsURL'
import { useRouter, useSearchParams } from 'next/navigation'
import { TransitionStartFunction, useRef, useState } from 'react'
import styles from './style.module.scss'
import FilterChip from '@/components/base/FilterChip/FilterChip'
import { isValidRoomCategory } from '$shared/utils/validators'
import { roomCategoryDisplayNames } from '@/utils/displayNameMappings'

interface Props {
	transition: [boolean, TransitionStartFunction]
	/** Key to use for the browser query param */
	paramKey: string
}

export default function CategoryFilter({ transition, paramKey }: Props) {
	const searchParams = useSearchParams()
	const router = useRouter()
	const [open, setOpen] = useState(false)
	const [selectedFilters, setSelectedFilters] = useState<RoomSettings['category'][]>([])
	const focusOnOpenRef = useRef<HTMLButtonElement>(null)
	const filterWithDropdownRef = useRef<HTMLDivElement>(null)
	const startTransition = transition[1]
	const validParamFilters = searchParams.getAll(paramKey).filter((p) => isValidRoomCategory(p))

	function toggleFilter(filter: RoomSettings['category']) {
		setSelectedFilters((s) => (s.includes(filter) ? s.filter((f) => f !== filter) : [...s, filter]))
	}

	function onSave() {
		startTransition(() => {
			router.push(
				newParamsURL<{ [key: string]: RoomSettings['category'][] }>(searchParams, {
					[paramKey]: selectedFilters
				})
			)
		})
		setOpen(false)
	}

	function onOpen() {
		setSelectedFilters(validParamFilters)
		setOpen(true)
	}

	return (
		<FilterWithDropdown
			ref={filterWithDropdownRef}
			open={open}
			onOpen={onOpen}
			onClose={() => setOpen(false)}
			name="Category"
			selected={validParamFilters.map((key) => roomCategoryDisplayNames[key])}
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
						label={roomCategoryDisplayNames[category as RoomSettings['category']]}
						selected={selectedFilters.includes(category as RoomSettings['category'])}
						onClick={() => toggleFilter(category as RoomSettings['category'])}
					/>
				))}
			</div>
			<Button onClick={onSave}>Save</Button>
		</FilterWithDropdown>
	)
}
