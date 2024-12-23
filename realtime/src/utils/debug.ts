export const DEBUG_COLORS = {
	RED: '\x1b[31m',
	GREEN: '\x1b[32m',
	YELLOW: '\x1b[33m',
	BLUE: '\x1b[34m',
	PURPLE: '\x1b[35m',
	CYAN: '\x1b[36m',
	WHITE: '\x1b[37m'
}

export default function debug(...args: any[]) {
	if (process.env.MODE === 'development') {
		console.log(...args)
	}
}
