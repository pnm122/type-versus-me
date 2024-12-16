import { CursorColor } from "$shared/types/Cursor"
import CursorColors from "$shared/utils/CursorColors"
import CursorPreview from "../CursorPreview/CursorPreview"
import styles from './style.module.scss'

interface Props {
  selected?: CursorColor
  onChange: (c: CursorColor) => void
}

export default function CursorSelector({
  selected,
  onChange
}: Props) {
  return (
    <div className={styles['selector']}>
      {CursorColors.map(c => (
        <button
          key={c}
          type='button'
          className={styles['selector__item']}
          style={{
            backgroundColor: selected === c ? `var(--cursor-${c}-light)` : `var(--gray-10)`
          }}
          onClick={() => onChange(c)}>
          <CursorPreview color={c} />
        </button>
      ))}
    </div>
  )
}
