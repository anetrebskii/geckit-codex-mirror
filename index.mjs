export const create = (host) => ({
  ...host.codex,
  id: 'plugin:codex-mirror',
  replaces: 'codex',
})
