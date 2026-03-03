# Tasks: error-boundary-component

## Stage 1: Реализация ErrorBoundary — компоненты, стили, интеграция

- [ ] Добавить действие `{ type: 'RESET_GAME' }` в тип `GameAction` → `src/types/index.ts`
- [ ] Добавить обработку `RESET_GAME` в редьюсер (возврат `INITIAL_STATE`) → `src/logic/gameReducer.ts`
- [ ] Создать классовый компонент `ErrorBoundary` с `getDerivedStateFromError`, `componentDidCatch`, рендером `ErrorFallback` при ошибке → `src/components/ErrorBoundary/ErrorBoundary.tsx`
- [ ] Создать функциональный компонент `ErrorFallback` с текстом «Что-то пошло не так» и кнопкой «Начать заново» → `src/components/ErrorBoundary/ErrorFallback.tsx`
- [ ] Создать CSS-модуль для `ErrorBoundary` (использует только CSS-переменные из `:root`) → `src/components/ErrorBoundary/ErrorBoundary.module.css`
- [ ] Создать CSS-модуль для `ErrorFallback` (использует только CSS-переменные из `:root`) → `src/components/ErrorBoundary/ErrorFallback.module.css`
- [ ] Создать `index.ts` с реэкспортом `ErrorBoundary` как публичного API каталога → `src/components/ErrorBoundary/index.ts`
- [ ] Обновить импорт `ErrorBoundary` и добавить `onReset` (вызывает `dispatch({ type: 'RESET_GAME' })`) → `src/components/App.tsx`
- [ ] Удалить устаревший файл (заменить содержимое реэкспортом или убедиться в отсутствии конфликта) → `src/components/ErrorBoundary.tsx`