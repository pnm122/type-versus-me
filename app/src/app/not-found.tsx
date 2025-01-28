'use client'

import TyperPreview from '@/components/shared/TyperPreview/TyperPreview'
import styles from './error.module.scss'
import Button from '@/components/base/Button/Button'
import PixelarticonsHome from '~icons/pixelarticons/home'
import ButtonIcon from '@/components/base/Button/ButtonIcon'

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
					Go back home
				</Button>
			</div>
		</main>
	)
}
