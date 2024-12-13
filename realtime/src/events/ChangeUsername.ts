import { ChangeUsernameCallback, ChangeUsernamePayload } from "$shared/types/events/client/ChangeUsername";
import { isValidUsername } from "$shared/utils/validators";
import state from "@/global/state";
import CustomSocket from "@/types/CustomSocket";
import { check, isValidEventAndPayload } from "@/utils/eventUtils";

export default function ChangeUsername(
  socket: CustomSocket,
  value: ChangeUsernamePayload,
  callback: ChangeUsernameCallback
) {
  if(!isValidEventAndPayload(socket, callback, value?.id, value?.username)) {
    return
  }

  const { username, id } = value

  if(check(!isValidUsername(username), 'invalid-username', callback)) {
    return
  }

  const room = state.getRoomFromUser(id)
  if(check(!room, 'user-not-in-room', callback)) {
    return
  }

  const usernameTaken = !!state.getRoomFromUser(id)!.users.find(u => u.username === username)
  if(check(usernameTaken, 'username-taken', callback)) {
    return
  }

  // Should be defined since we checked that the user is in a room already
  const newUser = state.updateUser(id, { username })!
  socket.broadcast.to(room!.id).emit('change-user-data', newUser)

  callback({
    value: newUser,
    error: null
  })
}