import state from "@/global/state";
import CustomSocket from "@/types/CustomSocket";
import LeaveRoom from "./LeaveRoom";

export default function Disconnect(
  socket: CustomSocket
) {
  const room = state.getRoomFromUser(socket.id)

  if(room) {
    LeaveRoom(socket, () => {})
  }
}