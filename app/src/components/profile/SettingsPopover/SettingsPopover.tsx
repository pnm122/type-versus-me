import Button from '@/components/Button/Button'
import Popover from '@/components/Popover/Popover'
import React from 'react'

interface Props {
	open: boolean
	onClose: () => void
}

export default function SettingsPopover({ open, onClose }: Props) {
	return (
		<Popover open={open}>
			<Button onClick={onClose}>Close</Button>
		</Popover>
	)
}
