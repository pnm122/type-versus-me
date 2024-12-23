import { CursorColor, CursorPosition } from '$shared/types/Cursor'

export interface Cursor {
	id: string
	color: CursorColor
	position: CursorPosition
}
