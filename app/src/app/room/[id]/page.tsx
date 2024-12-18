"use client"

import React, { useEffect } from 'react'
import styles from './style.module.scss'
import { useRoom } from '@/context/Room'

export default function Room() {
  const room = useRoom()

  return (
    <main className={styles['page']}>
      {room.room?.users.map(u => (
        <p key={u.id}>{u.username}</p>
      ))}
    </main>
  )
}
