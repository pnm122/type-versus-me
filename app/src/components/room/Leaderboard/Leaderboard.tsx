import { useGlobalState } from '@/context/GlobalState'
import styles from './style.module.scss'
import LeaderboardUser from './LeaderboardUser'
import sortUsersByScore from '@/utils/sortUsersByScore'
import { useState } from 'react'
import createClasses from '@/utils/createClasses'
import PixelarticonsChevronUp from '~icons/pixelarticons/chevron-up'
import Collapsible from '@/components/Collapsible/Collapsible'

export default function Leaderboard() {
	const { room } = useGlobalState()
	const [open, setOpen] = useState(true)

	const sortedScores = sortUsersByScore(room?.users ?? [])

	if (!room) return <></>

	const isLeaderboardVisible = room.state !== 'in-progress' && sortedScores.length !== 0

	return (
		<Collapsible open={isLeaderboardVisible} openDirection="down">
			<div
				className={createClasses({
					[styles['leaderboard']]: true,
					[styles['leaderboard--open']]: open
				})}
			>
				<div className={styles['divider']} />
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
					<ol className={styles['leaderboard__results']}>
						{sortedScores.map((u) => (
							<LeaderboardUser key={u.id} user={u} />
						))}
					</ol>
				</Collapsible>
			</div>
		</Collapsible>
	)
}
