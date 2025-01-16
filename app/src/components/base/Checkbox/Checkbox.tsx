import { PropsWithChildren } from 'react'
import styles from './style.module.scss'
import PixelarticonsCheck from '~icons/pixelarticons/check'
import createClasses from '@/utils/createClasses'

type Props = PropsWithChildren<{
	checked: boolean
	onChange?: (value: boolean) => void
	disabled?: boolean
	className?: string
}>

export default function Checkbox({
	checked,
	onChange = () => {},
	disabled,
	className,
	children
}: Props) {
	return (
		<button
			className={createClasses({
				[styles['checkbox']]: true,
				...(className ? { [className]: true } : {})
			})}
			role="checkbox"
			aria-checked={checked}
			disabled={disabled}
			onClick={() => !disabled && onChange(!checked)}
		>
			<div className={styles['checkbox__box']}>
				<PixelarticonsCheck className={styles['check']} />
			</div>
			{children}
		</button>
	)
}
