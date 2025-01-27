'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { getUser } from '$shared/utils/database/user'
import { signOut, useSession } from 'next-auth/react'
import { Prisma, User } from '@prisma/client'
import { Session } from 'next-auth'

const AuthContext = createContext<Auth>({
	user: null,
	session: null,
	state: 'loading',
	error: null,
	async reload() {
		return null
	},
	async signOut() {}
})

type State = 'loading' | 'ready' | 'reloading' | 'error'

export interface Auth {
	user: User | null
	state: State
	error: Prisma.PrismaClientKnownRequestError | null
	session: Session | null
	reload(): Promise<User | null>
	signOut(): Promise<any>
}

export function AuthProvider({ children }: React.PropsWithChildren) {
	const [user, setUser] = useState<User | null>(null)
	const [state, setState] = useState<State>('loading')
	const [error, setError] = useState<Prisma.PrismaClientKnownRequestError | null>(null)
	const session = useSession()

	async function updateUser(id: string, reloading = false) {
		if (reloading) setState('reloading')
		const res = await getUser(id)
		setState('ready')
		setError(res.error)
		setUser(res.data)
		return res.data
	}

	async function reload() {
		if (!session.data?.user?.id) return null
		return await updateUser(session.data.user.id, true)
	}

	async function signOutExternal() {
		return await signOut()
	}

	useEffect(() => {
		if (session.status === 'loading') return

		if (!session.data) {
			setState('ready')
			return
		}

		updateUser(session.data.user!.id!)
	}, [session])

	return (
		<AuthContext.Provider
			value={{ user, state, error, session: session.data, reload, signOut: signOutExternal }}
		>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuthContext = () => useContext(AuthContext)
