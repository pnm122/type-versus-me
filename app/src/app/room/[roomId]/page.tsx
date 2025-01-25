'use client'

import { useState } from 'react'
// import { useParams, usePathname, useRouter } from 'next/navigation'
// import { useNotification } from '@/context/Notification'
// import { errorNotification } from '@/utils/errorNotifications'
// import { useSocket } from '@/context/Socket'
import InRoom from '@/components/page/room/InRoom/InRoom'
import LoadingRoom from '@/components/page/room/LoadingRoom/LoadingRoom'
// import { getRoom, leaveRoom } from '@/utils/realtime/room'
import { useRoom } from '@/context/Room'

export default function Room() {
	// const notifs = useNotification()
	// const router = useRouter()
	// const socket = useSocket()
	// const { roomId } = useParams<{ roomId: string }>()
	const { room } = useRoom()
	const [loading] = useState(room === null)

	// useEffect(() => {
	// 	return () => {
	// 		console.log('effect cleanup')
	// 	}
	// }, [])

	// async function initRoom() {
	// 	// Room was already initialized by creating the room
	// 	// if (room) {
	// 	// 	const res = await getRoom(id, { notifs, socket })
	// 	//   // Go to homepage if the room does not exist/an error occurred
	// 	//   if(res.error || !res.value) {
	// 	//     return router.push('/')
	// 	//   }
	// 	// }
	// }

	if (loading) {
		return <LoadingRoom />
	}

	return <InRoom />
}
