import state from '@/global/state'

// Clear global state before every test
beforeEach(() => {
	state.reset()
})
