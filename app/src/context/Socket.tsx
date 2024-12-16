"use client"
import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import ServerEvents from "$shared/types/events/server/_Events"
import ClientEvents from "$shared/types/events/client/_Events"
import Data from "@/types/Data";
import { LOADING } from "@/utils/constants";

export type CustomSocket = Socket<
  ServerEvents,
  ClientEvents
>

export type SocketContextType = Data<CustomSocket, 'connect_error'>

const SocketContext = createContext<SocketContextType>(LOADING)

export function SocketProvider({ children }: React.PropsWithChildren) {
  const [data, setData] = useState<SocketContextType>(LOADING)

  useEffect(() => {
    const socket = io(
      process.env.NODE_ENV === 'development'
        ? process.env.NEXT_PUBLIC_DEV_SOCKET_URL
        : process.env.NEXT_PUBLIC_PROD_SOCKET_URL
    )
    socket.on('connect', () => {
      setData({
        state: 'valid',
        value: socket,
        error: null
      })
    })
    socket.on('connect_error', () => {
      setData({
        state: 'error',
        value: null,
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