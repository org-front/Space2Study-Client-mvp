# Client MVP

Frontend of an educational marketplace: experts share knowledge, students find tutors and courses, and both sides can receive feedback.

---

- [Installation](#installation)
  - [Required to install](#Required-to-install)
  - [Clone](#Clone)
  - [Setup](#Setup)
  - [How to run local](#How-to-run-local)
- [Usage](#Usage)
  - [How to run tests](#How-to-run-tests)
- [Documentation](#Documentation)
  - [Tech stack](#tech-stack)
  - [Project structure](#project-structure)
  - [Rules and guidelines](#Rules-and-guidelines)
  - [Testing](#Testing)
- [Contributing](#contributing)
  - [git flow](#git-flow)
  - [issue flow](#issue-flow)
- [FAQ](#faq)
- [License](#license)

---

## Installation

- All the `code` required to get started

### Required to install

- NodeJS (18.14.0 LTS)

### Clone

- Clone this repo to your local machine

### Setup

> install npm packages

```shell
$ npm install
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

### How to run local

1. Open terminal.
2. Run `npm run start` to start application.<sup>[*](#footnote)</sup>
3. Open http://localhost:3000 to view it in the browser.

###### <a name="footnote">*</a> - to run the project you need an `.env` file in root folder

## Usage

### How to run tests

To run unit test open terminal and run `npm run test` in it.

Other useful scripts:

```shell
npm start          # Vite dev server, http://localhost:3000
npm run build      # Production build
npm run serve      # Preview the production build on port 3000
npm test           # Vitest with coverage
npm run lint       # ESLint
npm run lint-fix   # ESLint with --fix
```

Pre-commit runs lint-staged (ESLint on staged JS/TS files). Pre-push runs `npm test`.

---

## Documentation

### Tech stack

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

### Project structure

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

### Rules and guidelines

- Redux
  - State is managed with Redux Toolkit
  - For each entity we should have a separate folder
  - In each folder keep slice logic clearly separated: reducers, thunks (`createAsyncThunk`), and selectors
- Configuration
  - Configuration is done via `.env` file where environment
    variables are located
- Styles
  - Component styles live in a separate `{component-name}.styles.js` file
  - Pass style objects to MUI `sx`. Theme is created with `createTheme` from `@mui/material`
- Components
  - Components that are connected to Redux should be located inside
    `containers` folder. Components without connection to Redux should
    be located inside `components` folder.
  - Each individual page that is accessed via `react-router`
    should be located inside `pages` folder. All components
    that are used inside particular page should be located inside
    folder for the specific page.
  - Each component should have at least three files:
    - `index.js` where we export anything from the whole folder
    - `{component-name}.jsx` - file where component is located
    - `{component-name}.styles.js` where all styles are located
- API
  - Call the backend through `axiosClient` and `src/services/*`. Do not fetch from UI components directly when a service already exists.

### Testing

#### Components

Order of testing components:

1. simple stateless components that are used in multiple places
2. components that depends on other components but not connected to Redux and don’t have any state
3. components that have internal state but are not connected to Redux
4. components that connected to Redux

##### Don’t test:

- third-party libraries
- constants
- static css styles
- related components (test only one specific component at the specific moment of time)

##### How to test:

- testing using snapshots (actual ui)
- testing logic of component (dynamic)

Snapshots allow us to compare actual UI with saved one and throw an error if it has accidentally changed. We can use flag “updateSnapshot” to update save snapshots of a component.
It is appropriate for presentational components but doesn’t cover any logic.

##### What to test in components:

- Properties
  - default properties
  - custom properties
- Data types
- Conditions (what if)
- State
  - default state
  - state after some event has happened
- Events
  - with parameters or custom props
  - without arguments

#### Async thunks

Flow:

- Set up the conditions of our test
- Mock the actual HTTP requests
- Instruct the thunk to run through everything and finish its business
- Check that the expected side effects have happened (actions are dispatched, selectors are called, etc)

#### Actions creators

We test action creators as simple pure functions that just take an arguments and output proper arguments

#### Reducers

We test reducers as simple pure functions that just take an arguments and output proper arguments
Checks:

- valid default state
- changes of state when action is dispatched for different values of state

#### E2E

1. Use `data-cy` as selector

---

## Contributing

You're encouraged to contribute to our project if you've found any issues or missing functionality that you would want to see. You can add in **Issues** tab and after that click on `New issue`. There you can see the list of issues and create a new issue after clicking on `New Issue`.

Before sending any pull request, please discuss requirements/changes to be implemented using an existing issue or by creating a new one. All pull requests should be done into `develop` branch.

There are two repositories: one for the frontend part and one for the backend part. Every project has its own issues.

Every pull request should be linked to an issue. So if you make changes on frontend or backend parts you should create an issue with a link to corresponding requirement (story, task or epic). Every issue should have its own branch. Every branch name should start from task type (`feature`, `bugfix` or `test`), task number and short description. e.g. **feature/125/create-adminPanel**

All Pull Requests should start from prefix `#xxx-yyy` where xxx - task number and yyy - short description e.g. **#125-createAdminPanel**

---

### Git flow

We have **main** , **develop** and **feature** branches.
All **feature** branches must be merged into `develop` branch!!!
Only the release should merge into the main branch!!!

![Github flow](<https://wac-cdn.atlassian.com/dam/jcr:b5259cce-6245-49f2-b89b-9871f9ee3fa4/03%20(2).svg?cdnVersion=1312>)

#### Step 1

- **Option 1**

  - 👯 clone this repo to your local machine

- **Option 2**

  - create new branch from development branch

#### Step 2

- add some commits to your new branch

#### Step 3

- 🔃 create a new pull request in this repository

---

### Issue flow

#### Step 1

- go to **Issues** and click `New issue` button

#### Step 2

- when creating issue you should add name of the issue, description, choose assignee, label, project. If issue is a `User Story` you should link it with corresponding tasks, and corresponding tasks should be linked to issue.

#### Step 3

- if issue is in work it should be placed in proper column on dashboard according to its status.

---

## FAQ

- **How do I do _specifically_ so and so?**
  - No problem! Just do this.

---

#### License

- **[MIT license](http://opensource.org/licenses/mit-license.php)**

[MIT](https://choosealicense.com/licenses/mit/)

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)
