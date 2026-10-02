import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

import { create } from '../index.mjs'

test('uses the built-in Codex provider and keeps Codex session IDs', async () => {
  const manifest = JSON.parse(await readFile(new URL('../geckit-plugin.json', import.meta.url), 'utf8'))
  const list = async () => [{ id: 'codex:session-1' }]
  const driver = { send() {}, answer() {}, stop() {}, end() {} }
  const hold = () => driver
  const codex = { id: 'codex', family: 'codex', list, hold }
  const provider = create({ codex })

  assert.equal(manifest.provider.id, provider.id)
  assert.equal(manifest.provider.replaces, provider.replaces)
  assert.equal(provider.list, list)
  assert.equal(provider.hold, hold)
  assert.deepEqual(await provider.list(), [{ id: 'codex:session-1' }])
  assert.equal(provider.hold(), driver)
})
