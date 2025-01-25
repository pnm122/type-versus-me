import createClasses from '@/utils/createClasses'
import {
	Fragment,
	KeyboardEvent,
	useEffect,
	useImperativeHandle,
	useLayoutEffect,
	useRef,
	useState
} from 'react'
import styles from './style.module.scss'
import { Cursor } from '@/types/Cursor'
import TyperCursor from '@/components/shared/TyperCursor/TyperCursor'
import { CursorColor, CursorPosition } from '$shared/types/Cursor'
import { getCursorPosition, getInitialStats, getTextRegions, words } from '@/utils/typer'
import { TyperStats, Word } from '@/types/Typer'
import debounce from 'debounce'
import { useRoom } from '@/context/Room'

export interface TyperRef {
	focus: () => void
}

interface LineInfo {
	/** Lines and their distance from the top of the Typer */
	lines: number[]
	/** Line the cursor is currently on */
	currentLine: number
}

interface Props {
	/** Text to display in the Typer */
	text: string
	/** Time the test was started in ms since epoch */
	startTime: number
	/** Whether the test should disallow typing */
	disabled: boolean
	/**
	 * Callback for when a user input should cause the typed text to change
	 **/
	onChange?: (stats: TyperStats) => void
	/**
	 * Callback for when the test is finished by correctly typing the entire text
	 * @param stats statistics from the test
	 **/
	onFinish?: (stats: TyperStats) => void
	/**
	 * Other players' cursors to show within the Typer
	 */
	cursors?: Cursor[]
	/**
	 * Reference to this Typer's exposed functions
	 */
	ref?: React.RefObject<TyperRef | null>
}

export default function Typer({
	text,
	startTime,
	disabled,
	onChange,
	onFinish,
	cursors,
	ref
}: Props) {
	useImperativeHandle(ref, () => ({
		focus() {
			input.current?.focus({})
		}
	}))

	const { user } = useRoom()

	const cursorColor: CursorColor = user?.color ?? 'blue'

	const typer = useRef<HTMLDivElement>(null)
	const input = useRef<HTMLInputElement>(null)
	const stats = useRef<TyperStats>(getInitialStats())

	const [typed, setTyped] = useState('')

	const textRegions = getTextRegions(text, typed)

	const cursorPosition = getCursorPosition(typed)

	const cursorAtStartOfWord = cursorPosition.letter === 0

	function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
		e.preventDefault()

		if (disabled) {
			return
		}

		if (e.key === ' ' && cursorAtStartOfWord) {
			return
		}

		// Disallow pressing space on the last word
		if (e.key === ' ' && textRegions.at(-1)?.distanceToCurrent === 0) {
			return
		}

		if (e.key.length > 1 && !['Backspace', 'Delete'].includes(e.key)) {
			return
		}

		if (['Backspace', 'Delete'].includes(e.key)) {
			if (typed.length === 0) return

			return handleChange(typed.slice(0, -1))
		}

		const newTyped = `${typed}${e.key}`

		handleChange(newTyped)

		// Finish event AFTER change event to ensure all stats are updated
		if (text === newTyped) {
			handleFinish()
		}
	}

	function isIncorrect(word: Word) {
		return !word.correct && word.distanceToCurrent > 0
	}

	function getTotalCorrectAndErrors(regions: Word[]) {
		interface CorrectAndErrors {
			correct: number
			errors: number
		}

		function sum(a: CorrectAndErrors, b: CorrectAndErrors) {
			return {
				correct: a.correct + b.correct,
				errors: a.errors + b.errors
			}
		}

		return regions.reduce(
			(acc, w) =>
				sum(
					{
						// Correctly placed spaces count as correct keystrokes
						correct: isSubmitted(w) && isRightLength(w) ? acc.correct + 1 : acc.correct,
						// Incorrectly placed spaces count as incorrect keystrokes
						errors: isSubmitted(w) && !isRightLength(w) ? acc.errors + 1 : acc.errors
					},
					w.regions.reduce(
						(acc, r) =>
							r.type === 'incorrect' || r.type === 'extra'
								? { ...acc, errors: acc.errors + r.text.length }
								: r.type === 'correct'
									? { ...acc, correct: acc.correct + r.text.length }
									: acc,
						{ correct: 0, errors: 0 }
					)
				),
			{ correct: 0, errors: 0 }
		)
	}

	function handleChange(newTyped: string) {
		const newRegions = getTextRegions(text, newTyped)
		const { correct: newCorrect, errors: newErrors } = getTotalCorrectAndErrors(newRegions)
		const { correct: oldCorrect, errors: oldErrors } = getTotalCorrectAndErrors(textRegions)

		const errorsMade =
			newErrors > oldErrors ? stats.current.errorsMade + 1 : stats.current.errorsMade
		const correctMade =
			newCorrect > oldCorrect ? stats.current.correctMade + 1 : stats.current.correctMade

		stats.current = {
			...stats.current,
			errorsMade,
			errorsLeft: newErrors,
			correctMade,
			correctLeft: newCorrect,
			netWPM: newCorrect / 5 / ((Date.now() - startTime) / 60000),
			accuracy: correctMade / (correctMade + errorsMade),
			cursorPosition: getCursorPosition(newTyped)
		}

		setTyped(newTyped)
		onChange?.(stats.current)
	}

	function handleFinish() {
		stats.current.endTime = Date.now()
		onFinish?.(stats.current)
	}

	function isSubmitted(word: Word) {
		return word.distanceToCurrent > 0
	}

	function isRightLength(word: Word) {
		return word.regions.every((r) => r.type === 'correct' || r.type === 'incorrect')
	}
	/**
	 * Get information about the lines of text as they appear in the DOM
	 * @returns the position of each line relative to the top of the typer, as well as the line the cursor is currently on
	 */
	function getLineInfo(cursorPosition: CursorPosition): LineInfo {
		const inner = typer.current!.querySelector<HTMLElement>(`.${styles['typer__inner']}`)!
		const initialTransform = inner.style.transform
		inner.style.transform = ''

		const currentWordElement = typer
			.current!.querySelectorAll(`.${styles['word']}`)
			.item(cursorPosition.word)
		const currentWordCharElements = [
			...Array.from(currentWordElement.querySelectorAll(`.${styles['character']}`)),
			// Include the space after the word since the cursor can be attached to it too
			currentWordElement.nextSibling as Element
		]
		const { top: typerTop } = inner.getBoundingClientRect()
		const { top: charTop } = currentWordCharElements[cursorPosition.letter].getBoundingClientRect()

		const allCharElements = typer.current!.querySelectorAll(`.${styles['character']}`)

		// Get a list of all lines' distance to the top of the typer
		const lines = Array.from(allCharElements).reduce<number[]>((acc, elem) => {
			const top = elem.getBoundingClientRect().top - typerTop
			if (acc.includes(top)) {
				return acc
			} else {
				return [...acc, top]
			}
		}, [])
		const currentLine = lines.findIndex((l) => charTop - typerTop === l)

		inner.style.transform = initialTransform

		return {
			lines,
			currentLine
		}
	}

	function setLinePosition() {
		if (!typer.current) return

		const inner = typer.current.querySelector<HTMLElement>(`.${styles['typer__inner']}`)!

		const { lines, currentLine } = getLineInfo(cursorPosition)

		// Move the text of the typer so that the middle line is always where the cursor is, beginning with the second line
		if (currentLine > 1) {
			inner.style.transform = `translateY(-${lines[currentLine - 1]}px)`
		} else {
			inner.style.transform = ''
		}
	}

	useLayoutEffect(() => {
		const onresize = debounce(setLinePosition, 100)
		window.addEventListener('resize', onresize)
		setLinePosition()

		return () => {
			window.removeEventListener('resize', onresize)
		}
	}, [text, typed])

	useEffect(() => {
		stats.current = getInitialStats(words(text).length)
		setTyped('')
	}, [text])

	return (
		<>
			<div
				className={createClasses({
					[styles['typer']]: true,
					[styles['typer--disabled']]: disabled
				})}
				ref={typer}
			>
				<input
					className={styles['typer__input']}
					defaultValue={words(typed).at(-1)}
					onKeyDown={onKeyDown}
					tabIndex={disabled ? -1 : 0}
					ref={input}
					autoCapitalize="none"
					autoCorrect="none"
				/>
				{/* Only the current user's cursor should disappear on disable, so that they can still see where other users are */}
				{!disabled && <TyperCursor color={cursorColor} position={cursorPosition} typer={typer} />}
				{cursors?.map((c) => <TyperCursor key={c.id} typer={typer} opponent={true} {...c} />)}
				{/*
          Need extra nested divs:
            * text is the container with a set height and no overflow, sibling to cursor so the cursor isn't cut off
            * inner is moved as needed to keep the cursor on the middle line
        */}
				<div className={styles['typer__inner']}>
					{textRegions.map((word, index) => (
						<Fragment key={index}>
							<span
								className={createClasses({
									[styles['word']]: true,
									[styles['word--incorrect']]: isIncorrect(word)
								})}
							>
								{word.regions.map((wordRegion) =>
									Array.from(wordRegion.text).map((char, index) => (
										<span
											key={index}
											className={createClasses({
												[styles['character']]: true,
												[styles[wordRegion.type]]: true
											})}
										>
											{char}
										</span>
									))
								)}
							</span>
							<span className={styles['character']}> </span>
						</Fragment>
					))}
				</div>
			</div>
		</>
	)
}
