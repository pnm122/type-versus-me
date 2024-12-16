import Link from "next/link"
import styles from './style.module.scss'
import createClasses from "@/utils/createClasses"

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
}>

export default function Button({
  style = 'primary',
  disabled,
  type = 'button',
  href,
  onClick = () => {},
  className,
  ariaLabel,
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
      onClick={e => !disabled && onClick(e)}>
      {children}
    </Link>
  ) : (
    <button
      className={createClasses({
        [styles['button']]: true,
        [styles[`button--${style}`]]: true,
        ...(className ? { [className]: true } : {})
      })}
      disabled={disabled}
      type={type}
      aria-label={ariaLabel}
      onClick={onClick}>
      {children}
    </button>
  )
}
