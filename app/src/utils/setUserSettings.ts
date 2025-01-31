import { User } from '$shared/types/User'
import { Context } from '@/types/Context'
import { updateUser as updateUserInDatabase } from '$shared/utils/database/user'
import { updateUser as updateUserInSocket } from '@/utils/realtime/user'
import { CursorColor } from '$shared/types/Cursor'

export default async function setUserSettings(
	{ color, username }: Partial<Pick<User, 'color' | 'username'>>,
	{
		auth: { user, reload },
		room: { room, user: socketUser },
		socket,
		notifs
	}: Pick<Context, 'auth' | 'room' | 'socket' | 'notifs'>
) {
	if (user) {
		const { error } = await updateUserInDatabase(user.id, {
			username,
			cursorColor: color
		})

		if (error) {
			notifs.push({
				style: 'error',
				text: `There was an error updating your settings. Please refresh and try again. (Error code: "${error.code}")`
			})
		}
	}

	// Reload user data so it's synced across the app
	const newUser = await reload()
	// Update settings in room if applicable
	if (room && socketUser && newUser) {
		if (newUser.cursorColor !== socketUser.color) {
			await updateUserInSocket(
				'color',
				newUser.cursorColor as CursorColor,
				{ user: socketUser },
				{ socket, notifs }
			)
		}
		if (newUser.username !== socketUser.username) {
			await updateUserInSocket(
				'username',
				newUser.username,
				{ user: socketUser },
				{ socket, notifs }
			)
		}
	}
}
