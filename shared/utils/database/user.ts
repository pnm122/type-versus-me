'use server'

import { CursorColor } from '$shared/types/Cursor'
import { RoomSettings } from '$shared/types/Room'
import { prisma } from '$shared/prisma'
import { UserStats } from '$shared/types/Database'
import { Prisma, User } from '@prisma/client'

export async function getUser(
	id: string
): Promise<{ data: User | null; error: Prisma.PrismaClientKnownRequestError | null }> {
	try {
		const data = await prisma.user.findUnique({
			where: { id }
		})
		return {
			data,
			error: null
		}
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			return {
				data: null,
				error
			}
		}
		return {
			data: null,
			error: null
		}
	}
}

export async function getAllUserIds(): Promise<{
	data: string[] | null
	error: Prisma.PrismaClientKnownRequestError | null
}> {
	try {
		const res = await prisma.user.findMany({
			select: {
				id: true
			}
		})

		return {
			data: res.map(({ id }) => id),
			error: null
		}
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			return {
				data: null,
				error
			}
		}
		return { data: null, error: null }
	}
}

export async function getUserStats(
	id: string,
	filter: { category?: RoomSettings['category'][]; minWords?: number; maxWords?: number }
): Promise<{ data: UserStats | null; error: Prisma.PrismaClientKnownRequestError | null }> {
	// Empty array should be no filter
	const category = filter.category && filter.category.length > 0 ? filter.category : undefined
	const where = {
		userId: id,
		race: {
			category: { in: category },
			numWords: {
				gte: filter.minWords,
				lte: filter.maxWords
			}
		}
	}

	try {
		const res = await prisma.score.groupBy({
			by: ['isWinner', 'failed'],
			where,
			_avg: {
				netWPM: true
			},
			_max: {
				netWPM: true
			},
			_count: {
				raceId: true
			}
		})

		// eslint-disable-next-line
		const { racesCountingForAverage, ...stats } = res.reduce(
			(acc, curr) => {
				const racesCountingForAverage =
					acc.racesCountingForAverage + (curr.failed ? 0 : curr._count.raceId)
				return {
					maxWPM: (curr._max.netWPM ?? 0) > acc.maxWPM ? (curr._max.netWPM ?? 0) : acc.maxWPM,
					avgWPM: curr.failed
						? acc.avgWPM
						: acc.avgWPM * (acc.racesPlayed / racesCountingForAverage) +
							(curr._avg.netWPM ?? 0) * (curr._count.raceId / racesCountingForAverage),
					racesPlayed: acc.racesPlayed + curr._count.raceId,
					racesWon: curr.isWinner ? curr._count.raceId : acc.racesWon,
					racesCountingForAverage
				}
			},
			{ maxWPM: 0, avgWPM: 0, racesPlayed: 0, racesWon: 0, racesCountingForAverage: 0 }
		)

		const wordsTyped = (
			await prisma.score.findMany({
				where: {
					...where,
					// only count words for scores where the user did not fail
					netWPM: {
						gte: 0
					}
				},
				select: {
					race: {
						select: {
							numWords: true
						}
					}
				}
			})
		).reduce((sum, curr) => sum + curr.race.numWords, 0)

		return {
			data: {
				wordsTyped,
				...stats
			},
			error: null
		}
	} catch (e) {
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			return {
				data: null,
				error: e
			}
		}
		return {
			data: null,
			error: null
		}
	}
}

export async function getUserScores(
	id: string,
	page: number,
	itemsPerPage: number,
	filter: { category?: RoomSettings['category'][]; minWords?: number; maxWords?: number }
): Promise<{
	data: {
		scores: Prisma.ScoreGetPayload<{
			include: {
				race: {
					include: {
						scores: {
							include: {
								user: {
									select: {
										username: true
										cursorColor: true
									}
								}
							}
						}
					}
				}
			}
		}>[]
		totalCount: number
	} | null
	error: Prisma.PrismaClientKnownRequestError | null
}> {
	// Empty array should be no filter
	const category = filter.category && filter.category.length > 0 ? filter.category : undefined
	const where = {
		userId: id,
		race: {
			category: { in: category },
			numWords: {
				gte: filter.minWords,
				lte: filter.maxWords
			}
		}
	}

	try {
		const [scores, totalCount] = await prisma.$transaction([
			prisma.score.findMany({
				where,
				skip: page * itemsPerPage,
				take: itemsPerPage,
				orderBy: {
					race: {
						startTime: 'desc'
					}
				},
				include: {
					race: {
						include: {
							scores: {
								include: {
									user: {
										select: {
											username: true,
											cursorColor: true
										}
									}
								}
							}
						}
					}
				}
			}),
			prisma.score.count({ where })
		])

		return {
			data: { scores, totalCount },
			error: null
		}
	} catch (e) {
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			return {
				data: null,
				error: e
			}
		}

		return {
			data: null,
			error: null
		}
	}
}

export async function getTopUsersByPoints(
	page: number,
	itemsPerPage: number
): Promise<{ data: User[] | null; error: Prisma.PrismaClientKnownRequestError | null }> {
	try {
		const data = await prisma.user.findMany({
			skip: page * itemsPerPage,
			take: itemsPerPage,
			orderBy: {
				points: 'desc'
			}
		})

		return { data, error: null }
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			return { data: null, error }
		}
		return { data: null, error: null }
	}
}

export async function updateUser(
	id: string,
	{ username, cursorColor }: { username?: string; cursorColor?: CursorColor }
): Promise<{ error: Prisma.PrismaClientKnownRequestError | null }> {
	try {
		await prisma.user.update({
			where: { id },
			data: { username, cursorColor }
		})

		return { error: null }
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			return { error }
		}
		return { error: null }
	}
}
