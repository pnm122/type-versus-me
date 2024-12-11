import { ErrorReason, Return } from "$shared/types/Return";
import { User } from "$shared/types/User";
import { isValidColor, isValidUsername } from "$shared/utils/validators";
import CustomSocket from "@/types/CustomSocket";

/**
 * Check if an event with a payload is valid, returning appropriate errors through the callback if found.
 * The event is valid iff:
 *  1. callback is a function
 *  2. all expected values are non-null
 *  3. The user ID matches the socket ID
 * @returns true if valid, false if not
 */
export function isValidEventAndPayload<
  Callback extends (value: Return<any, 'missing-argument' | 'invalid-user-id'>) => void
>(
  socket: CustomSocket,
  callback: Callback,
  userId: User['id'],
  ...expectedValues: any[]
) {
  if(typeof callback !== 'function') return false

  const anyFailed = expectedValues.findIndex(value => {
    return check(!value, 'missing-argument', callback)
  }) !== -1

  if(anyFailed) return false

  if(check(socket.id !== userId, 'invalid-user-id', callback)) {
    return false
  }

  return true
}

/**
 * Check if a condition is met, calling the callback with the given error reason if condition is met.
 * @param condition Error condition to check truthiness of
 * @param errorReason Reason for error if condition is met
 * @param callback Function to call if the condition is met
 * @returns whether or not the condition is met
 */
export function check<
  Reason extends ErrorReason,
  Callback extends (value: Return<any, Reason>) => void
>(
  condition: any,
  errorReason: Reason,
  callback: Callback
) {
  if(condition) {
    callback({
      value: null,
      error: {
        reason: errorReason
      }
    })
    return true
  }

  return false
}