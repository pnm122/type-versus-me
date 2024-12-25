import { flushSync } from 'react-dom'

export default function transition(callback: () => void) {
	if (!document.startViewTransition) return callback()

	document.startViewTransition(() => {
		// Update the DOM synchronously so the view transition API can reliably get
		// a before and after snapshot of the DOM
		flushSync(callback)
	})
}
