import { useRoom } from '@/context/Room'
import styles from './style.module.scss'
import MainRoom from '../../MainRoom/MainRoom'
import RoomData from '../../RoomData/RoomData'

export default function InRoom() {
  const { room } = useRoom()

  if(!room) {
    return (
      <main className={styles['page']}>
        <p>Room does not exist!</p>
      </main>
    )
  }

  return (
    <main className={styles['page']}>
      <MainRoom />
      <RoomData />
    </main>
  )
}