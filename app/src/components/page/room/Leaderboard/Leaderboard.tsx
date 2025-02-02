import styles from './style.module.scss'
import { useState } from 'react'
import createClasses from '@/utils/createClasses'
import PixelarticonsChevronUp from '~icons/pixelarticons/chevron-up'
import Collapsible from '@/components/base/Collapsible/Collapsible'
import { useRoom } from '@/context/Room'
import RaceLeaderboard from '@/components/shared/RaceLeaderboard/RaceLeaderboard'

export default function Leaderboard() {
	const { room, user } = useRoom()
	const [open, setOpen] = useState(true)

	if (!room) return <></>

	const usersWithLastScore = room.users.filter((u) => u.lastScore)
	const isLeaderboardVisible = room.state !== 'in-progress' && usersWithLastScore.length !== 0

	return (
		<Collapsible open={isLeaderboardVisible} openDirection="down">
			<div
				className={createClasses({
					[styles['leaderboard']]: true,
					[styles['leaderboard--open']]: open
				})}
			>
				<div className={styles['divider']} />
				<div className={styles['leaderboard__content']}>
					<button
						className={styles['expand']}
						aria-label="Show results"
						aria-expanded={open}
						aria-controls="leaderboard-results"
						onClick={() => setOpen((o) => !o)}
					>
						<h1 className={styles['expand__title']}>Results</h1>
						<PixelarticonsChevronUp className={styles['expand__icon']} />
					</button>
					<Collapsible open={open} openDirection="down" id="leaderboard-results">
						<div className={styles['leaderboard-results-spacer']} />
						<RaceLeaderboard
							scores={usersWithLastScore.map((u) => ({
								user: {
									id: u.socketId,
									username: u.username,
									color: u.color
								},
								...u.lastScore!
							}))}
							currentUserId={user!.socketId}
						/>
					</Collapsible>
				</div>
			</div>
		</Collapsible>
	)
}
