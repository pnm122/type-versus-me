import { ChangeUsernameCallback } from '$shared/types/events/client/ChangeUsername'
import { ChangeUserScoreCallback } from '$shared/types/events/client/ChangeUserScore'
import { ChangeUserStateCallback } from '$shared/types/events/client/ChangeUserState'
import { RequestColorCallback } from '$shared/types/events/client/RequestColor'
import { User } from '$shared/types/User'
import checkSocket from '../checkSocket'
import { SocketContextType } from '@/context/Socket'
import { NotificationContextType } from '@/context/Notification'
import { errorNotification } from '../errorNotifications'
import { ChangeAllUserDataPayload } from '$shared/types/events/server/ChangeAllUserData'
import { ChangeUserDataPayload } from '$shared/types/events/server/ChangeUserData'
import { Room } from '$shared/types/Room'
import { DatabaseUpdatePayload } from '$shared/types/events/server/DatabaseUpdate'
import { Auth } from '@/context/Auth'
import { UserNotificationsContextType } from '@/context/UserNotifications'

interface Context {
	notifs: NotificationContextType
	socket: SocketContextType
	auth: Auth
	userNotifs: UserNotificationsContextType
}

interface State {
	room: Room | null
	setRoom: SetState<Room | null>
	user: User | null
	setUser: SetState<User | null>
}

type SetState<T> = React.Dispatch<React.SetStateAction<T>>

/**
 * Request to change some value of the user.
 */
export async function updateUser<T extends keyof Omit<User, 'id'>>(
	key: T,
	value: Required<User>[T],
	{ user }: Pick<State, 'user'>,
	{ socket, notifs }: Context
): Promise<
	T extends 'username'
		? Parameters<ChangeUsernameCallback>[0]
		: T extends 'score'
			? Parameters<ChangeUserScoreCallback>[0]
			: T extends 'state'
				? Parameters<ChangeUserStateCallback>[0]
				: Parameters<RequestColorCallback>[0]
> {
	if (!checkSocket(socket.value, notifs) || !user) {
		return {
			value: null,
			error: {
				reason: 'missing-argument'
			}
		} as any
	}
	const res = await (() => {
		if (key === 'username') {
			return socket.value.emitWithAck('change-username', {
				socketId: user.socketId,
				username: value as User['username']
			})
		} else if (key === 'color') {
			return socket.value.emitWithAck('request-color', {
				socketId: user.socketId,
				color: value as User['color']
			})
		} else if (key === 'state') {
			return socket.value.emitWithAck('change-user-state', {
				socketId: user.socketId,
				state: value as Required<User>['state']
			})
		} else {
			return socket.value.emitWithAck('change-user-score', {
				socketId: user.socketId,
				score: value as Required<User>['score']
			})
		}
	})()

	if (res.error) {
		notifs.push(errorNotification(res.error.reason))
		// This is typed correctly but it's a hassle to get typescript to like it
		// Besides, the whole benefit is knowing the type outside of this function
		return res as any
	}

	return res as any
}

export async function onChangeAllUserData(
	data: ChangeAllUserDataPayload,
	{ setUser, setRoom }: Pick<State, 'setUser' | 'setRoom'>
) {
	setRoom((r) =>
		r
			? {
					...r,
					users: r.users.map((u) => ({ ...u, ...data }))
				}
			: null
	)

	setUser((u) =>
		u
			? {
					...u,
					...data
				}
			: null
	)
}

export async function onChangeUserData(
	data: ChangeUserDataPayload,
	{ setRoom, setUser, user }: Pick<State, 'setRoom' | 'setUser' | 'user'>
) {
	setRoom((r) =>
		r
			? {
					...r,
					users: r.users.map((u) => (u.socketId === data.socketId ? { ...u, ...data } : u))
				}
			: null
	)
	if (data.socketId === user?.socketId) {
		setUser((u) =>
			u
				? {
						...u,
						...data
					}
				: null
		)
	}
}

export async function onDatabaseUpdate(
	data: DatabaseUpdatePayload,
	{ auth, userNotifs }: Pick<Context, 'auth' | 'userNotifs'>
) {
	userNotifs.pushPointsUpdateNotification(auth.user!.points, data.points)
	auth.reload(data)
}
