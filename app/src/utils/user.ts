import { ChangeUsernameCallback } from '$shared/types/events/client/ChangeUsername'
import { ChangeUserScoreCallback } from '$shared/types/events/client/ChangeUserScore'
import { ChangeUserStateCallback } from '$shared/types/events/client/ChangeUserState'
import { RequestColorCallback } from '$shared/types/events/client/RequestColor'
import { User } from '$shared/types/User'
import { generateColor } from '$shared/utils/generateColor'
import generateUsername from '$shared/utils/generateUsername'
import { isValidColor, isValidUsername } from '$shared/utils/validators'
import * as storage from '@/utils/localStorage'
import checkSocket from './checkSocket'
import { GlobalState } from '@/context/GlobalState'
import { SocketContextType } from '@/context/Socket'
import { NotificationContextType } from '@/context/Notification'
import { errorNotification } from './errorNotifications'

interface Context {
  globalState: GlobalState
  socket: SocketContextType
  notifs: NotificationContextType
}

export function getUsername() {
  const storedUsername = storage.get('username')
  if(isValidUsername(storedUsername)) return storedUsername

  const newUsername = generateUsername()
  storage.set('username', newUsername)
  return newUsername
}

export function getColor() {
  const storedColor = storage.get('preferred-color')
  if(isValidColor(storedColor)) return storedColor

  const newColor = generateColor()
  storage.set('preferred-color', newColor)
  return newColor
}

/**
 * **WARNING: ONLY USE THIS FUNCTION TO UPDATE THE USER WHEN THE SERVER RETURNS AN UPDATED USER OR OUTSIDE OF A ROOM**
 * Directly update the state of the user.
 */
export function setUser(
  u: Partial<Omit<User, 'id'>>,
  context: Pick<Context, 'globalState'>
) {
  const { globalState } = context

  if(u.username) storage.set('username', u.username)
  if(u.color) storage.set('preferred-color', u.color)

  globalState.setUser({
    ...globalState.user!,
    ...u
  })
}

/**
 * Request to change some value of the user, then update the state if successful.
 */
export async function updateUser<T extends keyof Omit<User, 'id'>>(
  key: T,
  value: Required<User>[T],
  context: Context
): Promise<
T extends 'username'
  ? Parameters<ChangeUsernameCallback>[0]
  : T extends 'score'
    ? Parameters<ChangeUserScoreCallback>[0]
    : T extends 'state'
      ? Parameters<ChangeUserStateCallback>[0]
      : Parameters<RequestColorCallback>[0]
> {
  const { socket, globalState, notifs } = context

  if(!checkSocket(socket.value, notifs) || !globalState.user) {
    return {
      value: null,
      error: {
        reason: 'missing-argument'
      }
    } as any
  }
  const res = await (() => {
    if(key === 'username') {
      return socket.value.emitWithAck(
        'change-username',
        {
          id: globalState.user.id,
          username: value as User['username']
        }
      )
    } else if(key === 'color') {
      return socket.value.emitWithAck(
        'request-color',
        {
          id: globalState.user.id,
          color: value as User['color']
        }
      )
    } else if(key === 'state') {
      return socket.value.emitWithAck(
        'change-user-state',
        {
          id: globalState.user.id,
          state: value as Required<User>['state']
        }
      )
    } else {
      return socket.value.emitWithAck(
        'change-user-score',
        {
          id: globalState.user.id,
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

  setUser({ [key]: value }, { globalState })
  await globalState.waitForStateChange()
  return res as any
}