import { ChangeUserStateCallback, ChangeUserStatePayload } from "$shared/types/events/client/ChangeUserState";
import { RoomState } from "$shared/types/Room";
import { UserState } from "$shared/types/User";
import { INITIAL_USER_SCORE } from "@/constants";
import state from "@/global/state";
import CustomSocket from "@/types/CustomSocket";
import { check, isValidEventAndPayload } from "@/utils/eventUtils";
import generateTest from "@/utils/generateTest";

export default function ChangeUserState(
  socket: CustomSocket,
  value: ChangeUserStatePayload,
  callback: ChangeUserStateCallback
) {
  if(!isValidEventAndPayload(socket, callback, value?.id, value?.state)) {
    return
  }

  const room = state.getRoomFromUser(value.id)
  if(check(!room, 'user-not-in-room', callback)) {
    return
  }

  // mapping of current room states to invalid requested user states
  const invalidStates: { [key in RoomState]: UserState[] } = {
    'complete': ['failed', 'in-progress'],
    'in-progress': ['not-ready', 'ready'],
    'waiting': ['in-progress', 'complete', 'failed']
  }

  const invalidRequestedState = Object.keys(invalidStates).find(roomState => (
    !!invalidStates[roomState as RoomState].find(userState => (
      room!.state === roomState && value.state === userState
    ))
  ))
  if(check(invalidRequestedState, 'invalid-state', callback)) {
    return
  }

  state.updateUser(value.id, { state: value.state })
  socket.broadcast.to(room!.id).emit(
    'change-user-data',
    value
  )

  const allUsersReady = room!.users.every(u => u.id === value.id || u.state === 'ready') && value.state === 'ready'
  if(allUsersReady) {
    state.updateRoom(room!.id, { state: 'in-progress' })
    socket.in(room!.id).emit(
      'change-room-data',
      { state: 'in-progress' }
    )

    room!.users.forEach(u => {
      state.updateUser(u.id, { score: INITIAL_USER_SCORE, state: 'in-progress' })
    })
    socket.in(room!.id).emit(
      'change-all-user-data',
      { score: INITIAL_USER_SCORE, state: 'in-progress' }
    )
  }

  const allUsersDone =
    room!.users.every(u => u.id === value.id || u.state === 'complete' || u.state === 'failed') &&
    (value.state === 'complete' || value.state === 'failed')
  if(allUsersDone) {
    state.updateRoom(room!.id, { state: 'complete' })
    socket.in(room!.id).emit(
      'change-room-data',
      { state: 'complete' }
    )
  }

  const restart =
    room!.users.every(u => u.state === 'complete' || u.state === 'failed') &&
    value.state === 'not-ready'
  if(restart) {
    const test = generateTest()
    state.updateRoom(room!.id, { test, state: 'waiting' })
    socket.in(room!.id).emit(
      'change-room-data',
      { test, state: 'waiting' }
    )
  }

  callback({
    value: { state: value.state },
    error: null
  })
}