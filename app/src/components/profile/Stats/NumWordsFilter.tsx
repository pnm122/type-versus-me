import FilterWithDropdown from '@/components/FilterWithDropdown/FilterWithDropdown'
import styles from './style.module.scss'
import newParamsURL from '@/utils/newParamsURL'
import { useRouter } from 'next/navigation'
import { TransitionStartFunction, useRef, useState } from 'react'
import { MAX_TEST_WORDS, MIN_TEST_WORDS } from '$shared/constants'
import Button from '@/components/Button/Button'
import useNumWordsParams from '@/hooks/useNumWordsParams'

interface Props {
	transition: [boolean, TransitionStartFunction]
}

export default function NumWordsFilter({ transition }: Props) {
	const MIN_PARAM_KEY = 'stats-min-words'
	const MAX_PARAM_KEY = 'stats-max-words'

	const [safeParams, searchParams] = useNumWordsParams(MIN_PARAM_KEY, MAX_PARAM_KEY)

	const router = useRouter()
	const [open, setOpen] = useState(false)
	const [minWords, setMinWords] = useState(safeParams[MIN_PARAM_KEY])
	const [maxWords, setMaxWords] = useState(safeParams[MAX_PARAM_KEY])
	const focusOnOpenRef = useRef<HTMLElement>(null)
	const filterWithDropdownRef = useRef<HTMLDivElement>(null)
	const startTransition = transition[1]

	function onSave() {
		startTransition(() => {
			router.push(
				newParamsURL(searchParams, {
					[MIN_PARAM_KEY]: minWords.toString(),
					[MAX_PARAM_KEY]: maxWords.toString()
				})
			)
		})
		setOpen(false)
	}

	function onOpen() {
		setMinWords(safeParams[MIN_PARAM_KEY])
		setMaxWords(safeParams[MAX_PARAM_KEY])
		setOpen(true)
	}

	const selected =
		safeParams[MIN_PARAM_KEY] !== MIN_TEST_WORDS || safeParams[MAX_PARAM_KEY] !== MAX_TEST_WORDS
			? [`${safeParams[MIN_PARAM_KEY]} - ${safeParams[MAX_PARAM_KEY]} words`]
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
			<Button ref={focusOnOpenRef} onClick={onSave}>
				Save
			</Button>
		</FilterWithDropdown>
	)
}
