import { CreateRoomCallback } from '$shared/types/events/client/CreateRoom'
import { ServerJoinRoomPayload } from '$shared/types/events/server/JoinRoom'
import { ServerLeaveRoomPayload } from '$shared/types/events/server/LeaveRoom'
import { NotificationContextType } from '@/context/Notification'
import checkSocket from '../checkSocket'
import { errorNotification } from '../errorNotifications'
import { Room, RoomSettings } from '$shared/types/Room'
import { ClientJoinRoomCallback } from '$shared/types/events/client/JoinRoom'
import { Return } from '$shared/types/Return'
import ErrorsOf from '$shared/types/ErrorsOf'
import { LeaveRoomCallback } from '$shared/types/events/client/LeaveRoom'
import { ChangeRoomDataPayload } from '$shared/types/events/server/ChangeRoomData'
import { GetRoomCallback } from '$shared/types/events/client/GetRoom'
import { ChangeRoomSettingsPayload } from '$shared/types/events/client/ChangeRoomSettings'
import { SocketContextType } from '@/context/Socket'
import { User } from '$shared/types/User'
import { User as DatabaseUser } from '@prisma/client'
import { CursorColor } from '$shared/types/Cursor'
import generateUsername from '$shared/utils/generateUsername'

interface Context {
	notifs: NotificationContextType
	socket: SocketContextType
}

interface State {
	room: Room | null
	setRoom: SetState<Room | null>
	user: User | null
	setUser: SetState<User | null>
}

type SetState<T> = React.Dispatch<React.SetStateAction<T>>

export function onJoinRoom(
	res: ServerJoinRoomPayload,
	{ room, setRoom }: Pick<State, 'room' | 'setRoom'>,
	{ notifs }: Pick<Context, 'notifs'>
) {
	if (!room) return

	setRoom((r) => (r ? { ...r, users: [...r.users, res.user] } : null))
	notifs.push({
		text: `${res.user.username} has joined the room.`
	})
}

export function onLeaveRoom(
	res: ServerLeaveRoomPayload,
	{ room, setRoom }: Pick<State, 'room' | 'setRoom'>,
	{ notifs }: Pick<Context, 'notifs'>
) {
	if (!room) return

	const leavingUser = room.users.find((u) => u.socketId === res.userSocketId)
	if (!leavingUser) {
		return
	}

	setRoom((r) =>
		r ? { ...r, users: r.users.filter((u) => u.socketId !== res.userSocketId) } : null
	)
	notifs.push({
		text: `${leavingUser.username} has left the room.`
	})
}

export function onChangeRoomData(res: ChangeRoomDataPayload, { setRoom }: Pick<State, 'setRoom'>) {
	setRoom((r) => (r ? { ...r, ...res } : null))
}

export async function createRoom(
	settings: RoomSettings,
	user: DatabaseUser | null,
	{ setUser, setRoom }: Pick<State, 'setUser' | 'setRoom'>,
	{ socket, notifs }: Context
): Promise<Parameters<CreateRoomCallback>[0]> {
	if (!checkSocket(socket.value, notifs)) {
		return {
			value: null,
			error: {
				reason: 'missing-argument'
			}
		}
	}
	const res = await socket.value.emitWithAck('create-room', {
		user: {
			socketId: socket.value.id!,
			userId: user?.id,
			username: user?.username ?? generateUsername(),
			color: (user?.cursorColor as CursorColor) ?? 'gray'
		},
		settings
	})

	if (res.error) {
		notifs.push(errorNotification(res.error.reason))
		return res
	}

	setUser(res.value.user)
	setRoom(res.value.room)
	return res
}

export async function joinRoom(
	id: Room['id'],
	user: DatabaseUser | null,
	{ setUser, setRoom }: Pick<State, 'setUser' | 'setRoom'>,
	{ socket, notifs }: Context
): Promise<Parameters<ClientJoinRoomCallback>[0]> {
	if (!checkSocket(socket.value, notifs)) {
		return {
			value: null,
			error: {
				reason: 'missing-argument'
			}
		}
	}
	const res = await socket.value.emitWithAck('join-room', {
		roomId: id,
		user: {
			socketId: socket.value.id!,
			userId: user?.id,
			username: user?.username ?? generateUsername(),
			color: (user?.cursorColor as CursorColor) ?? 'gray'
		}
	})

	if (res.error) {
		notifs.push(errorNotification(res.error.reason))
		return res
	}

	setUser(res.value.user)
	setRoom(res.value.room)
	return res
}

export async function leaveRoom({
	socket,
	notifs
}: Context): Promise<Return<null, ErrorsOf<LeaveRoomCallback> | 'missing-argument'>> {
	if (!checkSocket(socket.value, notifs)) {
		return {
			value: null,
			error: {
				reason: 'missing-argument'
			}
		}
	}
	const res = await socket.value.emitWithAck('leave-room', null)

	if (res.error) {
		return res
	}

	return { value: null, error: null }
}

export async function getRoom(
	roomId: Room['id'],
	{ notifs, socket }: Context
): Promise<Parameters<GetRoomCallback>[0]> {
	if (!checkSocket(socket.value, notifs)) {
		return {
			value: null,
			error: {
				reason: 'missing-argument'
			}
		}
	}
	return await socket.value.emitWithAck('get-room', roomId)
}

export async function changeRoomSettings(
	settings: ChangeRoomSettingsPayload['settings'],
	{ user, room }: Pick<State, 'user' | 'room'>,
	{ socket, notifs }: Context
) {
	if (!checkSocket(socket.value, notifs) || !user || !room) {
		return {
			value: null,
			error: {
				reason: 'missing-argument'
			}
		}
	}

	const res = await socket.value.emitWithAck('change-room-settings', {
		userSocketId: user.socketId,
		roomId: room.id,
		settings
	})

	if (res.error) {
		notifs.push(errorNotification(res.error.reason))
	}

	return res
}
