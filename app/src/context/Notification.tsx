'use client'

import { NotificationProps } from '@/components/base/Notification/Notification'
import NotificationStack from '@/components/base/NotificationStack/NotificationStack'
import transition from '@/utils/transition'
import { createContext, useContext, useRef, useState } from 'react'

export type NotificationData = Pick<NotificationProps, 'style'> & {
	text: Required<NotificationProps>['children']
}

export interface NotificationContextType {
	push: (data: NotificationData) => void
}

const NotificationContext = createContext<NotificationContextType>({
	push() {}
})

export function NotificationProvider({ children }: React.PropsWithChildren) {
	const MAX_NOTIFICATIONS = 4 as const

	const [notifs, setNotifs] = useState<NotificationProps[]>([])
	const counter = useRef(0)

	function updateNotifs(x: React.SetStateAction<NotificationProps[]>) {
		transition(() => setNotifs(x))
	}

	function onClose(id: string) {
		updateNotifs((n) => n.filter((notif) => notif.id !== id))
	}

	function push(data: NotificationData) {
		updateNotifs((n) =>
			[
				{
					id: `main-notif-${counter.current++}`,
					onClose,
					style: data.style,
					children: data.text,
					closeDelay: 8000
				},
				...n
			].slice(0, MAX_NOTIFICATIONS)
		)
	}

	return (
		<NotificationContext.Provider value={{ push }}>
			<NotificationStack stack={notifs} position="top-center" />
			{children}
		</NotificationContext.Provider>
	)
}

export const useNotification = () => useContext(NotificationContext)
