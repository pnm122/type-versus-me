import ClientEvents from '$shared/types/events/client/_Events'
import ServerEvents from '$shared/types/events/server/_Events'
import { Socket } from 'socket.io'

type CustomSocket = Socket<ClientEvents, ServerEvents>

export default CustomSocket
