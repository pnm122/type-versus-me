import { User as UserType } from '$shared/types/User'
import CursorPreview from '@/components/shared/CursorPreview/CursorPreview'
import styles from './style.module.scss'
import { useGlobalState } from '@/context/GlobalState'
import UserState from './UserState'
import RiVipCrownFill from '~icons/ri/vip-crown-fill'

interface Props {
	user: UserType
}

export default function User({ user: { id, username, color, score, state } }: Props) {
	const globalState = useGlobalState()
	const { user, room } = globalState

	return (
		<li className={styles['user']}>
			<div className={styles['user__name']}>
				<CursorPreview size="small" color={color} />
				<p className={styles['username']}>
					<span className={styles['username__main']}>
						{username}
						{room?.admin === id && (
							<RiVipCrownFill aria-label="Admin" className={styles['admin-icon']} />
						)}
					</span>
					{id === user!.id && <span className={styles['username__you']}> (you)</span>}
				</p>
			</div>
			<div className={styles['user__info']}>
				<UserState score={score} state={state} />
			</div>
		</li>
	)
}
