# Specification: component-smoke-tests

## Context
Smoke-тесты компонентов проверяют базовый рендеринг и ключевые взаимодействия без глубокого тестирования логики (которая покрыта unit-тестами). Согласно архитектуре, каждый компонент имеет собственный тестовый файл рядом с ним (co-location). Тесты `Cell` и `Board` обязательно проверяют a11y-атрибуты.

## User Scenarios
1. **Разработчик запускает все тесты:** `npm test` — все smoke-тесты проходят без ошибок.
2. **Разработчик изменяет разметку компонента:** тест выявляет удаление обязательного a11y-атрибута.

## Functional Requirements
- FR-01: `Cell.test.tsx`: рендер с `value=null`, `value='X'`, `value='O'`; наличие `role="button"`; наличие `aria-label`; вызов `onCellClick` при клике.
- FR-02: `Board.test.tsx`: рендер ровно 9 элементов `Cell`; вызов `onCellClick` при клике на свободную клетку; наличие `role="grid"`.
- FR-03: `StatusBar.test.tsx`: корректный текст для `status.kind === 'playing'`, `'won'`, `'draw'`; наличие `aria-live="polite"`.
- FR-04: `GameSettings.test.tsx`: рендер формы; вызов `onStartGame` при нажатии кнопки; наличие `<label>` для всех `<input>`.
- FR-05: `ResultScreen.test.tsx`: отображение победителя при `status.kind === 'won'`; отображение «Ничья!» при `status.kind === 'draw'`; вызов `onRestart`; вызов `onQuitToMenu`.
- FR-06: `App.test.tsx`: рендер без ошибок; начальный экран — меню (наличие элементов `GameSettings`).

## Non-Functional Requirements
- NFR-01: Каждый тест выполняется менее чем за 1 секунду.
- NFR-02: Тесты используют `@testing-library/react` и `@testing-library/user-event`.
- NFR-03: Тесты не зависят от деталей реализации (не используют `querySelector` по CSS-классам модулей).

## Boundaries (что НЕ входит)
- Не тестируется полный игровой сценарий через UI (это покрывается тестами редьюсера).
- Не тестируется визуальное соответствие дизайну (нет скриншот-тестов).
- Не тестируется производительность рендеринга.

## Acceptance Criteria
- [ ] Все 6 тестовых файлов существуют и проходят.
- [ ] `Cell.test.tsx` проверяет `role="button"` и `aria-label`.
- [ ] `Board.test.tsx` проверяет `role="grid"` и рендер 9 клеток.
- [ ] `StatusBar.test.tsx` проверяет `aria-live="polite"`.
- [ ] `GameSettings.test.tsx` проверяет наличие `<label>` для всех `<input>`.
- [ ] Общее покрытие тестами ≥ 60% (проверяется через `npm run test:coverage`).
- [ ] `npm run lint` не выдаёт ошибок для всех тестовых файлов.

## Open Questions
- Нужно ли добавить тест для `ErrorBoundary`, симулирующий ошибку рендеринга через компонент-заглушку?
- Стоит ли использовать `axe-core` (через `jest-axe`) для автоматической проверки a11y в тестах?