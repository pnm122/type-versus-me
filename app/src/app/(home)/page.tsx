'use client'

import styles from './style.module.scss'
import TyperPreview from '@/components/shared/TyperPreview/TyperPreview'
import Input from '@/components/base/Input/Input'

import PixelarticonsPlus from '~icons/pixelarticons/plus'
import PixelarticonsArrowRight from '~icons/pixelarticons/arrow-right'
import Button from '@/components/base/Button/Button'
import ButtonIcon from '@/components/base/Button/ButtonIcon'
import { useState } from 'react'
import { useSocket } from '@/context/Socket'
import { useRouter } from 'next/navigation'
import { CursorColor } from '$shared/types/Cursor'
import HomeRoomSettingsPopover from '@/components/page/home/HomeRoomSettingsPopover/HomeRoomSettingsPopover'
import { useAuthContext } from '@/context/Auth'
import { useRoom } from '@/context/Room'

export default function Home() {
	const [joinRoomCode, setJoinRoomCode] = useState('')
	const [joinRoomLoading, setJoinRoomLoading] = useState(false)
	const [settingsOpen, setSettingsOpen] = useState(false)

	const socket = useSocket()
	const router = useRouter()
	const { user, state: authState } = useAuthContext()
	const { joinRoom } = useRoom()

	async function onJoinRoomSubmit(e: React.FormEvent) {
		e.preventDefault()
		if (socket.state !== 'valid') return

		setJoinRoomLoading(true)
		const res = await joinRoom(joinRoomCode)
		setJoinRoomLoading(false)

		if (res.error) return

		router.push(`/room/${res.value.room.id}`)
	}

	const loading = socket.state !== 'valid' || authState !== 'ready'

	return (
		<>
			<main className={styles['page']}>
				<form onSubmit={onJoinRoomSubmit} className={styles['main']}>
					<h1 className={styles['main__title']}>
						{loading ? (
							'taptaptap.live'
						) : (
							<TyperPreview
								text="taptaptap.live"
								cursorColor={user ? (user.cursorColor as CursorColor) : 'gray'}
							/>
						)}
					</h1>
					<div className={styles['main__group']}>
						<Button onClick={() => setSettingsOpen(true)} disabled={socket.state !== 'valid'}>
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
								disabled={loading}
								required
							/>
							<Button style="secondary" type="submit" disabled={loading} loading={joinRoomLoading}>
								Join
								<ButtonIcon icon={<PixelarticonsArrowRight />} />
							</Button>
						</div>
					</div>
				</form>
			</main>
			<HomeRoomSettingsPopover open={settingsOpen} onClose={() => setSettingsOpen(false)} />
		</>
	)
}
