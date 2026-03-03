# План реализации: Компонент Board

## Обзор

Задача состоит из двух логических блоков:
1. Реализация компонента `Board` с полным ARIA-деревом и поддержкой `winLine`/`disabled`.
2. Написание smoke-тестов для `Board`.

Поскольку файлы `Board.tsx`, `Board.module.css` и `Board.test.tsx` уже существуют
в дереве проекта (но могут содержать заглушки), план состоит из **одного этапа** —
полной реализации всех трёх файлов как единого логически связного блока.
Разбивать на несколько этапов нет смысла: тест не может быть написан раньше
компонента, а CSS-модуль неотделим от компонента.

---

## Stage 1: Реализация компонента Board и его тестов

**Goal:**
Реализовать компонент `Board` согласно спецификации: CSS Grid, полное ARIA-дерево
(`role="grid"` → `role="row"` → `role="gridcell"`), поддержка `winLine` (подсветка
победных клеток через `--color-win-highlight`), корректная передача `disabled` в
`Cell`, визуальное разделение через `gap`. Написать два smoke-теста согласно FR-08.
Обновить `global.css` — добавить CSS-переменную `--color-win-highlight`.

**Depends on:** нет (все зависимости уже существуют в проекте)

**Inputs:**
- `src/types/index.ts` — типы `BoardState`, `CellValue`, `Player`
- `src/components/Cell.tsx` — компонент клетки (уже реализован)
- `src/styles/global.css` — глобальные CSS-переменные (нужно добавить `--color-win-highlight`)
- `src/styles/Board.module.css` — файл стилей (перезаписывается)
- `src/components/Board.module.css` — дублирующий файл (приводится в соответствие или удаляется)
- Спецификация `board-component`, ADR-004, ADR-010

**Outputs:**
- `src/components/Board.tsx` — полная реализация компонента
- `src/styles/Board.module.css` — стили: CSS Grid, gap, класс победной клетки
- `src/styles/global.css` — добавлена переменная `--color-win-highlight: #f1c40f`
- `src/components/Board.test.tsx` — два smoke-теста

**DoD:**
- [ ] Компонент принимает props: `board`, `onCellClick`, `winLine?`, `disabled?`
- [ ] Рендерится ровно 9 компонентов `Cell`
- [ ] Корневой элемент имеет `role="grid"` и `aria-label="Игровое поле"`
- [ ] Внутри три `div` с `role="row"`, каждый содержит 3 `Cell` с `role="gridcell"`
- [ ] Клетки из `winLine` получают CSS-класс, использующий `--color-win-highlight`
- [ ] `Cell` получает `disabled={true}` если `disabled === true` ИЛИ клетка занята
- [ ] Визуальное разделение реализовано через `gap` на контейнере (не `border` на `Cell`)
- [ ] CSS-переменная `--color-win-highlight: #f1c40f` объявлена в `global.css`
- [ ] Smoke-тест 1: рендерится ровно 9 клеток
- [ ] Smoke-тест 2: клик на свободную клетку вызывает `onCellClick` с корректным индексом
- [ ] `npm run lint` не выдаёт ошибок
- [ ] `npm run test` для `Board.test.tsx` проходит без ошибок

**Risks:**
- В проекте существуют два файла стилей для Board:
  `src/components/Board.module.css` и `src/styles/Board.module.css`.
  Необходимо убедиться, что `Board.tsx` импортирует правильный файл
  согласно архитектуре (`src/styles/Board.module.css`).
- Компонент `Cell` должен поддерживать проп `role="gridcell"` или обёртка
  `div[role="gridcell"]` должна быть на уровне `Board` — нужно проверить
  текущую реализацию `Cell.tsx` и выбрать корректный подход без нарушения
  контракта `Cell`.

---

## Verify

- name: Smoke-тесты компонента Board
  command: npx vitest run src/components/Board.test.tsx --reporter=verbose
- name: Линтинг изменённых файлов
  command: npx eslint src/components/Board.tsx src/components/Board.test.tsx src/styles/Board.module.css --max-warnings=0
- name: Проверка типов TypeScript
  command: npx tsc --noEmit --project tsconfig.app.json
- name: Полный прогон тестов (регрессия)
  command: npx vitest run --reporter=verbose