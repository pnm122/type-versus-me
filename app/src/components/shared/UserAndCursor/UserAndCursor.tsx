import { CursorColor } from '$shared/types/Cursor'
import createClasses from '@/utils/createClasses'
import CursorPreview from '../CursorPreview/CursorPreview'
import styles from './style.module.scss'

interface Props {
	/**
	 * Size of the cursor and user text
	 * @default "medium"
	 **/
	size?: 'small' | 'medium' | 'large'
	username: React.ReactNode
	color: CursorColor
}

export default function UserAndCursor({ size = 'medium', username, color }: Props) {
	return (
		<div
			className={createClasses({
				[styles['user-and-cursor']]: true,
				[styles[`user-and-cursor--${size}`]]: true
			})}
		>
			<CursorPreview size={size} color={color} />
			<p className={styles['user-and-cursor__username']}>{username}</p>
		</div>
	)
}
