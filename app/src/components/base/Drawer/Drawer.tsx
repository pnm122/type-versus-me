import React, { PropsWithChildren } from 'react'
import Popover from '../Popover/Popover'
import styles from './style.module.scss'
import Collapsible from '../Collapsible/Collapsible'

type Props = PropsWithChildren<{
	open: boolean
	onClose(): void
}>

export default function Drawer({ open, onClose, children }: Props) {
	return (
		<Popover open={open} className={styles['drawer']} onBackdropClicked={onClose} clearStyles>
			<Collapsible openDirection="up" open={open}>
				<div className={styles['drawer__content']}>{children}</div>
			</Collapsible>
		</Popover>
	)
}
