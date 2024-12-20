import { CreateRoomCallback } from "$shared/types/events/client/CreateRoom"
import { ServerJoinRoomPayload } from "$shared/types/events/server/JoinRoom"
import { ServerLeaveRoomPayload } from "$shared/types/events/server/LeaveRoom"
import { GlobalState } from "@/context/GlobalState"
import { NotificationContextType } from "@/context/Notification"
import { SocketContextType } from "@/context/Socket"
import checkSocket from "./checkSocket"
import { errorNotification } from "./errorNotifications"
import { Room } from "$shared/types/Room"
import { ClientJoinRoomCallback } from "$shared/types/events/client/JoinRoom"
import { Return } from "$shared/types/Return"
import ErrorsOf from "$shared/types/ErrorsOf"
import { LeaveRoomCallback } from "$shared/types/events/client/LeaveRoom"
import { ChangeRoomDataPayload } from "$shared/types/events/server/ChangeRoomData"

interface Context {
  globalState: GlobalState
  socket: SocketContextType
  notifs: NotificationContextType
}

export function onJoinRoom(
  res: ServerJoinRoomPayload,
  context: Pick<Context, 'globalState' | 'notifs'>
) {
  const { globalState, notifs } = context
  if(!globalState.room) return

  globalState.setRoom(r => (
    r ? { ...r, users: [...r.users, res.user] } : null
  ))
  notifs.push({
    text: `${res.user.username} has joined the room.`
  })
}

export function onLeaveRoom(
  res: ServerLeaveRoomPayload,
  context: Pick<Context, 'globalState' | 'notifs'>
) {
  const { globalState, notifs } = context
  if(!globalState.room) return

  const leavingUser = globalState.room.users.find(u => u.id === res.userId)
  if(!leavingUser) {
    return console.warn(`Received ${res.userId} left room, but this user does not exist!`)
  }

  globalState.setRoom(r => (
    r ? { ...r, users: r.users.filter(u => u.id !== res.userId) } : null
  ))
  notifs.push({
    text: `${leavingUser.username} has left the room.`
  })
}

export function onChangeRoomData(
  res: ChangeRoomDataPayload,
  { globalState }: Pick<Context, 'globalState'>
) {
  globalState.setRoom(r => (
    r ? { ...r, ...res } : null
  ))
}

export async function createRoom(
  context: Context
): Promise<Parameters<CreateRoomCallback>[0]> {
  const { socket, notifs, globalState } = context

  if(!checkSocket(socket.value, notifs)) {
    return {
      value: null,
      error: {
        reason: 'missing-argument'
      }
    }
  }
  const res = await socket.value.emitWithAck('create-room', globalState.user!)

  if(res.error) {
    notifs.push(errorNotification(res.error.reason))
    return res
  }

  globalState.setUser(res.value.user)
  globalState.setRoom(res.value.room)
  await globalState.waitForStateChange()
  return res
}

export async function joinRoom(
  id: Room['id'],
  context: Context
): Promise<Parameters<ClientJoinRoomCallback>[0]> {
  const { socket, notifs, globalState } = context

  if(!checkSocket(socket.value, notifs)) {
    return {
      value: null,
      error: {
        reason: 'missing-argument'
      }
    }
  }
  const res = await socket.value.emitWithAck('join-room', { roomId: id, user: globalState.user! })

  if(res.error) {
    notifs.push(errorNotification(res.error.reason))
    return res
  }

  globalState.setUser(res.value.user)
  globalState.setRoom(res.value.room)
  await globalState.waitForStateChange()
  return res
}

export async function leaveRoom(
  context: Context
): Promise<Return<null, ErrorsOf<LeaveRoomCallback> | 'missing-argument'>> {
  const { socket, notifs, globalState } = context

  if(!checkSocket(socket.value, notifs)) {
    return {
      value: null,
      error: {
        reason: 'missing-argument'
      }
    }
  }
  const res = await socket.value.emitWithAck('leave-room', null)

  if(res.error) {
    return res
  }
  globalState.setRoom(null)
  await globalState.waitForStateChange()
  return { value: null, error: null }
}