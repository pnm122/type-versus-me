import Pill from '@/components/Pill/Pill'
import PixelarticonsMinus from '~icons/pixelarticons/minus'
import PixelarticonsCheck from '~icons/pixelarticons/check'
import PixelarticonsClose from '~icons/pixelarticons/close'
import styles from './style.module.scss'
import { User } from '$shared/types/User'
import createClasses from '@/utils/createClasses'
import { useEffect, useState } from 'react'

type Props = Pick<User, 'score' | 'state'>

export default function UserState({ score, state }: Props) {
	const [lastFinishState, setLastFinishState] = useState<'complete' | 'failed' | null>(null)

	useEffect(() => {
		if (state === 'complete' || state === 'failed') {
			setLastFinishState(state)
		} else if (state === 'in-progress') {
			setLastFinishState(null)
		}
	}, [state])

	return (
		<div
			className={createClasses({
				[styles['state']]: true,
				[styles[`state--${state}`]]: true
			})}
		>
			<div
				className={styles['state__option']}
				aria-hidden={state !== 'complete' && state !== 'failed'}
			>
				{state === 'complete' || lastFinishState === 'complete' ? (
					<Pill
						backgroundColor="var(--positive)"
						foregroundColor="var(--background)"
						text="Done"
						icon={<PixelarticonsCheck />}
					/>
				) : (
					<Pill
						backgroundColor="var(--negative)"
						foregroundColor="var(--background)"
						text="Failed"
						icon={<PixelarticonsClose />}
					/>
				)}
			</div>
			<div className={styles['state__option']} aria-hidden={state !== 'in-progress'}>
				<p
					aria-label={`${score?.netWPM ?? 0} words per minute`}
					className={styles['words-per-minute']}
				>
					{Math.round(score?.netWPM ?? 0)}wpm
				</p>
			</div>
			<div className={styles['state__option']} aria-hidden={state !== 'ready'}>
				<Pill
					backgroundColor="var(--positive)"
					foregroundColor="var(--background)"
					text="Ready"
					icon={<PixelarticonsCheck />}
				/>
			</div>
			<div className={styles['state__option']} aria-hidden={state !== 'not-ready'}>
				<Pill
					backgroundColor="var(--disabled)"
					foregroundColor="var(--heading)"
					text="Not Ready"
					icon={<PixelarticonsMinus />}
				/>
			</div>
		</div>
	)
}
