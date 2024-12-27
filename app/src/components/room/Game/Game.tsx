'use client'

import Typer, { TyperRef } from '@/components/Typer/Typer'
import styles from './style.module.scss'
import { RefObject, useEffect, useRef, useState } from 'react'
import { useGlobalState } from '@/context/GlobalState'
import { useNotification } from '@/context/Notification'
import { useSocket } from '@/context/Socket'
import { Cursor } from '@/types/Cursor'
import { updateUser } from '@/utils/user'
import createClasses from '@/utils/createClasses'
import useInterval from '@/hooks/useInterval'
import { getInitialStats } from '@/utils/typer'
import { TyperStats } from '@/types/Typer'

export default function Game({ ref }: { ref?: RefObject<HTMLDivElement> }) {
	const GAME_TIME = 120

	const [startTime, setStartTime] = useState(-1)
	const [finished, setFinished] = useState(false)
	const [stats, setStats] = useState<TyperStats>(getInitialStats())
	const [timeToStart, setTimeToStart] = useState(-1)
	const [timeLeft, setTimeLeft] = useState(-1)
	const globalState = useGlobalState()
	const socket = useSocket()
	const notifs = useNotification()
	const typer = useRef<TyperRef>(null)
	const { room, user } = globalState

	useInterval(
		nextTimeLeft,
		room?.state === 'in-progress' && timeToStart === 0 && timeLeft > 0 ? 1000 : null
	)

	useInterval(nextTimeToStart, timeToStart > 0 ? 1000 : null)

	useEffect(() => {
		if (timeToStart === 0) {
			typer.current?.focus()
			setStartTime(Date.now())
		}
	}, [timeToStart])

	useEffect(() => {
		if (timeLeft === 0 && !finished) {
			setFinished(true)
			updateUser('state', 'failed', { globalState, notifs, socket })
		}
	}, [timeLeft])

	useEffect(() => {
		if (room?.state === 'in-progress') {
			setFinished(false)
			setStats(getInitialStats())
			setTimeToStart(5)
			setTimeLeft(GAME_TIME)
		}
	}, [room?.state])

	function nextTimeToStart() {
		setTimeToStart((t) => t - 1)
	}

	function nextTimeLeft() {
		setTimeLeft((t) => t - 1)
	}

	if (!room || !room.test) return <></>

	const otherCursors: Cursor[] = room.users
		.filter((u) => u.id !== user!.id)
		.map((u) => ({
			id: u.id,
			color: u.color,
			position: u.score?.cursorPosition ?? { word: 0, letter: 0 }
		}))

	function onTyperChange(stats: TyperStats) {
		updateUser(
			'score',
			{ cursorPosition: stats.cursorPosition, netWPM: stats.netWPM },
			{ globalState, socket, notifs }
		)
		setStats(stats)
	}

	function onTyperFinish() {
		setFinished(true)
		updateUser('state', 'complete', { globalState, socket, notifs })
	}

	return (
		<div className={styles['game']} ref={ref}>
			<h1
				className={createClasses({
					[styles['start-overlay']]: true,
					[styles['start-overlay--visible']]: timeToStart > 0
				})}
			>
				Game starting in {timeToStart}...
			</h1>
			<Typer
				text={room.test}
				disabled={finished || timeToStart > 0}
				startTime={startTime}
				onChange={onTyperChange}
				cursors={otherCursors}
				onFinish={onTyperFinish}
				ref={typer}
			/>
			<div className={styles['game__info']}>
				<div className={styles['stats']}>
					<p className={styles['stats__wpm']}>{Math.round(user?.score?.netWPM ?? 0)}wpm</p>
					<p
						className={createClasses({
							[styles['stats__typed']]: true,
							[styles['stats__typed--error']]: stats.errorsLeft > 0
						})}
					>
						{stats.correctMade}/{room.test.length}
					</p>
					{stats.errorsLeft > 0 && (
						<p className={styles['stats__errors-left']}>
							{stats.errorsLeft} mistake{stats.errorsLeft > 1 ? 's' : ''}
						</p>
					)}
				</div>
				<p
					className={createClasses({
						[styles['time-left']]: true,
						[styles['time-left--low']]: timeLeft <= 10
					})}
				>
					{Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? '0' : ''}
					{timeLeft % 60}
				</p>
			</div>
		</div>
	)
}
