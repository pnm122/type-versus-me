import { LeaveRoomCallback } from "$shared/types/events/client/LeaveRoom";
import state from "@/global/state";
import CustomSocket from "@/types/CustomSocket";
import { check, setRoomToInProgress } from "@/utils/eventUtils";

export default function LeaveRoom(
  socket: CustomSocket,
  callback: LeaveRoomCallback
) {
  if(typeof callback !== 'function') return

  const room = state.getRoomFromUser(socket.id)
  if(check(!room, 'user-not-in-room', callback)) {
    return
  }

  state.removeUserFromRoom(room!.id, socket.id)
  socket.leave(room!.id)
  socket.in(room!.id).emit(
    'leave-room',
    { id: socket.id }
  )

  const allUsersReady = state.getRoom(room!.id)!.users.every(u => u.state === 'ready')
  if(allUsersReady) {
    setRoomToInProgress(room!.id, socket)
  }

  const allUsersDone = state.getRoom(room!.id)!.users.every(u => u.state === 'complete' || u.state === 'failed')
  if(allUsersDone) {
    state.updateRoom(room!.id, { state: 'complete' })
    socket.in(room!.id).emit(
      'change-room-data',
      { state: 'complete' }
    )
  }

  callback({
    value: null,
    error: null
  })
}