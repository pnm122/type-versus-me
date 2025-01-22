import generateUsername from '$shared/utils/generateUsername'
import { setUser } from '@/utils/user'
import IconButton from '@/components/base/Button/IconButton'
import Input from '@/components/base/Input/Input'
import styles from './style.module.scss'
import PixelarticonsDice from '~icons/pixelarticons/dice'
import CursorSelector from '@/components/shared/CursorSelector/CursorSelector'
import { useGlobalState } from '@/context/GlobalState'
import { CursorColor } from '$shared/types/Cursor'

interface Props {
	/**
	 * Username state to use.
	 * @default globalState.user.username
	 **/
	username?: string
	/**
	 * Color state to use.
	 * @default globalState.user.color
	 **/
	color?: CursorColor
	/**
	 * Handler for username changes. *Must be provided if also providing a username.*
	 */
	onUsernameChange?: (u: string) => void
	/**
	 * Handler for color changes. *Must be provided if also providing a color.*
	 */
	onColorChange?: (c: CursorColor) => void
	/** Change the styling for when the component is on a surface. */
	isOnSurface?: boolean
	inputRef?: React.RefObject<HTMLInputElement>
}

export default function UsernameAndColorInput({
	username,
	color,
	onUsernameChange,
	onColorChange,
	isOnSurface,
	inputRef
}: Props) {
	const globalState = useGlobalState()

	const { user } = globalState

	function onUsernameChangeDefault(username: string) {
		if (onUsernameChange) {
			return onUsernameChange(username)
		}
		setUser({ username }, { globalState })
	}

	function onColorChangeDefault(c: CursorColor) {
		if (onColorChange) {
			return onColorChange(c)
		}
		setUser({ color: c }, { globalState })
	}

	return (
		<div className={styles['group']}>
			<div className={styles['username']}>
				<Input
					id="username"
					label="Username"
					placeholder="Username"
					disabled={!username && !user}
					text={username ?? user?.username ?? ''}
					onChange={(e) => onUsernameChangeDefault(e.target.value)}
					wrapperClassName={styles['username__input']}
					minLength={3}
					maxLength={16}
					ref={inputRef}
					required
				/>
				<IconButton
					icon={<PixelarticonsDice />}
					className={styles['username__generate']}
					style="secondary"
					aria-label="Generate random username"
					disabled={!username && !user}
					onClick={() => onUsernameChangeDefault(generateUsername())}
				/>
			</div>
			<CursorSelector
				selected={color ?? user?.color}
				onChange={onColorChangeDefault}
				points={6000}
				isOnSurface={isOnSurface}
			/>
		</div>
	)
}
