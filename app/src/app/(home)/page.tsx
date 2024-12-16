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

export default function Home() {
  const [joinRoomCode, setJoinRoomCode] = useState('')
  const [usernameError, setUsernameError] = useState(false)
  const user = useUser()
  const socket = useSocket()
  const router = useRouter()

  function onUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
    if(usernameError) {
      setUsernameError(false)
    }
    user.update({ username: e.target.value })
  }

  async function onCreateRoomClicked() {
    if(socket.state !== 'valid' || user.data.state !== 'valid') return
    if(!isValidUsername(user.data.value.username)) {
      return setUsernameError(true)
    }
    const res = await socket.value.emitWithAck('create-room', user.data.value)

    if(res.error) {
      const { reason } = res.error
      if(reason === 'invalid-username') {
        setUsernameError(true)
      } else if(reason === 'user-in-room-already') {
        // TODO: Notification for error
      } else if(reason === 'max-rooms-created') {
        // TODO: Notification for error
      } else {
        // TODO: Notification for error
      }

      return
    }

    user.update(res.value.user)
    router.push(`/room/${res.value.room.id}`)
  }

  async function onJoinRoomSubmit(e: React.FormEvent) {
    e.preventDefault()
    if(socket.state !== 'valid' || user.data.state !== 'valid') return
    if(!isValidUsername(user.data.value.username)) {
      return setUsernameError(true)
    }
    const res = await socket.value.emitWithAck('join-room', { roomId: joinRoomCode, user: user.data.value })

    if(res.error) {
      const { reason } = res.error

      if(reason === 'invalid-username') {
        setUsernameError(true)
      } else if(reason === 'room-does-not-exist') {
        // TODO: Notification for error
      } else if(reason === 'room-is-full') {
        // TODO: Notification for error
      } else if(reason === 'game-in-progress') {
        // TODO: Notification for error
      } else if(reason === 'user-in-room-already') {
        // TODO: Notification for error
      } else {
        // TODO: Notification for error
      }

      return
    }
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
              error={
                usernameError
                  ? 'Must be between 3 and 16 characters (alphanumeric or underscore).'
                  : ''
              }
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
              onClick={() => user.update({ username: generateUsername() })}
            />
          </div>
          <CursorSelector
            selected={user.data.value?.color}
            onChange={c => user.update({ color: c })}
          />
        </div>
        <div className={styles['main__group']}>
          <Button
            onClick={onCreateRoomClicked}>
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
              type='submit'>
              Join
              <ButtonIcon icon={<PixelarticonsArrowRight />} />
            </Button>
          </div>
        </div>
      </form>
    </main>
  )
}