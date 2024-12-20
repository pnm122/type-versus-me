"use client"

import CursorSelector from "@/components/CursorSelector/CursorSelector";
import styles from './style.module.scss'
import TyperPreview from "@/components/TyperPreview/TyperPreview";
import Input from "@/components/Input/Input";
import IconButton from "@/components/Button/IconButton";
import PixelarticonsDice from '~icons/pixelarticons/dice'
import PixelarticonsPlus from '~icons/pixelarticons/plus'
import PixelarticonsArrowRight from '~icons/pixelarticons/arrow-right'
import generateUsername from "$shared/utils/generateUsername";
import Button from "@/components/Button/Button";
import ButtonIcon from "@/components/Button/ButtonIcon";
import { useState } from "react";
import { useSocket } from "@/context/Socket";
import { useRouter } from "next/navigation";
import { isValidUsername } from "$shared/utils/validators";
import { useNotification } from "@/context/Notification";
import { errorNotification } from "@/utils/errorNotifications";
import { useGlobalState } from "@/context/GlobalState";
import { setUser } from "@/utils/user";
import { createRoom, joinRoom } from "@/utils/room";

export default function Home() {
  const [joinRoomCode, setJoinRoomCode] = useState('')
  const [createRoomLoading, setCreateRoomLoading] = useState(false)
  const [joinRoomLoading, setJoinRoomLoading] = useState(false)
  const { user, room, ...otherGlobalState } = useGlobalState()
  const socket = useSocket()
  const router = useRouter()
  const notifs = useNotification()

  function onUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setUser(
      { username: e.target.value },
      { globalState: { user, room, ...otherGlobalState } }
    )
  }

  async function onCreateRoomClicked() {
    if(socket.state !== 'valid' || !user) return
    if(!isValidUsername(user.username)) {
      return notifs.push(errorNotification('invalid-username'))
    }

    setCreateRoomLoading(true)
    const res = await createRoom({ socket, notifs, globalState: { user, room, ...otherGlobalState }})
    setCreateRoomLoading(false)

    if(res.error) return

    router.push(`/room/${res.value.room.id}`)
  }

  async function onJoinRoomSubmit(e: React.FormEvent) {
    e.preventDefault()
    if(socket.state !== 'valid' || !user) return
    if(!isValidUsername(user.username)) {
      return notifs.push(errorNotification('invalid-username'))
    }

    setJoinRoomLoading(true)
    const res = await joinRoom(
      joinRoomCode,
      { socket, notifs, globalState: { user, room, ...otherGlobalState }}
    )
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
            cursorColor={user?.color}
            className={styles['main__title']}
          />
        </h1>
        <div className={styles['main__group']}>
          <div className={styles['username']}>
            <Input
              id='username'
              label='Username'
              placeholder='Username'
              disabled={!user}
              text={user?.username ?? ''}
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
              onClick={() => setUser({ username: generateUsername() }, { globalState: { user, room, ...otherGlobalState } })}
            />
          </div>
          <CursorSelector
            selected={user?.color}
            onChange={c => setUser({ color: c }, { globalState: { user, room, ...otherGlobalState } })}
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