'use client'

import Typer from '@/components/Typer/Typer'
import styles from './style.module.scss'
import { useEffect, useState } from 'react'

export default function Home() {
  const [typed, setTyped] = useState('')
  
  useEffect(() => {
    console.log(typed)
  }, [typed])

  return (
    <div className={styles['main']}>
      <Typer
        text='Hello world lots of text woo hoo yay'
        typed={typed}
        onChange={(s) => setTyped(s)}
      />
    </div>
  )
}
