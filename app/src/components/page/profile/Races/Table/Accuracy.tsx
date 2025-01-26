import createClasses from '@/utils/createClasses'
import styles from './style.module.scss'
import PixelarticonsBullseyeArrow from '~icons/pixelarticons/bullseye-arrow'
import Pill from '@/components/base/Pill/Pill'

export default function Accuracy({ accuracy }: { accuracy: number }) {
	const displayAccuracy = accuracy < 0 ? '-' : `${(accuracy * 100).toFixed(2)}%`

	return (
		<Pill
			size="large"
			lowercase
			className={createClasses({
				[styles['accuracy']]: true,
				[styles['accuracy--perfect']]: accuracy >= 1,
				[styles['accuracy--low']]: accuracy < 0.95
			})}
			text={displayAccuracy}
			icon={accuracy >= 1 ? <PixelarticonsBullseyeArrow /> : undefined}
		/>
	)
}
