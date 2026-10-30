import { useEffect, useRef, useState } from 'react'

// Set this to an imported audio file to enable ambience; playback only starts from the toggle.
const AMBIENT_SRC: string | undefined = undefined

export function useSound() {
  const [on, setOn] = useState(false)
  const audio = useRef<HTMLAudioElement>(null)

  const toggle = () => {
    if (AMBIENT_SRC && !audio.current) {
      audio.current = new Audio(AMBIENT_SRC)
      audio.current.loop = true
      audio.current.volume = 0.4
    }
    const next = !on
    setOn(next)
    if (next) audio.current?.play().catch(() => setOn(false))
    else audio.current?.pause()
  }

  useEffect(() => () => audio.current?.pause(), [])

  return { on, toggle, available: Boolean(AMBIENT_SRC) }
}
