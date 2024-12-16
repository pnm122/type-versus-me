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

export default function Home() {
  const [joinRoomCode, setJoinRoomCode] = useState('')
  const user = useUser()

  return (
    <main className={styles['page']}>
      <form className={styles['main']}>
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
              onChange={e => user.update({ username: e.target.value })}
              wrapperClassName={styles['username__input']}
              required
            />
            <IconButton
              icon={<PixelarticonsDice />}
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
          >
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