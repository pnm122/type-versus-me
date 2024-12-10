import ClientEvents from "$shared/types/events/client/_Events"
import ServerEvents from "$shared/types/events/server/_Events"
import { Server } from "socket.io"

const io = new Server<
  ClientEvents,
  ServerEvents
>()

export default io