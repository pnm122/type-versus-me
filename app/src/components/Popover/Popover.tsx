import createClasses from '@/utils/createClasses'
import styles from './style.module.scss'

type Props = React.PropsWithChildren<{
	/**
	 * Whether the popup has a backdrop covering the content behind.
	 * @default true
	 **/
	hasBackdrop?: boolean
	/** Callback for clicking the backdrop. */
	onBackdropClicked?: () => void
	/** Class(es) to add to the popover. */
	className?: string
	/**
	 * Whether the body should be scrollable when the popover is open.
	 * @default false
	 */
	bodyScrollableWhenOpen?: boolean
	/** Whether the popover is open. */
	open: boolean
}>

export default function Popover({
	hasBackdrop = true,
	onBackdropClicked,
	className,
	bodyScrollableWhenOpen = false,
	open,
	children
}: Props) {
	return (
		<div
			className={createClasses({
				[styles['popover']]: true,
				[styles['popover--open']]: open,
				[styles['popover--no-scroll']]: !bodyScrollableWhenOpen
			})}
		>
			{hasBackdrop && (
				<div
					className={styles['popover__backdrop']}
					onClick={() => onBackdropClicked && onBackdropClicked()}
					tabIndex={0}
				/>
			)}
			<div
				className={createClasses({
					[styles['popover__content']]: true,
					...(className ? { [className]: true } : {})
				})}
			>
				{children}
			</div>
		</div>
	)
}
