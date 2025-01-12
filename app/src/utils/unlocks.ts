import { CursorColor } from '$shared/types/Cursor'

export type Unlocks = {
	'cursor-color': CursorColor
}

export type UnlockType = keyof Unlocks

type Unlock<T extends UnlockType = UnlockType> = {
	type: T
	value: Unlocks[T]
}

export const UNLOCKS: Record<number, Unlock | undefined> = {
	3: u({
		type: 'cursor-color',
		value: 'red'
	}),
	5: u({
		type: 'cursor-color',
		value: 'blue'
	}),
	7: u({
		type: 'cursor-color',
		value: 'green'
	}),
	10: u({
		type: 'cursor-color',
		value: 'purple'
	}),
	13: u({
		type: 'cursor-color',
		value: 'orange'
	}),
	16: u({
		type: 'cursor-color',
		value: 'yellow'
	}),
	20: u({
		type: 'cursor-color',
		value: 'cyan'
	}),
	25: u({
		type: 'cursor-color',
		value: 'pink'
	})
} as const

// Enforce type and value match
function u<T extends UnlockType>(unlock: Unlock<T>): Unlock<T> {
	return unlock
}
