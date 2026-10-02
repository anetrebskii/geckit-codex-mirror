# Codex Mirror for GeckIt

An experimental Codex provider plugin with a different name and icon. It uses GeckIt's Codex provider, including the same conversations, streaming, controls, limits, and browsers.

In GeckIt, open Settings > Assistants and add `https://github.com/anetrebskii/geckit-codex-mirror` under "Add provider from GitHub". Select Codex Mirror in the assistant menu.

The plugin replaces the built-in Codex choice. It keeps `codex:` session IDs, so existing conversations stay in place. Uninstall it in Settings to return to the built-in name and icon.

The manifest declares the name and icon. `index.mjs` delegates the provider contract to `host.codex`; it has no separate Codex process or account.
