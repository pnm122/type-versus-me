import { User as UserType } from '$shared/types/User'
import CursorPreview from '@/components/CursorPreview/CursorPreview'
import styles from './style.module.scss'
import Pill from '@/components/Pill/Pill'
import PixelarticonsMinus from '~icons/pixelarticons/minus'
import PixelarticonsCheck from '~icons/pixelarticons/check'
import PixelarticonsClose from '~icons/pixelarticons/close'
import { useGlobalState } from '@/context/GlobalState'

interface Props {
  user: UserType
}

export default function User({
  user: {
    id,
    username,
    color,
    score,
    state
  }
}: Props) {
  const { user } = useGlobalState()

  return (
    <li className={styles['user']}>
      <div className={styles['user__name']}>
        <CursorPreview size='small' color={color} />
        <p className={styles['username']}>
          {username}
          {id === user!.id && <span className={styles['username__you']}> (you)</span>}
        </p>
      </div>
      <div className={styles['user__info']}>
        {state === 'not-ready' ? (
          <Pill
            backgroundColor='var(--disabled)'
            foregroundColor='var(--heading)'
            text='Not Ready'
            icon={<PixelarticonsMinus />}
          />
        ) : state === 'ready' ? (
          <Pill
            backgroundColor='var(--positive)'
            foregroundColor='var(--heading)'
            text='Ready'
            icon={<PixelarticonsCheck />}
          />
        ) : state === 'in-progress' ? (
          <p
            aria-label={`${score?.netWPM ?? 0} words per minute`}
            className={styles['words-per-minute']}>
            {score?.netWPM ?? 0}wpm
          </p>
        ) : state === 'complete' ? (
          <Pill
            backgroundColor='var(--positive)'
            foregroundColor='var(--heading)'
            text='Done'
            icon={<PixelarticonsCheck />}
          />
        ) : (
          <Pill
            backgroundColor='var(--error)'
            foregroundColor='var(--background)'
            text='Failed'
            icon={<PixelarticonsClose />}
          />
        )}
      </div>
    </li>
  )
}
