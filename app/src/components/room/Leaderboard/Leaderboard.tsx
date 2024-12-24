import { useGlobalState } from '@/context/GlobalState'
import styles from './style.module.scss'
import LeaderboardUser from './LeaderboardUser'
import sortUsersByScore from '@/utils/sortUsersByScore'
import { useLayoutEffect, useRef, useState } from 'react'
import createClasses from '@/utils/createClasses'
import PixelarticonsChevronUp from '~icons/pixelarticons/chevron-up'
import debounce from 'debounce'

export default function Leaderboard() {
	const { room } = useGlobalState()
	const [open, setOpen] = useState(true)
	const results = useRef<HTMLDivElement>(null)
	const list = useRef<HTMLOListElement>(null)

	useLayoutEffect(() => {
		setResultsHeight()
		const onresize = debounce(setResultsHeight, 100)
		window.addEventListener('resize', onresize)

		return () => {
			window.removeEventListener('resize', onresize)
		}
	}, [open])

	if (!room) return <></>

	function setResultsHeight() {
		if (!results.current || !list.current) return

		if (open) {
			results.current.style.height = `${list.current.getBoundingClientRect().height}px`
		} else {
			results.current.style.height = '0px'
		}
	}

	return (
		<div
			className={createClasses({
				[styles['leaderboard']]: true,
				[styles['leaderboard--open']]: open
			})}
		>
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
			<div ref={results} className={styles['leaderboard__results']}>
				<ol ref={list} className={styles['list']} id="leaderboard-results">
					{sortUsersByScore(room.users).map((u) => (
						<LeaderboardUser key={u.id} user={u} />
					))}
				</ol>
			</div>
		</div>
	)
}
