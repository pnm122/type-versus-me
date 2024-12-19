import styles from './style.module.scss'

interface Props {
  backgroundColor: string
  foregroundColor: string
  icon?: React.ReactNode
  text: string
}

export default function Pill({
  backgroundColor,
  foregroundColor,
  icon,
  text
}: Props) {
  return (
    <div style={{ backgroundColor, color: foregroundColor }} className={styles['pill']}>
      {icon}
      {text}
    </div>
  )
}
