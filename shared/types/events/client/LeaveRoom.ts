import { Return } from "../../Return"

type Callback = Return<
  null,
  | 'user-not-in-room'
>

export {
  Callback as ChangeUserStateCallback
}