'use client'

import InRoom from '@/components/page/room/InRoom/InRoom'
import LoadingRoom from '@/components/page/room/LoadingRoom/LoadingRoom'
import { useAuthContext } from '@/context/Auth'
import { useRoom } from '@/context/Room'
import { useSocket } from '@/context/Socket'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Room() {
	const { room, joinRoom } = useRoom()
	const { roomId } = useParams<{ roomId: string }>()
	const router = useRouter()
	const socket = useSocket()
	const auth = useAuthContext()
	const [loading, setLoading] = useState(!room)

	useEffect(() => {
		if (socket.state !== 'valid' || auth.state !== 'ready' || !loading) return

		if (!room) {
			init()
		}
	}, [socket, auth])

	async function init() {
		const res = await joinRoom(roomId)
		if (res.error) return router.push('/')
		setLoading(false)
	}

	if (loading) {
		return <LoadingRoom />
	}

	return <InRoom />
}
