import { useLayoutEffect, useRef, useState } from 'react'
import styles from './style.module.scss'
import createClasses from '@/utils/createClasses'
import debounce from 'debounce'

interface Props {
	/** Element to attach the box's size and position to. This element must be in the same stacking context as the box. */
	selected?: React.RefObject<HTMLElement>
	/** Optional additional class(es) to give the box. */
	className?: string
	/**
	 * z-index of the box
	 * @default 0
	 */
	zIndex?: number
}

/** A box to use as a background/border to highlight selected items, and transition between them. Must have the same stacking context as the selected item. */
export default function SelectedBox({ selected, className, zIndex = 0 }: Props) {
	const [showTransition, setShowTransition] = useState(false)
	const box = useRef<HTMLDivElement>(null)

	useLayoutEffect(() => {
		const onResize = debounce(updateBoxPosition, 100)

		updateBoxPosition()
		window.addEventListener('resize', onResize)

		return () => {
			window.removeEventListener('resize', onResize)
		}
	}, [selected])

	function updateBoxPosition() {
		if (!box.current || !selected?.current) return

		const { offsetLeft, offsetWidth, offsetTop, offsetHeight } = selected.current
		box.current.style.width = `${offsetWidth}px`
		box.current.style.height = `${offsetHeight}px`
		box.current.style.transform = `translate(${offsetLeft}px, ${offsetTop}px)`
		// Add transition class AFTER render so the transition doesn't happen on the first render
		requestAnimationFrame(() => {
			if (!showTransition) setShowTransition(true)
		})
	}

	return (
		<div
			ref={box}
			style={{ zIndex }}
			className={createClasses({
				[styles['box']]: true,
				[styles['box--transition']]: showTransition,
				...(className ? { [className]: true } : {})
			})}
		/>
	)
}
