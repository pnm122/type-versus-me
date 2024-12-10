import { RegisterCallback, RegisterPayload } from "$shared/types/events/client/Register";
import { User } from "$shared/types/User";
import CustomSocket from "@/types/CustomSocket";
import generateColor from "@/utils/generateColor";
import generateUsername from "@/utils/generateUsername";
import { isValidUsername, isValidColor } from '$shared/utils/validators'

export default function Register(
  socket: CustomSocket,
  value: RegisterPayload,
  callback: RegisterCallback
) {
  const newUser: User = {
    id: socket.id,
    username: isValidUsername(value.username) ? value.username! : generateUsername(),
    color: isValidColor(value.color) ? value.color! : generateColor()
  }

  callback({
    value: newUser,
    error: null
  })
}