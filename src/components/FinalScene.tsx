import { useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { useLanguage } from '../lib/language'
import { useSceneMotion } from '../lib/motion'
import { SceneTitle, StoryText } from './Blocks'
import { ImageFrame } from './ImageFrame'
import { Particles } from './Particles'

export function FinalScene() {
  const ref = useRef<HTMLElement>(null)
  const { t } = useLanguage()
  useSceneMotion(ref)

  return (
    <footer>
      <section ref={ref} id="journey" className="relative bg-midnight">
        <div className="sticky top-0 h-svh overflow-hidden">
          <ImageFrame n={1} alt="" focus="50% 30%" dim="opacity-20" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-midnight via-midnight/40 to-midnight" />
          <Particles kind="snow" />
          <div data-fade="in" aria-hidden className="absolute inset-0 bg-midnight opacity-0" />
        </div>
        <div className="relative -mt-[100svh] px-6 py-[24svh] text-center md:px-16">
          <div className="mx-auto max-w-2xl">
            <SceneTitle id="journey" />
            <StoryText from={42} to={62} />
            <motion.a
              href="#forest"
              whileHover={{ scale: 1.03, backgroundColor: 'rgba(198,166,107,.16)' }}
              whileTap={{ scale: 0.98 }}
              className="label mt-20 inline-flex items-center gap-3 border border-gold/70 px-8 py-4 text-snow"
            >
              <ArrowUp aria-hidden size={16} /> {t.back}
            </motion.a>
          </div>
        </div>
      </section>
    </footer>
  )
}
