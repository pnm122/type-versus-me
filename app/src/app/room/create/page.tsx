'use client'

import RoomSettingsForm from '@/components/shared/RoomSettingsForm/RoomSettingsForm'
import styles from './style.module.scss'
import { RoomSettings } from '$shared/types/Room'
import { useReducer } from 'react'
import { useRoom } from '@/context/Room'
import { useRouter } from 'next/navigation'

export default function CreateRoom() {
	type Settings = RoomSettings & { open: boolean; loading: boolean }
	type Action<T extends keyof Settings> = { key: T; value: Settings[T] }

	const [settings, settingsDispatch] = useReducer(settingsReducer, {
		category: 'top-100',
		numWords: 40,
		timeLimit: 120,
		open: false,
		loading: false
	})

	const { createRoom } = useRoom()
	const router = useRouter()

	function settingsReducer<T extends keyof Settings>(state: Settings, { key, value }: Action<T>) {
		return {
			...state,
			[key]: value
		}
	}

	async function onSubmit() {
		settingsDispatch({ key: 'loading', value: true })
		const res = await createRoom({
			category: settings.category,
			numWords: settings.numWords,
			timeLimit: settings.timeLimit
		})
		settingsDispatch({ key: 'loading', value: false })

		if (res.error) return

		router.push(`/room/${res.value.room.id}`)
	}

	return (
		<main className={styles['page']}>
			<RoomSettingsForm
				settings={{
					category: settings.category,
					numWords: settings.numWords,
					timeLimit: settings.timeLimit
				}}
				onChange={(key, value) => settingsDispatch({ key, value })}
				onSubmit={onSubmit}
				type="create-room"
				loading={settings.loading}
			/>
		</main>
	)
}
