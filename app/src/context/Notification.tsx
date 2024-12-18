"use client"

import { NotificationProps } from "@/components/Notification/Notification"
import NotificationStack from "@/components/NotificationStack/NotificationStack"
import { createContext, useContext, useRef, useState } from "react"
import { flushSync } from "react-dom"

export type NotificationData =
  Pick<NotificationProps, 'style'> &
  { text: string }

interface NotificationContextType {
  push: (data: NotificationData) => void
}

const NotificationContext = createContext<NotificationContextType>({
  push() {}
})

export function NotificationProvider({ children }: React.PropsWithChildren) {
  const MAX_NOTIFICATIONS = 4 as const
  
  const [notifs, setNotifs] = useState<NotificationProps[]>([])
  const counter = useRef(0)

  function updateNotifs(
    x: React.SetStateAction<NotificationProps[]>
  ) {
    if(!document.startViewTransition) return setNotifs(x)
    
    document.startViewTransition(async () => {
      // Update the DOM synchronously so the view transition API can reliably get
      // a before and after snapshot of the DOM
      flushSync(() => {
        setNotifs(x)
      })
    })
  }

  function onClose(id: string) {
    updateNotifs(n => n.filter(notif => notif.id !== id))
  }

  function push(data: NotificationData) {
    updateNotifs(n => [
      {
        id: `notif-${counter.current++}`,
        onClose,
        style: data.style,
        children: data.text,
        closeDelay: 8000
      },
      ...n
    ].slice(0, MAX_NOTIFICATIONS))
  }

  return (
    <NotificationContext.Provider value={{ push }}>
      <NotificationStack stack={notifs} />
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => useContext(NotificationContext)