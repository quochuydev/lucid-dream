import { useLayoutEffect, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const calm = '(prefers-reduced-motion: no-preference)'

/**
 * Wires a scene's declarative hooks to ScrollTrigger:
 * data-reveal, data-parallax, data-zoom, data-fade="in|out|leave", data-scrim, data-clip.
 * Reduced motion matches no condition, so everything stays static and visible.
 */
export function useSceneMotion(ref: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const section = ref.current
    if (!section) return
    const q = gsap.utils.selector(section)
    const mm = gsap.matchMedia()

    mm.add(
      {
        desktop: `(min-width: 1024px) and ${calm}`,
        tablet: `(min-width: 768px) and (max-width: 1023px) and ${calm}`,
        mobile: `(max-width: 767px) and ${calm}`,
      },
      (ctx) => {
        const { desktop, tablet, mobile } = ctx.conditions as Record<string, boolean>
        const whole = { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true }

        for (const el of q('[data-reveal]')) {
          gsap.from(el, {
            autoAlpha: 0,
            y: 28,
            duration: 1.3,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          })
        }

        gsap.fromTo(
          q('[data-fade="in"]'),
          { opacity: 1 },
          { opacity: 0, ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: desktop ? 'top 35%' : 'top 75%', scrub: true } },
        )
        // Only desktop art is sticky; finishes as it releases, so no hard seam scrolls through the viewport.
        if (desktop) gsap.fromTo(
          q('[data-fade="out"]'),
          { opacity: 0 },
          { opacity: 1, ease: 'none', immediateRender: false, scrollTrigger: { trigger: section, start: 'bottom 125%', end: 'bottom 98%', scrub: true } },
        )
        // Non-sticky scenes (the hero) simply dim as they scroll away.
        gsap.fromTo(
          q('[data-fade="leave"]'),
          { opacity: 0 },
          { opacity: 1, ease: 'none', scrollTrigger: { trigger: section, start: 'top top', end: 'bottom 20%', scrub: true } },
        )
        // Art stays clean for the opening frame, then darkens for reading.
        gsap.fromTo(
          q('[data-scrim]'),
          { opacity: 0 },
          { opacity: 1, ease: 'none', scrollTrigger: { trigger: section, start: 'top top', end: 'top -45%', scrub: true } },
        )

        for (const el of q('[data-clip]')) {
          gsap.fromTo(
            el,
            { clipPath: 'inset(14% 20% 14% 20%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 2, ease: 'power2.inOut', scrollTrigger: { trigger: section, start: 'top 55%', once: true } },
          )
        }

        if (mobile) return

        for (const el of q('[data-zoom]')) {
          gsap.fromTo(el, { scale: 1.16 }, { scale: 1, ease: 'none', scrollTrigger: whole })
        }
        // Stays under the 8% bleed of ImageFrame, so cropped image edges never show.
        const drift = desktop ? 5 : tablet ? 2.5 : 0
        gsap.fromTo(q('[data-parallax]'), { yPercent: -drift }, { yPercent: drift, ease: 'none', scrollTrigger: whole })
      },
    )
    return () => mm.revert()
  }, [ref])
}
