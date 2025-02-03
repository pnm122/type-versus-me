import { RoomSettings } from '$shared/types/Room'
import { Score } from '@prisma/client'

export default function getPointsFromScore({
	netWPM,
	accuracy,
	isWinner,
	numWords,
	numUsers,
	category
}: Pick<Score, 'netWPM' | 'accuracy' | 'isWinner'> & {
	numWords: number
	numUsers: number
	category: RoomSettings['category']
}) {
	// 0 points if the user failed
	if (netWPM < 0 || accuracy < 0) return 0

	// More words in test => more points for wpm and accuracy
	const numWordsScale = numWords / 45
	const categoryScale = category === 'quote' ? 1.2 : category === 'top-1000' ? 1.05 : 1
	// Higher wpm is weighted disproportionately higher
	const wpmPoints = (Math.pow(netWPM, 2) / 1000 + netWPM / 6) * categoryScale
	// Bonus for winning the race
	const winnerPoints = isWinner ? 3 * (numUsers - 1) : 0
	// Bonus for 100% accuracy, small bonus for accuracy > 0.95
	const accuracyPoints = accuracy >= 1 ? 4 : 40 * Math.max(accuracy - 0.95, 0)
	return Math.floor((wpmPoints + winnerPoints + accuracyPoints) * numWordsScale)
}
