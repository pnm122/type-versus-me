import { useGlobalState } from '@/context/GlobalState'
import styles from './style.module.scss'
import Game from '../Game/Game'
import Leaderboard from '../Leaderboard/Leaderboard'
import { useEffect, useLayoutEffect, useRef } from 'react'

export default function MainRoom() {
	const globalState = useGlobalState()
	const gameRef = useRef<HTMLDivElement>(null)
	const waitingTextRef = useRef<HTMLHeadingElement>(null)
	const topRef = useRef<HTMLDivElement>(null)
	const resetHeightTimeout = useRef<NodeJS.Timeout | null>(null)
	const { room } = globalState

	useLayoutEffect(() => {
		if (!room || !topRef.current) return

		if (room.state === 'in-progress') {
			topRef.current.style.height = `${gameRef.current!.getBoundingClientRect().height}px`
		} else {
			topRef.current.style.height = `${waitingTextRef.current!.getBoundingClientRect().height}px`
		}
		resetTopHeight()
	}, [room?.state])

	useEffect(() => {
		return () => {
			if (resetHeightTimeout.current) clearTimeout(resetHeightTimeout.current)
		}
	}, [])

	function resetTopHeight() {
		resetHeightTimeout.current = setTimeout(() => {
			topRef.current!.style.height = ''
			resetHeightTimeout.current = null
		}, 250)
	}

	if (!room) return <></>

	return (
		<div className={styles['main']}>
			<div className={styles['top']} ref={topRef}>
				{room.state === 'in-progress' ? (
					<Game ref={gameRef} />
				) : (
					<h1 ref={waitingTextRef} className={styles['main__waiting-text']}>
						The race will start when all players are ready.
					</h1>
				)}
			</div>
			<Leaderboard />
		</div>
	)
}
