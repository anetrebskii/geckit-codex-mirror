const family = 'plugin:codex-mirror'
const mirror = (id) => `${family}:${id.slice('codex:'.length)}`
const codexId = (id) => `codex:${id.slice(family.length + 1)}`
const forward = (provider, method) => (...args) => provider[method](...args)

export const create = (host) => {
  const codex = host.codex
  return {
    id: family,
    family,
    name: 'Codex Mirror',
    shortName: 'Codex Mirror',
    icon: 'codex-mirror',
    browser: 'codex',
    loginCommand: 'codex login',
    planName: 'ChatGPT',
    runtime: 'codex',
    available: codex.available,
    localOnly: codex.localOnly,
    subscriptionOnly: codex.subscriptionOnly,
    images: codex.images,
    remoteControl: codex.remoteControl,
    nativeGoals: codex.nativeGoals,
    idleMs: codex.idleMs,
    waitForExit: codex.waitForExit,
    account: async () => ({ ...await codex.account(), provider: family }),
    program: forward(codex, 'program'),
    models: forward(codex, 'models'),
    limits: forward(codex, 'limits'),
    list: async (roots) => (await codex.list(roots)).map((row) => ({ ...row, id: mirror(row.id), driven: false })),
    search: async (roots, asked) => (await codex.search(roots, asked)).map((found) => ({ ...found, id: mirror(found.id) })),
    hidden: forward(codex, 'hidden'),
    create: async (options) => mirror(await codex.create(options)),
    fork: async (root, id, at, mode, model) => {
      const result = await codex.fork(root, codexId(id), at, mode, model)
      return { ...result, id: mirror(result.id) }
    },
    has: (root, id) => codex.has(root, codexId(id)),
    read: (root, id) => codex.read(root, codexId(id)),
    links: (root, id) => codex.links(root, codexId(id)),
    goal: (root, id) => codex.goal(root, codexId(id)),
    setGoal: (id, objective) => codex.setGoal(codexId(id), objective),
    clearGoal: (id) => codex.clearGoal(codexId(id)),
    hold: (options, hear, left) => codex.hold({ ...options, id: codexId(options.id) }, (heard) => hear({
      ...heard,
      signals: heard.signals.map((signal) => signal.kind === 'started' ? { ...signal, session: mirror(signal.session) } : signal),
    }), left),
    rename: (id, name, driver) => codex.rename(codexId(id), name, driver),
    remote: forward(codex, 'remote'),
    mcp: forward(codex, 'mcp'),
    browsers: forward(codex, 'browsers'),
    correct: forward(codex, 'correct'),
    delete: (root, id) => codex.delete(root, codexId(id)),
    dispose: () => {},
  }
}
