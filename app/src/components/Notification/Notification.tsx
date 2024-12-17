import createClasses from '@/utils/createClasses'
import styles from './style.module.scss'
import PixelarticonsNotification from '~icons/pixelarticons/notification'
import PixelarticonsClose from '~icons/pixelarticons/close'
import IconButton from '../Button/IconButton'
import { useEffect } from 'react'

export type NotificationProps = React.PropsWithChildren<{
  id: string
  onClose: (id: string) => void
  closeDelay?: number
  style?: 'default' | 'error'
}>

export default function Notification({
  id,
  onClose,
  closeDelay,
  style = 'default',
  children
}: NotificationProps) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      if(closeDelay) {
        onClose(id)
      }
    }, closeDelay ?? 0)

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  return (
    <div
      style={{
        viewTransitionName: id
      }}
      aria-live='polite'
      className={createClasses({
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
        onClick={() => onClose(id)}
        className={styles['notification__close']}
        ariaLabel='Close notification'
      />
    </div>
  )
}
