import { PropsWithChildren, useEffect, useLayoutEffect, useRef, useState } from 'react'
import styles from './style.module.scss'
import createClasses from '@/utils/createClasses'

type Props = PropsWithChildren<{
	/**
	 * Direction the Collapsible opens. i.e. 'left' means the collapsible will open to the left.
	 * @default "down"
	 **/
	openDirection?: 'left' | 'right' | 'up' | 'down'
	/**
	 * Easing function for opening and closing.
	 * @default "var(--timing)"
	 */
	ease?: string
	/**
	 * Duration of the transition between open and close states in milliseconds
	 * @default 250
	 */
	duration?: number
	/**
	 * Delay between open changing and the start of the ensuing transition.
	 * @default 0
	 */
	delay?: number
	/**
	 * Whether to fit the collapsible to its content in the direction perpendicular to `openDirection`
	 * @default false
	 */
	fitContent?: boolean
	/** Open state of the collapsible. */
	open: boolean
	id?: string
}>

export default function Collapsible({
	openDirection = 'down',
	ease = 'var(--timing)',
	duration = 250,
	delay = 0,
	fitContent = false,
	open,
	id,
	children
}: Props) {
	const container = useRef<HTMLDivElement>(null)
	const content = useRef<HTMLDivElement>(null)
	const revertTimeout = useRef<NodeJS.Timeout | null>(null)
	const [rendered, setRendered] = useState(false)

	const transitioningProperty =
		openDirection === 'left' || openDirection === 'right' ? 'width' : 'height'

	useLayoutEffect(() => {
		if (!container.current || !content.current) return

		// Don't show the animation on first render, but initialize its height when closed
		if (!rendered) {
			if (!open) {
				container.current!.style[transitioningProperty] = '0px'
			}
			return
		}

		// If the user clicks fast enough, the applied styles could get reverted in the middle of a transition
		// Because the revert was meant to be after the last transition. This stops that from happening.
		if (revertTimeout.current) {
			clearTimeout(revertTimeout.current)
			revertTimeout.current = null
		}

		if (open) {
			container.current!.style[transitioningProperty] = '0px'
			// Was able to get this working without requestAnimationFrame, but I don't understand why
			// Leaving this here since this makes more sense to me
			requestAnimationFrame(() => {
				container.current!.style[transitioningProperty] =
					`${content.current!.getBoundingClientRect()[transitioningProperty]}px`
				revertChanges()
			})
		} else {
			container.current.style[transitioningProperty] =
				`${content.current.getBoundingClientRect()[transitioningProperty]}px`
			requestAnimationFrame(() => {
				container.current!.style[transitioningProperty] = '0px'
			})
		}
	}, [open])

	useEffect(() => {
		setRendered(true)

		return () => {
			if (revertTimeout.current) clearTimeout(revertTimeout.current)
		}
	}, [])

	function revertChanges() {
		revertTimeout.current = setTimeout(() => {
			container.current!.style[transitioningProperty] = ''
			revertTimeout.current = null
		}, duration + delay)
	}

	return (
		<div
			ref={container}
			id={id}
			className={createClasses({
				[styles['collapsible']]: true,
				[styles['collapsible--open']]: open,
				[styles[`collapsible--${openDirection}`]]: true,
				[styles['collapsible--fit-content']]: fitContent,
				[styles['collapsible--show-animations']]: rendered
			})}
			style={
				{
					'--collapsible-ease': ease,
					'--collapsible-duration': `${duration}ms`,
					'--collapsible-delay': `${delay}ms`
				} as React.CSSProperties
			}
		>
			<div ref={content} className={styles['collapsible__content']}>
				{children}
			</div>
		</div>
	)
}
