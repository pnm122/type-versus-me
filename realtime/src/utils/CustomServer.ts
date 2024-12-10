import ClientEvents from "$shared/types/events/client/_Events"
import ServerEvents from "$shared/types/events/server/_Events"
import { Server } from "socket.io"

const CustomServer = Server<
  ClientEvents,
  ServerEvents
>

export default CustomServer