'use client'

import Typer from '@/components/Typer/Typer'
import styles from './style.module.scss'
import { useState } from 'react'

export default function Home() {
  const [typed, setTyped] = useState('')
  const [finished, setFinished] = useState(false)

  function onChange(str: string) {
    setTyped(str)
  }

  function onStart(t: number) {
    console.log(new Date(t))
  }

  function onFinish(t: number) {
    console.log(t / 1000)
    setFinished(true)
  }

  return (
    <div className={styles['main']}>
      <Typer
        text='Hello world lots of text woo hoo yay'
        typed={typed}
        finished={finished}
        onChange={onChange}
        onStart={onStart}
        onFinish={onFinish}
      />
    </div>
  )
}
