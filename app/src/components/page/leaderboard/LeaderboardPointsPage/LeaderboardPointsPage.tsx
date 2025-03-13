// import styles from './style.module.scss'

import { User } from '@prisma/client'

export default function LeaderboardPointsPage({ leaderboard }: { leaderboard: User[] }) {
	return (
		<div>
			{leaderboard.map((u) => (
				<div key={u.id}>
					{u.username} | {u.points}
				</div>
			))}
		</div>
	)
}
