'use client'

import { useId, useRef } from 'react'
import styles from './style.module.scss'
import PixelarticonsChevronUp from '~icons/pixelarticons/chevron-up'
import Dropdown, { DropdownProps } from '@/components/base/Dropdown/Dropdown'
import createClasses from '@/utils/createClasses'

type Props<T extends React.ElementType> = React.PropsWithChildren<{
	open: boolean
	onOpen: () => void
	onClose: () => void
	name: string
	selected: string[]
	ref?: React.RefObject<HTMLDivElement | null>
	className?: string
	dropdownProps: Omit<DropdownProps<T>, 'id' | 'onClose' | 'open' | 'toggleButton'>
}>

export default function FilterWithDropdown<T extends React.ElementType>({
	open,
	onOpen,
	onClose,
	name,
	selected,
	ref,
	className,
	dropdownProps,
	children
}: Props<T>) {
	const id = useId()
	const button = useRef<HTMLButtonElement>(null)

	const text =
		selected.length === 0
			? name
			: selected.length === 1
				? selected[0]
				: `${selected.length} selected`

	return (
		<div
			className={createClasses({
				[styles['filter']]: true,
				...(className ? { [className]: true } : {})
			})}
			ref={ref}
		>
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
			<Dropdown id={id} open={open} onClose={onClose} toggleButton={button} {...dropdownProps}>
				{children}
			</Dropdown>
		</div>
	)
}
