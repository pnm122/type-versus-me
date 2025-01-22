import { User as UserType } from '$shared/types/User'
import styles from './style.module.scss'
import { useGlobalState } from '@/context/GlobalState'
import UserState from './UserState'
import RiVipCrownFill from '~icons/ri/vip-crown-fill'
import UserAndCursor from '@/components/shared/UserAndCursor/UserAndCursor'

interface Props {
	user: UserType
}

export default function User({ user: { id, username, color, score, state } }: Props) {
	const globalState = useGlobalState()
	const { user, room } = globalState

	const usernameElement = (
		<>
			<span className={styles['username']}>
				{username}
				{room?.admin === id && (
					<RiVipCrownFill aria-label="Admin" className={styles['admin-icon']} />
				)}
			</span>
			{id === user!.id && <span className={styles['you']}> (you)</span>}
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
