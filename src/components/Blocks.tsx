import { useLanguage } from '../lib/language'
import type { Block } from '../story/parse'
import { sceneIds } from '../story'

const big = 'font-serif text-3xl leading-tight text-snow md:text-4xl'

export function BlockView({ block, index }: { block: Block; index: number }) {
  const common = { 'data-reveal': true, 'data-anchor': true, key: index }
  switch (block.type) {
    case 'heading':
      return <h3 {...common} className="pt-10 font-serif text-3xl text-gold md:text-4xl">{block.text}</h3>
    case 'quote':
      return <blockquote {...common} className="font-serif text-2xl italic leading-snug text-ice md:text-3xl">{block.text}</blockquote>
    case 'list':
      return (
        <ul {...common} className="space-y-2 border-l border-gold/50 pl-5 font-serif text-xl text-snow md:text-2xl">
          {block.items.map((item) => <li key={item}>{item}</li>)}
        </ul>
      )
    case 'steps':
      return (
        <ol {...common} className="list-inside list-[upper-roman] space-y-3 marker:text-gold">
          {block.items.map((item) => <li key={item}>{item}</li>)}
        </ol>
      )
    default:
      return <p {...common} className={block.text.length < 40 ? big : ''}>{block.text}</p>
  }
}

/** Renders the inclusive range [from, to] of the current language's story. */
export function StoryText({ from, to }: { from: number; to: number }) {
  const { story } = useLanguage()
  return (
    <div className="space-y-6 text-[1.0625rem] font-light leading-[1.85] text-snow/90">
      {story.slice(from, to + 1).map((block, i) => <BlockView block={block} index={from + i} key={from + i} />)}
    </div>
  )
}

export function SceneTitle({ id, tone = 'text-gold' }: { id: string; tone?: string }) {
  const { t } = useLanguage()
  const number = sceneIds.indexOf(id) + 1
  return (
    <header className="mb-10">
      <p data-reveal className={`label ${tone}`}>{t.scene} {String(number).padStart(2, '0')}</p>
      <h2 data-reveal className="mt-4 font-serif text-5xl leading-none text-snow text-balance md:text-6xl lg:text-7xl">
        {t.scenes[id as keyof typeof t.scenes]}
      </h2>
    </header>
  )
}
