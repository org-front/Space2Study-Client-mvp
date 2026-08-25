# Робота з агентами в цьому репо

Це інструкція **для людей**. Інструкції **для моделі** не треба вставляти в чат: Cursor — `AGENTS.md` і `.cursor/rules/`; VS Code Copilot — `.github/copilot-instructions.md`; Claude Code — `CLAUDE.md`; Codex — `AGENTS.md`; Gemini — `GEMINI.md`.

Робоча гілка: `develop`. Стек: React 17, Vite 4, MUI 5, Redux Toolkit, React Router 6, Vitest, Node 18.

## Що лежить у репо і навіщо

| Файл | Для кого | Навіщо |
| --- | --- | --- |
| `AGENTS.md` | Агент | Цикл роботи: не чіпати зайве, перевіряти UI, не комітити секрети |
| `.cursor/rules/project.mdc` | Агент (завжди) | Стек, гілка, LF, Docker = Vite-dev |
| `.cursor/rules/src.mdc` | Агент (коли відкритий `src/`) | MUI `sx`, thunks, `axiosClient` |
| `.cursor/rules/tests.mdc` | Агент (коли відкриті `tests/`) | Vitest 0.28, `renderWithProviders` |
| `.cursor/rules/docker.mdc` | Агент (Dockerfile / Compose) | Не збирати «прод» nginx |
| `.cursor/rules/mcp.mdc` | Агент (завжди) | Який MCP / CLI на яку задачу |
| `.cursor/mcp.json` | Cursor | GitHub, Context7, MUI, Chrome DevTools |
| `.vscode/mcp.json` | VS Code Copilot Agent | Ті самі сервери (`servers`, не `mcpServers`) |
| `.github/copilot-instructions.md` | GitHub Copilot | Заміна `.cursor/rules` у VS Code |
| `CLAUDE.md` + `.mcp.json` | Claude Code CLI | `@AGENTS.md` + ті самі MCP (`type` обов’язковий для HTTP) |
| `.codex/config.toml` | Codex CLI | MCP у TOML; лише в **trusted** workspace |
| `GEMINI.md` + `.gemini/settings.json` | Gemini CLI | Інструкції + MCP |

Після `git pull` перезапустіть редактор або CLI, інакше MCP може не підхопитись.

## Які агенти вміють цей флоу

Працює все, що відкриває **корінь репо** як workspace.

### Cursor

| Агент | Читає `AGENTS.md` + `.cursor/rules` | MCP з `.cursor/mcp.json` | Коли користуватись |
| --- | --- | --- | --- |
| **Cursor Agent** | Так | Так | Основний спосіб у Cursor |
| **Plan** | Так (читає код) | Зазвичай ні, поки не перейдете в Agent | Велика задача з кількома варіантами |
| **Ask** | Так | Обмежено | «Поясни», без правок файлів |
| **Cursor CLI** | Так | Так | Те саме з термінала |
| **Cloud Agent** | Так, якщо репо підключене | Secrets у дашборді Cursor | Довгі задачі поза IDE |
| **Bugbot** / **Security Review** | Diff | Ні | Рев’ю змін / PR |

Tab / inline autocomplete правила майже не читає.

### VS Code (GitHub Copilot)

Потрібні розширення **GitHub Copilot** + **GitHub Copilot Chat** і режим **Agent** у чаті (не звичайний Ask).

| Що | Де |
| --- | --- |
| Інструкції для моделі | `.github/copilot-instructions.md` (і `AGENTS.md`, якщо Copilot його підхоплює) |
| MCP | `.vscode/mcp.json` — у `.vscode/settings.json` увімкнено `chat.mcp.enabled` |
| UI / мережа | `chrome-devtools` (немає Cursor Browser і Bugbot) |

Command Palette: `MCP: List Servers`. Якщо `github` червоний — немає `GITHUB_PERSONAL_ACCESS_TOKEN`; MUI і Context7 мають працювати без ключа.

**Не підхоплюють флоу:** ChatGPT / Claude у браузері, Copilot **completions** (сірий текст), агент в іншій папці без цих файлів.

### CLI (Claude Code, Codex, Gemini)

Запускати з **кореня репо**. Ті самі MCP-сервери, інші файли. Немає Cursor Browser і Bugbot — UI/мережа через `chrome-devtools`.

| CLI | Старт | Інструкції | MCP | Перший запуск |
| --- | --- | --- | --- | --- |
| **Claude Code** | `claude` | `CLAUDE.md` імпортує `AGENTS.md` | `.mcp.json` | Підтвердити project MCP у інтерактивній сесії |
| **Codex** | `codex` | `AGENTS.md` | `.codex/config.toml` | Довірити workspace, інакше TOML ігнорується |
| **Gemini CLI** | `gemini` | `GEMINI.md` | `.gemini/settings.json` | `/mcp` щоб перевірити сервери |

Токен GitHub — змінна `GITHUB_PERSONAL_ACCESS_TOKEN` у середовищі оболонки, з якої стартує CLI.

## Що для чого: задача → інструмент

Агент обирає інструмент сам, якщо ви назвали задачу нормально. Нижче — що **має** статись.

| Задача | Хто / що | Не треба |
| --- | --- | --- |
| Написати / змінити UI, роути, Redux | Cursor Agent + правила `src` | Новий UI-фреймворк |
| Документація MUI 5 (`sx`, Date Pickers) | MCP `mui-mcp` (`useMuiDocs`) | Копіювати приклади MUI 7 |
| Документація Vite 4 / React 17 / RTK / RR6 / Vitest 0.28 | MCP `context7` (пін **цих** мажорів) | «як у React 19» |
| Кліки по екрану на `http://localhost:3000` | Cursor: вбудований **Browser**. VS Code: `chrome-devtools` | Playwright MCP |
| Мережа: 401, CORS, тіло Axios | MCP `chrome-devtools` | Водити ту саму вкладку Browser + DevTools одночасно |
| Issue / PR / Actions | MCP `github` або `/add-plugin github` | PAT у файлі в git |
| Рев’ю коду | Cursor: `/review-bugbot` або `/review-security`. VS Code: Copilot Agent по diff | CodeRabbit MCP |
| Невикористані імпорти | `npm run lint` (pre-commit + CI) | Окремий MCP |
| Мертві файли / експорти / залежності | `npx knip@5` (лише звіт) | `@knip/mcp` (потрібен Node 20, у нас 18) |
| Lint + тести з coverage | GitHub Actions | Pre-push хук (його навмисно немає) |

## Як питати агента

Коротко і з результатом, не «покращ код».

- «Додай валідацію email у `SignupForm` і покрий Vitest.»
- «У логіні Axios падає з CORS — подивись мережу через chrome-devtools, `npm start` уже запущений.»
- «Зроби рев’ю незакомічених змін через Bugbot.»
- «Не коміть і не пуш, поки я не скажу.»

Агент комітить і пушить **лише коли ви просите**. Не кладіть у чат і не просіть закомітити `.env` чи GitHub-токени.

## Мінімальне налаштування студента

### Cursor

1. Відкрити **корінь** репо, режим **Agent**, у tools увімкнути Browser.
2. `mui-mcp` і `context7` без ключів. GitHub: `/add-plugin github` або `GITHUB_PERSONAL_ACCESS_TOKEN`.
3. Chrome для `chrome-devtools`. Node 18, `.env` як у README, API на `:8080`.

### VS Code

1. Рекомендовані розширення з `.vscode/extensions.json` (Copilot + Copilot Chat + ESLint).
2. Copilot Chat → **Agent** (не Ask). MCP: Command Palette → `MCP: List Servers`.
3. Той самий `GITHUB_PERSONAL_ACCESS_TOKEN` у змінних середовища Windows/macOS, потім перезапуск VS Code. Токен не писати в JSON.
4. Жива сторінка й мережа — через `chrome-devtools`, не Cursor Browser.

### Claude Code / Codex / Gemini CLI

1. `cd` у корінь репо. Node 18 і `.env` як у README.
2. `GITHUB_PERSONAL_ACCESS_TOKEN` у **цьому** терміналі (не лише в GUI Cursor).
3. Claude: `claude` → approve `.mcp.json`. Codex: trust folder. Gemini: `gemini` потім `/mcp`.
4. Жива сторінка — `chrome-devtools`.

Червоний `github` без токена — нормально. MUI / Context7 працюють і так.

GitHub MCP у **Cloud Agent** Cursor не бере ваш User env: Integrations або [Cloud Agents secrets](https://cursor.com/dashboard/cloud-agents).

## Чого не додавати

Playwright MCP, Sequential Thinking, filesystem MCP, CodeRabbit, `@knip/mcp`, застарілий `@modelcontextprotocol/server-github`, `npm@latest` у Docker.

Якщо потрібен новий MCP — спочатку перевірте, чи задачу вже закриває Browser, ESLint, Knip CLI або Bugbot.
