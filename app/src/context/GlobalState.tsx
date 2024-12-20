"use client"

import { Room } from "$shared/types/Room"
import { User } from "$shared/types/User"
import { createContext, useContext, useEffect, useRef, useState } from "react"
import { useSocket } from "./Socket"
import { getColor, getUsername } from "@/utils/user"
import { onJoinRoom, onLeaveRoom } from "@/utils/room"
import { useNotification } from "./Notification"
import { ServerJoinRoomPayload } from "$shared/types/events/server/JoinRoom"
import { ServerLeaveRoomPayload } from "$shared/types/events/server/LeaveRoom"

export type GlobalState = {
  user: User | null
  room: Room | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  setRoom: React.Dispatch<React.SetStateAction<Room | null>>
  waitForStateChange: () => Promise<void>
}

const GlobalStateContext = createContext<GlobalState>({
  user: null,
  room: null,
  setUser() {},
  setRoom() {},
  async waitForStateChange() {}
})

export function GlobalStateProvider({
  children
}: React.PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null)
  const [room, setRoom] = useState<Room | null>(null)
  const socket = useSocket()
  const notifs = useNotification()
  const stateHasChanged = useRef<(() => void) | null>(null)

  useEffect(() => {
    if(stateHasChanged.current) {
      stateHasChanged.current()
      stateHasChanged.current = null
    }
  }, [room, user])

  useEffect(() => {
    if(socket.state !== 'valid') return

    const username = getUsername()
    const color = getColor()

    setUser({
      id: socket.value.id!,
      username,
      color
    })
  }, [socket])

  useEffect(() => {
    if(socket.state !== 'valid') return

    const handleJoinRoom = (res: ServerJoinRoomPayload) => onJoinRoom(res, { globalState: { user, setUser, room, setRoom, waitForStateChange }, notifs })
    const handleLeaveRoom = (res: ServerLeaveRoomPayload) => onLeaveRoom(res, { globalState: { user, setUser, room, setRoom, waitForStateChange }, notifs })
    
    socket.value.on('join-room', handleJoinRoom)
    socket.value.on('leave-room', handleLeaveRoom)

    return () => {
      socket.value.off('join-room', handleJoinRoom)
    }
  }, [socket, room])

  function waitForStateChange() {
    return new Promise<void>(res => stateHasChanged.current = res)
  }

  return (
    <GlobalStateContext.Provider value={{ user, room, setUser, setRoom, waitForStateChange }}>
      {children}
    </GlobalStateContext.Provider>
  )
}

export const useGlobalState = () => useContext(GlobalStateContext)