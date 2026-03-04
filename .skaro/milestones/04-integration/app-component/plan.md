# План реализации: app-component (App.tsx + main.tsx)

## Анализ текущего состояния

Проект уже имеет структуру директорий, все зависимые модули существуют:
- `src/logic/gameReducer.ts` — редьюсер и `INITIAL_STATE`
- `src/components/ErrorBoundary/` — `ErrorBoundary`, `ErrorFallback`, `index.ts`
- `src/components/Board.tsx`, `StatusBar.tsx`, `GameSettings.tsx`, `ResultScreen.tsx`
- `src/types/index.ts` — все типы
- `src/styles/global.css` — токены дизайна

Задача: реализовать `App.tsx`, `main.tsx`, `App.module.css` (в `src/components/`) и
smoke-тест `App.test.tsx`. Файл `src/styles/App.module.css` уже существует — будет
дополнен при необходимости.

---

## Stage 1: Реализация App.tsx, main.tsx, стилей и smoke-теста

**Goal:**
Реализовать корневой компонент `App` с `useReducer`, условным рендерингом трёх
экранов, оборачиванием в `ErrorBoundary`, механизмом сброса через `resetKey`,
точку входа `main.tsx` с `React.StrictMode`, стили компонента и smoke-тест.

**Depends on:** нет (все зависимости уже существуют в проекте)

**Inputs:**
- `src/types/index.ts`
- `src/logic/gameReducer.ts` (экспортирует `gameReducer`, `INITIAL_STATE`)
- `src/components/ErrorBoundary/index.ts` (экспортирует `ErrorBoundary`, `ErrorFallback`)
- `src/components/Board.tsx`
- `src/components/StatusBar.tsx`
- `src/components/GameSettings.tsx`
- `src/components/ResultScreen.tsx`
- `src/styles/global.css`
- `src/styles/App.module.css` (существует, может быть дополнен)
- Спецификация `app-component`, Architecture document, Constitution

**Outputs:**
- `src/components/App.tsx` — корневой компонент (создать/перезаписать)
- `src/main.tsx` — точка входа с `React.StrictMode` (создать/перезаписать)
- `src/components/App.module.css` — стили компонента App (создать/перезаписать)
- `src/styles/App.module.css` — при необходимости синхронизировать
- `src/components/App.test.tsx` — smoke-тест начального рендера

**DoD:**
- [ ] `App` использует `useReducer(gameReducer, INITIAL_STATE)` как единственный источник состояния (FR-01)
- [ ] При `state.screen === 'menu'` рендерится `<GameSettings onStartGame={...} />` (FR-02)
- [ ] При `state.screen === 'game'` рендерится `<Board ... />` и `<StatusBar ... />` (FR-03)
- [ ] При `state.screen === 'result'` рендерится `<ResultScreen ... />` (FR-04)
- [ ] `onStartGame` диспатчит `{ type: 'START_GAME', payload: settings }` (FR-05)
- [ ] `onCellClick` диспатчит `{ type: 'MAKE_MOVE', payload: { index } }` (FR-06)
- [ ] `onRestart` диспатчит `{ type: 'RESTART' }` (FR-07)
- [ ] `onQuitToMenu` диспатчит `{ type: 'QUIT_TO_MENU' }` (FR-08)
- [ ] Всё дерево обёрнуто в `<ErrorBoundary fallback={<ErrorFallback onReset={handleReset} />}>` (FR-09)
- [ ] `handleReset`: (1) диспатчит `RESTART`, (2) инкрементирует `resetKey` (FR-10)
- [ ] `<ErrorBoundary key={resetKey}>` — сброс через key-проп (Clarification Q2)
- [ ] `Board` получает ровно 4 пропа: `board`, `onCellClick`, `disabled`, `winLine` (FR-15)
- [ ] `Board` получает `disabled={state.status.kind !== 'playing'}` (FR-11)
- [ ] `Board` получает `winLine` из `state.status` при `won`, иначе `undefined` (FR-12)
- [ ] `main.tsx` содержит `<React.StrictMode>` вокруг `<App />` (FR-16)
- [ ] Стили в `App.module.css`: центрирование контейнера, максимальная ширина (FR-14)
- [ ] Smoke-тест в `App.test.tsx` проходит: начальный рендер без ошибок, экран меню виден (FR-13)
- [ ] `npm run lint` не выдаёт ошибок
- [ ] `npm run build` завершается без ошибок
- [ ] `gameReducer` является чистой функцией — двойной вызов в StrictMode не приводит к артефактам (NFR-03)
- [ ] Нет `dangerouslySetInnerHTML` (инвариант безопасности #9)
- [ ] Нет inline-стилей без комментария `// STYLE_EXCEPTION:` (инвариант #14)
- [ ] Все токены дизайна берутся из CSS-переменных `global.css`, хардкод запрещён (инвариант #15)

**Risks:**
- Дублирование файлов стилей: `src/components/App.module.css` и `src/styles/App.module.css`
  существуют одновременно — необходимо определить, какой из них импортируется в `App.tsx`,
  и использовать только один (согласно архитектуре — `src/styles/App.module.css`).
- `ErrorBoundary` может иметь несовместимый интерфейс пропов — необходимо проверить
  экспорт из `src/components/ErrorBoundary/index.ts` перед реализацией.
- Дублирование `ErrorBoundary.tsx` на уровне `src/components/ErrorBoundary.tsx` и
  `src/components/ErrorBoundary/` — нужно использовать правильный импорт.
- При `state.status.kind === 'won'` необходимо корректно извлечь `winLine` через
  type narrowing TypeScript, иначе компилятор выдаст ошибку.

---

## Verify

- name: Smoke-тест App компонента
  command: npx vitest run src/components/App.test.tsx --reporter=verbose

- name: Все тесты проекта (регрессия)
  command: npx vitest run --reporter=verbose

- name: TypeScript проверка типов
  command: npx tsc --noEmit

- name: Линтер
  command: npx eslint src/components/App.tsx src/main.tsx src/components/App.test.tsx

- name: Сборка проекта
  command: npx vite build