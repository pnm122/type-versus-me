import { Return } from "../../Return"

type Callback = (
  value: Return<
    null,
    | 'user-not-in-room'
  >
) => void

export type {
  Callback as LeaveRoomCallback
}