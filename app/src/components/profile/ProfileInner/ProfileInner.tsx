'use client'

import { User } from '@prisma/client'
import styles from './style.module.scss'
import CursorPreview from '@/components/CursorPreview/CursorPreview'
import IconButton from '@/components/Button/IconButton'
import PixelarticonsEdit from '~icons/pixelarticons/edit'
import SettingsPopover from '../SettingsPopover/SettingsPopover'
import { useState } from 'react'
import { ProfileContext, useProfile } from '@/context/Profile'
import LevelAndPoints from '../LevelAndPoints/LevelAndPoints'
import Stats from '../Stats/Stats'

export default function ProfileInner({ user }: { user: User }) {
	// Can't put context in a server component so it has to go here :(
	return (
		<ProfileContext.Provider value={{ user }}>
			<Profile />
		</ProfileContext.Provider>
	)
}

function Profile() {
	const [settingsOpen, setSettingsOpen] = useState(false)
	const { user } = useProfile()

	return (
		<>
			<main className={styles['page']}>
				<section className={styles['page__top']}>
					<div className={styles['user']}>
						<div className={styles['user__preview-and-edit']}>
							<div className={styles['preview']}>
								{/* TODO: Get from user object */}
								<CursorPreview size="medium" color={'red'} />
								<h1 className={styles['preview__username']}>{user.username}</h1>
							</div>
							<IconButton
								style="tertiary"
								icon={<PixelarticonsEdit />}
								aria-label="Edit username and color"
								className={styles['edit']}
								onClick={() => setSettingsOpen(true)}
							/>
						</div>
						<LevelAndPoints />
					</div>
					<Stats />
				</section>
				<section className={styles['races']}></section>
			</main>
			<SettingsPopover open={settingsOpen} onClose={() => setSettingsOpen(false)} />
		</>
	)
}
