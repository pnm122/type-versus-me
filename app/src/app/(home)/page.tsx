"use client"

import CursorSelector from "@/components/CursorSelector/CursorSelector";
import styles from './style.module.scss'
import TyperPreview from "@/components/TyperPreview/TyperPreview";
import Input from "@/components/Input/Input";
import IconButton from "@/components/Button/IconButton";
import PixelarticonsDice from '~icons/pixelarticons/dice'
import PixelarticonsPlus from '~icons/pixelarticons/plus'
import PixelarticonsArrowRight from '~icons/pixelarticons/arrow-right'
import { useUser } from "@/context/User";
import generateUsername from "$shared/utils/generateUsername";
import Button from "@/components/Button/Button";
import ButtonIcon from "@/components/Button/ButtonIcon";
import { useState } from "react";
import { useSocket } from "@/context/Socket";
import { useRouter } from "next/navigation";
import { isValidUsername } from "$shared/utils/validators";
import { useNotification } from "@/context/Notification";
import { errorNotification } from "@/utils/errorNotifications";
import { useRoom } from "@/context/Room";

export default function Home() {
  const [joinRoomCode, setJoinRoomCode] = useState('')
  const [createRoomLoading, setCreateRoomLoading] = useState(false)
  const [joinRoomLoading, setJoinRoomLoading] = useState(false)
  const user = useUser()
  const room = useRoom()
  const socket = useSocket()
  const router = useRouter()
  const notifs = useNotification()

  function onUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
    user.set({ username: e.target.value })
  }

  async function onCreateRoomClicked() {
    if(socket.state !== 'valid' || user.data.state !== 'valid') return
    if(!isValidUsername(user.data.value.username)) {
      return notifs.push(errorNotification('invalid-username'))
    }

    setCreateRoomLoading(true)
    const res = await room.create()
    setCreateRoomLoading(false)

    if(res.error) return

    router.push(`/room/${res.value.room.id}`)
  }

  async function onJoinRoomSubmit(e: React.FormEvent) {
    e.preventDefault()
    if(socket.state !== 'valid' || user.data.state !== 'valid') return
    if(!isValidUsername(user.data.value.username)) {
      return notifs.push(errorNotification('invalid-username'))
    }

    setJoinRoomLoading(true)
    const res = await room.join(joinRoomCode)
    setJoinRoomLoading(false)

    if(res.error) return

    router.push(`/room/${res.value.room.id}`)
  }

  return (
    <main className={styles['page']}>
      <form onSubmit={onJoinRoomSubmit} className={styles['main']}>
        <h1>
          <TyperPreview
            text='taptaptap.live'
            cursorColor={user.data.value?.color ?? 'blue'}
            className={styles['main__title']}
          />
        </h1>
        <div className={styles['main__group']}>
          <div className={styles['username']}>
            <Input
              id='username'
              label='Username'
              placeholder='Username'
              disabled={user.data.state === 'loading'}
              text={user.data.value?.username ?? ''}
              onChange={onUsernameChange}
              wrapperClassName={styles['username__input']}
              minLength={3}
              maxLength={16}
              required
            />
            <IconButton
              icon={<PixelarticonsDice />}
              className={styles['username__generate']}
              style='secondary'
              ariaLabel='Generate random username'
              onClick={() => user.set({ username: generateUsername() })}
            />
          </div>
          <CursorSelector
            selected={user.data.value?.color}
            onChange={c => user.set({ color: c })}
          />
        </div>
        <div className={styles['main__group']}>
          <Button
            onClick={onCreateRoomClicked}
            loading={createRoomLoading}>
            <ButtonIcon icon={<PixelarticonsPlus />} />
            Create a room
          </Button>
          <div className={styles['join']}>
            <Input
              id='join'
              text={joinRoomCode}
              onChange={e => setJoinRoomCode(e.target.value)}
              placeholder='Room code (i.e. ABCDE)'
              wrapperClassName={styles['join__input']}
              minLength={5}
              maxLength={5}
              required
            />
            <Button
              style='secondary'
              type='submit'
              loading={joinRoomLoading}>
              Join
              <ButtonIcon icon={<PixelarticonsArrowRight />} />
            </Button>
          </div>
        </div>
      </form>
    </main>
  )
}