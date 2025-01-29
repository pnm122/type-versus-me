'use client'

import { RoomSettings } from '$shared/types/Room'
import { useRoom } from '@/context/Room'
import { useReducer, useState } from 'react'
import RoomSettingsPopover from '@/components/page/room/RoomSettingsPopover/RoomSettingsPopover'
import { useRouter } from 'next/navigation'

interface Props {
	open: boolean
	onClose(): void
}

export default function HomeRoomSettingsPopover({ open, onClose }: Props) {
	type Action<T extends keyof RoomSettings> = { key: T; value: RoomSettings[T] }

	const [loading, setLoading] = useState(false)
	const [settings, settingsDispatch] = useReducer(settingsReducer, {
		category: 'top-100',
		numWords: 40,
		timeLimit: 120
	})
	const router = useRouter()
	const { createRoom } = useRoom()

	function settingsReducer<T extends keyof RoomSettings>(
		state: RoomSettings,
		{ key, value }: Action<T>
	) {
		return {
			...state,
			[key]: value
		}
	}

	async function onSubmitRoomSettings() {
		setLoading(true)
		const res = await createRoom({
			category: settings.category,
			numWords: settings.numWords,
			timeLimit: settings.timeLimit
		})
		setLoading(false)

		if (res.error) return

		router.push(`/room/${res.value.room.id}`)
	}

	return (
		<RoomSettingsPopover
			open={open}
			settings={{
				category: settings.category,
				numWords: settings.numWords,
				timeLimit: settings.timeLimit
			}}
			onClose={onClose}
			onChange={(key, value) => settingsDispatch({ key, value })}
			onSubmit={onSubmitRoomSettings}
			loading={loading}
		/>
	)
}
