import { auth } from '@/auth'
import { getUser } from '@/utils/database/user'
import HeaderClient from './HeaderClient'

export default async function HeaderServer() {
	const session = await auth()
	const user = session?.user?.id ? (await getUser(session?.user?.id)).data : null

	return <HeaderClient session={session} user={user} />
}
