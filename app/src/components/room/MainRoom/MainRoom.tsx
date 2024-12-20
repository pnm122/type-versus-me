import { useGlobalState } from '@/context/GlobalState'
import styles from './style.module.scss'
import Typer, { TyperRef, TyperStats } from '@/components/Typer/Typer'
import { updateUser } from '@/utils/user'
import { useSocket } from '@/context/Socket'
import { useNotification } from '@/context/Notification'
import { Cursor } from '@/types/Cursor'
import { useEffect, useRef, useState } from 'react'

export default function MainRoom() {
  const [startTime, setStartTime] = useState(-1)
  const [finished, setFinished] = useState(false)
  const globalState = useGlobalState()
  const socket = useSocket()
  const notifs = useNotification()
  const { room, user } = globalState
  const typer = useRef<TyperRef>(null)

  useEffect(() => {
    if(room?.state === 'in-progress') {
      setStartTime(Date.now())
      setFinished(false)
      typer.current?.focus()
    }
  }, [room?.state])
  
  if(!room || (room.state === 'in-progress' && !room.test)) return <></>

  const otherCursors: Cursor[] = room.users.filter(u => u.id !== user!.id).map(u => ({
    id: u.id,
    color: u.color,
    position: u.score?.cursorPosition ?? { word: 0, letter: 0 }
  }))

  function onTyperChange(stats: TyperStats) {
    updateUser(
      'score',
      { cursorPosition: stats.cursorPosition, netWPM: stats.netWPM },
      { globalState, socket, notifs }
    )
  }

  function onTyperFinish() {
    setFinished(true)
    updateUser(
      'state',
      'complete',
      { globalState, socket, notifs }
    )
  }

  return (
    <div className={styles['main']}>
      {room.state === 'waiting' ? (
        <h1 className={styles['main__waiting-text']}>The race will start when all players are ready.</h1>
      ) : room.state === 'in-progress' ? (
        <Typer
          text={room.test!}
          disabled={finished}
          startTime={startTime}
          onChange={onTyperChange}
          cursors={otherCursors}
          onFinish={onTyperFinish}
          ref={typer}
        />
      ) : (
        <></>
      )}
    </div>
  )
}
