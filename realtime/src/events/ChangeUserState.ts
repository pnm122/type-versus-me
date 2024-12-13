import { ChangeUserStateCallback, ChangeUserStatePayload } from "$shared/types/events/client/ChangeUserState";
import CustomSocket from "@/types/CustomSocket";
import { isValidEventAndPayload } from "@/utils/eventUtils";

export default function ChangeUserState(
  socket: CustomSocket,
  value: ChangeUserStatePayload,
  callback: ChangeUserStateCallback
) {
  if(!isValidEventAndPayload(socket, callback, value?.id)) {
    return
  }
}