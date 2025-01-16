import Button from '@/components/base/Button/Button'
import Popover from '@/components/base/Popover/Popover'
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
