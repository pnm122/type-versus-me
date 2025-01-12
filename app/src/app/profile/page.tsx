import { auth } from '@/auth'
import ProfileInner from '@/components/profile/ProfileInner/ProfileInner'
import { getUser } from '@/utils/database/user'

export default async function Profile() {
	const session = await auth()
	const user = (await getUser(session!.user!.id!))!

	return <ProfileInner user={user} />
}
