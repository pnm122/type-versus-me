import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'
import { NextResponse } from 'next/server'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
	interface Session {
		id: string
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		id: string
	}
}

export const authConfig = {
	pages: {
		signIn: '/login'
	},
	providers: [Google],
	session: {
		strategy: 'jwt'
	},
	callbacks: {
		jwt({ token, user }) {
			// Add user ID to JWT
			return {
				...token,
				...(user ? { id: user.id } : {})
			}
		},
		session({ session, token }) {
			// Use JWT ID in session
			return {
				...session,
				user: {
					...session.user,
					id: token.id
				}
			}
		},
		authorized({ auth, request: { nextUrl } }) {
			const isLoggedIn = !!auth?.user
			const isOnLogin = nextUrl.pathname.startsWith('/login')

			// Redirect logged in users trying to access the login page
			if (isOnLogin && isLoggedIn) {
				return NextResponse.redirect(new URL('/', nextUrl))
			}
			return true
		}
	}
} satisfies NextAuthConfig
