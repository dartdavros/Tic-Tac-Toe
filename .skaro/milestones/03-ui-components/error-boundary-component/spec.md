# Specification: error-boundary-component

## Context
Согласно ADR-005, `ErrorBoundary` является единственным механизмом обработки ошибок рендеринга в React. Без него любое исключение в дочернем компоненте приводит к «белому экрану». `ErrorBoundary` — классовый компонент (единственный допустимый способ в React 18). Ошибки логируются через `logEvent`.

Prop `fallback` игнорируется: `ErrorBoundary` всегда рендерит встроенный `ErrorFallback`, передавая ему `onReset` через внутренний `setState`. Prop `onReset` передаётся в `ErrorBoundary` от `App` и вызывает `dispatch({ type: 'RESET_GAME' })` для сброса игрового состояния.

## User Scenarios
1. **Ошибка рендеринга в дочернем компоненте:** пользователь видит `ErrorFallback` с сообщением об ошибке и кнопкой «Начать заново».
2. **Пользователь нажимает «Начать заново»:** вызывается `onReset` (что приводит к `dispatch({ type: 'RESET_GAME' })` в `App`), граница ошибки сбрасывается через `setState({ hasError: false })`, приложение возвращается в рабочее состояние.

## Functional Requirements
- FR-01: `ErrorBoundary` — классовый компонент, реализующий `componentDidCatch` и `getDerivedStateFromError`.
- FR-02: При перехвате ошибки вызывается `logEvent('render_error', { error: Error, errorInfo: React.ErrorInfo })` с нативными объектами как есть, без сериализации.
- FR-03: При перехвате ошибки рендерится встроенный `ErrorFallback` вместо дочерних компонентов. Prop `fallback` не используется для рендеринга.
- FR-04: `ErrorBoundary` принимает props: `children: React.ReactNode`, `fallback: React.ReactNode`, `onReset: () => void`. Prop `fallback` принимается для совместимости интерфейса, но игнорируется при рендеринге.
- FR-05: `ErrorFallback` — функциональный компонент, принимающий `onReset: () => void`. Отображает сообщение «Что-то пошло не так» и кнопку «Начать заново».
- FR-06: Кнопка «Начать заново» в `ErrorFallback` вызывает `onReset`, что одновременно сбрасывает внутреннее состояние `ErrorBoundary` (через `setState({ hasError: false })`) и вызывает `dispatch({ type: 'RESET_GAME' })` в `App`.
- FR-07: `ErrorFallback` использует стандартный `<button>` с понятным текстом.
- FR-08: `onReset` передаётся как prop в `ErrorBoundary` от `App`; внутри `App` это функция, вызывающая `dispatch({ type: 'RESET_GAME' })`.

## Non-Functional Requirements
- NFR-01: `ErrorFallback` максимально прост — не содержит сложной логики, которая сама может выбросить исключение.
- NFR-02: `ErrorBoundary` не перехватывает ошибки в обработчиках событий (это стандартное поведение React).
- NFR-03: Тесты для `ErrorBoundary` и `ErrorFallback` не пишутся — компонент сложно тестировать в изоляции; покрытие обеспечивается тестами других модулей.

## Файловая структура
Согласно ADR-008 (co-location) и ADR-004 (CSS Modules), все файлы располагаются в одном каталоге:

```
src/components/ErrorBoundary/
├── ErrorBoundary.tsx
├── ErrorFallback.tsx
├── ErrorBoundary.module.css
├── ErrorFallback.module.css
└── index.ts
```

- `index.ts` реэкспортирует `ErrorBoundary` как публичный API каталога.
- Каждый компонент использует собственный CSS-модуль для стилизации.

## Boundaries (что НЕ входит)
- Не реализуется отображение стека ошибки пользователю (только в dev-консоли через `logEvent`).
- Не реализуется несколько уровней `ErrorBoundary`.
- Не реализуется автоматическое восстановление без действия пользователя.
- Prop `fallback` не используется при рендеринге — `ErrorBoundary` всегда показывает встроенный `ErrorFallback`.
- Технические детали ошибки не отображаются в `ErrorFallback` ни в каком режиме (dev или prod).

## Acceptance Criteria
- [ ] При ошибке рендеринга в дочернем компоненте отображается встроенный `ErrorFallback`, а не содержимое prop `fallback`.
- [ ] `logEvent('render_error', { error, errorInfo })` вызывается при перехвате ошибки с нативными объектами `Error` и `React.ErrorInfo`.
- [ ] Кнопка «Начать заново» сбрасывает состояние `ErrorBoundary` (`hasError: false`) и вызывает `onReset`, переданный от `App`.
- [ ] `onReset` в `App` вызывает `dispatch({ type: 'RESET_GAME' })`, возвращая игру в начальное состояние.
- [ ] `ErrorFallback` содержит текст «Что-то пошло не так» и кнопку `<button>` с текстом «Начать заново».
- [ ] Все файлы расположены в `src/components/ErrorBoundary/` согласно структуре, описанной в спецификации.
- [ ] `index.ts` реэкспортирует `ErrorBoundary` как публичный API каталога.
- [ ] Каждый компонент использует собственный CSS-модуль (`*.module.css`).
- [ ] `npm run lint` не выдаёт ошибок.

## Open Questions
*Все открытые вопросы закрыты по результатам уточнений.*