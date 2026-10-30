import { useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useLanguage } from '../lib/language'
import { useSceneMotion } from '../lib/motion'
import { blockText } from '../story/parse'
import { ImageFrame } from './ImageFrame'
import { Particles } from './Particles'

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { t, story } = useLanguage()
  useSceneMotion(ref)

  return (
    <section ref={ref} id="forest" className="relative h-svh overflow-hidden bg-midnight">
      <ImageFrame n={1} alt={t.scenes.forest} focus="50% 45%" eager />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-midnight/55 via-midnight/35 to-midnight" />
      <div aria-hidden className="fog" />
      <Particles kind="snow" />
      <div data-fade="leave" aria-hidden className="absolute inset-0 bg-midnight opacity-0" />

      <div data-anchor className="relative flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 2, ease: 'easeOut' }}>
          <h1 className="font-serif text-[clamp(3.75rem,17vw,12rem)] font-semibold leading-none tracking-[0.12em] text-snow [text-shadow:0_0_50px_rgba(168,216,237,.35)]">
            ELDORIA
          </h1>
          <p className="label mt-4 text-gold">{t.subtitle}</p>
          <p className="mx-auto mt-8 max-w-md font-light leading-relaxed text-snow/85">{blockText(story[1])}</p>
          <motion.a
            href="#kingdom"
            whileHover={{ scale: 1.03, backgroundColor: 'rgba(198,166,107,.16)' }}
            whileTap={{ scale: 0.98 }}
            className="label mt-10 inline-block border border-gold/70 px-8 py-4 text-snow"
          >
            {t.begin}
          </motion.a>
        </motion.div>
        <a href="#kingdom" aria-label={t.scroll} className="absolute bottom-7 flex flex-col items-center gap-1 p-2 text-snow/70">
          <span aria-hidden className="label text-[0.625rem]">{t.scroll}</span>
          <ChevronDown aria-hidden size={18} className="bob" />
        </a>
      </div>
    </section>
  )
}
