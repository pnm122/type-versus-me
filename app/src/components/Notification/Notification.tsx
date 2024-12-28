import createClasses from '@/utils/createClasses'
import styles from './style.module.scss'
import PixelarticonsNotification from '~icons/pixelarticons/notification'
import PixelarticonsCheck from '~icons/pixelarticons/check'
import PixelarticonsAlert from '~icons/pixelarticons/alert'
import PixelarticonsClose from '~icons/pixelarticons/close'
import IconButton from '../Button/IconButton'
import { useEffect } from 'react'

export type NotificationProps = React.PropsWithChildren<{
	id: string
	onClose: (id: string) => void
	closeDelay?: number
	style?: 'default' | 'error' | 'success'
	icon?: 'notification' | 'check' | 'alert'
}>

export default function Notification({
	id,
	onClose,
	closeDelay,
	style = 'default',
	children,
	icon
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
		const timeout = setTimeout(() => {
			if (closeDelay) {
				onClose(id)
			}
		}, closeDelay ?? 0)

		return () => {
			clearTimeout(timeout)
		}
	}, [])

	return (
		<div
			style={{
				viewTransitionName: id
			}}
			role="alert"
			className={createClasses({
				[styles['notification']]: true,
				[styles[`notification--${style}`]]: true
			})}
		>
			<div className={styles['notification__icon']}>{iconElement}</div>
			<div className={styles['notification__content']}>{children}</div>
			<IconButton
				icon={<PixelarticonsClose />}
				style="tertiary"
				onClick={() => onClose(id)}
				className={styles['notification__close']}
				aria-label="Close notification"
			/>
		</div>
	)
}
