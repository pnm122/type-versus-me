import state from '@/global/state'

jest.mock('$shared/utils/database/race', () => ({
	createRace: jest.fn().mockImplementation((data) => ({
		data: { id: 0, ...data },
		error: null
	}))
}))

jest.mock('$shared/utils/database/score', () => ({
	createScores: jest.fn().mockImplementation((data) => ({
		data: data?.length ?? 0,
		error: null
	}))
}))

beforeEach(() => {
	// Clear global state before every test
	state.reset()

	// Clear mocked function calls
	jest.clearAllMocks()
})
