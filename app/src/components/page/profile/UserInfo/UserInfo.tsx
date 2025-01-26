import { User } from '@prisma/client'
import styles from './style.module.scss'
import UserAndCursor from '@/components/shared/UserAndCursor/UserAndCursor'
import { CursorColor } from '$shared/types/Cursor'
import LevelAndPoints from '../LevelAndPoints/LevelAndPoints'

interface Props {
	user: User
}

export default function UserInfo({ user }: Props) {
	return (
		<div className={styles['user']}>
			<div className={styles['user__preview-and-edit']}>
				<UserAndCursor
					size="large"
					username={user.username}
					color={user.cursorColor as CursorColor}
				/>
			</div>
			<LevelAndPoints user={user} />
		</div>
	)
}
