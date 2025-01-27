import { Score } from '@prisma/client'

export default function getPointsFromScore({
	netWPM,
	accuracy,
	isWinner,
	numWords,
	numUsers
}: Pick<Score, 'netWPM' | 'accuracy' | 'isWinner'> & { numWords: number; numUsers: number }) {
	// 0 points if the user failed
	if (netWPM < 0 || accuracy < 0) return 0

	// More words in test => more points for wpm and accuracy
	const numWordsScale = numWords / 40
	// Higher wpm is weighted disproportionately higher
	const wpmPoints = (Math.pow(netWPM, 2) / 1000 + netWPM / 6) * numWordsScale
	// Bonus for winning the race
	const winnerPoints = isWinner ? 2 * (numUsers - 1) : 0
	// 2x bonus for 100% accuracy, small bonus for accuracy > 0.95
	const accuracyPoints =
		accuracy >= 1
			? Math.max(numWordsScale * 3, 1)
			: 30 * Math.max(accuracy - 0.95, 0) * numWordsScale
	return Math.floor(wpmPoints + winnerPoints + accuracyPoints)
}
