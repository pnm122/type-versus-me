"use client"

import { User } from "$shared/types/User";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useSocket } from "./Socket";
import { isValidUsername, isValidColor } from "$shared/utils/validators"
import * as storage from "@/utils/localStorage"
import Data from "@/types/Data";
import { LOADING } from "@/utils/constants";
import { RegisterCallback } from "$shared/types/events/client/Register";
import ErrorsOf from "$shared/types/ErrorsOf"
import generateUsername from "$shared/utils/generateUsername"
import { generateColor } from "$shared/utils/generateColor"
import checkSocket from "@/utils/checkSocket";
import { useNotification } from "./Notification";
import { ChangeUsernameCallback } from "$shared/types/events/client/ChangeUsername";
import { ChangeUserScoreCallback } from "$shared/types/events/client/ChangeUserScore";
import { RequestColorCallback } from "$shared/types/events/client/RequestColor";
import { ChangeUserStateCallback } from "$shared/types/events/client/ChangeUserState";
import { errorNotification } from "@/utils/errorNotifications";

export type UserContextType = {
  data: Data<User, ErrorsOf<RegisterCallback>>
  /**
   * **WARNING: ONLY USE THIS FUNCTION TO UPDATE THE USER WHEN THE SERVER RETURNS AN UPDATED USER OR OUTSIDE OF A ROOM**
   * Directly update the state of the user.
   */
  set: (u: Partial<Omit<User, 'id'>>) => void
  /**
   * Request to change some value of the user, then update the state if successful.
   */
  update: <T extends keyof Omit<User, 'id'>>(
    key: T,
    value: Required<User>[T]
  ) => Promise<
    T extends 'username'
      ? Parameters<ChangeUsernameCallback>[0]
      : T extends 'score'
        ? Parameters<ChangeUserScoreCallback>[0]
        : T extends 'state'
          ? Parameters<ChangeUserStateCallback>[0]
          : Parameters<RequestColorCallback>[0]
  >
}

const UserContext = createContext<UserContextType>({
  data: LOADING,
  set() {},
  update(): any {}
})

export function UserProvider({ children }: React.PropsWithChildren) {
  const [data, setData] = useState<Data<User, ErrorsOf<RegisterCallback>>>(LOADING)
  const socket = useSocket()
  const notifs = useNotification()
  const userHasBeenUpdated = useRef<(() => void) | null>(null)

  const set: UserContextType['set'] = (u) => {
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

  const update: UserContextType['update'] = async (
    key,
    value
  ) => {
    if(!checkSocket(socket.value, notifs) || !data.value) {
      return {
        value: null,
        error: {
          reason: 'missing-argument'
        }
      }
    }
    const res = await (() => {
      if(key === 'username') {
        return socket.value.emitWithAck(
          'change-username',
          {
            id: data.value.id,
            username: value as User['username']
          }
        )
      } else if(key === 'color') {
        return socket.value.emitWithAck(
          'request-color',
          {
            id: data.value.id,
            color: value as User['color']
          }
        )
      } else if(key === 'state') {
        return socket.value.emitWithAck(
          'change-user-state',
          {
            id: data.value.id,
            state: value as Required<User>['state']
          }
        )
      } else {
        return socket.value.emitWithAck(
          'change-user-score',
          {
            id: data.value.id,
            score: value as Required<User>['score']
          }
        )
      }
    })()

    if(res.error) {
      notifs.push(errorNotification(res.error.reason))
      // This is typed correctly but it's a hassle to get typescript to like it
      // Besides, the whole benefit is knowing the type outside of this function
      return res as any
    }

    set({ [key]: value })
    await waitForUserUpdate()
    return res as any
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

  function waitForUserUpdate() {
    return new Promise<void>(res => userHasBeenUpdated.current = res)
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
    <UserContext.Provider value={{ data, set, update }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)