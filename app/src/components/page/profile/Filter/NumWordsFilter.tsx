import FilterWithDropdown from '@/components/base/FilterWithDropdown/FilterWithDropdown'
import styles from './style.module.scss'
import newParamsURL from '@/utils/newParamsURL'
import { useRouter } from 'next/navigation'
import { TransitionStartFunction, useRef, useState } from 'react'
import { MAX_TEST_WORDS, MIN_TEST_WORDS } from '$shared/constants'
import Button from '@/components/base/Button/Button'
import useNumWordsParams from '@/hooks/useNumWordsParams'
import RangeSlider from '@/components/base/RangeSlider/RangeSlider'
import PixelarticonsSave from '~icons/pixelarticons/save'
import ButtonIcon from '@/components/base/Button/ButtonIcon'

interface Props {
	transition: [boolean, TransitionStartFunction]
	minWordsParamKey: string
	maxWordsParamKey: string
}

export default function NumWordsFilter({ transition, minWordsParamKey, maxWordsParamKey }: Props) {
	const [safeParams, searchParams] = useNumWordsParams(minWordsParamKey, maxWordsParamKey)

	const router = useRouter()
	const [open, setOpen] = useState(false)
	const [minWords, setMinWords] = useState(safeParams[minWordsParamKey])
	const [maxWords, setMaxWords] = useState(safeParams[maxWordsParamKey])
	const focusOnOpenRef = useRef<HTMLElement>(null)
	const filterWithDropdownRef = useRef<HTMLDivElement>(null)
	const startTransition = transition[1]

	function onSave() {
		startTransition(() => {
			router.push(
				newParamsURL(searchParams, {
					[minWordsParamKey]: minWords.toString(),
					[maxWordsParamKey]: maxWords.toString()
				})
			)
		})
		setOpen(false)
	}

	function onOpen() {
		setMinWords(safeParams[minWordsParamKey])
		setMaxWords(safeParams[maxWordsParamKey])
		setOpen(true)
	}

	const selected =
		safeParams[minWordsParamKey] !== MIN_TEST_WORDS ||
		safeParams[maxWordsParamKey] !== MAX_TEST_WORDS
			? [`${safeParams[minWordsParamKey]} - ${safeParams[maxWordsParamKey]} words`]
			: []

	return (
		<FilterWithDropdown
			ref={filterWithDropdownRef}
			open={open}
			onOpen={onOpen}
			onClose={() => setOpen(false)}
			name="Number of words"
			selected={selected}
			dropdownProps={{
				focusOnOpenRef,
				className: styles['dropdown']
			}}
			className={styles['filter']}
		>
			<h1 className={styles['dropdown__heading']}>Number of words</h1>
			<RangeSlider
				min={MIN_TEST_WORDS}
				max={MAX_TEST_WORDS}
				lowSelected={minWords}
				highSelected={maxWords}
				step={5}
				onLowChange={(n) => setMinWords(n)}
				onHighChange={(n) => setMaxWords(n)}
				ariaLabel="Number of words"
			/>
			<Button ref={focusOnOpenRef} onClick={onSave}>
				<ButtonIcon icon={<PixelarticonsSave />} />
				Save
			</Button>
		</FilterWithDropdown>
	)
}
