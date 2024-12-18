import { CreateRoomCallback, CreateRoomPayload } from "$shared/types/events/client/CreateRoom";
import { User } from "$shared/types/User";
import { isValidColor, isValidUsername } from "$shared/utils/validators";
import { INITIAL_USER_SCORE, INITIAL_USER_STATE, MAX_ROOMS } from "@/constants";
import state from "@/global/state";
import CustomSocket from "@/types/CustomSocket";
import { check, isValidEventAndPayload } from "@/utils/eventUtils";

// TODO: Test does not need to exist at time of room creation
export default function CreateRoom(
  socket: CustomSocket,
  value: CreateRoomPayload,
  callback: CreateRoomCallback
) {
  if(!isValidEventAndPayload(socket, callback, value?.id, value)) {
    return
  }

  if(check(!isValidUsername(value.username), 'invalid-username', callback)) {
    return
  }

  if(check(!isValidColor(value.color), 'invalid-color', callback)) {
    return
  }

  if(check(state.getRoomFromUser(value.id), 'user-in-room-already', callback)) {
    return
  }

  if(check(state.getRooms().length >= MAX_ROOMS, 'max-rooms-created', callback)) {
    return
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