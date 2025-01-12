'use client'

import { RoomSettings } from '$shared/types/Room'
import Button from '@/components/Button/Button'
import FilterWithDropdown from '@/components/FilterWithDropdown/FilterWithDropdown'
import newParamsURL from '@/utils/newParamsURL'
import { useRouter, useSearchParams } from 'next/navigation'
import { TransitionStartFunction, useRef, useState } from 'react'

interface Props {
	transition: [boolean, TransitionStartFunction]
}

export default function CategoryFilter({ transition }: Props) {
	const searchParams = useSearchParams()
	const [open, setOpen] = useState(false)
	const router = useRouter()
	const focusOnOpenRef = useRef<HTMLElement>(null)
	const startTransition = transition[1]

	function onSave() {
		startTransition(() => {
			router.push(
				newParamsURL<RoomSettings['category']>(searchParams, 'statsCategory', [
					'top-100',
					'top-1000'
				])
			)
		})
		setOpen(false)
	}

	return (
		<FilterWithDropdown
			open={open}
			onOpen={() => setOpen(true)}
			onClose={() => setOpen(false)}
			name="Category"
			selected={searchParams.getAll('statsCategory')}
			focusOnOpenRef={focusOnOpenRef}
		>
			<Button ref={focusOnOpenRef} onClick={onSave}>
				Save
			</Button>
		</FilterWithDropdown>
	)
}
