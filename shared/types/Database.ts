import { User } from '@prisma/client'

/** Additional fields to add to the User object besides the defaults */
export type AppUser = Omit<
	User,
	'id' | 'name' | 'email' | 'emailVerified' | 'image' | 'createdAt' | 'updatedAt'
>

export type UserStats = {
	maxWPM: number
	avgWPM: number
	wordsTyped: number
	racesPlayed: number
	racesWon: number
}
