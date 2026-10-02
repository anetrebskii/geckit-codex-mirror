# Codex Mirror for GeckIt

An experimental Codex provider plugin with a different name and icon. It starts as a complete editable implementation of GeckIt's provider contract, adapting Codex operations.

In GeckIt, open Settings > Libraries and add `https://github.com/anetrebskii/geckit-codex-mirror`. Codex Mirror then appears as a separate assistant in Settings > Assistants and the chat assistant menu.

Codex and Codex Mirror have separate switches. Both show the same Codex conversations under different IDs, so a conversation can appear twice. Turning off either assistant hides only its own copy. Both use the same Codex account and process; deleting a conversation from either assistant removes the underlying Codex conversation for both.

The manifest declares the name and icon. `index.mjs` lists every provider capability and operation explicitly, translating session IDs and stream events into its own namespace. Change any method to add custom AI behavior, use another CLI, or provide a different service; GeckIt keeps communicating through the same provider contract.
