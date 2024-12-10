import { RoomMetadata } from '../../Room'

type Payload = Partial<Omit<RoomMetadata, 'id'>>

export {
  Payload as ChangeRoomStatePayload
}