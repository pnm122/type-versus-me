"use client"

import { User } from "$shared/types/User";
import { createContext, useContext, useEffect, useState } from "react";
import { useSocket } from "./Socket";
import { isValidUsername, isValidColor } from "$shared/utils/validators"
import * as storage from "@/utils/localStorage"
import Data from "@/types/Data";
import { LOADING } from "@/utils/constants";
import { RegisterCallback } from "$shared/types/events/client/Register";
import ErrorsOf from "$shared/types/ErrorsOf"
import generateUsername from "$shared/utils/generateUsername"
import { generateColor } from "$shared/utils/generateColor"

export type UserContextType = {
  data: Data<User, ErrorsOf<RegisterCallback>>
  update: (u: Partial<User>) => void
}

const UserContext = createContext<UserContextType>({
  data: LOADING,
  update: () => {}
})

export function UserProvider({ children }: React.PropsWithChildren) {
  const [data, setData] = useState<Data<User, ErrorsOf<RegisterCallback>>>(LOADING)
  const socket = useSocket()

  function update(u: Partial<User>) {
    if(data.state !== 'valid') return

    if(u.username) storage.set('username', u.username)
    if(u.color) storage.set('preferred-color', u.color)
    
    setData({
      state: 'valid',
      value: {
        ...data.value,
        ...u
      },
      error: null
    })
  }

  function getUsername() {
    const storedUsername = storage.get('username')
    if(isValidUsername(storedUsername)) return storedUsername

    const newUsername = generateUsername()
    storage.set('username', newUsername)
    return newUsername
  }

  function getColor() {
    const storedColor = storage.get('preferred-color')
    if(isValidColor(storedColor)) return storedColor

    const newColor = generateColor()
    storage.set('preferred-color', newColor)
    return newColor
  }

  useEffect(() => {
    if(socket.state !== 'valid') return

    const username = getUsername()
    const color = getColor()

    setData({
      state: 'valid',
      value: {
        id: socket.value.id!,
        username,
        color
      },
      error: null
    })
  }, [socket])
  
  return (
    <UserContext.Provider value={{ data, update }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)