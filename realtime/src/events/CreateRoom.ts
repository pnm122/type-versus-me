import { CreateRoomCallback, CreateRoomPayload } from "$shared/types/events/client/CreateRoom";
import { User } from "$shared/types/User";
import { isValidColor, isValidUsername } from "$shared/utils/validators";
import { INITIAL_USER_SCORE, INITIAL_USER_STATE, MAX_ROOMS } from "@/constants";
import state from "@/global/state";
import CustomSocket from "@/types/CustomSocket";

export default function CreateRoom(
  socket: CustomSocket,
  value: CreateRoomPayload,
  callback: CreateRoomCallback
) {
  if(typeof callback !== 'function') return

  if(!value) {
    return callback({
      value: null,
      error: {
        reason: 'no-argument-provided'
      }
    })
  }

  if(socket.id !== value.id) {
    return callback({
      value: null,
      error: {
        reason: 'invalid-user-id',
        details: value.id
      }
    })
  }

  if(!isValidUsername(value.username)) {
    return callback({
      value: null,
      error: {
        reason: 'invalid-username'
      }
    })
  }

  if(!isValidColor(value.color)) {
    return callback({
      value: null,
      error: {
        reason: 'invalid-color'
      }
    })
  }

  if(state.getRoomFromUser(value.id)) {
    return callback({
      value: null,
      error: {
        reason: 'user-in-room-already'
      }
    })
  }

  if(state.getRooms().length >= MAX_ROOMS) {
    return callback({
      value: null,
      error: {
        reason: 'max-rooms-created'
      }
    })
  }

  const initialRoom = state.createRoom()

  const initialUser: User = {
    ...value,
    state: INITIAL_USER_STATE,
    score: INITIAL_USER_SCORE
    
  }
  const room = state.addUserToRoom(initialRoom.id, initialUser)!
  socket.join(initialRoom.id)

  callback({
    value: {
      room,
      user: initialUser
    },
    error: null
  })
}