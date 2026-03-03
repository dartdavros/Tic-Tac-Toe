# Tasks: cell-component

## Stage 1: Реализация компонента Cell, стилей и smoke-тестов

- [ ] Реализовать компонент с нативным `<button>` как корневым элементом → `src/components/Cell.tsx`
- [ ] Добавить вычисление `row` и `col` из `index` (0-based → 1-based) → `src/components/Cell.tsx`
- [ ] Реализовать формирование `aria-label` по шаблону `'Клетка {row}×{col}, {пусто|крестик|нолик}'` → `src/components/Cell.tsx`
- [ ] Добавить `aria-disabled={disabled ?? false}` на `<button>` → `src/components/Cell.tsx`
- [ ] Передавать нативный атрибут `disabled` на `<button>` при `disabled={true}` → `src/components/Cell.tsx`
- [ ] Реализовать обработчик `onClick`: вызывать `onCellClick(index)` (нативная кнопка блокирует клик при `disabled`) → `src/components/Cell.tsx`
- [ ] Применять CSS-классы: базовый `cell` всегда + один из `cellX` / `cellO` / `cellEmpty` → `src/components/Cell.tsx`
- [ ] Экспортировать интерфейс `CellProps` именованным экспортом → `src/components/Cell.tsx`
- [ ] Убедиться, что `useState` не используется в компоненте → `src/components/Cell.tsx`
- [ ] Определить класс `.cell` с базовыми стилями (размер, рамка, cursor, flex-центрирование) → `src/styles/Cell.module.css`
- [ ] Определить класс `.cellX` с цветом `var(--color-player-x)` → `src/styles/Cell.module.css`
- [ ] Определить класс `.cellO` с цветом `var(--color-player-o)` → `src/styles/Cell.module.css`
- [ ] Определить класс `.cellEmpty` для пустой клетки → `src/styles/Cell.module.css`
- [ ] Добавить адаптивный размер: `var(--cell-size-desktop)` по умолчанию, `var(--cell-size-mobile)` при `@media (max-width: 480px)` → `src/styles/Cell.module.css`
- [ ] Убедиться, что все цвета и размеры используют CSS-переменные из `:root`, без хардкода → `src/styles/Cell.module.css`
- [ ] Написать тест: рендер без ошибок для `value=null`, `value='X'`, `value='O'` → `src/components/Cell.test.tsx`
- [ ] Написать тест: корневой элемент доступен через `getByRole('button')` → `src/components/Cell.test.tsx`
- [ ] Написать тест: `aria-label` содержит `'пусто'` при `value=null` → `src/components/Cell.test.tsx`
- [ ] Написать тест: `aria-label` содержит `'крестик'` при `value='X'` → `src/components/Cell.test.tsx`
- [ ] Написать тест: `aria-label` содержит `'нолик'` при `value='O'` → `src/components/Cell.test.tsx`
- [ ] Написать тест: `aria-disabled={false}` при `disabled` не передан → `src/components/Cell.test.tsx`
- [ ] Написать тест: `aria-disabled={true}` при `disabled={true}` → `src/components/Cell.test.tsx`
- [ ] Написать тест: клик вызывает `onCellClick` с корректным `index` → `src/components/Cell.test.tsx`
- [ ] Написать тест: при `disabled={true}` клик не вызывает `onCellClick` → `src/components/Cell.test.tsx`
- [ ] Написать тест: базовый класс `cell` присутствует всегда → `src/components/Cell.test.tsx`
- [ ] Написать тест: при `value='X'` присутствует класс `cellX`, отсутствуют `cellO` и `cellEmpty` → `src/components/Cell.test.tsx`
- [ ] Написать тест: при `value='O'` присутствует класс `cellO`, отсутствуют `cellX` и `cellEmpty` → `src/components/Cell.test.tsx`
- [ ] Написать тест: при `value=null` присутствует класс `cellEmpty`, отсутствуют `cellX` и `cellO` → `src/components/Cell.test.tsx`