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

export default function Account() {
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
			<div className={styles['account']}>
				{session && user ? (
					<Button
						className={styles['account__user']}
						style="tertiary"
						onClick={toggleExpanded}
						ref={toggleButton}
					>
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
					</Button>
				) : (
					<IconButton
						style="tertiary"
						icon={<PixelarticonsUser />}
						aria-label="Open profile"
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
					className={styles['account__dropdown']}
				>
					<div className={styles['links']}>
						{session && user ? (
							<>
								<Button
									ref={firstButton}
									style="tertiary"
									href={`/profile/${user.id}`}
									className={styles['links__link']}
								>
									<ButtonIcon icon={<PixelarticonsUser />} />
									Profile
								</Button>
								<Button
									style="tertiary"
									className={styles['links__link']}
									onClick={() => setSettingsOpen(true)}
								>
									<ButtonIcon icon={<PixelarticonsEdit />} />
									Settings
								</Button>
								<Button
									style="tertiary"
									onClick={() => signOut()}
									className={styles['links__link']}
								>
									<ButtonIcon icon={<PixelarticonsLogout />} />
									Logout
								</Button>
							</>
						) : (
							<Button ref={firstButton} href="/login">
								<ButtonIcon icon={<PixelarticonsLogin />} />
								Login
							</Button>
						)}
					</div>
					<hr></hr>
					<ThemeSwitcher />
				</Dropdown>
			</div>
			{session && user && (
				<UserSettingsPopover
					open={settingsOpen}
					onClose={() => setSettingsOpen(false)}
					user={user}
				/>
			)}
		</>
	)
}
