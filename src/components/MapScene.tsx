import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLanguage } from '../lib/language'
import { useSceneMotion } from '../lib/motion'
import { image, places, type Place } from '../story'
import { blockText } from '../story/parse'
import { SceneTitle, StoryText } from './Blocks'

export function MapScene() {
  const ref = useRef<HTMLElement>(null)
  const { t, story } = useLanguage()
  const [selected, setSelected] = useState(places[1])
  useSceneMotion(ref)

  const detail = (p: Place) => {
    const block = story[p.block]
    return p.item !== undefined && 'items' in block ? block.items[p.item] : blockText(block, p.sentence)
  }

  return (
    <section ref={ref} id="map" className="relative overflow-hidden bg-midnight px-4 py-24 md:px-16 lg:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,3fr)]">
        <div data-reveal className="relative aspect-[1376/768] w-full shadow-[0_0_90px_rgba(198,166,107,.16)]">
          <img src={image(9).src} srcSet={image(9).srcSet} sizes="(min-width: 1024px) 60vw, 100vw" alt={t.scenes.map} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full" />
          {places.map((p) => {
            const active = p === selected
            return (
              <button
                key={p.id}
                type="button"
                aria-pressed={active}
                aria-label={t.places[p.id as keyof typeof t.places]}
                onClick={() => setSelected(p)}
                onMouseEnter={() => setSelected(p)}
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                className="group absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
              >
                <span className={`marker ${active ? 'marker-active' : ''}`} />
                <span className={`label pointer-events-none absolute top-full hidden whitespace-nowrap bg-midnight/80 px-2 py-1 text-[0.625rem] text-snow md:block ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'}`}>
                  {t.places[p.id as keyof typeof t.places]}
                </span>
              </button>
            )
          })}
        </div>

        <div className="px-2">
          <SceneTitle id="map" />
          <StoryText from={40} to={41} />
          <div aria-live="polite" className="mt-10 min-h-32 border-t border-gold/40 pt-6">
            <p className="label text-ice/80">{t.place}</p>
            <AnimatePresence mode="wait">
              <motion.div key={selected.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                <h3 className="mt-3 font-serif text-3xl text-snow">{t.places[selected.id as keyof typeof t.places]}</h3>
                <p className="mt-2 font-light leading-relaxed text-snow/80">{detail(selected)}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
