import createClasses from '@/utils/createClasses'
import styles from './style.module.scss'
import PixelarticonsClose from '~icons/pixelarticons/close'

type Props = {
	id: string
	text: string
	label?: string
	error?: string
	required?: boolean
	disabled?: boolean
	wrapperClassName?: string
	inputClassName?: string
	units?: string
	ref?: React.RefObject<HTMLInputElement>
} & Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	'value' | 'size' | 'required' | 'disabled' | 'id' | 'className'
>

export default function Input({
	id,
	text,
	label,
	error,
	required,
	disabled,
	wrapperClassName,
	inputClassName,
	units,
	ref,
	...inputAttributes
}: Props) {
	return (
		<div
			className={createClasses({
				[styles['input']]: true,
				[styles['input--error']]: !!error,
				...(wrapperClassName ? { [wrapperClassName]: true } : {})
			})}
		>
			{label && (
				<label htmlFor={id} className={styles['input__label']}>
					{label}
					{required && <span className={styles['input__required-star']}>*</span>}
				</label>
			)}
			<div className={styles['main-control']}>
				<input
					id={id}
					required={required}
					disabled={disabled}
					aria-invalid={!!error}
					aria-describedby={error ? `${id}--error` : undefined}
					className={createClasses({
						[styles['main-control__input']]: true,
						...(inputClassName ? { [inputClassName]: true } : {})
					})}
					value={text}
					size={1}
					ref={ref}
					{...inputAttributes}
				/>
				{units && <span className={styles['main-control__units']}>{units}</span>}
			</div>
			{error && (
				<span id={`${id}--error`} className={styles['input__error']}>
					<PixelarticonsClose />
					{error}
				</span>
			)}
		</div>
	)
}
