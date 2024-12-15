"use client"

import { User } from "$shared/types/User";
import { createContext, useContext, useEffect, useState } from "react";
import { useSocket } from "./Socket";
import { isValidUsername, isValidColor } from "$shared/utils/validators"
import * as storage from "@/utils/localStorage"
import { CursorColor } from "$shared/types/Cursor";
import Data from "@/types/Data";
import { LOADING } from "@/utils/constants";
import { RegisterCallback } from "$shared/types/events/client/Register";
import ErrorsOf from "$shared/types/ErrorsOf"

const UserContext = createContext<Data<User, ErrorsOf<RegisterCallback>>>(LOADING)

export function UserProvider({ children }: React.PropsWithChildren) {
  const [data, setData] = useState<Data<User, ErrorsOf<RegisterCallback>>>(LOADING)
  const socket = useSocket()

  function update(u: User) {
    storage.set('username', u.username)
    storage.set('preferred-color', u.color)
    setData({
      state: 'valid',
      data: u,
      error: null
    })
  }

  async function register() {
    if(socket.state !== 'valid') return

    const username = storage.get<string>('username')
    const color = storage.get<CursorColor>('preferred-color')

    const res = await socket.data.emitWithAck('register', {
      username: isValidUsername(username) ? username! : undefined,
      color: isValidColor(color) ? color! : undefined
    })
    if(res.error) {
      return setData({
        state: 'error',
        data: null,
        error: res.error
      })
    }
    update(res.value)
  }

  useEffect(() => {
    if(socket.state !== 'valid') return

    register()
  }, [socket])

  useEffect(() => {
    if(!data) return

    console.log(data)
  }, [data])
  
  return (
    <UserContext.Provider value={data}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)