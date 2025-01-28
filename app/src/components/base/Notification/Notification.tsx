import createClasses from '@/utils/createClasses'
import styles from './style.module.scss'
import PixelarticonsNotification from '~icons/pixelarticons/notification'
import PixelarticonsCheck from '~icons/pixelarticons/check'
import PixelarticonsAlert from '~icons/pixelarticons/alert'
import PixelarticonsClose from '~icons/pixelarticons/close'
import IconButton from '@/components/base/Button/IconButton'
import { useEffect } from 'react'

export type NotificationProps = React.PropsWithChildren<{
	/** Unique identifier for the notification. */
	id: string
	/** Callback for when the notification should close. */
	onClose?: (id: string) => void
	/**
	 * Duration to wait until calling the `onClose` callback. If not provided or <= 0, the notification will not close automatically.
	 * @default 0
	 */
	closeDelay?: number
	/** Style of notification. */
	style?: 'default' | 'error' | 'success'
	/** Override the icon shown due to the notification style. */
	icon?: 'notification' | 'check' | 'alert'
	/**
	 * Whether the notification can be closed. If true, shows a close button in the top right of the notification, which fires `onClose` when clicked.
	 * @default true
	 */
	closeable?: boolean
	/**
	 * Direction the notification goes when closing.
	 * @default "up"
	 */
	closeDirection?: 'up' | 'down'
	/**
	 * Index of this notification in a stack.
	 */
	stackIndex?: number
	/**
	 * Length of the stack this notification is in.
	 */
	stackLength?: number
}>

export default function Notification({
	id,
	onClose,
	closeDelay = 0,
	style = 'default',
	children,
	icon,
	closeable = true,
	closeDirection = 'up',
	stackIndex = 0,
	stackLength = 1
}: NotificationProps) {
	const displayedIcon = icon ?? getIconFromStyle()

	function getIconFromStyle(): NotificationProps['icon'] {
		return style === 'default' ? 'notification' : style === 'error' ? 'alert' : 'check'
	}

	const iconElement =
		displayedIcon === 'notification' ? (
			<PixelarticonsNotification />
		) : displayedIcon === 'alert' ? (
			<PixelarticonsAlert />
		) : (
			<PixelarticonsCheck />
		)

	useEffect(() => {
		const timeout =
			closeDelay <= 0
				? null
				: setTimeout(() => {
						onClose?.(id)
					}, closeDelay)

		return () => {
			if (timeout) clearTimeout(timeout)
		}
	}, [])

	function getViewTransitionClass() {
		if (closeDirection === 'up') {
			return `notification notification-up notification-${stackIndex === 0 ? 'up-first' : 'not-first'}`
		}

		if (closeDirection === 'down') {
			return `notification notification-down notification-${stackIndex === stackLength - 1 ? 'down-first' : 'not-first'}`
		}
	}

	return (
		<div
			style={
				{
					viewTransitionName: id,
					viewTransitionClass: getViewTransitionClass()
				} as React.CSSProperties
			}
			role="alert"
			className={createClasses({
				[styles['notification']]: true,
				[styles[`notification--${style}`]]: true,
				[styles[`notification--${closeDirection}`]]: true,
				[styles['notification--closeable']]: closeable
			})}
		>
			<div className={styles['notification__icon']}>{iconElement}</div>
			<div className={styles['notification__content']}>{children}</div>
			{closeable && (
				<IconButton
					icon={<PixelarticonsClose />}
					style="tertiary"
					onClick={() => onClose?.(id)}
					className={styles['notification__close']}
					aria-label="Close notification"
				/>
			)}
		</div>
	)
}
