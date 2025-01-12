'use client'

import { useId, useRef } from 'react'
import styles from './style.module.scss'
import PixelarticonsChevronUp from '~icons/pixelarticons/chevron-up'
import Dropdown from '../Dropdown/Dropdown'
import createClasses from '@/utils/createClasses'

type Props = React.PropsWithChildren<{
	open: boolean
	onOpen: () => void
	onClose: () => void
	name: string
	selected: string[]
	focusOnOpenRef: React.RefObject<HTMLElement>
}>

export default function FilterWithDropdown({
	open,
	onOpen,
	onClose,
	name,
	selected,
	focusOnOpenRef,
	children
}: Props) {
	const id = useId()
	const button = useRef<HTMLButtonElement>(null)

	const text =
		selected.length === 0
			? name
			: selected.length === 1
				? selected[0]
				: `${selected.length} selected`

	return (
		<div className={styles['filter']}>
			<button
				ref={button}
				className={createClasses({
					[styles['button']]: true,
					[styles['button--has-selections']]: selected.length !== 0
				})}
				aria-label={`Open ${name} filter`}
				aria-expanded={open}
				aria-controls={id}
				onClick={() => (open ? onClose() : onOpen())}
			>
				<span className={styles['button__text']}>{text}</span>
				<PixelarticonsChevronUp className={styles['button__icon']} />
			</button>
			<Dropdown
				id={id}
				open={open}
				onClose={onClose}
				toggleButton={button}
				focusOnOpenRef={focusOnOpenRef}
			>
				{children}
			</Dropdown>
		</div>
	)
}
