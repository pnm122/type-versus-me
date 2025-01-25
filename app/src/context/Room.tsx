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
import { createRoom, onChangeRoomData, onJoinRoom, onLeaveRoom } from '@/utils/realtime/room'
import { onChangeAllUserData, onChangeUserData } from '@/utils/realtime/user'
import { useNotification } from './Notification'
import { useAuthContext } from './Auth'
import { CreateRoomCallback } from '$shared/types/events/client/CreateRoom'

export interface RoomContextType {
	room: Room | null
	user: User | null
	createRoom(settings: RoomSettings): Promise<Parameters<CreateRoomCallback>[0]>
}

const RoomContext = createContext<RoomContextType>({
	room: null,
	user: null,
	async createRoom() {
		return { value: null, error: { reason: 'missing-argument' } }
	}
})

export function RoomProvider({ children }: React.PropsWithChildren) {
	const [room, setRoom] = useState<Room | null>(null)
	const [user, setUser] = useState<User | null>(null)
	const socket = useSocket()
	const notifs = useNotification()
	const auth = useAuthContext()

	const state = { room, setRoom, user, setUser }
	const context = { socket, notifs }

	useEffect(() => {
		if (socket.state !== 'valid') return

		const handleJoinRoom = (res: ServerJoinRoomPayload) => onJoinRoom(res, state, context)
		const handleLeaveRoom = (res: ServerLeaveRoomPayload) => onLeaveRoom(res, state, context)
		const handleChangeRoomData = (res: ChangeRoomDataPayload) => onChangeRoomData(res, state)
		const handleChangeAllUserData = (res: ChangeAllUserDataPayload) =>
			onChangeAllUserData(res, state)
		const handleChangeUserData = (res: ChangeUserDataPayload) => onChangeUserData(res, state)
		const handleDisconnect = () => setRoom(null)

		socket.value.on('join-room', handleJoinRoom)
		socket.value.on('leave-room', handleLeaveRoom)
		socket.value.on('change-room-data', handleChangeRoomData)
		socket.value.on('change-all-user-data', handleChangeAllUserData)
		socket.value.on('change-user-data', handleChangeUserData)
		socket.value.on('disconnect', handleDisconnect)

		return () => {
			socket.value.off('join-room', handleJoinRoom)
			socket.value.off('leave-room', handleLeaveRoom)
			socket.value.off('change-room-data', handleChangeRoomData)
			socket.value.off('change-all-user-data', handleChangeAllUserData)
			socket.value.off('change-user-data', handleChangeUserData)
			socket.value.off('disconnect', handleDisconnect)
		}
	}, [socket, state, context])

	function createRoomExternal(settings: RoomSettings) {
		return createRoom(settings, auth.user, state, context)
	}

	return (
		<RoomContext.Provider value={{ user, room, createRoom: createRoomExternal }}>
			{children}
		</RoomContext.Provider>
	)
}

export const useRoom = () => useContext(RoomContext)
