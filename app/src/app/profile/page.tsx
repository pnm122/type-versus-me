// import styles from './style.module.scss'

import { auth } from '@/auth'
import { getUser } from '@/utils/database/user'

export default async function Profile() {
	const session = await auth()
	const user = (await getUser(session!.user!.id!))!

	return (
		<div>
			{Object.keys(user).map((key) => (
				<p key={key}>
					{key}: {user[key as keyof typeof user]?.toString()}
				</p>
			))}
		</div>
	)
}
