'use client'

import Typer, { TyperStats } from '@/components/Typer/Typer'
import styles from './style.module.scss'
import { useState } from 'react'

export default function Home() {
  const [finished, setFinished] = useState(false)
  const [stats, setStats] = useState<TyperStats | null>(null)

  function onStart(t: number) {
    console.log(new Date(t))
  }

  function onFinish(stats: TyperStats) {
    console.log((stats.endTime - stats.startTime) / 1000)
    setFinished(true)
  }

  function onChange(s: TyperStats) {
    setStats(s)
  }

  return (
    <div className={styles['main']}>
      <Typer
        text='So if on advanced addition absolute received replying throwing he. Delighted consisted newspaper of unfeeling as neglected so. Tell size come hard mrs and four fond are. Of in commanded earnestly resources it.'
        finished={finished}
        onChange={onChange}
        onStart={onStart}
        onFinish={onFinish}
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
