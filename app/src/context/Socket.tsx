"use client"
import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import ServerEvents from "$shared/types/events/server/_Events"
import ClientEvents from "$shared/types/events/client/_Events"
import Data from "@/types/Data";
import { LOADING } from "@/utils/constants";
import { useNotification } from "./Notification";

export type CustomSocket = Socket<
  ServerEvents,
  ClientEvents
>

export type SocketContextType = Data<CustomSocket, 'connect_error'>

const SocketContext = createContext<SocketContextType>(LOADING)

export function SocketProvider({ children }: React.PropsWithChildren) {
  const [data, setData] = useState<SocketContextType>(LOADING)
  const notifs = useNotification()
  const [socket, setSocket] = useState<CustomSocket | null>(null)

  function onConnect() {
    if(data.state === 'error') {
      notifs.push({
        text: 'Reconnected to the server successfully!'
      })
    }

    setData({
      state: 'valid',
      value: socket!,
      error: null
    })
  }

  function onConnectError() {
    if(data.state === 'error') return

    notifs.push({
      style: 'error',
      text: 'Failed to connect to the server. Please refresh to try again.'
    })
    setData({
      state: 'error',
      value: null,
      error: 'connect_error'
    })
  }

  useEffect(() => {
    if(!socket) return;
    socket.on('connect', onConnect)
    socket.on('connect_error', onConnectError)

    return () => {
      socket?.off('connect', onConnect)
      socket?.off('connect_error', onConnectError)
    }
  }, [data, socket])

  useEffect(() => {
    setSocket(
      io(
        process.env.NODE_ENV === 'development'
          ? process.env.NEXT_PUBLIC_DEV_SOCKET_URL
          : process.env.NEXT_PUBLIC_PROD_SOCKET_URL
      )
    )
  }, [])

  return (
    <SocketContext.Provider value={data}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext)