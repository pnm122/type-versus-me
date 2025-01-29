import { useSocket } from '@/context/Socket'
import { useEffect, useState } from 'react'

export function useActiveUserCount() {
	const [activeUserCount, setActiveUserCount] = useState(1)
	const socket = useSocket()

	// TODO: needs a way of fetching the active user count, otherwise it's possible to miss the change-user-count event from connecting
	useEffect(() => {
		if (socket.state !== 'valid') return

		socket.value.on('change-user-count', setActiveUserCount)

		return () => {
			socket.value.off('change-user-count', setActiveUserCount)
		}
	}, [socket])

	return activeUserCount
}
