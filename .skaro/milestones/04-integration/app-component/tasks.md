# Tasks: app-component

## Stage 1: Реализация App.tsx, main.tsx, стилей и smoke-теста

- [ ] Проверить интерфейс `ErrorBoundary` и `ErrorFallback` из `src/components/ErrorBoundary/index.ts` → убедиться в совместимости пропов `key`, `fallback`, `onReset`
- [ ] Реализовать корневой компонент `App` с `useReducer(gameReducer, INITIAL_STATE)` → `src/components/App.tsx`
- [ ] Добавить локальный `useState` для `resetKey` (счётчик сбросов ErrorBoundary) → `src/components/App.tsx`
- [ ] Реализовать `handleReset`: dispatch RESTART + инкремент resetKey → `src/components/App.tsx`
- [ ] Реализовать условный рендеринг трёх экранов (menu / game / result) → `src/components/App.tsx`
- [ ] Передать в `Board` ровно 4 пропа: `board`, `onCellClick`, `disabled`, `winLine` → `src/components/App.tsx`
- [ ] Реализовать type narrowing для `winLine` (только при `status.kind === 'won'`) → `src/components/App.tsx`
- [ ] Обернуть дерево в `<ErrorBoundary key={resetKey} fallback={<ErrorFallback onReset={handleReset} />}>` → `src/components/App.tsx`
- [ ] Написать стили контейнера (центрирование, max-width, отступы) через CSS-переменные → `src/styles/App.module.css`
- [ ] Убедиться, что `src/components/App.module.css` либо удалён, либо синхронизирован (один файл стилей) → `src/components/App.module.css`
- [ ] Реализовать точку входа с `<React.StrictMode><App /></React.StrictMode>` → `src/main.tsx`
- [ ] Подключить `src/styles/global.css` в `main.tsx` → `src/main.tsx`
- [ ] Написать smoke-тест: рендер без ошибок, проверка наличия элементов экрана меню → `src/components/App.test.tsx`
- [ ] Проверить отсутствие `dangerouslySetInnerHTML` и несогласованных inline-стилей → `src/components/App.tsx`
- [ ] Запустить `npx vitest run src/components/App.test.tsx` — все тесты зелёные
- [ ] Запустить `npx tsc --noEmit` — нет ошибок типов
- [ ] Запустить `npx eslint src/components/App.tsx src/main.tsx src/components/App.test.tsx` — нет ошибок
- [ ] Запустить `npx vite build` — сборка успешна, бандл ≤ 100 КБ gzip