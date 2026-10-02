import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

import { create } from '../index.mjs'

test('implements the provider contract and keeps Codex Mirror separate', async () => {
  const manifest = JSON.parse(await readFile(new URL('../geckit-plugin.json', import.meta.url), 'utf8'))
  const calls = []
  const codex = {
    id: 'codex', family: 'codex',
    account: async () => ({ provider: 'codex', here: true, signedIn: true }),
    list: async () => [{ id: 'codex:session-1', title: 'Example', driven: true }],
    search: async () => [{ id: 'codex:session-1', root: '/work' }],
    create: async () => 'codex:session-2',
    fork: async (_root, id) => { calls.push(['fork', id]); return { id: 'codex:session-3', begun: true, items: [] } },
    read: async (_root, id) => { calls.push(['read', id]); return { items: [] } },
    goal: async (_root, id) => { calls.push(['goal', id]); return { status: 'active' } },
    rename: async (id) => { calls.push(['rename', id]) },
    delete: async (_root, id) => { calls.push(['delete', id]); return true },
    hold: (options, hear) => {
      calls.push(['hold', options.id])
      hear({ items: [], gone: [], signals: [{ kind: 'started', session: 'codex:session-1', key: false }] })
      return { send() {}, answer() {}, stop() {}, end() {} }
    },
  }
  const provider = create({ codex })
  const heard = []
  const methods = ['account', 'program', 'models', 'limits', 'list', 'search', 'hidden', 'create', 'fork', 'has', 'read', 'links', 'goal', 'setGoal', 'clearGoal', 'hold', 'rename', 'remote', 'mcp', 'browsers', 'correct', 'delete', 'dispose']

  assert.equal(manifest.provider.id, provider.id)
  assert.equal(manifest.provider.family, provider.family)
  assert.equal(manifest.provider.replaces, undefined)
  assert.equal(codex.family, 'codex')
  for (const method of methods) assert.equal(typeof provider[method], 'function')
  assert.equal((await provider.account()).provider, 'plugin:codex-mirror')
  assert.deepEqual(await codex.list(), [{ id: 'codex:session-1', title: 'Example', driven: true }])
  assert.deepEqual(await provider.list(), [{ id: 'plugin:codex-mirror:session-1', title: 'Example', driven: false }])
  assert.deepEqual(await provider.search(), [{ id: 'plugin:codex-mirror:session-1', root: '/work' }])
  assert.equal(await provider.create({ root: '/work', mode: 'auto' }), 'plugin:codex-mirror:session-2')
  assert.equal((await provider.fork('/work', 'plugin:codex-mirror:session-1')).id, 'plugin:codex-mirror:session-3')
  assert.deepEqual(await provider.read('/work', 'plugin:codex-mirror:session-1'), { items: [] })
  assert.deepEqual(await provider.goal('/work', 'plugin:codex-mirror:session-1'), { status: 'active' })
  await provider.rename('plugin:codex-mirror:session-1', 'Name')
  assert.equal(await provider.delete('/work', 'plugin:codex-mirror:session-1'), true)
  provider.hold({ id: 'plugin:codex-mirror:session-1' }, (event) => heard.push(event), () => {})
  assert.deepEqual(calls, [['fork', 'codex:session-1'], ['read', 'codex:session-1'], ['goal', 'codex:session-1'], ['rename', 'codex:session-1'], ['delete', 'codex:session-1'], ['hold', 'codex:session-1']])
  assert.equal(heard[0].signals[0].session, 'plugin:codex-mirror:session-1')
})
