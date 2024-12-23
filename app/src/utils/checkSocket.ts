import { NotificationContextType } from '@/context/Notification'
import { CustomSocket } from '@/context/Socket'

export default function checkSocket(
	socket: CustomSocket | null,
	notifs: NotificationContextType
): socket is CustomSocket {
	if (!socket) {
		notifs.push({
			style: 'error',
			text: 'Failed to connect to the server. Please refresh to try again.'
		})
		return false
	}
	return true
}
