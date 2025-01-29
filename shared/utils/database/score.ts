import { prisma } from '$shared/prisma'
import { Prisma, Score, User } from '@prisma/client'

export async function createScores(data: Omit<Score, 'id'>[]): Promise<{
	data: [Prisma.BatchPayload, ...User[]] | null
	error: Prisma.PrismaClientKnownRequestError | null
}> {
	try {
		const res = await prisma.$transaction([
			prisma.score.createMany({
				data
			}),
			...data.map((score) =>
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
		])

		return {
			data: res,
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
