# План реализации: error-boundary-component

## Обзор

Задача состоит из одного логически завершённого блока: создание компонентов
`ErrorBoundary` и `ErrorFallback` с CSS-модулями, публичным `index.ts` и
интеграцией в `App.tsx`. Существующий файл `src/components/ErrorBoundary.tsx`
будет удалён и заменён структурой каталога согласно спецификации.

Зависимостей между этапами нет — вся работа выполняется в одном этапе,
так как все файлы логически связаны и не имеют внешних зависимостей,
кроме уже существующих модулей (`logger.ts`, `types/index.ts`, `App.tsx`).

---

## Stage 1: Реализация ErrorBoundary — компоненты, стили, интеграция

**Goal:**
Создать каталог `src/components/ErrorBoundary/` со всеми необходимыми
файлами: классовый компонент `ErrorBoundary`, функциональный компонент
`ErrorFallback`, CSS-модули для каждого, публичный реэкспорт через `index.ts`.
Обновить `App.tsx` для использования нового пути импорта и добавить
действие `RESET_GAME` в типы и редьюсер (если отсутствует).
Удалить устаревший `src/components/ErrorBoundary.tsx`.

**Depends on:** нет (все зависимости уже существуют в проекте)

**Inputs:**
- `src/types/index.ts` — типы `GameAction`, `GameState`
- `src/utils/logger.ts` — функция `logEvent`
- `src/components/App.tsx` — место интеграции `ErrorBoundary`
- `src/logic/gameReducer.ts` — редьюсер, куда добавляется `RESET_GAME`
- Спецификация `error-boundary-component`
- Архитектурный документ (ADR-004, ADR-005, ADR-007, ADR-008)

**Outputs:**
- `src/components/ErrorBoundary/ErrorBoundary.tsx` — классовый компонент
- `src/components/ErrorBoundary/ErrorFallback.tsx` — функциональный компонент
- `src/components/ErrorBoundary/ErrorBoundary.module.css` — стили для ErrorBoundary
- `src/components/ErrorBoundary/ErrorFallback.module.css` — стили для ErrorFallback
- `src/components/ErrorBoundary/index.ts` — публичный реэкспорт
- `src/components/App.tsx` — обновлён импорт ErrorBoundary + добавлен onReset
- `src/types/index.ts` — добавлено действие `RESET_GAME` в `GameAction`
- `src/logic/gameReducer.ts` — добавлена обработка `RESET_GAME`

**DoD:**
- [ ] Каталог `src/components/ErrorBoundary/` создан со всеми 5 файлами
- [ ] `ErrorBoundary` — классовый компонент с `getDerivedStateFromError` и `componentDidCatch`
- [ ] `componentDidCatch` вызывает `logEvent('render_error', { error, errorInfo })` с нативными объектами
- [ ] При `hasError === true` рендерится встроенный `ErrorFallback`, prop `fallback` игнорируется
- [ ] `ErrorFallback` содержит текст «Что-то пошло не так» и `<button>` с текстом «Начать заново»
- [ ] Кнопка «Начать заново» вызывает `onReset`, который сбрасывает `hasError` и диспатчит `RESET_GAME`
- [ ] `index.ts` реэкспортирует `ErrorBoundary` как единственный публичный API каталога
- [ ] Каждый компонент использует собственный CSS-модуль (без inline-стилей без обоснования)
- [ ] Все CSS-переменные берутся из `global.css` (`:root`), хардкод цветов/размеров отсутствует
- [ ] `GameAction` в `types/index.ts` содержит `{ type: 'RESET_GAME' }`
- [ ] `gameReducer.ts` обрабатывает `RESET_GAME`, возвращая `INITIAL_STATE`
- [ ] `App.tsx` импортирует `ErrorBoundary` из `src/components/ErrorBoundary/`
- [ ] `App.tsx` передаёт `onReset` в `ErrorBoundary`, где `onReset` вызывает `dispatch({ type: 'RESET_GAME' })`
- [ ] Устаревший `src/components/ErrorBoundary.tsx` удалён (или его содержимое заменено реэкспортом)
- [ ] `npm run lint` завершается без ошибок
- [ ] `npm run build` завершается без ошибок TypeScript

**Risks:**
- Устаревший `src/components/ErrorBoundary.tsx` может конфликтовать с новым
  каталогом `src/components/ErrorBoundary/` — необходимо удалить файл до
  создания каталога (или убедиться, что сборщик разрешает конфликт корректно).
- Действие `RESET_GAME` может отсутствовать в `GameAction` — необходимо
  добавить его в `types/index.ts` и обработать в `gameReducer.ts`; при этом
  существующие тесты редьюсера не должны сломаться.
- `App.tsx` может использовать `ErrorBoundary` с prop `fallback` — при
  рефакторинге нужно убедиться, что prop принимается (для совместимости
  интерфейса), но не используется при рендеринге.

---

## Verify

```yaml
- name: Линтинг изменённых файлов
  command: npx eslint src/components/ErrorBoundary/ src/components/App.tsx src/types/index.ts src/logic/gameReducer.ts --max-warnings=0

- name: Проверка типов TypeScript
  command: npx tsc --noEmit

- name: Сборка проекта
  command: npm run build

- name: Запуск существующих тестов редьюсера (не должны сломаться после добавления RESET_GAME)
  command: npx vitest run src/logic/gameReducer.test.ts

- name: Запуск всех тестов с покрытием
  command: npx vitest run --coverage