"use client"

import { Room } from "$shared/types/Room";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useSocket } from "./Socket";
import { ServerJoinRoomPayload } from "$shared/types/events/server/JoinRoom";
import { ServerLeaveRoomPayload } from "$shared/types/events/server/LeaveRoom";
import { useNotification } from "./Notification";
import checkSocket from "@/utils/checkSocket";
import { useUser } from "./User";
import { errorNotification } from "@/utils/errorNotifications";
import { ClientJoinRoomCallback } from "$shared/types/events/client/JoinRoom";
import { CreateRoomCallback } from "$shared/types/events/client/CreateRoom";
import { Return } from "$shared/types/Return";
import { usePathname } from "next/navigation";

interface RoomContextType {
  room: Room | null
  create: () => Promise<Parameters<CreateRoomCallback>[0]>
  join: (id: Room['id']) => Promise<Parameters<ClientJoinRoomCallback>[0]>
  update: (r: Partial<Omit<Room, 'id'>>) => void
  leave: () => Promise<Return<null, 'user-not-in-room' | 'missing-argument'>>
}

const RoomContext = createContext<RoomContextType>({
  room: null,
  create(): any {},
  join(): any {},
  update() {},
  leave(): any {}
})

// TODO outgoing room events should probably be handled in here to centralize it?
export function RoomProvider({ children }: React.PropsWithChildren) {
  const [room, setRoom] = useState<Room | null>(null)
  const socket = useSocket()
  const notifs = useNotification()
  const user = useUser()
  const pathname = usePathname()
  const roomHasBeenUpdated = useRef<(() => void) | null>(null)

  useEffect(() => {
    if(!room) return

    // Leave the room the user is currently in if they are in one and the new route doesn't match the room's path
    const inCurrentRoom = pathname === `/room/${room.id}`
    if(!inCurrentRoom) leave()
  }, [pathname])

  useEffect(() => {
    if(socket.state !== 'valid') return
    
    socket.value.on('join-room', onJoinRoom)
    socket.value.on('leave-room', onLeaveRoom)

    return () => {
      socket.value.off('join-room', onJoinRoom)
    }
  }, [socket, room])

  useEffect(() => {
    if(roomHasBeenUpdated.current) {
      roomHasBeenUpdated.current()
      roomHasBeenUpdated.current = null
    }
  }, [room])

  function onJoinRoom(res: ServerJoinRoomPayload) {
    if(!checkRoomExists()) return
    update({ users: [...room!.users, res.user] })
    notifs.push({
      text: `${res.user.username} has joined the room.`
    })
  }

  function onLeaveRoom(res: ServerLeaveRoomPayload) {
    if(!checkRoomExists()) return
    const leavingUser = room!.users.find(u => u.id === res.userId)
    if(!leavingUser) {
      return console.warn(`Received ${res.userId} left room, but this user does not exist!`)
    }
    update({ users: room!.users.filter(u => u.id !== res.userId) })
    notifs.push({
      text: `${leavingUser.username} has left the room.`
    })
  }

  function checkRoomExists() {
    if(room) return true

    console.warn('Room does not exist, but it should!')
    return false
  }

  async function create(): ReturnType<RoomContextType['create']> {
    if(!checkSocket(socket.value, notifs)) {
      return {
        value: null,
        error: {
          reason: 'missing-argument'
        }
      }
    }
    const res = await socket.value.emitWithAck('create-room', user.data.value!)

    if(res.error) {
      notifs.push(errorNotification(res.error.reason))
      return res
    }

    user.set(res.value.user)
    setRoom(res.value.room)
    await waitForRoomUpdate()
    return res
  }

  async function join(id: Room['id']): ReturnType<RoomContextType['join']> {
    if(!checkSocket(socket.value, notifs)) {
      return {
        value: null,
        error: {
          reason: 'missing-argument'
        }
      }
    }
    const res = await socket.value.emitWithAck('join-room', { roomId: id, user: user.data.value! })

    if(res.error) {
      notifs.push(errorNotification(res.error.reason))
      return res
    }

    user.set(res.value.user)
    setRoom(res.value.room)
    await waitForRoomUpdate()
    return res
  }

  function update(r: Partial<Omit<Room, 'id'>>) {
    setRoom(current => current ? ({ ...current, ...r }) : null)
  }

  async function leave(): ReturnType<RoomContextType['leave']> {
    if(!checkSocket(socket.value, notifs)) {
      return {
        value: null,
        error: {
          reason: 'missing-argument'
        }
      }
    }
    const res = await socket.value.emitWithAck('leave-room', null)

    if(res.error) {
      return res
    }
    setRoom(null)
    await waitForRoomUpdate()
    return { value: null, error: null }
  }

  function waitForRoomUpdate() {
    return new Promise<void>(res => roomHasBeenUpdated.current = res)
  }

  return (
    <RoomContext.Provider value={{ room, create, join, update, leave }}>
      {children}
    </RoomContext.Provider>
  )
}

export const useRoom = () => useContext(RoomContext)