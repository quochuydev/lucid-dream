export type Block =
  | { type: 'heading' | 'paragraph' | 'quote'; text: string }
  | { type: 'list' | 'steps'; items: string[] }

const stripEmoji = (s: string) => s.replace(/[\p{Extended_Pictographic}️]/gu, '').trim()

/** Splits a story file into blocks. Block 0 is the title; indexes match across languages. */
export function parseStory(markdown: string): Block[] {
  return markdown
    .replace(/\r\n/g, '\n')
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk): Block => {
      if (chunk.startsWith('- ')) return { type: 'list', items: chunk.split('\n').map((l) => l.slice(2).trim()) }
      if (/^\d+\. /.test(chunk)) return { type: 'steps', items: chunk.split('\n').map((l) => l.replace(/^\d+\. /, '').trim()) }
      if (chunk.startsWith('#')) return { type: 'heading', text: stripEmoji(chunk.replace(/^#+\s*/, '')) }
      const text = stripEmoji(chunk)
      return { type: text.startsWith('"') ? 'quote' : 'paragraph', text }
    })
}

/** Plain text of a paragraph-like block, or one sentence (negative counts from the end). */
export function blockText(block: Block, sentence?: number): string {
  if (!('text' in block)) return ''
  return sentence === undefined ? block.text : block.text.split(/(?<=\.)\s+/).at(sentence) ?? block.text
}
