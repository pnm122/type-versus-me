'use client'

import { useNotification } from '@/context/Notification'
import { useSocket } from '@/context/Socket'
import { leaveRoom } from '@/utils/realtime/room'
import { useParams, usePathname } from 'next/navigation'
import React, { useEffect } from 'react'

export default function LeaveRoomHandler() {
	const socket = useSocket()
	const notifs = useNotification()
	const params = useParams()
	const pathname = usePathname()

	useEffect(() => {
		// Will call leaveRoom unnecessarily, but this is the only way I can think of doing this without some hacky useEffect cleanup shit
		if (!params.roomId) {
			leaveRoom({ socket, notifs })
		}
	}, [pathname])

	return <></>
}
