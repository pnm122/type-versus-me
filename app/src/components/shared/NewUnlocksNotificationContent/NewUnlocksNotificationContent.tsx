import { Unlock } from '@/utils/unlocks'
import CursorPreview from '../CursorPreview/CursorPreview'
import styles from './style.module.scss'

interface Props {
	unlocks: [key: string, value: Unlock | undefined][]
}

export default function NewUnlocksNotificationContent({ unlocks }: Props) {
	return (
		<div className={styles['unlocks']}>
			<h2 className={styles['unlocks__heading']}>
				You unlocked {unlocks.length === 1 ? 'a new item' : 'new items'}!
			</h2>
			<div className={styles['unlocks__items']}>
				{unlocks.map((u, index) =>
					u[1]?.type === 'cursor-color' ? (
						<div
							key={index}
							className={styles['cursor']}
							style={
								{
									'--cursor-background': `var(--cursor-${u[1].value}-light)`,
									'--cursor-border': `var(--cursor-${u[1].value})`
								} as React.CSSProperties
							}
						>
							<CursorPreview size="large" color={u[1].value} />
						</div>
					) : (
						<></>
					)
				)}
			</div>
		</div>
	)
}
