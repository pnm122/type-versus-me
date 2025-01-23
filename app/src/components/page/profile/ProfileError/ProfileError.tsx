'use client'

import { Prisma } from '@prisma/client'
import styles from './style.module.scss'
import TyperPreview from '@/components/shared/TyperPreview/TyperPreview'
import Button from '@/components/base/Button/Button'
import PixelarticonsReload from '~icons/pixelarticons/reload'
import ButtonIcon from '@/components/base/Button/ButtonIcon'

interface Props {
	error: Prisma.PrismaClientKnownRequestError | null
}

export default function ProfileError({ error }: Props) {
	return (
		<main className={styles['page']}>
			<TyperPreview cursorColor="red" text="Oops!" className={styles['page__heading']} />
			<p className={styles['page__text']}>There was an error loading your profile.</p>
			{error && <p className={styles['page__subtext']}>Error code: &#34;{error.code}&#34;</p>}
			<Button onClick={() => window.location.reload()} className={styles['page__refresh']}>
				<ButtonIcon icon={<PixelarticonsReload />} />
				Refresh
			</Button>
		</main>
	)
}
