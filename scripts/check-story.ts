// Scene ranges index into the parsed stories, so both files must stay block-for-block parallel.
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { blockText, parseStory, type Block } from '../src/story/parse.ts'

const load = (lang: string) => parseStory(readFileSync(new URL(`../docs/1/${lang}.md`, import.meta.url), 'utf8'))
const shape = (b: Block) => b.type + ('items' in b ? b.items.length : '')

const vi = load('vi')
const en = load('en')
assert.deepEqual(vi.map(shape), en.map(shape))
assert.equal(en.length, 63)

// Anchors the scene map relies on.
assert.match(blockText(en[8]), /raven/)
assert.match(blockText(en[22]), /North is waiting/)
assert.match(blockText(en[7], -1), /castle/)
assert.match(blockText(en[23], 1), /Frostheim/)
assert.match(blockText(vi[7], -1), /lâu đài/)
assert.match(blockText(vi[23], 1), /Frostheim/)
assert.equal(en[41].type, 'list')
assert.equal(en[56].type, 'heading')
assert.ok(!blockText(en[0]).includes('⚔'))

console.log('story check ok')
