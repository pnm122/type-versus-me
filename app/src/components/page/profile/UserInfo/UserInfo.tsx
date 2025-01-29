'use client'

import { User } from '@prisma/client'
import styles from './style.module.scss'
import UserAndCursor from '@/components/shared/UserAndCursor/UserAndCursor'
import { CursorColor } from '$shared/types/Cursor'
import LevelAndPoints from '../LevelAndPoints/LevelAndPoints'
import { useAuthContext } from '@/context/Auth'

interface Props {
	user: User
}

export default function UserInfo({ user }: Props) {
	const { user: currentUser } = useAuthContext()
	// Subscribe to current user changes if this is the current user
	const displayUser = user.id === currentUser?.id ? currentUser : user

	return (
		<div className={styles['user']}>
			<div className={styles['user__preview-and-edit']}>
				<UserAndCursor
					size="large"
					username={displayUser.username}
					color={displayUser.cursorColor as CursorColor}
				/>
			</div>
			<LevelAndPoints user={displayUser} />
		</div>
	)
}
