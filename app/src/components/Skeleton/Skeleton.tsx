import styles from './style.module.scss'

interface Props {
  width?: string
  height?: string
}

export default function Skeleton({
  width = '100%',
  height = '2em'
}: Props) {
  return (
    <div
      className={styles['skeleton']}
      style={{ width, height }}
    />
  )
}
