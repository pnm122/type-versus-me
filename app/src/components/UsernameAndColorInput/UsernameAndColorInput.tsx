import generateUsername from '$shared/utils/generateUsername'
import { setUser } from '@/utils/user'
import IconButton from '../Button/IconButton'
import Input from '../Input/Input'
import styles from './style.module.scss'
import PixelarticonsDice from '~icons/pixelarticons/dice'
import CursorSelector from '../CursorSelector/CursorSelector'
import { useGlobalState } from '@/context/GlobalState'
import { useNotification } from '@/context/Notification'
import { useSocket } from '@/context/Socket'

export default function UsernameAndColorInput() {
  const globalState = useGlobalState()
  const socket = useSocket()
  const notifs = useNotification()

  const { user, room } = globalState

  function onUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setUser(
      { username: e.target.value },
      { globalState }
    )
  }

  return (
    <div className={styles['group']}>
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
          onClick={() => setUser({ username: generateUsername() }, { globalState })}
        />
      </div>
      <CursorSelector
        selected={user?.color}
        onChange={c => setUser({ color: c }, { globalState })}
      />
    </div>
  )
}
