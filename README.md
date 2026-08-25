# Client MVP

Frontend of an educational marketplace: students look for tutors, tutors publish offers, and both sides manage profiles and cooperations.

## Tech stack

| Area | Used in this repo |
| --- | --- |
| UI | React 17, MUI 5 (`@mui/material`, Emotion), MUI X Date Pickers |
| Bundler | Vite 4 |
| State | Redux Toolkit (`configureStore`, `createSlice`, `createAsyncThunk`) |
| Routing | React Router 6 (`createBrowserRouter`, lazy routes) |
| HTTP | Axios (`src/plugins/axiosClient.js`), interceptors for JWT refresh |
| i18n | i18next / react-i18next (`en`, `ua`) |
| Auth extras | Google Identity Services (`accounts.google.com/gsi/client`) |
| Dates | `date-fns` |
| Tests | Vitest, Testing Library, jsdom |
| Quality | ESLint, Prettier, Husky, lint-staged |
| Runtime | Node.js 18 |
| Containers | Docker, Docker Compose |
| CI | GitHub Actions (lint, tests) |

The source is mostly JSX/JS. TypeScript is configured (`tsconfig.json`, `src/vite-env.d.ts`) and used for Vite/Vitest config.

How to use Cursor Agent, VS Code Copilot Agent, Bugbot, and MCP: [docs/agents.md](docs/agents.md) (Ukrainian). Cursor rules: `AGENTS.md` + `.cursor/rules/`. VS Code: `.github/copilot-instructions.md` + `.vscode/mcp.json`.

## Requirements

- Node.js 18.x (Docker image uses `18.14.0`)
- npm
- A running API on the URL you set in `.env` (Compose defaults to `http://localhost:8080`)

## Setup

```shell
npm install
```

Create a `.env` file in the project root:

```env
VITE_API_BASE_PATH=http://localhost:8080
VITE_GMAIL_CLIENT_ID=
VITE_APP_IMG_URL=
VITE_APP_IMG_USER_URL=
```

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE_PATH` | API base URL for Axios |
| `VITE_GMAIL_CLIENT_ID` | Google Sign-In client id |
| `VITE_APP_IMG_URL` | Public images base URL |
| `VITE_APP_IMG_USER_URL` | User avatars base URL |

Vite only exposes variables that start with `VITE_`.

## Scripts

```shell
npm start          # Vite dev server, http://localhost:3000
npm run build      # Production build
npm run serve      # Preview the production build on port 3000
npm test           # Vitest with coverage (CI / Sonar)
npm run lint       # ESLint on src and tests
npm run lint-fix   # ESLint with --fix
```

Pre-commit runs lint-staged (ESLint `--fix` on staged JS/TS, including tests). Full tests with coverage run in GitHub Actions, not on push.

### Line endings (Windows vs macOS/Linux)

The repo uses **LF** everywhere (`.gitattributes`, Prettier `endOfLine: lf`, `.editorconfig`). Do not switch Git to CRLF. If ESLint/Prettier reports `Delete CR` or `CRLF` after a pull:

```shell
git add --renormalize .
git checkout -- .
```

## Docker

Dev container: Vite on `http://localhost:3000` (not a production nginx image).

```shell
docker compose up --build
```

`VITE_API_BASE_PATH` defaults to `http://localhost:8080` (the API as seen from the browser). Optional Google/image URLs can be set in a local `.env` next to `compose.yaml` — Compose reads `VITE_GMAIL_CLIENT_ID`, `VITE_APP_IMG_URL`, and `VITE_APP_IMG_USER_URL` from there.

## Agents and MCP

Student guide: [docs/agents.md](docs/agents.md).

| Editor | Instructions | MCP |
| --- | --- | --- |
| Cursor | `AGENTS.md`, `.cursor/rules/*.mdc` | `.cursor/mcp.json` |
| VS Code + Copilot Agent | `.github/copilot-instructions.md` | `.vscode/mcp.json` |
| Claude Code CLI | `CLAUDE.md` (`@AGENTS.md`) | `.mcp.json` |
| Codex CLI | `AGENTS.md` | `.codex/config.toml` (trusted workspace) |
| Gemini CLI | `GEMINI.md` | `.gemini/settings.json` |

Restart the editor or CLI after pulling MCP changes. In VS Code open Copilot Chat in **Agent** mode (`chat.mcp.enabled` is on in `.vscode/settings.json`). Claude Code: run `claude` in the repo root and approve `.mcp.json` servers on first use. Codex only loads `.codex/config.toml` in a **trusted** folder.

| Server | What it is for | Auth |
| --- | --- | --- |
| `mui-mcp` | Official Material UI docs (`npx @mui/mcp`). This app is **MUI 5**. | None |
| `context7` | Version-specific docs (Vite 4, React 17, Vitest 0.28, …) | Optional `CONTEXT7_API_KEY` |
| `github` | Issues, PRs, Actions | `GITHUB_PERSONAL_ACCESS_TOKEN` or `/add-plugin github` |
| `chrome-devtools` | Live Chrome: network, console, performance | Local Chrome |
| Built-in Browser | Cursor Agent click-through on `:3000` | Enable in Cursor Agent tools |

**Not MCP (on purpose).** Code review: Cursor Bugbot / Security Review. Unused imports: `npm run lint`. Dead files/exports/deps: `npx knip@5` (Node 18). Official `@knip/mcp` needs Node 20+, so it is not in this repo.

Do not add Playwright MCP unless you introduce Playwright tests. Do not put tokens in JSON files. Do not drive the same page with Browser and Chrome DevTools at once.

**GitHub token** (skip this if you use `/add-plugin github`):

```powershell
[System.Environment]::SetEnvironmentVariable("GITHUB_PERSONAL_ACCESS_TOKEN", "ghp_your_token", "User")
```

Then restart the editor. Never commit a GitHub PAT. `@modelcontextprotocol/server-github` is deprecated — this repo does not use it. In Cursor you can skip the env var and use `/add-plugin github`.

## Project structure

```
src/
  assets/        Static files (svg, images)
  components/    Reusable UI pieces
  constants/     Shared constants and i18n JSON
  containers/    Feature-level UI (layout, auth dialogs, home blocks)
  context/       Modal, snackbar, confirm, step providers
  hooks/         Shared hooks
  pages/         Route-level screens
  plugins/       Axios client, i18n init
  redux/         Store and app slice
  router/        Route trees and helpers
  services/      API and localStorage helpers
  styles/        MUI theme
  utils/         Pure helpers and validators
tests/
  unit/          Vitest specs, mirrored after `src/`
```

Path aliases: `~/` → `src/`, `~tests/` → `tests/`.

## Conventions

- **State.** App auth/session lives in one Redux Toolkit slice (`src/redux/reducer.js`). Async work uses `createAsyncThunk`, not sagas.
- **Styles.** Component styles are plain objects in `{Name}.styles.js` and passed to MUI `sx`. The theme is `createTheme` in `src/styles/app-theme/`.
- **Components.** Presentational pieces go in `components/`. Feature blocks go in `containers/`. Screens go in `pages/`. Import the component file directly (there is no required `index.js` barrel).
- **API.** Call the backend through `axiosClient` and `src/services/*`. Do not fetch from UI components directly when a service already exists.

## Tests

Unit tests run in jsdom via Vitest. Coverage reports go to `tests/coverage/`.

Do not unit-test third-party libraries, translation JSON, or static theme tokens. Prefer Testing Library queries over implementation details.

## License

MIT. See [LICENSE](LICENSE).
