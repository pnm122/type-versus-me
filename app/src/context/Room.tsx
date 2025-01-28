'use client'

import { Room, RoomSettings } from '$shared/types/Room'
import { User } from '$shared/types/User'
import { createContext, useContext, useEffect, useState } from 'react'
import { useSocket } from './Socket'
import { ServerJoinRoomPayload } from '$shared/types/events/server/JoinRoom'
import { ServerLeaveRoomPayload } from '$shared/types/events/server/LeaveRoom'
import { ChangeRoomDataPayload } from '$shared/types/events/server/ChangeRoomData'
import { ChangeAllUserDataPayload } from '$shared/types/events/server/ChangeAllUserData'
import { ChangeUserDataPayload } from '$shared/types/events/server/ChangeUserData'
import {
	createRoom,
	joinRoom,
	leaveRoom,
	onChangeRoomData,
	onJoinRoom,
	onLeaveRoom
} from '@/utils/realtime/room'
import { onChangeAllUserData, onChangeUserData, onDatabaseUpdate } from '@/utils/realtime/user'
import { useNotification } from './Notification'
import { useAuthContext } from './Auth'
import { CreateRoomCallback } from '$shared/types/events/client/CreateRoom'
import { ClientJoinRoomCallback } from '$shared/types/events/client/JoinRoom'
import { useParams, usePathname } from 'next/navigation'
import { DatabaseUpdatePayload } from '$shared/types/events/server/DatabaseUpdate'
import { useUserNotifications } from './UserNotifications'

export interface RoomContextType {
	room: Room | null
	user: User | null
	createRoom(settings: RoomSettings): Promise<Parameters<CreateRoomCallback>[0]>
	joinRoom(roomId: string): Promise<Parameters<ClientJoinRoomCallback>[0]>
}

const RoomContext = createContext<RoomContextType>({
	room: null,
	user: null,
	async createRoom() {
		return { value: null, error: { reason: 'missing-argument' } }
	},
	async joinRoom() {
		return { value: null, error: { reason: 'missing-argument' } }
	}
})

export function RoomProvider({ children }: React.PropsWithChildren) {
	const [room, setRoom] = useState<Room | null>(null)
	const [user, setUser] = useState<User | null>(null)
	const socket = useSocket()
	const notifs = useNotification()
	const auth = useAuthContext()
	const pathname = usePathname()
	const params = useParams()
	const userNotifs = useUserNotifications()

	const state = { room, setRoom, user, setUser }
	const context = { socket, notifs, auth, userNotifs }

	useEffect(() => {
		if (socket.state !== 'valid') return

		const handleJoinRoom = (res: ServerJoinRoomPayload) => onJoinRoom(res, state, context)
		const handleLeaveRoom = (res: ServerLeaveRoomPayload) => onLeaveRoom(res, state, context)
		const handleChangeRoomData = (res: ChangeRoomDataPayload) => onChangeRoomData(res, state)
		const handleChangeAllUserData = (res: ChangeAllUserDataPayload) =>
			onChangeAllUserData(res, state)
		const handleChangeUserData = (res: ChangeUserDataPayload) => onChangeUserData(res, state)
		const handleDatabaseUpdate = (res: DatabaseUpdatePayload) => onDatabaseUpdate(res, context)
		const handleDisconnect = () => setRoom(null)

		socket.value.on('join-room', handleJoinRoom)
		socket.value.on('leave-room', handleLeaveRoom)
		socket.value.on('change-room-data', handleChangeRoomData)
		socket.value.on('change-all-user-data', handleChangeAllUserData)
		socket.value.on('change-user-data', handleChangeUserData)
		socket.value.on('database-update', handleDatabaseUpdate)
		socket.value.on('disconnect', handleDisconnect)

		return () => {
			socket.value.off('join-room', handleJoinRoom)
			socket.value.off('leave-room', handleLeaveRoom)
			socket.value.off('change-room-data', handleChangeRoomData)
			socket.value.off('change-all-user-data', handleChangeAllUserData)
			socket.value.off('change-user-data', handleChangeUserData)
			socket.value.off('database-update', handleDatabaseUpdate)
			socket.value.off('disconnect', handleDisconnect)
		}
	}, [socket, state, context])

	useEffect(() => {
		const { roomId } = params

		if (!roomId && room) {
			leaveRoomInternal()
		}
	}, [pathname])

	function createRoomExternal(settings: RoomSettings) {
		return createRoom(settings, auth.user, state, context)
	}

	function joinRoomExternal(roomId: string) {
		return joinRoom(roomId, auth.user, state, context)
	}

	async function leaveRoomInternal() {
		const res = await leaveRoom(context)
		if (res.error) return

		setRoom(null)
		setUser(null)
	}

	return (
		<RoomContext.Provider
			value={{ user, room, createRoom: createRoomExternal, joinRoom: joinRoomExternal }}
		>
			{children}
		</RoomContext.Provider>
	)
}

export const useRoom = () => useContext(RoomContext)
