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
import { isValidUsername } from '$shared/utils/validators'
import { useNotification } from '@/context/Notification'
import { errorNotification } from '@/utils/errorNotifications'
import { joinRoom } from '@/utils/realtime/room'
import { CursorColor } from '$shared/types/Cursor'
import useAuth from '@/hooks/useAuth'

export default function Home() {
	const [joinRoomCode, setJoinRoomCode] = useState('')
	const [joinRoomLoading, setJoinRoomLoading] = useState(false)

	const socket = useSocket()
	const router = useRouter()
	const notifs = useNotification()
	const { user } = useAuth()

	async function onJoinRoomSubmit(e: React.FormEvent) {
		e.preventDefault()
		if (socket.state !== 'valid' || !user) return
		if (!isValidUsername(user.username)) {
			return notifs.push(errorNotification('invalid-username'))
		}

		setJoinRoomLoading(true)
		const res = await joinRoom(joinRoomCode, user, { socket, notifs })
		setJoinRoomLoading(false)

		if (res.error) return

		router.push(`/room/${res.value.room.id}`)
	}

	return (
		<>
			<main className={styles['page']}>
				<form onSubmit={onJoinRoomSubmit} className={styles['main']}>
					<h1 className={styles['main__title']}>
						{socket.state === 'valid' ? (
							<TyperPreview
								text="taptaptap.live"
								cursorColor={user ? (user.cursorColor as CursorColor) : 'gray'}
							/>
						) : (
							'taptaptap.live'
						)}
					</h1>
					<div className={styles['main__group']}>
						<Button href="/room/create" disabled={socket.state !== 'valid'}>
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
								disabled={socket.state !== 'valid'}
								required
							/>
							<Button
								style="secondary"
								type="submit"
								disabled={socket.state !== 'valid'}
								loading={joinRoomLoading}
							>
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
