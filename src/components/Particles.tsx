import { useEffect, useRef } from 'react'

const kinds = {
  snow: { color: '232,237,242', count: 110, size: [0.6, 2.4], vy: [0.25, 1], glow: false },
  ice: { color: '168,216,237', count: 42, size: [0.6, 1.8], vy: [-0.35, -0.08], glow: true },
  ember: { color: '226,170,92', count: 36, size: [0.6, 1.8], vy: [-0.5, -0.12], glow: true },
}

const between = ([a, b]: number[]) => a + Math.random() * (b - a)

/** Canvas particle field; only animates while on screen. */
export function Particles({ kind }: { kind: keyof typeof kinds }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const cfg = kinds[kind]
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(devicePixelRatio, 1.5)
    let w = 0
    let h = 0
    let frame = 0
    let parts: { x: number; y: number; r: number; vy: number; phase: number; alpha: number }[] = []

    const resize = () => {
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.round(cfg.count * (w < 768 ? 0.4 : w < 1024 ? 0.7 : 1))
      parts = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: between(cfg.size),
        vy: between(cfg.vy),
        phase: Math.random() * Math.PI * 2,
        alpha: 0.25 + Math.random() * 0.6,
      }))
      draw()
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of parts) {
        ctx.fillStyle = `rgba(${cfg.color},${p.alpha})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
        if (cfg.glow) {
          ctx.fillStyle = `rgba(${cfg.color},${p.alpha * 0.15})`
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    const step = () => {
      for (const p of parts) {
        p.phase += 0.008
        p.y += p.vy
        p.x += Math.sin(p.phase) * 0.3
        if (p.y > h + 4) p.y = -4
        if (p.y < -4) p.y = h + 4
      }
      draw()
      frame = requestAnimationFrame(step)
    }

    const size = new ResizeObserver(resize)
    size.observe(canvas)
    const seen = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame)
      if (entry.isIntersecting && !still) frame = requestAnimationFrame(step)
    })
    seen.observe(canvas)

    return () => {
      cancelAnimationFrame(frame)
      size.disconnect()
      seen.disconnect()
    }
  }, [kind])

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />
}
