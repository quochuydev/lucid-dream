import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { stories, type Lang } from '../story'
import { blockText } from '../story/parse'
import { ui } from '../story/ui'

const KEY = 'eldoria-lang'

function savedLang(): Lang {
  try {
    return localStorage.getItem(KEY) === 'en' ? 'en' : 'vi'
  } catch {
    return 'vi'
  }
}

function makeValue(lang: Lang, toggle: () => void) {
  return { lang, toggle, story: stories[lang], t: ui[lang] }
}

const Ctx = createContext<ReturnType<typeof makeValue> | null>(null)

/** The first story element still on screen, so a text reflow can be cancelled out. */
function viewportAnchor() {
  for (const el of document.querySelectorAll<HTMLElement>('[data-anchor]')) {
    const { top, bottom } = el.getBoundingClientRect()
    if (bottom > 0) return { el, top }
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState(savedLang)
  const anchor = useRef<ReturnType<typeof viewportAnchor>>(undefined)

  const toggle = useCallback(() => {
    anchor.current = viewportAnchor()
    setLang((l) => (l === 'vi' ? 'en' : 'vi'))
  }, [])

  useLayoutEffect(() => {
    if (!anchor.current) return
    const { el, top } = anchor.current
    anchor.current = undefined
    ScrollTrigger.refresh()
    window.scrollBy({ top: el.getBoundingClientRect().top - top, behavior: 'instant' })
  }, [lang])

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = `Eldoria — ${blockText(stories[lang][0])}`
    try {
      localStorage.setItem(KEY, lang)
    } catch {
      // Private mode: the choice just won't persist.
    }
  }, [lang])

  const value = useMemo(() => makeValue(lang, toggle), [lang, toggle])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useLanguage() {
  const value = useContext(Ctx)
  if (!value) throw new Error('useLanguage needs LanguageProvider')
  return value
}
