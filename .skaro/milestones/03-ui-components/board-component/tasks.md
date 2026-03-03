# Tasks: board-component

## Stage 1: Реализация компонента Board и его тестов

- [ ] Добавить CSS-переменную `--color-win-highlight: #f1c40f` в `:root` → `src/styles/global.css`
- [ ] Реализовать стили компонента: CSS Grid (`grid-template-columns: repeat(3, 1fr)`), `gap`, класс `.winCell` использующий `var(--color-win-highlight)` → `src/styles/Board.module.css`
- [ ] Реализовать компонент `Board`: props-интерфейс, разбивка 9 клеток на три строки `role="row"`, обёртка `role="gridcell"` вокруг каждой `Cell`, логика `disabled` (занятая клетка или prop `disabled`), передача класса `winCell` клеткам из `winLine` → `src/components/Board.tsx`
- [ ] Написать два smoke-теста: (1) рендер ровно 9 клеток, (2) клик на свободную клетку вызывает `onCellClick` с корректным индексом → `src/components/Board.test.tsx`