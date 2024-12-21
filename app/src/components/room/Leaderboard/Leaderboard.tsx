import { useGlobalState } from "@/context/GlobalState"
import styles from './style.module.scss'
import LeaderboardUser from "./LeaderboardUser"

export default function Leaderboard() {
  const { room } = useGlobalState()

  if(!room) return <></>

  const sortedUsers = room.users.sort((a, b) => b.score!.netWPM - a.score!.netWPM)

  return (
    <div className={styles['leaderboard']}>
      <h1 className={styles['leaderboard__title']}>Results</h1>
      <ol className={styles['leaderboard__results']}>
        {sortedUsers.map(u => (
          <LeaderboardUser key={u.id} user={u} />
        ))}
      </ol>
    </div>
  )
}
