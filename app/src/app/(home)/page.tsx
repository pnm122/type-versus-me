'use client'

import Typer, { TyperStats } from '@/components/Typer/Typer'
import styles from './style.module.scss'
import { useState, useEffect } from 'react'
import generatePuzzle from '@/utils/generatePuzzle'

export default function Home() {
  const [finished, setFinished] = useState(false)
  const [stats, setStats] = useState<TyperStats | null>(null)
  const [test, setTest] = useState<string>('')

  useEffect(() => {
    setTest(generatePuzzle(100))
  }, [])

  function onStart(t: number) {
  }

  function onFinish(stats: TyperStats) {
    setFinished(true)
  }

  function onChange(s: TyperStats) {
    setStats(s)
  }

  return (
    <div className={styles['main']}>
      <Typer
        text={test}
        finished={finished}
        onChange={onChange}
        onStart={onStart}
        onFinish={onFinish}
        cursors={[{
          id: 1,
          color: 'red',
          position: {
            word: 2,
            letter: 3
          }
        }, {
          id: 2,
          color: 'green',
          position: {
            word: 1,
            letter: 0
          }
        }, {
          id: 3,
          color: 'pink',
          position: {
            word: 4,
            letter: 6
          }
        }]}
      />
      {stats && (
        <div style={{ marginTop: 24 }}>
          <p>Net WPM: {stats.netWPM.toFixed(2)}</p>
          <p>Raw WPM: {stats.rawWPM.toFixed(2)}</p>
          <p>Accuracy: {stats.accuracy.toFixed(2)}</p>
        </div>
      )}
    </div>
  )
}
