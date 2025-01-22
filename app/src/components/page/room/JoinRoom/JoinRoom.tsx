'use client'

import styles from './style.module.scss'
import Button from '@/components/base/Button/Button'
import ButtonIcon from '@/components/base/Button/ButtonIcon'
import PixelarticonsArrowRight from '~icons/pixelarticons/arrow-right'
import PixelarticonsArrowLeft from '~icons/pixelarticons/arrow-left'
import { usePathname } from 'next/navigation'
import { joinRoom } from '@/utils/room'
import React from 'react'
import { useNotification } from '@/context/Notification'
import { useSocket } from '@/context/Socket'
import { useGlobalState } from '@/context/GlobalState'
import TyperPreview from '@/components/shared/TyperPreview/TyperPreview'

export default function JoinRoom() {
	const notifs = useNotification()
	const socket = useSocket()
	const globalState = useGlobalState()
	const pathname = usePathname()
	const pathRoomId = pathname.split('/').at(-1)!

	function handleJoinRoom() {
		joinRoom(pathRoomId, { socket, notifs, globalState })
	}

	return (
		<main className={styles['page']}>
			<div className={styles['main']}>
				<div className={styles['main__inputs']}>
					<div className={styles['cursor-preview']}>
						<TyperPreview
							text="Your cursor will look like this."
							cursorColor={globalState.user?.color}
						/>
					</div>
				</div>
				<div className={styles['main__actions']}>
					<Button onClick={handleJoinRoom}>
						Join room
						<ButtonIcon icon={<PixelarticonsArrowRight />} />
					</Button>
					<Button href="/" style="tertiary">
						<ButtonIcon icon={<PixelarticonsArrowLeft />} />
						Go to homepage
					</Button>
				</div>
			</div>
		</main>
	)
}
