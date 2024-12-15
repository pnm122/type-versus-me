"use client"

import { User } from "$shared/types/User";
import { createContext, useContext, useEffect, useState } from "react";
import { useSocket } from "./Socket";
import { isValidUsername, isValidColor } from "$shared/utils/validators"
import * as storage from "@/utils/localStorage"
import { CursorColor } from "$shared/types/Cursor";

const UserContext = createContext<User | null>(null)

export function UserProvider({ children }: React.PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null)
  const socket = useSocket()

  function update(u: User) {
    storage.set('username', u.username)
    storage.set('preferred-color', u.color)
    setUser(u)
  }

  async function register() {
    if(socket.state !== 'connected') return

    const username = storage.get<string>('username')
    const color = storage.get<CursorColor>('preferred-color')

    const res = await socket.socket.emitWithAck('register', {
      username: isValidUsername(username) ? username! : undefined,
      color: isValidColor(color) ? color! : undefined
    })
    if(res.error) {
      return console.error('REGISTER ERROR?', res.error.reason)
    }
    update(res.value)
  }

  useEffect(() => {
    if(socket.state !== 'connected') return

    register()
  }, [socket])

  useEffect(() => {
    console.log(user)
  }, [user])
  
  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)