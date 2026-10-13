# Global Antigravity rule (bundled)

Source of truth for the machine-wide rule file:

`%USERPROFILE%\.gemini\config\AGENTS.md` (Linux/macOS: `~/.gemini/config/AGENTS.md`)

After `npm install` or `npm run setup-settings`, `src/ensureGlobalRules.js` copies `AGENTS.md` from this folder into that path so every `agy` / agy-auto session loads it.

Edit `AGENTS.md` here, then run `npm run setup-settings` to refresh local installs.
