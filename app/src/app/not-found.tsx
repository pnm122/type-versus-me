'use client'

import TyperPreview from '@/components/TyperPreview/TyperPreview'
import styles from './error.module.scss'
import Button from '@/components/Button/Button'
import PixelarticonsHome from '~icons/pixelarticons/home'
import ButtonIcon from '@/components/Button/ButtonIcon'

export const dynamic = 'force-static'

export default function Custom404() {
	return (
		<main className={styles['page']}>
			<div className={styles['main']}>
				<h1 className={styles['main__title']}>404</h1>
				<h2 className={styles['main__subtitle']}>
					<TyperPreview text="We couldn't find this page :(" cursorColor="red" />
				</h2>
				<Button href="/">
					<ButtonIcon icon={<PixelarticonsHome />} />
					Take me back
				</Button>
			</div>
		</main>
	)
}
