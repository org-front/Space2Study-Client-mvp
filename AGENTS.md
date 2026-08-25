# Agent workflow

Frontend MVP (Vite 4, React 17, MUI 5 `sx`, RTK, React Router 6, i18next `en`/`ua`, Vitest, Node 18). Working branch is `develop`.

Match the user's language. Student-facing comments in config files (Docker, Sonar, gitattributes) stay Ukrainian.

## Loop

1. Read the relevant `.cursor/rules/*.mdc` before editing that area.
2. Change only what the task needs. Do not drive-by refactor or rebrand leftover copy unless asked.
3. After UI/layout/routing changes, verify in the **built-in Browser** on `http://localhost:3000` (start `npm start` if it is not running). A screenshot is not enough — click the flow.
4. After behavior changes, run the matching Vitest spec, or `npm test` if the blast radius is wide.
5. Commit and push only when the user asks. Never commit `.env`, tokens, `node_modules`, or `tests/coverage`.

## MCP

Declared in `.cursor/mcp.json` (Cursor) and `.vscode/mcp.json` (VS Code Copilot Agent). Restart the editor after changing them.

| Need | Use |
| --- | --- |
| MUI 5 docs / examples | `mui-mcp` (`useMuiDocs`, `fetchDocs`). Repo is MUI 5 — do not copy MUI 7 codegen. |
| Vite 4, React 17, RTK, RR6, Vitest 0.28 | Context7, with those majors pinned |
| GitHub issues / PRs / Actions | GitHub MCP, or `/add-plugin github` (OAuth) |
| UI check | Built-in Browser on `http://localhost:3000` |
| Network (status, CORS, request/response) | `chrome-devtools` MCP. Do not control the same tab with Browser and DevTools together. |
| Code review | `/review-bugbot` or `/review-security`, not a review MCP |
| Unused imports | `npm run lint` |
| Dead files / unused exports / unused deps | `npx knip@5` (read-only). `@knip/mcp` needs Node 20; this repo is Node 18. |
| Local git | `git` in the terminal |

GitHub MCP reads `GITHUB_PERSONAL_ACCESS_TOKEN` from the **OS environment**. Context7 works without a key; optional `CONTEXT7_API_KEY` raises limits. Never paste tokens into JSON.

Do not use `@modelcontextprotocol/server-github` (deprecated). Do not add Playwright, Knip, or CodeRabbit MCP.

## Git and CI

- Line endings: LF (`.gitattributes`, Prettier, EditorConfig). Do not set `core.autocrlf=true`.
- CI (`.github/workflows/main.yaml`): `npm ci`, `npm run lint` (`src` + `tests`), `npm test` (coverage for Sonar). Sonar runs only if `SONAR_TOKEN` is set.
- Pre-commit: lint-staged on staged JS/TS. There is no pre-push test hook — do not add `npm test` back there.
- Docker is a **Vite dev** image (`docker compose up --build`), not nginx.

## Stack facts the model often gets wrong

- Async work: `createAsyncThunk`, not sagas.
- Styles: `{Name}.styles.js` objects + MUI `sx`, not CSS modules / styled-components as the default.
- API: `axiosClient` + `src/services/*`.
- Aliases: `~/` → `src/`, `~tests/` → `tests/`.
- Vite env: only `VITE_*`. They are inlined at `vite build`; the Docker **dev** server reads them at runtime from Compose.
