"use client"

import generateUsername from '$shared/utils/generateUsername'
import { useNotification } from '@/context/Notification'
import React from 'react'

export default function Room() {
  const notifs = useNotification()

  return (
    <div style={{ padding: 24 }}>
      <button onClick={() => {
        notifs.push({
          text: `${generateUsername()} fdsaf dsf saf safdasd fasdfas`,
          style: 'error'
        })
      }}>
        Add
      </button>
    </div>
  )
}
