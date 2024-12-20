"use client"

import React, { use, useEffect, useState } from 'react'
import styles from './style.module.scss'
import { usePathname, useRouter } from 'next/navigation'
import { useNotification } from '@/context/Notification'
import { errorNotification } from '@/utils/errorNotifications'
import { useSocket } from '@/context/Socket'
import InRoom from '@/components/room/pages/InRoom/InRoom'
import JoinRoom from '@/components/room/pages/JoinRoom/JoinRoom'
import LoadingRoom from '@/components/room/pages/LoadingRoom/LoadingRoom'
import { useGlobalState } from '@/context/GlobalState'

export default function Room() {
  const { room } = useGlobalState()
  const pathname = usePathname()
  const notifs = useNotification()
  const router = useRouter()
  const socket = useSocket()
  const [roomExists, setRoomExists] = useState<boolean | null>(null)

  const pathRoomId = pathname.split('/').at(-1)!
  const inCurrentRoom = room && room.id === pathRoomId
  const inOtherRoom = room && room.id !== pathRoomId

  useEffect(() => {
    if(inOtherRoom) {
      notifs.push(errorNotification('user-in-room-already'))
      router.push('/')
    }
  }, [room])

  useEffect(() => {
    // Only check if room exists once, no need to call again after any socket changes
    if(roomExists !== null) return

    checkIfRoomExists()
  }, [socket, roomExists])

  async function checkIfRoomExists() {
    if(socket.state !== 'valid') return

    const res = await socket.value.emitWithAck('does-room-exist', pathRoomId)
    setRoomExists(res.value)
  }

  if(roomExists === null) {
    return <LoadingRoom />
  }

  if(inCurrentRoom) {
    return <InRoom />
  }

  return <JoinRoom />
}
