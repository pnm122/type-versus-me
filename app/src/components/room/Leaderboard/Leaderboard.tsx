import { useGlobalState } from "@/context/GlobalState"
import styles from './style.module.scss'
import LeaderboardUser from "./LeaderboardUser"
import sortUsersByScore from "@/utils/sortUsersByScore"

export default function Leaderboard() {
  const { room } = useGlobalState()

  if(!room) return <></>

  return (
    <div className={styles['leaderboard']}>
      <h1 className={styles['leaderboard__title']}>Results</h1>
      <ol className={styles['leaderboard__results']}>
        {sortUsersByScore(room.users).map(u => (
          <LeaderboardUser key={u.id} user={u} />
        ))}
      </ol>
    </div>
  )
}
