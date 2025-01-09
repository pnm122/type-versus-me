'use client'

import { useGlobalState } from '@/context/GlobalState'
import Pill from '../Pill/Pill'
import styles from './style.module.scss'

export default function ActiveUserCount() {
	const { activeUserCount } = useGlobalState()

	return (
		<Pill
			text={`${activeUserCount} online`}
			backgroundColor="var(--positive-light)"
			foregroundColor="var(--positive)"
			icon={<div className={styles['dot']} />}
		/>
	)
}
