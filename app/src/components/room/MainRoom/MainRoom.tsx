import { useGlobalState } from '@/context/GlobalState'
import styles from './style.module.scss'
import Typer from '@/components/Typer/Typer'

export default function MainRoom() {
  const { room } = useGlobalState()

  if(!room || (room.state === 'in-progress' && !room.test)) return <></>

  return (
    <div className={styles['main']}>
      {room.state === 'waiting' ? (
        <h1 className={styles['main__waiting-text']}>The race will start when all players are ready.</h1>
      ) : room.state === 'in-progress' ? (
        <Typer
          text={room.test!}
          disabled={false}
          startTime={Date.now()}
        />
      ) : (
        <></>
      )}
    </div>
  )
}
