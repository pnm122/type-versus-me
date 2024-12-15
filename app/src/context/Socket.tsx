"use client"
import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import ServerEvents from "$shared/types/events/server/_Events"
import ClientEvents from "$shared/types/events/client/_Events"

export type CustomSocket = Socket<
  ServerEvents,
  ClientEvents
>

export type SocketContextType = {
  state: 'connected'
  socket: CustomSocket
  error: null
} | {
  state: 'loading'
  socket: null
  error: null
} | {
  state: 'error'
  socket: null
  error: string
}

const SocketContext = createContext<SocketContextType>({
  state: 'loading',
  socket: null,
  error: null
})

export function SocketProvider({ children }: React.PropsWithChildren) {
  const [data, setData] = useState<SocketContextType>({
    state: 'loading',
    socket: null,
    error: null
  })

  useEffect(() => {
    const socket = io(
      process.env.NODE_ENV === 'development'
        ? process.env.NEXT_PUBLIC_DEV_SOCKET_URL
        : process.env.NEXT_PUBLIC_PROD_SOCKET_URL
    )
    socket.on('connect', () => {
      setData({
        state: 'connected',
        socket,
        error: null
      })
    })
    socket.on('connect_error', () => {
      setData({
        state: 'error',
        socket: null,
        error: 'connect_error'
      })
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <SocketContext.Provider value={data}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext)