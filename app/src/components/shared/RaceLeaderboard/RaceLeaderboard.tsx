import { LastTestScore, User } from '$shared/types/User'
import RaceLeaderboardUser from './RaceLeaderboardUser'
import styles from './style.module.scss'

interface Props {
	scores: (LastTestScore & {
		user: Pick<User, 'username' | 'color'> & { id: string }
		href?: string
	})[]
	currentUserId?: string
}

export default function RaceLeaderboard({ scores, currentUserId }: Props) {
	const sortedScores = scores.sort((a, b) => {
		if (b.failed && !a.failed) return -1
		if (a.failed && !b.failed) return 1
		return (b.netWPM ?? 0) - (a.netWPM ?? 0)
	})

	return (
		<ol className={styles['leaderboard']}>
			{sortedScores.map((score) => (
				<RaceLeaderboardUser
					key={score.user.id}
					score={score}
					winnerWPM={sortedScores[0].netWPM}
					isCurrentUser={score.user.id === currentUserId}
				/>
			))}
		</ol>
	)
}
