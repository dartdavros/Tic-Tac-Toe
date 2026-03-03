# Specification: cell-component

## Context
Компонент `Cell` является базовым интерактивным элементом игрового поля. Пользователь кликает на клетку для совершения хода. Согласно ADR-010, клетка должна быть доступна для скринридеров и клавиатурной навигации. Компонент не хранит локального состояния — только отображает переданное значение.

## User Scenarios
1. **Пользователь видит пустую клетку:** отображается пустая область с рамкой, доступная для клика.
2. **Пользователь видит клетку с X:** отображается символ X красного цвета (`--color-player-x`).
3. **Пользователь видит клетку с O:** отображается символ O синего цвета (`--color-player-o`).
4. **Пользователь нажимает Enter или Space на клетке:** вызывается `onCellClick`.
5. **Скринридер фокусируется на клетке:** объявляется `aria-label` с позицией и значением.

## Functional Requirements
- FR-01: Компонент принимает props: `value: CellValue`, `index: number`, `onCellClick: (index: number) => void`, `disabled?: boolean`.
- FR-02: Отображает `'X'`, `'O'` или пустую строку в зависимости от `value`.
- FR-03: Имеет `role="button"`, `tabIndex={disabled ? -1 : 0}`.
- FR-04: Имеет `aria-label` вида `"Клетка {row}×{col}, {значение или 'пусто'}"`, где row и col вычисляются из `index` (0-based → 1-based).
- FR-05: Обрабатывает `onClick` и `onKeyDown` (Enter / Space) — вызывает `onCellClick(index)`.
- FR-06: При `disabled === true` не вызывает `onCellClick` при клике или нажатии клавиш.
- FR-07: Стили определены в `src/styles/Cell.module.css`. Цвет X — `var(--color-player-x)`, цвет O — `var(--color-player-o)`.
- FR-08: Размер клетки: `var(--cell-size-desktop)` на десктопе, `var(--cell-size-mobile)` на мобильных (`@media (max-width: 480px)`).
- FR-09: Создан `src/components/Cell.test.tsx` со smoke-тестами.

## Non-Functional Requirements
- NFR-01: Компонент не хранит локального состояния (`useState` не используется).
- NFR-02: Компонент корректно отображается при ширине экрана от 320px.

## Boundaries (что НЕ входит)
- Не реализуется анимация появления символа (можно добавить позже через CSS transition).
- Не реализуется подсветка победной линии (это задача компонента `Board`).
- Не реализуется логика определения, можно ли кликнуть на клетку (это задача родительского компонента).

## Acceptance Criteria
- [ ] Компонент рендерится без ошибок для `value = null`, `value = 'X'`, `value = 'O'`.
- [ ] Присутствует `role="button"` на корневом элементе.
- [ ] `aria-label` содержит позицию клетки и её значение.
- [ ] Клик вызывает `onCellClick` с корректным `index`.
- [ ] Нажатие Enter вызывает `onCellClick`.
- [ ] Нажатие Space вызывает `onCellClick`.
- [ ] При `disabled={true}` клик не вызывает `onCellClick`.
- [ ] Smoke-тесты в `Cell.test.tsx` проходят.
- [ ] `npm run lint` не выдаёт ошибок.

## Open Questions
- Нужно ли добавить `aria-disabled={disabled}` при `disabled={true}`?
- Стоит ли использовать нативный `<button>` вместо `<div role="button">` для лучшей a11y (нативная поддержка клавиатуры без `onKeyDown`)?