import { getUser } from '$shared/utils/database/user'
import { Prisma, User } from '@prisma/client'
import { Session } from 'next-auth'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

type State = 'loading' | 'ready' | 'reloading' | 'error'

export interface Auth {
	user: User | null
	state: State
	error: Prisma.PrismaClientKnownRequestError | null
	session: Session | null
	reload(): Promise<User | null>
}

export default function useAuth(): Auth {
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

	useEffect(() => {
		if (session.status === 'loading') return

		if (!session.data) {
			setState('ready')
			return
		}

		updateUser(session.data.user!.id!)
	}, [session])

	return {
		session: session.data,
		user,
		state,
		error,
		reload
	}
}
