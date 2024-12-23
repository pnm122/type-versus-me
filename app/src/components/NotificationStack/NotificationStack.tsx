import Notification, { NotificationProps } from '../Notification/Notification'
import styles from './style.module.scss'

interface Props {
	stack: NotificationProps[]
}

export default function NotificationStack({ stack }: Props) {
	return stack.length > 0 ? (
		<div className={styles['stack']}>
			{stack.map((n) => (
				<Notification key={n.id} {...n} />
			))}
		</div>
	) : (
		<></>
	)
}
