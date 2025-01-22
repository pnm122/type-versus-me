'use client'

import React, { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useNotification } from '@/context/Notification'
import { errorNotification } from '@/utils/errorNotifications'
import { useSocket } from '@/context/Socket'
import InRoom from '@/components/page/room/InRoom/InRoom'
import JoinRoom from '@/components/page/room/JoinRoom/JoinRoom'
import LoadingRoom from '@/components/page/room/LoadingRoom/LoadingRoom'
import { useGlobalState } from '@/context/GlobalState'
import { doesRoomExist } from '@/utils/room'

export default function Room() {
	const { room } = useGlobalState()
	const pathname = usePathname()
	const notifs = useNotification()
	const router = useRouter()
	const socket = useSocket()
	const [roomExists, setRoomExists] = useState<boolean | null>(null)

	const pathRoomId = pathname.split('/').at(-1)!
	const inCurrentRoom = room && room.id === pathRoomId
	const inOtherRoom = room && room.id !== pathRoomId

	useEffect(() => {
		if (inOtherRoom) {
			notifs.push(errorNotification('user-in-room-already'))
			router.push('/')
		}
	}, [room])

	useEffect(() => {
		if (roomExists === false) {
			notifs.push(errorNotification('room-does-not-exist'))
			router.push('/')
		}
	}, [roomExists])

	useEffect(() => {
		if (socket.state !== 'valid') return
		doesRoomExist(pathRoomId, { socket, notifs }).then((res) => setRoomExists(res.value))
	}, [socket.state])

	// Show loading state even if the room doesn't exist or the user is in another room
	// because the user will be re-routed and there's no reason to show the other displays
	if ((!room && !roomExists) || inOtherRoom) {
		return <LoadingRoom />
	}

	if (inCurrentRoom) {
		return <InRoom />
	}

	// TODO: Get rid of concept of join room page
	return <JoinRoom />
}
