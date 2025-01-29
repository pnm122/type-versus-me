import { useEffect, useRef } from 'react'

export function useTimeout(callback: () => void, duration?: number, deps?: any[]) {
	const timeout = useRef<NodeJS.Timeout | null>(null)

	useEffect(() => {
		timeout.current = setTimeout(callback, duration)

		return () => {
			if (timeout.current) clear()
		}
	}, deps)

	function clear() {
		if (timeout.current) {
			clearTimeout(timeout.current)
			timeout.current = null
		}
	}

	return { clearTimeout: clear }
}
