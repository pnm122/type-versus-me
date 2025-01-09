'use server'

import { signOut } from '@/auth'

export async function signOutAction(...options: Parameters<typeof signOut>) {
	return await signOut(...options)
}
