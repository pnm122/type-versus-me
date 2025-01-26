export default function getTimeLimitText(timeLimit: number) {
	if (timeLimit < 60) {
		return `${timeLimit}s time limit`
	}

	const minutes = Math.floor(timeLimit / 60)
	const seconds = timeLimit % 60

	if (seconds === 0) {
		return `${minutes}min time limit`
	}

	return `${minutes}min ${seconds}s time limit`
}
