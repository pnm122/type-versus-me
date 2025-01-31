import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '../../shared/prisma'
import generateUsername from '$shared/utils/generateUsername'

export const { handlers, auth, signIn, signOut } = NextAuth({
	...authConfig,
	adapter: {
		...PrismaAdapter(prisma),
		// Override creating a user to initialize the username field to a random username
		createUser(user) {
			try {
				return prisma.user.create({ data: { ...user, username: generateUsername() } })
			} catch {
				// Possible that the readable generated username already exists, generate a very random name
				return prisma.user.create({ data: { ...user, username: generateUsername(true) } })
			}
		}
	}
})
