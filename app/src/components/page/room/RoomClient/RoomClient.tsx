'use client'

import InRoom from '@/components/page/room/InRoom/InRoom'
import LoadingRoom from '@/components/page/room/LoadingRoom/LoadingRoom'
import { useAuthContext } from '@/context/Auth'
import { useRoom } from '@/context/Room'
import { useSocket } from '@/context/Socket'
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function RoomClient() {
	const { room, joinRoom } = useRoom()
	const { roomId } = useParams<{ roomId: string }>()
	const router = useRouter()
	const socket = useSocket()
	const auth = useAuthContext()

	useEffect(() => {
		if (
			socket.state === 'loading' ||
			auth.state === 'loading' ||
			auth.state === 'reloading' ||
			room
		) {
			return
		}
		if (socket.state === 'error' || auth.state === 'error') {
			router.push('/')
			return
		}

		init()
	}, [socket, auth, room])

	async function init() {
		const res = await joinRoom(roomId)
		if (res.error) return router.push('/')
	}

	if (!room) {
		return <LoadingRoom />
	}

	return <InRoom />
}
