import Pill from '@/components/base/Pill/Pill'
import createClasses from '@/utils/createClasses'
import React from 'react'
import PixelarticonsTrophy from '~icons/pixelarticons/trophy'
import styles from './style.module.scss'

export default function Placement({ placement }: { placement: number }) {
	const displayText =
		placement === 1 ? '1st' : placement === 2 ? '2nd' : placement === 3 ? '3rd' : `${placement}th`

	return (
		<Pill
			size="large"
			className={createClasses({
				[styles['placement']]: true,
				[styles['placement--podium']]: placement >= 1 && placement <= 3,
				[styles['placement--first']]: placement === 1,
				[styles['placement--second']]: placement === 2,
				[styles['placement--third']]: placement === 3
			})}
			text={displayText}
			icon={placement === 1 && <PixelarticonsTrophy />}
			lowercase
		/>
	)
}
