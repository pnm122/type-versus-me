import Link from 'next/link'
import styles from './style.module.scss'
import createClasses from '@/utils/createClasses'
import Loader from '@/components/base/Loader/Loader'

export type ButtonProps = React.PropsWithChildren<
	{
		style?: 'primary' | 'secondary' | 'tertiary'
		/** Link to use if the button is intended for use as a link */
		href?: string
		loading?: boolean
		ref?: React.RefObject<HTMLElement | null>
	} & React.ButtonHTMLAttributes<HTMLButtonElement | HTMLAnchorElement>
>

export default function Button({
	style = 'primary',
	disabled,
	type = 'button',
	href,
	onClick = () => {},
	className,
	loading,
	children,
	ref,
	...props
}: ButtonProps) {
	// Link is not easily disabled, just use an HTML button if disabled
	return href && !disabled ? (
		<Link
			ref={ref as React.RefObject<HTMLAnchorElement>}
			className={createClasses({
				[styles['button']]: true,
				[styles[`button--${style}`]]: true,
				...(className ? { [className]: true } : {})
			})}
			href={href}
			onClick={(e) => !disabled && onClick(e)}
			{...props}
		>
			<div className={styles['button__content']}>{children}</div>
			<Loader className={styles['button__loader']} size={16} />
		</Link>
	) : (
		<button
			ref={ref as React.RefObject<HTMLButtonElement>}
			className={createClasses({
				[styles['button']]: true,
				[styles[`button--${style}`]]: true,
				[styles['button--loading']]: !!loading,
				...(className ? { [className]: true } : {})
			})}
			disabled={disabled || loading}
			type={type}
			aria-description={loading ? 'loading' : ''}
			onClick={onClick}
			{...props}
		>
			<div className={styles['button__content']}>{children}</div>
			<Loader className={styles['button__loader']} size={16} />
		</button>
	)
}
