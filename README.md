# Antigravity 破甲

**antigravity-pojia** — local **OpenAPI-style backend** for [Google Antigravity](https://antigravity.google/) CLI (`agy`).

Turn Antigravity into a headless, auto-approving agent service you can drive from **any frontend** (or Cursor / OpenAI-compatible clients).

**`npm install`** also installs a bundled **global rule** (`rules/global/AGENTS.md` → `~/.gemini/config/AGENTS.md`) so every local **`agy`** session (CLI, agy-auto, AGY Studio, IDE) loads the same always-on rules — no manual IDE Global Rules paste. See [Global rule install](#global-rule-install-破甲).

| Built-in Antigravity | **Antigravity 破甲** |
| --- | --- |
| Click Accept / Run all day | Forced `--dangerously-skip-permissions` |
| One Google login per machine | Multi-account profiles (cookie-style switch, no re-browser after save) |
| IDE / TUI only | HTTP + SSE for custom UIs |
| `/usage` inside the app | `GET /v1/usage` — same quota panel fields as official UI |
| Subagents in `/agents` | Streamed over SSE + transcript API (incl. subagent `thinking`) |
| Global rules only in IDE UI | **`npm install` installs bundled `AGENTS.md` → `~/.gemini/config/`** (all `agy` sessions) |

> Not affiliated with Google. Uses your already-installed `agy` + local OAuth. Keep it on localhost / LAN.  
> 原仓库名 **agy-auto** 已更名为 **antigravity-pojia**（展示名 **Antigravity 破甲**）；旧 clone URL 请改指向新地址。

---

## Features

- **Auto-approve** every tool call in headless mode
- **Bundled global rule (“破甲”)** — ships `rules/global/AGENTS.md` and installs it as Antigravity **global rule** on every machine (see below)
- **Built-in default agent** — same agent and tools as the Antigravity desktop app (override per request with `agent`)
- **SSE streaming** — `text_delta` / `tool` / `subagent` / `result`
- **Account switcher** — save & restore Windows Credential Manager snapshots
- **Model list + prefs** — default model / cwd / agent
- **Quota panel parity** — Gemini Models / Claude and GPT models × Weekly + Five Hour limits
- **Subagent transcripts** — read `thinking` from brain `transcript.jsonl`
- Small **web console** under `web/` (optional)

Full frontend contract: **[docs/API.md](docs/API.md)**  
Capability probe: `GET /v1/capabilities`

---

## Requirements

- Windows (Credential Manager path used for account switch; Linux/macOS may need file-storage tweaks)
- [Antigravity CLI](https://antigravity.google/docs/cli/install/) (`agy`) installed & logged in once
- Node.js 18+

```powershell
# Install agy (official)
irm https://antigravity.google/cli/install.ps1 | iex
agy   # browser login once
```

---

## Quick start

```powershell
git clone https://github.com/cqqybrn/antigravity-pojia.git
cd antigravity-pojia

# npm install runs postinstall: always-proceed settings + bundled global AGENTS.md → ~/.gemini/config/
npm install

# Re-apply settings / global rule after editing rules/global/AGENTS.md
# npm run setup-settings

# Save current Google login as a named profile
node bin/agy-auto.js account save default

# Start API (default http://127.0.0.1:8787)
npm start
# or: .\start-server.cmd
```

Open `http://127.0.0.1:8787` for the bundled console, or point your own frontend at the API.

### Global rule install (“破甲”)

Antigravity loads **global rules** from `~/.gemini/config/` (Windows: `%USERPROFILE%\.gemini\config\AGENTS.md`). That is **not** inside `agy.exe`; it is the official customization path (same as IDE **Global Rules**).

| What | Where |
| --- | --- |
| **Git source (edit & commit)** | `rules/global/AGENTS.md` |
| **Installed copy (runtime)** | `~/.gemini/config/AGENTS.md` |
| **Installer** | `src/ensureGlobalRules.js` |

**When it runs**

- `npm install` → `postinstall` → `npm run setup-settings` (settings + global rule)
- `npm start` → refreshes global rule once at server boot
- Manual: `npm run setup-settings` or `node bin/agy-auto.js --setup-settings`

**Who picks it up**

Any local **`agy`** session: agy-auto CLI/API, **AGY Studio**, Antigravity IDE/CLI — same file, same behavior.

**Customize / disable**

- Change behavior: edit `rules/global/AGENTS.md`, then `npm run setup-settings`
- Remove from disk only: delete `~/.gemini/config/AGENTS.md` (clone again + `npm install` to restore bundled copy)
- Do not commit `%USERPROFILE%\.gemini\config\` — that path is per-user, gitignored by nature

Details: **[rules/global/README.md](rules/global/README.md)**

### LAN / second machine (frontend elsewhere)

```powershell
$env:HOST = "0.0.0.0"
$env:PORT = "8787"
$env:AGY_API_KEY = "change-me-long-secret"
npm start
```

Frontend base URL: `http://<this-pc-lan-ip>:8787`  
Header: `Authorization: Bearer change-me-long-secret`

---

## API cheat sheet

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Health + active account |
| `GET` | `/v1/models` | Models from `agy models` |
| `GET` | `/v1/usage` | Official-shaped quota panel |
| `GET` | `/v1/accounts` | Saved profiles |
| `POST` | `/v1/accounts/switch` | Switch profile (no browser) |
| `POST` | `/v1/agent` | One-shot agent run |
| `POST` | `/v1/agent/stream` | **SSE** stream (recommended) |
| `POST` | `/v1/agent/abort` | Cancel a run |
| `GET` | `/v1/transcripts/:id` | Subagent log (+ thinking) |
| `GET` | `/v1/capabilities` | What works / what’s missing |
| `POST` | `/v1/chat/completions` | OpenAI-compatible shim |

```powershell
curl -N -X POST http://127.0.0.1:8787/v1/agent/stream ^
  -H "Content-Type: application/json" ^
  -d "{\"prompt\":\"hello\",\"model\":\"gemini-3.8-flash-low\"}"
```

---

## Security

- **Never commit** `accounts/` — it holds OAuth blobs / API keys (gitignored)
- Quota refresh reads the Antigravity CLI OAuth client from the installed `agy` binary (or `AGY_OAUTH_CLIENT_ID` / `AGY_OAUTH_CLIENT_SECRET`); nothing is hardcoded in the repo
- Auto-approve can write files and run shell commands — only use on machines you trust
- Prefer `127.0.0.1`; if binding `0.0.0.0`, always set `AGY_API_KEY`
- Not for exposing on the public internet

---

## Project layout

```text
bin/agy-auto.js          CLI wrapper + account commands
rules/global/AGENTS.md   Bundled Antigravity global rule (source)
src/ensureGlobalRules.js Install AGENTS.md → ~/.gemini/config/
scripts/run-setup-settings.js  postinstall: settings + global rule
src/server.js            HTTP + SSE server
src/agyRunner.js         agy spawn / stream normalize / transcripts
src/accounts.js          multi-account profiles
src/usage.js             Cloud Code quota (official panel parity)
src/models.js            model list + prefs
docs/API.md              Frontend integration doc
web/                     Optional console UI
```

---

## Limits (honest)

| Item | Status |
| --- | --- |
| Main-agent separate thought stream | Not in `agy` headless (IDE/SDK only). Use `thinking_tokens` + subagent transcript `thinking`. |
| AI Credits balance (`/credits`) | Not wired yet |
| Kill one subagent only | Abort whole parent run only |

---

## License

MIT — see repository; Google Antigravity itself remains under Google’s terms. Use at your own risk.
