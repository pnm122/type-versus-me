import { User as UserType } from '$shared/types/User'
import CursorPreview from '@/components/CursorPreview/CursorPreview'
import styles from './style.module.scss'
import { useGlobalState } from '@/context/GlobalState'
import UserState from './UserState'

interface Props {
	user: UserType
}

export default function User({ user: { id, username, color, score, state } }: Props) {
	const { user } = useGlobalState()

	return (
		<li className={styles['user']}>
			<div className={styles['user__name']}>
				<CursorPreview size="small" color={color} />
				<p className={styles['username']}>
					{username}
					{id === user!.id && <span className={styles['username__you']}> (you)</span>}
				</p>
			</div>
			<div className={styles['user__info']}>
				<UserState score={score} state={state} />
			</div>
		</li>
	)
}
