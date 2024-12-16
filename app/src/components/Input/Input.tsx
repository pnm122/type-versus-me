import createClasses from '@/utils/createClasses'
import styles from './style.module.scss'
import PixelarticonsClose from '~icons/pixelarticons/close'

interface Props {
  id: string
  text: string
  placeholder?: string
  onChange: React.InputHTMLAttributes<HTMLInputElement>['onChange']
  label?: string
  error?: string
  required?: boolean
  disabled?: boolean
  wrapperClassName?: string
  inputClassName?: string
}

export default function Input({
  id,
  text,
  placeholder,
  onChange,
  label,
  error,
  required,
  disabled,
  wrapperClassName,
  inputClassName
}: Props) {
  return (
    <div className={createClasses({
      [styles['input']]: true,
      [styles['input--error']]: !!error,
      ...(wrapperClassName ? { [wrapperClassName]: true } : {})
    })}>
      {label && (
        <label
          htmlFor={id}
          className={styles['input__label']}>
          {label}
          {required && <span className={styles['input__required-star']}>*</span>}
        </label>
      )}
      <input
        id={id}
        required={required}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}--error` : undefined}
        className={createClasses({
          [styles['input__input']]: true,
          ...(inputClassName ? { [inputClassName]: true } : {})
        })}
        value={text}
        placeholder={placeholder}
        onChange={onChange}
        size={1}
      />
      {error && (
        <span id={`${id}--error`} className={styles['input__error']}>
          <PixelarticonsClose />
          {error}
        </span>
      )}
    </div>
  )
}
