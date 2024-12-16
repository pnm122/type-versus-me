"use client"

import { NotificationProps } from "@/components/Notification/Notification"
import NotificationStack from "@/components/NotificationStack/NotificationStack"
import { createContext, useContext, useState } from "react"

type NotificationData = {
  style: Required<NotificationProps>['style']
  text: string
}

interface NotificationContextType {
  push: (data: NotificationData) => void
}

const NotificationContext = createContext<NotificationContextType>({
  push() {}
})

export function NotificationProvider({ children }: React.PropsWithChildren) {
  const [notifs, setNotifs] = useState<NotificationProps[]>([])

  function onClose(id: string) {
    setNotifs(n => n.filter(notif => notif.id !== id))
  }

  function push(data: NotificationData) {
    setNotifs(n => [
      {
        id: `${data.text}${Date.now()}`,
        onClose,
        style: data.style,
        children: data.text
      },
      ...n
    ])
  }

  return (
    <NotificationContext.Provider value={{ push }}>
      <NotificationStack stack={notifs} />
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => useContext(NotificationContext)