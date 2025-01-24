import { prisma } from '$shared/prisma'
import { Prisma, Score } from '@prisma/client'

export async function createScores(data: Omit<Score, 'id'>[]): Promise<{
	data: true | null
	error: Prisma.PrismaClientKnownRequestError | null
}> {
	try {
		await prisma.score.createMany({
			data
		})

		const updateUserResults = await Promise.allSettled(
			data.map((score) =>
				prisma.user.update({
					where: {
						id: score.userId
					},
					data: {
						points: {
							increment: score.points
						}
					}
				})
			)
		)

		if (updateUserResults.every((res) => res.status === 'fulfilled')) {
			return {
				data: true,
				error: null
			}
		}

		return {
			data: null,
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
