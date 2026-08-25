Follow `AGENTS.md` in this repository (stack, git, MCP policy).

This is Vite 4 + React 17 + MUI 5 (`develop`). Do not generate MUI 7 or React 19 APIs. Async work uses `createAsyncThunk`. Tests: Vitest 0.28 + `tests/test-utils.jsx`. Live UI and network: `chrome-devtools` MCP (no Cursor Browser). Unused imports: `npm run lint`. Dead code: `npx knip@5` (report only). Commit only when asked. Never commit `.env` or tokens.
