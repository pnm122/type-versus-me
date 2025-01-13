'use client'

import createClasses from '@/utils/createClasses'
import styles from './style.module.scss'
import { useEffect, useRef } from 'react'

export type DropdownProps<T extends React.ElementType> = React.PropsWithChildren<{
	open: boolean
	id: string
	onClose: () => void
	/**
	 * Element to render the dropdown as
	 * @default "div"
	 */
	as?: React.ElementType
	className?: string
	/** Button that toggles the dropdown. If provided, it must handle opening and closing the dropdown. */
	toggleButton?: React.RefObject<HTMLElement>
	focusOnOpenRef?: React.RefObject<HTMLElement>
}> &
	Omit<React.HTMLAttributes<T>, 'className'>

export default function Dropdown<T extends React.ElementType>({
	open,
	id,
	onClose,
	as: Component = 'div',
	className,
	toggleButton,
	focusOnOpenRef,
	children,
	...attributes
}: DropdownProps<T>) {
	const dropdown = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const ref = dropdown.current

		if (open) {
			// Need a small delay presumably because the element is technically not visible yet
			setTimeout(() => focusOnOpenRef?.current?.focus(), 25)
			// Add the event listener after the settings popup has opened, so that the click to open it doesn't close it immediately
			requestAnimationFrame(() => {
				ref?.addEventListener('focusout', handleFocusOut)
			})
		}

		return () => {
			ref?.removeEventListener('focusout', handleFocusOut)
		}
	}, [open])

	function handleFocusOut(e: FocusEvent) {
		// if focus is outside of the settings popup, close it
		if (
			!(
				e.relatedTarget &&
				(dropdown.current?.contains(e.relatedTarget as HTMLElement) ||
					toggleButton?.current?.contains(e.relatedTarget as HTMLElement))
			)
		) {
			onClose()
		}
	}
	return (
		<Component
			ref={dropdown}
			tabIndex={0}
			role="dialog"
			id={id}
			className={createClasses({
				[styles['dropdown']]: true,
				[styles['dropdown--open']]: open,
				...(className ? { [className]: true } : {})
			})}
			{...attributes}
		>
			{children}
		</Component>
	)
}
