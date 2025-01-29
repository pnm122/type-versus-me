import Notification, { NotificationProps } from '@/components/base/Notification/Notification'
import styles from './style.module.scss'
import createClasses from '@/utils/createClasses'

interface Props {
	stack: NotificationProps[]
	position: 'top-center' | 'bottom-right'
}

export default function NotificationStack({ stack, position }: Props) {
	return stack.length > 0 ? (
		<div
			className={createClasses({
				[styles['stack']]: true,
				[styles[`stack--${position}`]]: true
			})}
		>
			{stack.map((n, index) => (
				<Notification key={n.id} stackIndex={index} stackLength={stack.length} {...n} />
			))}
		</div>
	) : (
		<></>
	)
}
