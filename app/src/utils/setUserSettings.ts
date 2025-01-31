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
			// Prisma isn't throwing an error code for some reason, but it gives a message
			// Could also find() before, but I don't want to do additional queries
			if (error.message.match(/[Uu]nique/)) {
				notifs.push({
					style: 'error',
					text: `The username "${username}" is already taken. Please choose a different name.`
				})
			} else {
				notifs.push({
					style: 'error',
					text: `There was an error updating your settings. Please refresh and try again. (Error code: "${error.code}")`
				})
			}

			return error
		}
	}

	// Reload user data so it's synced across the app
	const newUser = await reload()
	// Update settings in room if applicable
	if (room && socketUser && newUser) {
		if (newUser.cursorColor !== socketUser.color) {
			const { error } = await updateUserInSocket(
				'color',
				newUser.cursorColor as CursorColor,
				{ user: socketUser },
				{ socket, notifs }
			)

			if (error) return error
		}
		if (newUser.username !== socketUser.username) {
			const error = await updateUserInSocket(
				'username',
				newUser.username,
				{ user: socketUser },
				{ socket, notifs }
			)

			if (error) return error
		}
	}
}
