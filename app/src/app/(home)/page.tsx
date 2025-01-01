'use client'

import styles from './style.module.scss'
import TyperPreview from '@/components/TyperPreview/TyperPreview'
import Input from '@/components/Input/Input'

import PixelarticonsPlus from '~icons/pixelarticons/plus'
import PixelarticonsArrowRight from '~icons/pixelarticons/arrow-right'
import Button from '@/components/Button/Button'
import ButtonIcon from '@/components/Button/ButtonIcon'
import { useReducer, useState } from 'react'
import { useSocket } from '@/context/Socket'
import { useRouter } from 'next/navigation'
import { isValidUsername } from '$shared/utils/validators'
import { useNotification } from '@/context/Notification'
import { errorNotification } from '@/utils/errorNotifications'
import { useGlobalState } from '@/context/GlobalState'
import { createRoom, joinRoom } from '@/utils/room'
import UsernameAndColorInput from '@/components/UsernameAndColorInput/UsernameAndColorInput'
import RoomSettingsPopover from '@/components/RoomSettingsPopover/RoomSettingsPopover'
import { RoomSettings } from '$shared/types/Room'

export default function Home() {
	type Settings = RoomSettings & { open: boolean }
	type Action<T extends keyof Settings> = { key: T; value: Settings[T] }

	const [joinRoomCode, setJoinRoomCode] = useState('')
	const [createRoomLoading, setCreateRoomLoading] = useState(false)
	const [joinRoomLoading, setJoinRoomLoading] = useState(false)
	const [settings, settingsDispatch] = useReducer(settingsReducer, {
		category: 'top-100',
		numWords: 40,
		timeLimit: 120,
		open: false
	})
	const globalState = useGlobalState()
	const socket = useSocket()
	const router = useRouter()
	const notifs = useNotification()

	const { user } = globalState

	function settingsReducer<T extends keyof Settings>(state: Settings, { key, value }: Action<T>) {
		return {
			...state,
			[key]: value
		}
	}

	async function onCreateRoomClicked() {
		if (socket.state !== 'valid' || !user) return
		if (!isValidUsername(user.username)) {
			return notifs.push(errorNotification('invalid-username'))
		}

		settingsDispatch({ key: 'open', value: true })
	}

	async function onJoinRoomSubmit(e: React.FormEvent) {
		e.preventDefault()
		if (socket.state !== 'valid' || !user) return
		if (!isValidUsername(user.username)) {
			return notifs.push(errorNotification('invalid-username'))
		}

		setJoinRoomLoading(true)
		const res = await joinRoom(joinRoomCode, { socket, notifs, globalState })
		setJoinRoomLoading(false)

		if (res.error) return

		router.push(`/room/${res.value.room.id}`)
	}

	async function onSubmitCreateRoomSettings() {
		setCreateRoomLoading(true)
		const res = await createRoom(
			{ category: settings.category, numWords: settings.numWords, timeLimit: settings.timeLimit },
			{ socket, notifs, globalState }
		)
		setCreateRoomLoading(false)

		if (res.error) return

		router.push(`/room/${res.value.room.id}`)
	}

	return (
		<>
			<RoomSettingsPopover
				open={settings.open}
				settings={{
					category: settings.category,
					numWords: settings.numWords,
					timeLimit: settings.timeLimit
				}}
				onClose={() => settingsDispatch({ key: 'open', value: false })}
				onChange={(key, value) => settingsDispatch({ key, value })}
				onSubmit={onSubmitCreateRoomSettings}
				type="create-room"
			/>
			<main className={styles['page']}>
				<form onSubmit={onJoinRoomSubmit} className={styles['main']}>
					<h1 className={styles['main__title']}>
						{user ? (
							<TyperPreview text="taptaptap.live" cursorColor={user.color} />
						) : (
							'taptaptap.live'
						)}
					</h1>
					<UsernameAndColorInput />
					<div className={styles['main__group']}>
						<Button onClick={onCreateRoomClicked} loading={createRoomLoading} disabled={!user}>
							<ButtonIcon icon={<PixelarticonsPlus />} />
							Create a room
						</Button>
						<div className={styles['join']}>
							<Input
								id="join"
								text={joinRoomCode}
								onChange={(e) => setJoinRoomCode(e.target.value.toUpperCase())}
								placeholder="Room code (i.e. ABCDE)"
								wrapperClassName={styles['join__input']}
								minLength={5}
								maxLength={5}
								disabled={!user}
								required
							/>
							<Button style="secondary" type="submit" disabled={!user} loading={joinRoomLoading}>
								Join
								<ButtonIcon icon={<PixelarticonsArrowRight />} />
							</Button>
						</div>
					</div>
				</form>
			</main>
		</>
	)
}
