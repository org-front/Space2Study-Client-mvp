# Робота з агентами в цьому репо

Це інструкція **для людей**. Файл `AGENTS.md` і папка `.cursor/rules/` — інструкції **для моделі**: їх не треба копіювати в чат, агент у Cursor підхоплює їх сам.

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
| `.cursor/mcp.json` | Cursor | Підключення GitHub, Context7, MUI, Chrome DevTools |

Після `git pull` перезапустіть Cursor (або Reload Window), інакше MCP може не підхопитись.

## Які агенти вміють цей флоу

Працює все, що відкриває **цю папку як проєкт Cursor** і має режим Agent.

| Агент | Читає правила + `AGENTS.md` | MCP з `.cursor/mcp.json` | Коли користуватись |
| --- | --- | --- | --- |
| **Cursor Agent** (чат, режим Agent) | Так | Так | Основний спосіб: фічі, баги, тести, Docker |
| **Plan** | Так (читає код) | Зазвичай ні, поки не перейдете в Agent | Велика задача з кількома варіантами |
| **Ask / Ask mode** | Так | Обмежено | «Поясни», без правок файлів |
| **Cursor CLI** (`cursor agent` у корені репо) | Так | Так, якщо CLI бачить той самий `.cursor/` | Те саме, що Agent, з термінала |
| **Cloud Agent** (фоновий агент у Cursor / з GitHub) | Так, якщо репо підключене | Частково: потрібні Secrets у дашборді Cursor, не ваш локальний `.env` | Довгі задачі, поки ви не сидите в IDE |
| **Bugbot** (`/review-bugbot`) | Дивиться diff | Ні | Рев’ю змін / PR на баги |
| **Security Review** (`/review-security`) | Дивиться diff | Ні | Рев’ю на секрети, XSS, небезпечні запити |

**Не підхоплюють цей флоу** (або майже ні): Tab / inline autocomplete, звичайний ChatGPT / Claude у браузері, GitHub Copilot у VS Code, агент в іншому клоні без цих файлів. Вони не читають `.cursor/mcp.json`.

GitHub MCP у хмарі не візьме ваш Windows User env. Для Cloud Agent GitHub — або Cursor GitHub App (Integrations), або секрет у [Cloud Agents dashboard](https://cursor.com/dashboard/cloud-agents).

## Що для чого: задача → інструмент

Агент обирає інструмент сам, якщо ви назвали задачу нормально. Нижче — що **має** статись.

| Задача | Хто / що | Не треба |
| --- | --- | --- |
| Написати / змінити UI, роути, Redux | Cursor Agent + правила `src` | Новий UI-фреймворк |
| Документація MUI 5 (`sx`, Date Pickers) | MCP `mui-mcp` (`useMuiDocs`) | Копіювати приклади MUI 7 |
| Документація Vite 4 / React 17 / RTK / RR6 / Vitest 0.28 | MCP `context7` (пін **цих** мажорів) | «як у React 19» |
| Кліки по екрану на `http://localhost:3000` | Вбудований **Browser** у Agent | Playwright MCP |
| Мережа: 401, CORS, тіло Axios | MCP `chrome-devtools` | Водити ту саму вкладку Browser + DevTools одночасно |
| Issue / PR / Actions | MCP `github` або `/add-plugin github` | PAT у файлі в git |
| Рев’ю коду | `/review-bugbot` або `/review-security` | CodeRabbit MCP |
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

1. Відкрити папку репо в **Cursor**, не «один файл».
2. Режим **Agent**, у списку tools увімкнути Browser.
3. `mui-mcp` і `context7` працюють без ключів (Context7 можна прискорити змінною `CONTEXT7_API_KEY`).
4. **GitHub:** Command Palette → `/add-plugin github` (OAuth). Або змінна середовища `GITHUB_PERSONAL_ACCESS_TOKEN` і перезапуск Cursor. Токен у `.cursor/mcp.json` не вписувати.
5. **Chrome DevTools:** має бути встановлений Chrome.
6. Локально: Node 18, `.env` як у README, API на `http://localhost:8080`.

Червоний індикатор `github` у MCP без токена / плагіна — нормально. Решта агентського флоу (правила, MUI, Context7, Browser) працює й так.

## Чого не додавати

Playwright MCP, Sequential Thinking, filesystem MCP, CodeRabbit, `@knip/mcp`, застарілий `@modelcontextprotocol/server-github`, `npm@latest` у Docker.

Якщо потрібен новий MCP — спочатку перевірте, чи задачу вже закриває Browser, ESLint, Knip CLI або Bugbot.
