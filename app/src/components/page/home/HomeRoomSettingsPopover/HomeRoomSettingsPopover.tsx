'use client'

import { RoomSettings } from '$shared/types/Room'
import { useRoom } from '@/context/Room'
import { useReducer, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import RoomSettingsForm from '@/components/shared/RoomSettingsForm/RoomSettingsForm'
import Popover from '@/components/base/Popover/Popover'

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
	const firstFocusableElement = useRef<HTMLButtonElement>(null)

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
		<Popover open={open} focusOnOpenRef={firstFocusableElement} onBackdropClicked={() => onClose()}>
			<RoomSettingsForm
				settings={{
					category: settings.category,
					numWords: settings.numWords,
					timeLimit: settings.timeLimit
				}}
				onChange={(key, value) => settingsDispatch({ key, value })}
				onCancel={onClose}
				onSubmit={onSubmitRoomSettings}
				firstFocusableElement={firstFocusableElement}
				type="create-room"
				loading={loading}
			/>
		</Popover>
	)
}
