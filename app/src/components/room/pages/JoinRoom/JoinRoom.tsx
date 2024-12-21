"use client"

import UsernameAndColorInput from '@/components/UsernameAndColorInput/UsernameAndColorInput'
import styles from './style.module.scss'
import Button from '@/components/Button/Button'
import ButtonIcon from '@/components/Button/ButtonIcon'
import PixelarticonsArrowRight from '~icons/pixelarticons/arrow-right'
import { usePathname, useRouter } from 'next/navigation'
import { joinRoom } from '@/utils/room'
import React from 'react'
import { useNotification } from '@/context/Notification'
import { useSocket } from '@/context/Socket'
import { useGlobalState } from '@/context/GlobalState'

export default function JoinRoom() {
  const notifs = useNotification()
  const socket = useSocket()
  const globalState = useGlobalState()
  const pathname = usePathname()
  const pathRoomId = pathname.split('/').at(-1)!

  function handleJoinRoom() {
    joinRoom(pathRoomId, { socket, notifs, globalState })
  }

  return (
    <main className={styles['page']}>
      <div className={styles['main']}>
        <UsernameAndColorInput />
        <Button
          onClick={handleJoinRoom}>
          Join room
          <ButtonIcon icon={<PixelarticonsArrowRight />} />
        </Button>
      </div>
    </main>
  )
}
