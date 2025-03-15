'use client'

import styles from './style.module.scss'
import Button from '@/components/base/Button/Button'
import IconButton from '@/components/base/Button/IconButton'
import { useEffect, useRef, useState } from 'react'
import PixelarticonsUser from '~icons/pixelarticons/user'
import ThemeSwitcher from '@/components/shared/ThemeSwitcher/ThemeSwitcher'
import Dropdown from '@/components/base/Dropdown/Dropdown'
import PixelarticonsLogout from '~icons/pixelarticons/logout'
import PixelarticonsLogin from '~icons/pixelarticons/login'
import { usePathname } from 'next/navigation'
import ButtonIcon from '@/components/base/Button/ButtonIcon'
import UserAndCursor from '../UserAndCursor/UserAndCursor'
import { CursorColor } from '$shared/types/Cursor'
import { useAuthContext } from '@/context/Auth'
import Skeleton from '@/components/base/Skeleton/Skeleton'
import UserSettingsPopover from '../UserSettingsPopover/UserSettingsPopover'
import PixelarticonsEdit from '~icons/pixelarticons/edit'
import LevelIndicator from '../LevelIndicator/LevelIndicator'
import { getLevel } from '@/utils/level'
import PixelarticonsMenu from '~icons/pixelarticons/menu'
import PixelarticonsTrophy from '~icons/pixelarticons/trophy'

export default function HeaderDropdown() {
	const path = usePathname()
	const [expanded, setExpanded] = useState(false)
	const [settingsOpen, setSettingsOpen] = useState(false)
	const firstButton = useRef<HTMLButtonElement>(null)
	const toggleButton = useRef<HTMLElement>(null)
	const { session, user, state, signOut } = useAuthContext()

	useEffect(() => {
		setExpanded(false)
	}, [path])

	function toggleExpanded() {
		setExpanded(!expanded)
	}

	return state === 'loading' ? (
		<Skeleton width="100px" height="1.5rem" />
	) : (
		<>
			<div className={styles['dropdown']}>
				{session && user ? (
					<Button
						className={styles['dropdown__toggle']}
						style="tertiary"
						onClick={toggleExpanded}
						ref={toggleButton}
					>
						<div className={styles['desktop']}>
							<UserAndCursor
								size="small"
								username={user.username}
								color={user.cursorColor as CursorColor}
							/>
							<LevelIndicator
								level={getLevel(user.points)}
								size="small"
								hideOutline
								unlocked
								hideItem
							/>
						</div>
						<div className={styles['mobile']}>
							<PixelarticonsMenu className={styles['toggle-icon']} />
						</div>
					</Button>
				) : (
					<IconButton
						style="tertiary"
						icon={<PixelarticonsUser />}
						aria-label="Open menu"
						aria-expanded={expanded}
						aria-controls="account-dropdown"
						onClick={toggleExpanded}
						ref={toggleButton}
					/>
				)}
				<Dropdown
					open={expanded}
					id="account-dropdown"
					toggleButton={toggleButton}
					focusOnOpenRef={firstButton}
					onClose={() => setExpanded(false)}
					className={styles['dropdown__dropdown']}
				>
					{session && user && (
						<div className={styles['mobile']}>
							<div className={styles['user-info']}>
								<UserAndCursor
									size="small"
									username={user.username}
									color={user.cursorColor as CursorColor}
								/>
								<LevelIndicator
									level={getLevel(user.points)}
									size="small"
									hideOutline
									unlocked
									hideItem
								/>
							</div>
							<hr></hr>
						</div>
					)}
					<ul className={styles['links']}>
						<div className={styles['mobile']}>
							<li className={styles['links__link']}>
								<Button
									ref={firstButton}
									style="tertiary"
									href="/leaderboard"
									aria-current={path.startsWith('/leaderboard') ? 'page' : undefined}
									className={styles['button']}
								>
									<ButtonIcon icon={<PixelarticonsTrophy />} />
									Leaderboard
								</Button>
							</li>
						</div>
						{session && user && (
							<>
								<li className={styles['links__link']}>
									<Button
										style="tertiary"
										href={`/profile/${user.id}`}
										aria-current={path.startsWith(`/profile/${user.id}`) ? 'page' : undefined}
										className={styles['button']}
									>
										<ButtonIcon icon={<PixelarticonsUser />} />
										Profile
									</Button>
								</li>
								<li className={styles['links__link']}>
									<Button
										style="tertiary"
										className={styles['button']}
										onClick={() => setSettingsOpen(true)}
									>
										<ButtonIcon icon={<PixelarticonsEdit />} />
										Settings
									</Button>
								</li>
								<li className={styles['links__link']}>
									<Button style="tertiary" onClick={() => signOut()} className={styles['button']}>
										<ButtonIcon icon={<PixelarticonsLogout />} />
										Logout
									</Button>
								</li>
							</>
						)}
					</ul>
					{!(session && user) && (
						<>
							<hr></hr>
							<Button ref={firstButton} href="/login">
								<ButtonIcon icon={<PixelarticonsLogin />} />
								Login
							</Button>
						</>
					)}

					<hr></hr>
					<ThemeSwitcher />
				</Dropdown>
			</div>
			{session && user && (
				<UserSettingsPopover open={settingsOpen} onClose={() => setSettingsOpen(false)} />
			)}
		</>
	)
}
