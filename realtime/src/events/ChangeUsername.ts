import { ChangeUsernameCallback, ChangeUsernamePayload } from "$shared/types/events/client/ChangeUsername";
import CustomSocket from "@/types/CustomSocket";

export default function ChangeUsername(
  socket: CustomSocket,
  value: ChangeUsernamePayload,
  callback: ChangeUsernameCallback
) {

}