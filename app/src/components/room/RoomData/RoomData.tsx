import { useRoom } from '@/context/Room'
import styles from './style.module.scss'
import User from '../User/User'
import Button from '@/components/Button/Button'
import PixelarticonsLogout from '~icons/pixelarticons/logout'
import ButtonIcon from '@/components/Button/ButtonIcon'
import PixelarticonsCopy from '~icons/pixelarticons/copy'

import { MAX_USERS_PER_ROOM } from '$shared/constants'
import { useNotification } from '@/context/Notification'
import Checkbox from '@/components/Checkbox/Checkbox'
import { useUser } from '@/context/User'
import { useEffect, useState } from 'react'
import { User as UserType } from '$shared/types/User'

export default function RoomData() {
  const { room } = useRoom()
  const { data: { value: user }, update: updateUser } = useUser()
  const notifs = useNotification()
  // 'Predict' what state the user will be in before waiting for server
  // This way, the state changes can feel instantaneous, but still be verified by the server
  const [predictedUserState, setPredictedUserState] = useState<UserType['state'] | null>(null)

  if(!room || !user) return <></>

  function onInviteClicked() {
    window.navigator.clipboard.writeText(window.location.href)
    notifs.push({
      style: 'success',
      text: 'Copied link to clipboard!'
    })
  }

  async function onCheckboxChange(ready: boolean) {
    setPredictedUserState(ready ? 'ready' : 'not-ready')
    await updateUser('state', ready ? 'ready' : 'not-ready')
    setPredictedUserState(null)
  }

  return (
    <div className={styles['data']}>
      <ul className={styles['data__users']}>
        {room.users.map(u => (
          <User key={u.id} user={u} />
        ))}
      </ul>
      <Checkbox
        checked={predictedUserState ? predictedUserState === 'ready' : user.state === 'ready'}
        onChange={onCheckboxChange}>
        I'm ready
      </Checkbox>
      <hr></hr>
      <div className={styles['data__room']}>
        <div className={styles['room-metadata']}>
          <div className={styles['room-metadata__title']}>
            <h2 className={styles['room-name']}>Room {room.id}</h2>
            <h3 className={styles['players']}>{room.users.length}/{MAX_USERS_PER_ROOM} players</h3>
          </div>
          <Button
            style='tertiary'>
            <ButtonIcon icon={<PixelarticonsLogout />} />
            Leave room
          </Button>
        </div>
        <div className={styles['invite']}>
          <h2 className={styles['invite__title']}>Invite</h2>
          <button
            onClick={onInviteClicked}
            className={styles['invite__button']}>
            {window.location.href}
            <PixelarticonsCopy />
          </button>
        </div>
      </div>
    </div>
  )
}
