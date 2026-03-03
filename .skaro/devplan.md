# Development Plan

_Generated: 2026-02-28_

## Фундамент
_Directory: `milestones/01-foundation/`_

| # | Task | Status | Dependencies | Description |
|---|------|--------|--------------|-------------|
| 1 | project-setup | planned | — | Инициализация Vite 5 + React 18 + TypeScript проекта, настройка ESLint (flat config), Prettier, Vitest и React Testing Library. Создание базовой структуры папок согласно архитектуре. |
| 2 | typescript-types | planned | project-setup | Определение всех общих TypeScript-типов в `src/types/index.ts` согласно архитектуре: Player, CellValue, BoardState, AppScreen, GameMode, GameStatus, GameSettings, GameState, GameAction. |
| 3 | global-styles | planned | project-setup | Создание глобального CSS-файла с токенами дизайна (CSS-переменными), сбросом стилей и базовой типографикой. Подключение в `main.tsx`. |

## Игровая логика
_Directory: `milestones/02-game-logic/`_

| # | Task | Status | Dependencies | Description |
|---|------|--------|--------------|-------------|
| 1 | game-logic-core | planned | typescript-types | Реализация чистых функций игровой логики в `src/logic/gameLogic.ts`: checkWinner, isBoardFull, getAvailableMoves, applyMove. Покрытие тестами ≥ 90%. |
| 2 | ai-player | planned | game-logic-core | Реализация алгоритма minimax в `src/logic/aiPlayer.ts` для вычисления оптимального хода ИИ. Покрытие тестами ≥ 90%, включая тест производительности (< 50 мс). |
| 3 | game-reducer | planned | game-logic-core, ai-player | Реализация `gameReducer` в `src/logic/gameReducer.ts` с обработкой всех GameAction, начальным состоянием, защитным try/catch и синхронным вызовом ИИ при PvAI. Полное покрытие тестами переходов состояния. |
| 4 | logger | planned | project-setup | Реализация минимального модуля логирования `src/utils/logger.ts` с функцией `logEvent`, которая в dev-режиме пишет в консоль, а в prod является точкой расширения для аналитики. |

## UI-компоненты
_Directory: `milestones/03-ui-components/`_

| # | Task | Status | Dependencies | Description |
|---|------|--------|--------------|-------------|
| 1 | cell-component | planned | typescript-types, global-styles | Реализация компонента `Cell` — отдельной клетки игрового поля с поддержкой a11y (role, aria-label, tabIndex, onKeyDown) и CSS-модулем. |
| 2 | board-component | planned | cell-component | Реализация компонента `Board` — игрового поля 3×3, отображающего 9 клеток `Cell` с поддержкой подсветки победной линии и a11y-атрибутами. |
| 3 | status-bar-component | planned | typescript-types, global-styles | Реализация компонента `StatusBar`, отображающего текущий статус игры (чей ход, победитель, ничья) с `aria-live="polite"` для скринридеров. |
| 4 | game-settings-component | planned | typescript-types, global-styles | Реализация компонента `GameSettings` — экрана меню с выбором режима игры (PvP / PvAI) и стороны (X / O для PvAI). Вызывает `onStartGame` с корректными настройками. |
| 5 | result-screen-component | planned | typescript-types, global-styles | Реализация компонента `ResultScreen` — экрана результата игры с отображением победителя или ничьей и кнопками «Играть снова» и «В меню». |
| 6 | error-boundary-component | planned | typescript-types, global-styles, logger | Реализация классового компонента `ErrorBoundary` и функционального `ErrorFallback` для перехвата ошибок рендеринга и отображения сообщения с кнопкой восстановления. |

## Интеграция
_Directory: `milestones/04-integration/`_

| # | Task | Status | Dependencies | Description |
|---|------|--------|--------------|-------------|
| 1 | app-component | planned | game-reducer, board-component, status-bar-component, game-settings-component, result-screen-component, error-boundary-component | Реализация корневого компонента `App` с `useReducer`, условным рендерингом экранов (menu / game / result) и интеграцией `ErrorBoundary`. Smoke-тест начального рендера. |
| 2 | main-entry-point | planned | app-component | Настройка точки входа `src/main.tsx`: монтирование `App` в DOM, подключение глобальных стилей, обёртка в `React.StrictMode`. |

## Тестирование
_Directory: `milestones/05-testing/`_

| # | Task | Status | Dependencies | Description |
|---|------|--------|--------------|-------------|
| 1 | game-logic-tests | planned | game-logic-core | Написание полного набора unit-тестов для `gameLogic.ts`: все 8 выигрышных линий, ничья, незавершённая игра, граничные случаи `getAvailableMoves` и `applyMove`. Покрытие ≥ 90%. |
| 2 | ai-player-tests | planned | ai-player | Написание полного набора unit-тестов для `aiPlayer.ts`: детерминированность, блокировка победы противника, выбор победного хода, производительность (< 50 мс), поведение при полной доске. Покрытие ≥ 90%. |
| 3 | game-reducer-tests | planned | game-reducer | Написание полного набора unit-тестов для `gameReducer.ts`: все переходы GameAction, валидация ходов, автоматический переход на result, защитное поведение при ошибках. |
| 4 | component-smoke-tests | planned | app-component, board-component, cell-component, status-bar-component, game-settings-component, result-screen-component | Дополнение и проверка smoke-тестов для всех компонентов: Board, Cell, StatusBar, GameSettings, ResultScreen, App. Проверка наличия a11y-атрибутов в тестах Cell и Board. |

## CI/CD и деплой
_Directory: `milestones/05-ci-cd/`_

| # | Task | Status | Dependencies | Description |
|---|------|--------|--------------|-------------|
| 1 | github-actions-pipeline | planned | app-component, component-smoke-tests | Создание файла `.github/workflows/ci.yml` с пайплайном: установка зависимостей, ESLint, Prettier, Vitest с coverage, Vite build с проверкой размера бандла. |
| 2 | deployment-config | planned | github-actions-pipeline | Настройка деплоя на GitHub Pages (через `gh-pages` или GitHub Actions) или Vercel. Конфигурация `vite.config.ts` с корректным `base` URL для статического хостинга. |
| 3 | ai-notes-and-readme | planned | deployment-config | Создание `AI_NOTES.md` по шаблону проекта и обновление `README.md` с описанием проекта, инструкциями по запуску, тестированию и деплою. |

---

## Status Legend
- **idea** — not yet scoped
- **planned** — scoped, assigned to milestone
- **in-progress** — actively being developed
- **done** — completed and reviewed
- **cut** — removed from scope (with reason)

## Change Log

- 2026-02-28: Confirmed 22 tasks: 01-foundation/project-setup, 01-foundation/typescript-types, 01-foundation/global-styles, 02-game-logic/game-logic-core, 02-game-logic/ai-player, 02-game-logic/game-reducer, 02-game-logic/logger, 03-ui-components/cell-component, 03-ui-components/board-component, 03-ui-components/status-bar-component, 03-ui-components/game-settings-component, 03-ui-components/result-screen-component, 03-ui-components/error-boundary-component, 04-integration/app-component, 04-integration/main-entry-point, 05-testing/game-logic-tests, 05-testing/ai-player-tests, 05-testing/game-reducer-tests, 05-testing/component-smoke-tests, 05-ci-cd/github-actions-pipeline, 05-ci-cd/deployment-config, 05-ci-cd/ai-notes-and-readme
- 2026-02-28: Initial plan created with 22 tasks across 6 milestones