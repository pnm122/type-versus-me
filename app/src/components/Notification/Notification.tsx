import createClasses from '@/utils/createClasses'
import styles from './style.module.scss'
import PixelarticonsNotification from '~icons/pixelarticons/notification'
import PixelarticonsClose from '~icons/pixelarticons/close'
import IconButton from '../Button/IconButton'
import { useEffect } from 'react'

type Props = React.PropsWithChildren<{
  onClose: () => void
  closeDelay?: number
  style?: 'default' | 'error'
}>

export default function Notification({
  onClose,
  closeDelay,
  style = 'default',
  children
}: Props) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      if(closeDelay) {
        onClose()
      }
    }, closeDelay ?? 0)

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  return (
    <div className={createClasses({
      [styles['notification']]: true,
      [styles[`notification--${style}`]]: true
    })}>
      <div className={styles['notification__icon']}>
        <PixelarticonsNotification />
      </div>
      <div className={styles['notification__content']}>
        {children}
      </div>
      <IconButton
        icon={<PixelarticonsClose />}
        style='tertiary'
        onClick={onClose}
        className={styles['notification__close']}
      />
    </div>
  )
}
