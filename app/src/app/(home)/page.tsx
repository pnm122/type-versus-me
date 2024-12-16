"use client"

import { CursorColor } from "$shared/types/Cursor";
import { isValidColor } from "$shared/utils/validators";
import TyperPreview from "@/components/TyperPreview/TyperPreview";
import { useSocket } from "@/context/Socket";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const socket = useSocket()
  const [color, setColor] = useState('blue')
  const [lastValidColor, setLastValidColor] = useState<CursorColor>('blue')

  function updateColor(c: string) {
    if(isValidColor(c)) {
      setLastValidColor(c as CursorColor)
    }
    setColor(c)
  }

  return (
    <div style={{ marginInline: 24 }}>
      <TyperPreview
        cursorColor={lastValidColor}
        text="taptaptap.live"
      />
      <input
        value={color}
        onChange={e => updateColor(e.target.value)}
      />
    </div>
  )
}