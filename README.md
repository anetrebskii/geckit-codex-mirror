# Codex Mirror for GeckIt

An experimental Codex provider plugin with a different name and icon. It starts as a complete editable implementation of GeckIt's provider contract, forwarding every operation to Codex.

In GeckIt, open Settings > Assistants and add `https://github.com/anetrebskii/geckit-codex-mirror` under "Add provider from GitHub". Select Codex Mirror in the assistant menu.

The plugin replaces the built-in Codex choice. It keeps `codex:` session IDs, so existing conversations stay in place. Remove its folder from GeckIt's `provider-plugins` data folder and restart to return to the built-in name and icon.

The manifest declares the name and icon. `index.mjs` lists every provider capability and operation explicitly. Change any method to add custom AI behavior, use another CLI, or provide a different service; GeckIt keeps communicating through the same provider contract.
