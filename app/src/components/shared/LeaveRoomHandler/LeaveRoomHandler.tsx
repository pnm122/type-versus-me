'use client'

import { useGlobalState } from '@/context/GlobalState'
import { useNotification } from '@/context/Notification'
import { useSocket } from '@/context/Socket'
import { leaveRoom } from '@/utils/room'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'

export default function LeaveRoomHandler() {
	const globalState = useGlobalState()
	const socket = useSocket()
	const notifs = useNotification()
	const pathname = usePathname()

	useEffect(() => {
		if (!globalState.room) return

		// Leave the room the user is currently in if they are in one and the new route doesn't match the room's path
		const inCurrentRoom = pathname === `/room/${globalState.room.id}`
		if (!inCurrentRoom) {
			leaveRoom({ globalState, socket, notifs })
		}
	}, [pathname])

	return <></>
}
