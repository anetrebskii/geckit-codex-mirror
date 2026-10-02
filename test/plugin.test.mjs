import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

import { create } from '../index.mjs'

test('implements every provider operation and keeps Codex session IDs', async () => {
  const manifest = JSON.parse(await readFile(new URL('../geckit-plugin.json', import.meta.url), 'utf8'))
  const list = async () => [{ id: 'codex:session-1' }]
  const driver = { send() {}, answer() {}, stop() {}, end() {} }
  const methods = ['account', 'program', 'models', 'limits', 'search', 'hidden', 'create', 'fork', 'has', 'read', 'links', 'goal', 'setGoal', 'clearGoal', 'rename', 'remote', 'mcp', 'browsers', 'correct', 'delete', 'dispose']
  const codex = Object.fromEntries(methods.map((method) => [method, async (...args) => [method, ...args]]))
  Object.assign(codex, { available: true, localOnly: true, subscriptionOnly: true, images: true, remoteControl: false, nativeGoals: true, idleMs: 1, waitForExit: true, list, hold: () => driver })
  const provider = create({ codex })

  assert.equal(manifest.provider.id, provider.id)
  assert.equal(manifest.provider.replaces, provider.replaces)
  assert.deepEqual(await provider.list(), [{ id: 'codex:session-1' }])
  assert.equal(provider.hold(), driver)
  for (const method of methods) assert.equal(typeof provider[method], 'function')
  assert.deepEqual(await provider.create('root', 'auto'), ['create', 'root', 'auto'])
})
