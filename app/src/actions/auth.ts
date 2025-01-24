'use server'

import { auth, signOut } from '@/auth'

export async function signOutAction(...options: Parameters<typeof signOut>) {
	return await signOut(...options)
}

export async function getAuth() {
	return auth()
}
