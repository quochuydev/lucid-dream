import { useRef } from 'react'
import { useLanguage } from '../lib/language'
import { useSceneMotion } from '../lib/motion'
import type { SceneConfig } from '../story'
import { blockText } from '../story/parse'
import { SceneTitle, StoryText } from './Blocks'
import { ImageFrame } from './ImageFrame'
import { Particles } from './Particles'

const column = {
  left: 'lg:mr-auto',
  right: 'lg:ml-auto',
  center: 'mx-auto text-center',
}

export function Scene({ scene }: { scene: SceneConfig }) {
  const ref = useRef<HTMLElement>(null)
  const { t, story } = useLanguage()
  useSceneMotion(ref)
  const alt = t.scenes[scene.id as keyof typeof t.scenes]
  const [from, to] = scene.blocks
  const accent = scene.warm ? 'text-amber' : 'text-gold'

  const sizes = scene.layout === 'split' ? '(min-width: 1024px) 200svh, 140svh' : '(min-width: 1024px) max(100vw, 200svh), 160vw'
  const art = (
    <>
      <ImageFrame n={scene.image} alt={alt} focus={scene.focus} sizes={sizes} dim={scene.warm ? 'saturate-[1.15]' : undefined} />
      {scene.glow && <div aria-hidden className="sword-glow absolute inset-0" />}
      {scene.warm && <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_55%,rgba(226,150,60,.28),transparent_65%)]" />}
      {scene.particles && <Particles kind={scene.particles} />}
      <div data-fade="in" aria-hidden className="absolute inset-0 bg-midnight opacity-0" />
      <div data-fade="out" aria-hidden className="absolute inset-0 bg-midnight opacity-0" />
    </>
  )

  if (scene.layout === 'split') {
    const imageRight = scene.imageSide === 'right'
    return (
      <section ref={ref} id={scene.id} className={`relative grid lg:min-h-[180svh] lg:grid-cols-2 ${scene.warm ? 'bg-hearth' : 'bg-midnight'}`}>
        <div className={`relative h-[65svh] overflow-hidden lg:sticky lg:top-0 lg:h-svh ${imageRight ? 'lg:order-2' : ''}`}>{art}</div>
        <div className="flex items-center px-6 py-20 md:px-16 lg:py-[22svh] xl:px-24">
          <div className="max-w-xl">
            <SceneTitle id={scene.id} tone={accent} />
            <StoryText from={from} to={to} />
          </div>
        </div>
      </section>
    )
  }

  const align = scene.align ?? 'left'
  return (
    <section ref={ref} id={scene.id} className="relative bg-midnight">
      <div data-clip={scene.clipReveal || undefined} className="relative aspect-[4/3] overflow-hidden md:aspect-video lg:sticky lg:top-0 lg:aspect-auto lg:h-svh">
        {art}
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-midnight to-transparent lg:h-1/2 lg:from-midnight/90" />
        <div data-scrim aria-hidden className={`absolute inset-0 hidden lg:block scrim-${align}`} />
      </div>
      <div className="relative px-6 pb-20 pt-10 md:px-16 lg:-mt-[100svh] lg:pb-[45svh] lg:pt-[72svh] xl:px-28">
        <div className={`max-w-2xl ${column[align]}`}>
          <SceneTitle id={scene.id} tone={accent} />
          {scene.quote !== undefined && (
            <blockquote data-reveal className="mb-12 font-serif text-4xl italic leading-tight text-snow md:text-6xl">
              {blockText(story[scene.quote])}
            </blockquote>
          )}
          <StoryText from={from} to={to} />
        </div>
      </div>
    </section>
  )
}
