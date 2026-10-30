import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion'
import { Menu, Volume2, VolumeX, X } from 'lucide-react'
import { useLanguage } from '../lib/language'
import { useSound } from '../lib/useSound'
import { sceneIds } from '../story'
import { roman } from '../story/ui'

const iconButton = 'flex h-11 w-11 items-center justify-center text-snow/80 transition-colors hover:text-gold'

function useActiveScene() {
  const [active, setActive] = useState(sceneIds[0])
  useEffect(() => {
    const seen = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id)
      },
      { rootMargin: '-50% 0px -50% 0px' },
    )
    for (const id of sceneIds) {
      const el = document.getElementById(id)
      if (el) seen.observe(el)
    }
    return () => seen.disconnect()
  }, [])
  return active
}

export function Nav() {
  const { lang, toggle, t } = useLanguage()
  const sound = useSound()
  const active = useActiveScene()
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  const pendingScene = useRef<string>(null)
  const { scrollY, scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  useMotionValueEvent(scrollY, 'change', (y) => setSolid(y > 80))

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [open])

  const name = (id: string) => t.scenes[id as keyof typeof t.scenes]
  const soundLabel = sound.available ? (sound.on ? t.soundOff : t.soundOn) : t.noSound

  return (
    <>
      <motion.div aria-hidden style={{ scaleX: progress }} className="fixed inset-x-0 top-0 z-50 h-px origin-left bg-gold" />
      <header className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${solid || open ? 'bg-midnight/80 backdrop-blur-md' : ''}`}>
        <div className="flex h-16 items-center justify-between px-4 md:px-8">
          <a href="#forest" className="font-serif text-xl font-semibold tracking-[0.2em] text-snow">ELDORIA</a>

          <nav aria-label={t.story} className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {sceneIds.map((id, i) => (
                <li key={id}>
                  <a href={`#${id}`} title={name(id)} aria-label={name(id)} aria-current={active === id ? 'true' : undefined} className="relative block px-3 py-3 font-serif text-sm text-snow/70 hover:text-snow">
                    {roman[i]}
                    {active === id && <motion.span layoutId="scene-mark" className="absolute inset-x-2 bottom-1.5 h-px bg-gold" />}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center">
            <button type="button" onClick={toggle} aria-label={t.language} className="label h-11 px-3 text-snow/80 hover:text-gold">
              {lang === 'vi' ? 'EN' : 'VI'}
            </button>
            <button type="button" onClick={sound.toggle} aria-label={soundLabel} title={soundLabel} aria-pressed={sound.on} className={iconButton}>
              {sound.on ? <Volume2 aria-hidden size={18} /> : <VolumeX aria-hidden size={18} />}
            </button>
            <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? t.closeMenu : t.menu} className={`${iconButton} lg:hidden`}>
              {open ? <X aria-hidden size={20} /> : <Menu aria-hidden size={20} />}
            </button>
          </div>
        </div>

        {/* Closing the menu cancels a native anchor scroll, so jump once it has gone. */}
        <AnimatePresence
          onExitComplete={() => {
            if (pendingScene.current) document.getElementById(pendingScene.current)?.scrollIntoView()
            pendingScene.current = null
          }}
        >
          {open && (
            <motion.nav
              aria-label={t.story}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden lg:hidden"
            >
              <ul className="max-h-[calc(100svh-4rem)] overflow-y-auto px-4 pb-6">
                {sceneIds.map((id, i) => (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      onClick={(e) => {
                        e.preventDefault()
                        pendingScene.current = id
                        setOpen(false)
                      }}
                      aria-current={active === id ? 'true' : undefined} className={`flex items-baseline gap-4 py-3 font-serif text-xl ${active === id ? 'text-gold' : 'text-snow'}`}
                    >
                      <span className="w-8 text-sm text-muted">{roman[i]}</span>
                      {name(id)}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
