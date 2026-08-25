# Copilot / VS Code Agent

This is a Vite 4 + React 17 + MUI 5 frontend (`develop`). Follow `AGENTS.md` for the full loop. You do not see Cursor `.mdc` rules — this file is the substitute.

## Stack (do not upgrade in generated code)

- React 17, MUI 5 `sx` + `{Name}.styles.js`, not MUI 7 Grid / CSS modules as default
- Redux Toolkit `createAsyncThunk`, not sagas
- React Router 6 `createBrowserRouter`; tests use `renderWithProviders` in `tests/test-utils.jsx`
- HTTP: `axiosClient` and `src/services/*`
- i18n: `en` / `ua` keys under `src/constants/translations/`
- Vitest 0.28: no `vi.hoisted`; do not `vi.mock('~/hooks/...')` expecting it to replace the component import
- Node 18, LF line endings. Do not set `core.autocrlf=true`
- Docker is Vite `npm start`, not nginx

## MCP (`.vscode/mcp.json`)

| Need | Use |
| --- | --- |
| MUI 5 docs | `mui-mcp`: `useMuiDocs` then `fetchDocs`. Not MUI 7 codegen |
| Vite 4 / React 17 / RTK / RR6 / Vitest 0.28 | Context7, pin those majors |
| GitHub issues / PRs | `github` MCP if `GITHUB_PERSONAL_ACCESS_TOKEN` is set, else `gh` |
| Live UI and network on `:3000` | `chrome-devtools` (VS Code has no Cursor Browser) |
| Unused imports | `npm run lint` |
| Dead files / exports / deps | `npx knip@5` (report only). Do not add `@knip/mcp` |

Do not add Playwright, Knip, or CodeRabbit MCP. Never put a PAT in a committed JSON file.

There is no Cursor Bugbot here. Review by reading the diff; do not invent a review MCP.

Commit and push only when the user asks. Never commit `.env`, tokens, `node_modules`, or `tests/coverage`.
