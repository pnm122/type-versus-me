import { CursorColor } from '$shared/types/Cursor'
import createClasses from '@/utils/createClasses'
import styles from './style.module.scss'

interface Props {
  color: CursorColor
  size?: 'small' | 'medium' | 'large'
}

export default function CursorPreview({
  color,
  size = 'medium'
}: Props) {
  return (
    <div
      className={createClasses({
        [styles['cursor']]: true,
        [styles[`cursor--${size}`]]: true
      })}
      style={{ backgroundColor: `var(--cursor-${color})` }}
    />
  )
}
