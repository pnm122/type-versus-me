"use client"

import { Room } from "$shared/types/Room";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useSocket } from "./Socket";
import { ServerJoinRoomPayload } from "$shared/types/events/server/JoinRoom";
import { ServerLeaveRoomPayload } from "$shared/types/events/server/LeaveRoom";
import { useNotification } from "./Notification";

interface RoomContextType {
  room: Room | null
  join: (r: Room) => Promise<void>
  update: (r: Partial<Omit<Room, 'id'>>) => void
  leave: () => void
}

const RoomContext = createContext<RoomContextType>({
  room: null,
  async join() {},
  update() {},
  leave() {}
})

// TODO outgoing room events should probably be handled in here to centralize it?
export function RoomProvider({ children }: React.PropsWithChildren) {
  const [room, setRoom] = useState<Room | null>(null)
  const socket = useSocket()
  const notifs = useNotification()
  const roomHasBeenUpdated = useRef<(() => void) | null>(null)

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

  async function join(r: Room) {
    if(room) {
      console.warn(`Tried to join room ${r.id}, but the user is already in room ${room.id}!`)
      return
    }
    setRoom(r)
    await waitForRoomUpdate()
  }

  function update(r: Partial<Omit<Room, 'id'>>) {
    setRoom(current => current ? ({ ...current, ...r }) : null)
  }

  function leave() {
    setRoom(null)
    socket.value?.emitWithAck('leave-room', undefined)
  }

  function waitForRoomUpdate() {
    return new Promise<void>(res => roomHasBeenUpdated.current = res)
  }

  return (
    <RoomContext.Provider value={{ room, join, update, leave }}>
      {children}
    </RoomContext.Provider>
  )
}

export const useRoom = () => useContext(RoomContext)