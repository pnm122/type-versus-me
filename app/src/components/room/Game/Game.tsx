"use client"

import Typer, { TyperRef, TyperStats } from '@/components/Typer/Typer'
import styles from './style.module.scss'
import { useEffect, useRef, useState } from 'react'
import { useGlobalState } from '@/context/GlobalState'
import { useNotification } from '@/context/Notification'
import { useSocket } from '@/context/Socket'
import { Cursor } from '@/types/Cursor'
import { updateUser } from '@/utils/user'
import createClasses from '@/utils/createClasses'
import useInterval from '@/hooks/useInterval'

export default function Game() {
  const GAME_TIME = 120

  const [startTime, setStartTime] = useState(-1)
  const [finished, setFinished] = useState(false)
  const [correctTyped, setCorrectTyped] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const globalState = useGlobalState()
  const socket = useSocket()
  const notifs = useNotification()
  const typer = useRef<TyperRef>(null)
  const { room, user } = globalState

  useInterval(
    nextTime,
    room?.state === 'in-progress' && !finished ? 1000 : null
  )

  useEffect(() => {
    if(room?.state === 'in-progress') {
      setStartTime(Date.now())
      setFinished(false)
      setCorrectTyped(0)
      setTimeLeft(GAME_TIME)
      typer.current?.focus()
    }
  }, [room?.state])

  function nextTime() {
    console.log('nextTime', timeLeft)
    if(timeLeft > 1) {
      setTimeLeft(t => t - 1)
    } else {
      setFinished(true)
      updateUser(
        'state',
        'failed',
        { globalState, notifs, socket }
      )
    }
  }

  if(!room || !room.test) return <></>

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
    setCorrectTyped(stats.correctLeft)
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
    <div className={styles['game']}>
      <Typer
        text={room.test}
        disabled={finished}
        startTime={startTime}
        onChange={onTyperChange}
        cursors={otherCursors}
        onFinish={onTyperFinish}
        ref={typer}
      />
      <div className={styles['game__info']}>
        <p className={styles['typed']}>
          {correctTyped}/{room.test.length}
        </p>
        <p className={createClasses({
          [styles['time-left']]: true,
          [styles['time-left--low']]: timeLeft <= 10
        })}>
          {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? '0' : ''}{timeLeft % 60}
        </p>
      </div>
    </div>
  )
}
