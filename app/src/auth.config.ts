import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'
import { NextResponse } from 'next/server'

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
			const isOnLogin = nextUrl.pathname.startsWith('/login')
			if (isOnProfile) {
				if (isLoggedIn) return true
				return false // Redirect unauthenticated users to login page
			}

			// Redirect logged in users trying to access the login page
			if (isOnLogin && isLoggedIn) {
				return NextResponse.redirect(new URL('/', nextUrl))
			}
			return true
		}
	}
} satisfies NextAuthConfig
