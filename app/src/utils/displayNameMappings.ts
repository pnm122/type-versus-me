import { RoomSettings } from '$shared/types/Room'
import { UserStats } from '$shared/types/Database'

export const userStatsDisplayNames: { [key in keyof UserStats]: string } = {
	maxWPM: 'best',
	avgWPM: 'average',
	wordsTyped: 'words typed',
	racesPlayed: 'races played',
	racesWon: 'races won'
}

export const roomCategoryDisplayNames: { [key in RoomSettings['category']]: string } = {
	quote: 'Quotes',
	'top-100': 'Top 100 words',
	'top-1000': 'Top 1000 words'
}
