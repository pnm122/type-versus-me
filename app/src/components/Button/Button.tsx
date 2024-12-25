import Link from 'next/link'
import styles from './style.module.scss'
import createClasses from '@/utils/createClasses'
import Loader from '../Loader/Loader'

export type ButtonProps = React.PropsWithChildren<{
	style?: 'primary' | 'secondary' | 'tertiary'
	disabled?: boolean
	type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type']
	/** Link to use if the button is intended for use as a link */
	href?: string
	/** Callback for when the button is clicked */
	onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>
	className?: string
	ariaLabel?: string
	loading?: boolean
}>

export default function Button({
	style = 'primary',
	disabled,
	type = 'button',
	href,
	onClick = () => {},
	className,
	ariaLabel,
	loading,
	children
}: ButtonProps) {
	// Link is not easily disabled, just use an HTML button if disabled
	return href && !disabled ? (
		<Link
			className={createClasses({
				[styles['button']]: true,
				[styles[`button--${style}`]]: true,
				...(className ? { [className]: true } : {})
			})}
			href={href}
			aria-label={ariaLabel}
			onClick={(e) => !disabled && onClick(e)}
		>
			<div className={styles['button__content']}>{children}</div>
			<Loader className={styles['button__loader']} size={16} />
		</Link>
	) : (
		<button
			className={createClasses({
				[styles['button']]: true,
				[styles[`button--${style}`]]: true,
				[styles['button--loading']]: !!loading,
				...(className ? { [className]: true } : {})
			})}
			disabled={disabled || loading}
			type={type}
			aria-label={`${ariaLabel ?? ''}${loading ? ' loading' : ''}`}
			onClick={onClick}
		>
			<div className={styles['button__content']}>{children}</div>
			<Loader className={styles['button__loader']} size={16} />
		</button>
	)
}
