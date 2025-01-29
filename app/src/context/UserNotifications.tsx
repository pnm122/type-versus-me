'use client'

import { NotificationProps } from '@/components/base/Notification/Notification'
import NotificationStack from '@/components/base/NotificationStack/NotificationStack'
import NewUnlocksNotificationContent from '@/components/shared/NewUnlocksNotificationContent/NewUnlocksNotificationContent'
import PointsUpdateNotificationContent from '@/components/shared/PointsUpdateNotificationContent/PointsUpdateNotificationContent'
import { getLevel } from '@/utils/level'
import transition from '@/utils/transition'
import { UNLOCKS } from '@/utils/unlocks'
import { createContext, useContext, useRef, useState } from 'react'

export interface UserNotificationsContextType {
	pushPointsUpdateNotification(prevPoints: number, nextPoints: number): void
}

const UserNotificationsContext = createContext<UserNotificationsContextType>({
	pushPointsUpdateNotification() {}
})

export function UserNotificationsProvider({ children }: React.PropsWithChildren) {
	const MAX_NOTIFICATIONS = 4 as const

	const [notifs, setNotifs] = useState<NotificationProps[]>([])
	const counter = useRef(0)

	function updateNotifs(x: React.SetStateAction<NotificationProps[]>) {
		transition(() => setNotifs(x))
	}

	function onClose(id: string) {
		updateNotifs((n) => n.filter((notif) => notif.id !== id))
	}

	function pushPointsUpdateNotification(prevPoints: number, nextPoints: number) {
		const prevLevel = getLevel(prevPoints)
		const nextLevel = getLevel(nextPoints)
		const earnedUnlocks = Object.entries(UNLOCKS).filter((u) => {
			const levelToUnlock = parseInt(u[0])
			return levelToUnlock <= nextLevel && levelToUnlock > prevLevel
		})

		updateNotifs((n) =>
			[
				{
					id: `user-notif-${counter.current++}`,
					onClose,
					children: <PointsUpdateNotificationContent {...{ prevPoints, nextPoints }} />,
					closeDelay: 15000,
					closeDirection: 'down'
				} as const,
				...(earnedUnlocks.length === 0
					? []
					: ([
							{
								id: `user-notif-${counter.current++}`,
								onClose,
								children: <NewUnlocksNotificationContent unlocks={earnedUnlocks} />,
								closeDelay: 14750,
								closeDirection: 'down',
								icon: 'alert'
							}
						] as const)),
				...n
			].slice(0, MAX_NOTIFICATIONS)
		)
	}

	return (
		<UserNotificationsContext.Provider value={{ pushPointsUpdateNotification }}>
			<NotificationStack stack={notifs} position="bottom-right" />
			{children}
		</UserNotificationsContext.Provider>
	)
}

export const useUserNotifications = () => useContext(UserNotificationsContext)
