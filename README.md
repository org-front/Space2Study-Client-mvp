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
npm test           # Vitest with coverage
npm run lint       # ESLint
npm run lint-fix   # ESLint with --fix
```

Pre-commit runs lint-staged (ESLint on staged JS/TS files). Pre-push runs `npm test`.

### Line endings (Windows vs macOS/Linux)

The repo uses **LF** everywhere (`.gitattributes`, Prettier `endOfLine: lf`, `.editorconfig`). Do not switch Git to CRLF. If ESLint/Prettier reports `Delete CR` or `CRLF` after a pull:

```shell
git add --renormalize .
git checkout -- .
```

## Docker

```shell
docker compose up --build
```

The Compose service maps port `3000` and sets `VITE_API_BASE_PATH=http://localhost:8080`. It expects an external Docker network named `s2s-network`.

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
