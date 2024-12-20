import { RequestColorCallback, RequestColorPayload } from "$shared/types/events/client/RequestColor";
import { isValidColor } from "$shared/utils/validators";
import io from "@/global/server";
import state from "@/global/state";
import CustomSocket from "@/types/CustomSocket";
import { check, isValidEventAndPayload } from "@/utils/eventUtils";

export default function RequestColor(
  socket: CustomSocket,
  value: RequestColorPayload,
  callback: RequestColorCallback
) {
  if(!isValidEventAndPayload(socket, callback, value?.id, value?.color)) {
    return
  }

  const { id, color } = value

  if(check(!isValidColor(color), 'invalid-color', callback)) {
    return
  }

  const room = state.getRoomFromUser(id)
  if(check(!room, 'user-not-in-room', callback)) {
    return
  }

  const colorTaken = !!room!.users.find(u => u.color === color)
  if(check(colorTaken, 'color-taken', callback)) {
    return
  }

  state.updateUser(id, { color })
  io.in(room!.id).emit('change-user-data', { id, color })

  callback({
    value: { color },
    error: null
  })
}