import { Auth } from '@/context/Auth'
import { NotificationContextType } from '@/context/Notification'
import { RoomContextType } from '@/context/Room'
import { SocketContextType } from '@/context/Socket'

export interface Context {
	notifs: NotificationContextType
	socket: SocketContextType
	auth: Auth
	room: RoomContextType
}
