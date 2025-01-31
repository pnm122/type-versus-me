'use client'

import { Unlock } from '@/utils/unlocks'
import CursorPreview from '../CursorPreview/CursorPreview'
import styles from './style.module.scss'
import React, { useState } from 'react'
import { useAuthContext } from '@/context/Auth'
import { useNotification } from '@/context/Notification'
import { useRoom } from '@/context/Room'
import { useSocket } from '@/context/Socket'
import { CursorColor } from '$shared/types/Cursor'
import PixelarticonsCheck from '~icons/pixelarticons/check'
import setUserSettings from '@/utils/setUserSettings'
import Button from '@/components/base/Button/Button'

interface Props {
	unlocks: [key: string, value: Unlock | undefined][]
}

export default function NewUnlocksNotificationContent({ unlocks }: Props) {
	const auth = useAuthContext()
	const notifs = useNotification()
	const room = useRoom()
	const socket = useSocket()
	const [loading, setLoading] = useState<CursorColor | null>(null)

	async function submitTry(value?: CursorColor) {
		if (!value) return
		setLoading(value)
		await setUserSettings({ color: value }, { auth, notifs, room, socket })
		setLoading(null)
	}

	return (
		<div className={styles['unlocks']}>
			<div className={styles['unlocks__text']}>
				<h2 className={styles['heading']}>
					You unlocked {unlocks.length === 1 ? 'a new item' : 'new items'}!
				</h2>
				<p className={styles['text']}>
					Click to equip {unlocks.length === 1 ? 'your' : 'a'} new item.
				</p>
			</div>
			<div className={styles['unlocks__items']}>
				{unlocks.map((u, index) => {
					const isSelected = auth.user?.cursorColor === u[1]?.value
					const isLoading = loading === u[1]?.value

					return u[1]?.type === 'cursor-color' ? (
						<form
							key={index}
							className={styles['cursor']}
							style={
								{
									'--cursor-background': `var(--cursor-${u[1].value}-light)`,
									'--cursor-border': `var(--cursor-${u[1].value})`
								} as React.CSSProperties
							}
							action={() => {
								submitTry(u[1]?.value)
							}}
						>
							<Button
								type="submit"
								style="tertiary"
								className={styles['cursor__button']}
								loading={isLoading}
								disabled={isSelected}
							>
								{!isSelected && (
									<>
										<CursorPreview size="large" color={u[1].value} />
										<span className={styles['try']}>Try it!</span>
									</>
								)}
								{isSelected && (
									<span className={styles['selected']}>
										<PixelarticonsCheck className={styles['selected__check']} />
									</span>
								)}
							</Button>
						</form>
					) : (
						<></>
					)
				})}
			</div>
		</div>
	)
}
