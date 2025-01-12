/** Get a user's level given their points */
export function getLevel(points: number) {
	return Math.floor(getUnroundedLevel(points))
}

function getUnroundedLevel(points: number) {
	if (typeof points !== 'number' || Number.isNaN(points) || points < 0) return 1

	return (
		// Easier to get levels at the start, then harder
		50 * Math.atan(points / 3000) +
		// At a minimum, levels will still increase at this rate
		0.0005 * points +
		// Start from level 1 at points = 0
		1
	)
}

export function getMinPointsForNextLevel(points: number) {
	if (typeof points !== 'number' || Number.isNaN(points) || points < 0)
		return getMinPointsForNextLevel(0)

	const GUESS_DELTA = 70

	const currentLevel = getUnroundedLevel(points)
	// try adding a number to points
	const deltaLevel = getUnroundedLevel(points + GUESS_DELTA)
	// get slope and extrapolate an estimated min points
	const slope = (deltaLevel - currentLevel) / GUESS_DELTA
	const distToNextLevel = Math.floor(currentLevel + 1) - currentLevel

	const guess = Math.round(points + distToNextLevel / slope)

	return _getLevelBoundary(guess)
}

export function getMinPointsForCurrentLevel(points: number) {
	if (typeof points !== 'number' || Number.isNaN(points) || points <= 0) return 0

	// By never going under 0, we can guarantee that the slope is always decreasing as `points` gets larger
	const GUESS_DELTA = Math.min(70, points)

	const currentLevel = getUnroundedLevel(points)
	// try adding a number to points
	const deltaLevel = getUnroundedLevel(points - GUESS_DELTA)
	// get slope and extrapolate an estimated min points
	const slope = ((deltaLevel - currentLevel) / GUESS_DELTA) * -1
	const distToStartOfLevel = Math.floor(currentLevel) - currentLevel

	const guess = Math.round(points + distToStartOfLevel / slope)

	return _getLevelBoundary(guess)
}

/** Add/subtract until finding the minimum number of points for the closest level boundary */
function _getLevelBoundary(points: number) {
	if (points <= 0) return 0

	const unroundedLevel = getUnroundedLevel(points)
	const boundaryIsAbove = Math.round(unroundedLevel) > unroundedLevel

	if (boundaryIsAbove) {
		if (getLevel(points) < getLevel(points + 1)) {
			return points + 1
		} else {
			return _getLevelBoundary(points + 1)
		}
	} else {
		if (getLevel(points) > getLevel(points - 1)) {
			return points
		} else {
			return _getLevelBoundary(points - 1)
		}
	}
}
