import { User as UserType } from '$shared/types/User'
import styles from './style.module.scss'
import UserState from './UserState'
import RiVipCrownFill from '~icons/ri/vip-crown-fill'
import UserAndCursor from '@/components/shared/UserAndCursor/UserAndCursor'
import { useRoom } from '@/context/Room'

interface Props {
	user: UserType
}

export default function User({ user: { socketId, username, color, score, state } }: Props) {
	const { user, room } = useRoom()

	const usernameElement = (
		<>
			<span className={styles['username']}>
				{username}
				{room?.admin === socketId && (
					<RiVipCrownFill aria-label="Admin" className={styles['admin-icon']} />
				)}
			</span>
			{socketId === user!.socketId && <span className={styles['you']}> (you)</span>}
		</>
	)

	return (
		<li className={styles['user']}>
			<div className={styles['user__name']}>
				<UserAndCursor size="small" color={color} username={usernameElement} />
			</div>
			<div className={styles['user__info']}>
				<UserState score={score} state={state} />
			</div>
		</li>
	)
}
