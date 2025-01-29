import { CursorColor } from '$shared/types/Cursor'

export type Unlocks = {
	'cursor-color': CursorColor
}

export type UnlockTypes = keyof Unlocks

export type Unlock<T extends UnlockTypes = UnlockTypes> = {
	type: T
	value: Unlocks[T]
}

export const UNLOCKS: Record<number, Unlock | undefined> = {
	1: u({
		type: 'cursor-color',
		value: 'gray'
	}),
	3: u({
		type: 'cursor-color',
		value: 'red'
	}),
	6: u({
		type: 'cursor-color',
		value: 'blue'
	}),
	10: u({
		type: 'cursor-color',
		value: 'green'
	}),
	14: u({
		type: 'cursor-color',
		value: 'purple'
	}),
	18: u({
		type: 'cursor-color',
		value: 'orange'
	}),
	24: u({
		type: 'cursor-color',
		value: 'yellow'
	}),
	30: u({
		type: 'cursor-color',
		value: 'cyan'
	}),
	36: u({
		type: 'cursor-color',
		value: 'pink'
	}),
	40: u({
		type: 'cursor-color',
		value: 'ocean'
	}),
	44: u({
		type: 'cursor-color',
		value: 'sunrise'
	}),
	48: u({
		type: 'cursor-color',
		value: 'flame'
	}),
	52: u({
		type: 'cursor-color',
		value: 'twilight'
	}),
	56: u({
		type: 'cursor-color',
		value: 'spring'
	}),
	60: u({
		type: 'cursor-color',
		value: 'crystal'
	}),
	64: u({
		type: 'cursor-color',
		value: 'amethyst'
	}),
	68: u({
		type: 'cursor-color',
		value: 'aurora'
	}),
	72: u({
		type: 'cursor-color',
		value: 'rainbow'
	})
} as const

// Enforce type and value match
function u<T extends UnlockTypes>(unlock: Unlock<T>): Unlock<T> {
	return unlock
}

export function getUnlocks(level: number): Record<number, Unlock | undefined> {
	return Object.fromEntries(Object.entries(UNLOCKS).filter((u) => parseInt(u[0]) <= level))
}
