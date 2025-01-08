import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'

export const authConfig = {
	pages: {
		signIn: '/login'
	},
	providers: [Google],
	session: {
		strategy: 'jwt'
	},
	callbacks: {
		authorized({ auth, request: { nextUrl } }) {
			const isLoggedIn = !!auth?.user
			const isOnProfile = nextUrl.pathname.startsWith('/profile')
			if (isOnProfile) {
				if (isLoggedIn) return true
				return false // Redirect unauthenticated users to login page
			}
			return true
		}
	}
} satisfies NextAuthConfig
