import { useGlobalState } from '@/context/GlobalState'
import styles from './style.module.scss'
import Game from '../Game/Game'
import Leaderboard from '../Leaderboard/Leaderboard'
import { useEffect, useLayoutEffect, useRef } from 'react'
import debounce from 'debounce'

export default function MainRoom() {
	const globalState = useGlobalState()
	const gameRef = useRef<HTMLDivElement>(null)
	const waitingTextRef = useRef<HTMLHeadingElement>(null)
	const topRef = useRef<HTMLDivElement>(null)
	const resetHeightTimeout = useRef<NodeJS.Timeout | null>(null)
	const { room } = globalState

	useLayoutEffect(() => {
		updateHeight()
		const onResize = debounce(updateHeight, 100)
		window.addEventListener('resize', onResize)

		return () => {
			window.removeEventListener('resize', onResize)
		}
	}, [room?.state])

	useEffect(() => {
		return () => {
			if (resetHeightTimeout.current) clearTimeout(resetHeightTimeout.current)
		}
	}, [])

	function updateHeight() {
		if (!room || !topRef.current) return

		if (resetHeightTimeout.current) {
			clearTimeout(resetHeightTimeout.current)
			resetHeightTimeout.current = null
		}

		if (room.state === 'in-progress') {
			topRef.current.style.height = `${gameRef.current!.getBoundingClientRect().height}px`
		} else {
			topRef.current.style.height = `${waitingTextRef.current!.getBoundingClientRect().height}px`
		}
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
