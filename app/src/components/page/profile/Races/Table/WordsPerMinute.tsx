import createClasses from '@/utils/createClasses'
import styles from './style.module.scss'
import MdiFire from '~icons/mdi/fire'
import PixelarticonsClose from '~icons/pixelarticons/close'
import Pill from '@/components/base/Pill/Pill'

export default function WordsPerMinute({ netWPM }: { netWPM: number }) {
	const wpm = Math.round(netWPM)
	const displayText = netWPM < 0 ? 'Failed' : `${wpm}wpm`
	return (
		<Pill
			size="large"
			className={createClasses({
				[styles['wpm']]: true,
				[styles['wpm--hot']]: wpm >= 100,
				[styles['wpm--hot-1']]: wpm >= 100 && wpm < 110,
				[styles['wpm--hot-2']]: wpm >= 110 && wpm < 120,
				[styles['wpm--hot-3']]: wpm >= 120 && wpm < 140,
				[styles['wpm--hot-4']]: wpm >= 140,
				[styles['wpm--failed']]: wpm < 0
			})}
			icon={
				wpm < 0 ? (
					<PixelarticonsClose />
				) : (
					wpm >= 100 && (
						<div className={styles['wpm__icons']}>
							<MdiFire />
							{wpm >= 130 && <MdiFire />}
							{wpm >= 150 && <MdiFire />}
						</div>
					)
				)
			}
			text={displayText}
			lowercase={wpm >= 0}
		/>
	)
}
