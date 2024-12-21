import { User } from '$shared/types/User'
import { useGlobalState } from '@/context/GlobalState'
import styles from './style.module.scss'
import Pill from '@/components/Pill/Pill'
import PixelarticonsClose from '~icons/pixelarticons/close'

export default function LeaderboardUser({ user }: { user: User }) {
  const { room, user: currentUser } = useGlobalState()

  if(!room || !user.score || !currentUser || !currentUser.score) return

  const winnerWPM = room.users.sort((a, b) => b.score!.netWPM - a.score!.netWPM).at(0)!.score!.netWPM
  const ratioToHighestWPM = user.score.netWPM / winnerWPM
  const nameInsideBar = ratioToHighestWPM > 0.5

  const nameAndStat = (
    <>
      <h2 className={styles['username']}>{user.username}</h2>
      {user.state === 'failed' ? (
        <Pill
          backgroundColor='var(--error)'
          foregroundColor='var(--background)'
          text='Failed'
          icon={<PixelarticonsClose />}
        />
      ) : (
        <div className={styles['wpm']}>{Math.round(user.score.netWPM)}wpm</div>
      )}
    </>
  )

  return (
    <li className={styles['user']}>
      <div
        style={{
          width: user.state === 'failed' ? 16 : `${ratioToHighestWPM * 100}%`,
          backgroundColor: `var(--cursor-${user.color})`
        }}
        className={styles['user__bar']}>
        {nameInsideBar && nameAndStat}
      </div>
      {!nameInsideBar && nameAndStat}
    </li>
  )
}
