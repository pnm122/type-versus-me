import createClasses from '@/utils/createClasses'
import Button, { ButtonProps } from './Button'
import ButtonIcon from './ButtonIcon'
import styles from './style.module.scss'

type Props = Omit<ButtonProps, 'children'> &
	Required<Pick<ButtonProps, 'ariaLabel'>> & { icon: React.ReactNode }

export default function IconButton(props: Props) {
	const { className, icon, ...buttonProps } = props

	return (
		<Button
			{...buttonProps}
			className={createClasses({
				...(className ? { [className]: true } : {}),
				[styles['button--icon-button']]: true
			})}
		>
			<ButtonIcon icon={icon} />
		</Button>
	)
}
