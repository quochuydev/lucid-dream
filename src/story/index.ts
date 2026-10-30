import en from '../../docs/1/en.md?raw'
import vi from '../../docs/1/vi.md?raw'
import { parseStory, type Block } from './parse'

export type Lang = 'vi' | 'en'

export const stories: Record<Lang, Block[]> = { vi: parseStory(vi), en: parseStory(en) }

const srcsets = import.meta.glob<string>('../../docs/1/*.png', {
  eager: true,
  import: 'default',
  query: { w: '640;1280;1920', format: 'webp', quality: '76', withoutEnlargement: 'true', as: 'srcset' },
})
const fallbacks = import.meta.glob<string>('../../docs/1/*.png', {
  eager: true,
  import: 'default',
  query: { w: '1280', format: 'webp', quality: '76', withoutEnlargement: 'true' },
})

export const image = (n: number) => ({
  srcSet: srcsets[`../../docs/1/${n}.png`],
  src: fallbacks[`../../docs/1/${n}.png`],
})

export type SceneConfig = {
  id: string
  /** Asset number in docs/1. */
  image: number
  /** Inclusive block range in the story. */
  blocks: [number, number]
  layout: 'full' | 'split'
  align?: 'left' | 'right' | 'center'
  imageSide?: 'left' | 'right'
  focus?: string
  quote?: number
  warm?: boolean
  glow?: boolean
  clipReveal?: boolean
  particles?: 'snow' | 'ice' | 'ember'
}

// Hero, map and ending have their own components; these are the plain story scenes.
export const scenes: SceneConfig[] = [
  { id: 'kingdom', image: 2, blocks: [2, 7], layout: 'full', align: 'left', focus: '50% 40%', particles: 'snow' },
  { id: 'raven', image: 3, blocks: [8, 12], layout: 'split', imageSide: 'right', focus: '58% 50%', particles: 'ice' },
  { id: 'sword', image: 4, blocks: [13, 17], layout: 'full', align: 'center', focus: '68% 50%', glow: true, particles: 'ice' },
  { id: 'village', image: 5, blocks: [18, 19], layout: 'full', align: 'left', focus: '55% 50%', particles: 'snow' },
  { id: 'tavern', image: 6, blocks: [20, 34], layout: 'split', imageSide: 'left', focus: '40% 60%', warm: true, particles: 'ember' },
  { id: 'knight', image: 7, blocks: [35, 37], layout: 'full', align: 'right', focus: '30% 50%', quote: 22 },
  { id: 'horse', image: 8, blocks: [38, 39], layout: 'full', align: 'left', focus: '90% 50%', clipReveal: true, particles: 'snow' },
]

export const sceneIds = ['forest', ...scenes.map((s) => s.id), 'map', 'journey']

export type Place = { id: string; x: number; y: number; block: number; sentence?: number; item?: number }

// Percent positions on 9.png; text comes from the story itself.
export const places: Place[] = [
  { id: 'forest', x: 65, y: 62, block: 41, item: 0 },
  { id: 'castle', x: 50.5, y: 49.5, block: 7, sentence: -1 },
  { id: 'dwarves', x: 82, y: 29, block: 41, item: 1 },
  { id: 'sea', x: 14, y: 39, block: 41, item: 2 },
  { id: 'frostheim', x: 67.5, y: 14, block: 23, sentence: 1 },
]
