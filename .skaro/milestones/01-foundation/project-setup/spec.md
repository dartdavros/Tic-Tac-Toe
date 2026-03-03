# Specification: project-setup

## Context
Необходимо создать рабочее окружение разработки с нуля. Без этой задачи невозможно начать разработку каких-либо компонентов или логики. Задача устанавливает все инструменты, конфигурации и структуру папок, описанные в конституции проекта.

## User Scenarios
1. **Разработчик клонирует репозиторий:** выполняет `npm install` и `npm run dev` — приложение запускается в браузере без ошибок.
2. **Разработчик запускает проверки:** выполняет `npm run lint`, `npm run format:check`, `npm test` — все команды завершаются успешно на пустом проекте.

## Functional Requirements
- FR-01: Проект инициализирован через `npm create vite@latest` с шаблоном `react-ts`.
- FR-02: Установлены зависимости: `react@18`, `react-dom@18`, `typescript@5.x`, `vite@5`.
- FR-03: Установлены dev-зависимости: `eslint`, `@eslint/js`, `typescript-eslint`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `prettier`, `vitest`, `@vitest/coverage-v8`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom`. Плагин `eslint-plugin-jsx-a11y` не устанавливается — проверка доступности выполняется вручную и через тесты.
- FR-04: Создан `eslint.config.js` (flat config) с правилами для TypeScript и React.
- FR-05: Создан `.prettierrc` с настройками форматирования (singleQuote: true, semi: true, tabWidth: 2, printWidth: 100).
- FR-06: Создан `vitest.config.ts` с настройками: environment: 'jsdom', coverage provider: 'v8', thresholds: lines 60% (согласно конституции; `test:coverage` будет падать до появления реальных тестов — это ожидаемое поведение), setupFiles подключает `@testing-library/jest-dom`.
- FR-07: Создана структура папок: `src/components/`, `src/logic/`, `src/utils/`, `src/types/`, `src/styles/`.
- FR-08: В `package.json` определены скрипты: `dev`, `build`, `preview`, `lint`, `lint:fix`, `format`, `format:check`, `test`, `test:coverage`.
- FR-09: Создан `tsconfig.json` со строгими настройками (`strict: true`, `noUncheckedIndexedAccess: true`). Настроены алиасы путей: `@/*` → `src/*` в секции `compilerOptions.paths`.
- FR-10: Создан `.gitignore` с исключением `node_modules/`, `dist/`, `.env`.
- FR-11: Удалены стандартные файлы-заглушки Vite (App.css, assets/react.svg и т.д.). Файл `main.tsx` рендерит только `<div id="root" />` напрямую через `ReactDOM.createRoot` — компонент `App.tsx` не создаётся. Сохраняется только `vite-env.d.ts`.
- FR-12: В `vite.config.ts` настроен алиас `@/` → `src/` через `resolve.alias`, согласованный с `tsconfig.json paths`. Версии `@types/react` и `@types/react-dom` используются те, что устанавливает шаблон `npm create vite@latest` по умолчанию, без ручной фиксации.
- FR-13: `husky` и `lint-staged` не устанавливаются и не настраиваются — pre-commit хуки избыточны для учебного проекта.

## Non-Functional Requirements
- NFR-01: `npm install` завершается без ошибок и уязвимостей высокого уровня.
- NFR-02: `npm run dev` запускает dev-сервер за менее чем 5 секунд.
- NFR-03: `npm run build` создаёт директорию `dist/` без ошибок TypeScript.

## Boundaries (что НЕ входит)
- Не создаются компоненты React (только минимальный `main.tsx` без `App.tsx`).
- Не определяются TypeScript-типы игры (это отдельная задача).
- Не настраивается CI/CD (это отдельный этап).
- Не создаются CSS-файлы стилей.
- Не устанавливается `eslint-plugin-jsx-a11y` — a11y проверяется вручную и через тесты.
- Не настраиваются pre-commit хуки (`husky`, `lint-staged`).

## Acceptance Criteria
- [ ] `npm install` завершается без ошибок.
- [ ] `npm run dev` запускает приложение, в браузере отображается пустая страница без ошибок в консоли.
- [ ] `npm run lint` завершается без ошибок на пустом проекте.
- [ ] `npm run format:check` завершается без ошибок.
- [ ] `npm test` запускает Vitest и завершается успешно (0 тестов = 0 провалов).
- [ ] `npm run build` создаёт `dist/` без ошибок TypeScript и ESLint.
- [ ] Структура папок `src/components/`, `src/logic/`, `src/utils/`, `src/types/`, `src/styles/` создана.
- [ ] `tsconfig.json` содержит `"strict": true` и `"noUncheckedIndexedAccess": true`.
- [ ] `tsconfig.json` содержит алиас `"@/*": ["src/*"]` в секции `compilerOptions.paths`.
- [ ] `vite.config.ts` содержит `resolve.alias` с маппингом `@/` → `src/`.
- [ ] Импорт вида `import { foo } from '@/utils/foo'` разрешается корректно при сборке и в IDE.
- [ ] `main.tsx` не импортирует `App.tsx`; файл `App.tsx` отсутствует в проекте.
- [ ] `main.tsx` монтирует `<div id="root" />` без дочерних компонентов.
- [ ] `eslint-plugin-jsx-a11y` отсутствует в `package.json`.
- [ ] `husky` и `lint-staged` отсутствуют в `package.json`.
- [ ] `npm run test:coverage` запускается (падение из-за порога 60% является ожидаемым поведением до появления реальных тестов).

## Open Questions
_Все вопросы разрешены. Открытых вопросов нет._