"use client"

import { Room } from "$shared/types/Room"
import { User } from "$shared/types/User"
import { createContext, useContext, useEffect, useRef, useState } from "react"
import { useSocket } from "./Socket"
import { getColor, getUsername, onChangeAllUserData, onChangeUserData } from "@/utils/user"
import { onChangeRoomData, onJoinRoom, onLeaveRoom } from "@/utils/room"
import { useNotification } from "./Notification"
import { ServerJoinRoomPayload } from "$shared/types/events/server/JoinRoom"
import { ServerLeaveRoomPayload } from "$shared/types/events/server/LeaveRoom"
import { ChangeRoomDataPayload } from "$shared/types/events/server/ChangeRoomData"
import { ChangeAllUserDataPayload } from "$shared/types/events/server/ChangeAllUserData"
import { ChangeUserDataPayload } from "$shared/types/events/server/ChangeUserData"

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
  const waitForStateChangePromise = useRef<Promise<void> | null>(null)

  const globalState = { user, setUser, room, setRoom, waitForStateChange }

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

    const handleJoinRoom = (res: ServerJoinRoomPayload) => onJoinRoom(res, { globalState, notifs })
    const handleLeaveRoom = (res: ServerLeaveRoomPayload) => onLeaveRoom(res, { globalState, notifs })
    const handleChangeRoomData = (res: ChangeRoomDataPayload) => onChangeRoomData(res, { globalState })
    const handleChangeAllUserData = (res: ChangeAllUserDataPayload) => onChangeAllUserData(res, { globalState })
    const handleChangeUserData = (res: ChangeUserDataPayload) => onChangeUserData(res, { globalState })
    const handleDisconnect = () => setRoom(null)

    socket.value.on('join-room', handleJoinRoom)
    socket.value.on('leave-room', handleLeaveRoom)
    socket.value.on('change-room-data', handleChangeRoomData)
    socket.value.on('change-all-user-data', handleChangeAllUserData)
    socket.value.on('change-user-data', handleChangeUserData)
    socket.value.on('disconnect', handleDisconnect)

    return () => {
      socket.value.off('join-room', handleJoinRoom)
      socket.value.off('leave-room', handleLeaveRoom)
      socket.value.off('change-room-data', handleChangeRoomData)
      socket.value.off('change-all-user-data', handleChangeAllUserData)
      socket.value.off('change-user-data', handleChangeUserData)
      socket.value.off('disconnect', handleDisconnect)
    }
  }, [socket, room])

  function waitForStateChange() {
    if(waitForStateChangePromise.current) {
      return waitForStateChangePromise.current
    }
    waitForStateChangePromise.current = new Promise<void>(res => stateHasChanged.current = res)
    return waitForStateChangePromise.current
  }

  return (
    <GlobalStateContext.Provider value={globalState}>
      {children}
    </GlobalStateContext.Provider>
  )
}

export const useGlobalState = () => useContext(GlobalStateContext)