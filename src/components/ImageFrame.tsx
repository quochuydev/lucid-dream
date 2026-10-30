import { image } from '../story'

type Props = { n: number; alt: string; focus?: string; eager?: boolean; dim?: string; sizes?: string }

/** Rendered width of cover-cropped art: wider than the screen when the box is tall. */
const fullscreen = 'max(100vw, 200svh)'

/**
 * Bleeds 8% past its box: leaves room for parallax and crops flaws sitting at the
 * edges of the source art (the white border and watermark in 1.png).
 */
export function ImageFrame({ n, alt, focus = '50% 50%', eager, dim, sizes = fullscreen }: Props) {
  const { src, srcSet } = image(n)
  return (
    <div data-parallax className="absolute -inset-y-[8%] inset-x-0 will-change-transform">
      <div data-zoom className="h-full w-full will-change-transform">
        <img
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : 'auto'}
          decoding="async"
          style={{ objectPosition: focus }}
          className={`drift h-full w-full object-cover ${dim ?? ''}`}
        />
      </div>
    </div>
  )
}
