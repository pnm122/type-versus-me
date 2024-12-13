import { ClientJoinRoomCallback, ClientJoinRoomPayload } from "$shared/types/events/client/JoinRoom"
import { User } from "$shared/types/User"
import { INITIAL_USER_SCORE, INITIAL_USER_STATE, MAX_USERS_PER_ROOM } from "@/constants"
import state from "@/global/state"
import CustomSocket from "@/types/CustomSocket"
import { check, isValidEventAndPayload } from "@/utils/eventUtils"
import { generateColorFromPreference } from "@/utils/generateColor"

export default function JoinRoom(
  socket: CustomSocket,
  value: ClientJoinRoomPayload,
  callback: ClientJoinRoomCallback
) {
  if(!isValidEventAndPayload(socket, callback, value?.user?.id, value?.roomId, value?.user)) {
    return
  }

  const { roomId, user } = value

  if(check(
    state.getRoomFromUser(user.id),
    'user-in-room-already',
    callback
  )) {
    return
  }

  if(check(
    !state.getRoom(roomId),
    'room-does-not-exist',
    callback
  )) {
    return
  }

  if(check(
    state.getRoom(roomId)!.state !== 'waiting',
    'game-in-progress',
    callback
  )) {
    return
  }

  if(check(
    state.getRoom(roomId)!.users.length >= MAX_USERS_PER_ROOM,
    'room-is-full',
    callback
  )) {
    return
  }

  const takenColors = state.getRoom(roomId)!.users.map(u => u.color)

  const userToAdd: User = {
    ...user,
    color: generateColorFromPreference(user.color, takenColors),
    score: INITIAL_USER_SCORE,
    state: INITIAL_USER_STATE
  }

  const room = state.addUserToRoom(roomId, userToAdd)!
  
  socket.broadcast.to(roomId).emit('join-room', userToAdd)
  socket.join(roomId)

  callback({
    value: {
      user: userToAdd,
      room
    },
    error: null
  })
}