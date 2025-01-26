'use client'

import { createContext, useContext } from 'react'
import useAuth, { Auth } from '@/hooks/useAuth'

const AuthContext = createContext<Auth>({
	user: null,
	session: null,
	state: 'loading',
	error: null,
	async reload() {
		return null
	}
})

export function AuthProvider({ children }: React.PropsWithChildren) {
	const auth = useAuth()

	return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => useContext(AuthContext)
