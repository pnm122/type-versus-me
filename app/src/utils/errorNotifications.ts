import { ErrorReason } from '$shared/types/Return'
import { NotificationData } from '@/context/Notification'

const readableErrorReasons: Record<ErrorReason, string | null> = {
	'invalid-color': 'The color you provided is invalid.',
	'invalid-username':
		'Your username must be between 3 and 16 characters (alphanumeric or underscore).',
	'max-rooms-created': 'The server is at capacity. Please try again later.',
	'user-in-room-already': 'You are already in a room. Please leave the room and try again.',
	'room-is-full': 'This room is full. Please try again later.',
	'game-in-progress': 'This room has a game in progress. Please try again later.',
	'room-does-not-exist': 'Invalid room code.',
	'username-taken': 'This username is taken. Please choose another username and try again.',
	'color-taken': 'This color is taken. Please choose another color and try again.',
	'invalid-user-id': null,
	'missing-argument': null,
	'user-not-in-room': null
} as const

export function errorNotification(reason: ErrorReason): NotificationData {
	return {
		style: 'error',
		text:
			readableErrorReasons[reason] ??
			`Something went wrong! Please refresh and try again. (Error code: ${reason})`
	}
}
