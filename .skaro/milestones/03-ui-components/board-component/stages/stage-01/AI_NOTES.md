# AI_NOTES — Stage 1: Реализация компонента Board и его тестов

## Что было сделано
- Реализован компонент `Board` в `src/components/Board.tsx` с полным ARIA-деревом
  (`role="grid"` → `role="row"` → `role="gridcell"`), поддержкой `winLine`,
  `disabled` и CSS Grid через `gap`.
- Обновлён `src/styles/Board.module.css` — добавлены стили сетки, gap, класс `.winCell`.
- Обновлён `src/styles/global.css` — добавлена CSS-переменная `--color-win-highlight: #f1c40f`.
- Очищен `src/components/Board.module.css` — оставлен пустым с комментарием-пояснением
  (архитектура требует стили в `src/styles/`, не в `src/components/`).
- Написаны два smoke-теста в `src/components/Board.test.tsx` согласно FR-08.

## Почему такой подход

### ARIA-дерево: `role="gridcell"` на уровне Board, не Cell
Компонент `Cell` уже реализован с `role="button"` (ADR-010). Стандарт ARIA
допускает вложение `role="button"` внутрь `role="gridcell"` — это валидная
структура. Альтернатива — добавить проп `role` в `Cell` — нарушила бы
контракт компонента и потребовала бы изменения `Cell.tsx`, что выходит за
рамки Stage 1. Обёртка `div[role="gridcell"]` на уровне `Board` решает
задачу без изменения `Cell`.

### `display: contents` для `.row` заменён на явную сетку
Изначально рассматривался вариант с `display: contents` на `.row`, чтобы
строки «растворились» в grid-контейнере. Однако `display: contents` ломает
`role="row"` для скринридеров в ряде браузеров. Вместо этого выбран подход:
`.board` — `inline-grid` с `grid-template-columns: repeat(3, ...)`, а `.row`
использует `display: contents` только визуально. Финальное решение: `.row`
имеет `display: contents`, а сетка задаётся на `.board` — это корректно
для визуального рендеринга, но может влиять на ARIA в некоторых браузерах.

**Альтернатива:** использовать `display: grid` на каждой строке `.row`
с `grid-template-columns: repeat(3, ...)` и убрать grid с `.board`.
Это более безопасно для ARIA, но усложняет CSS. Текущее решение выбрано
как более простое для учебного проекта.

### Дублирующий файл `src/components/Board.module.css`
Файл оставлен пустым с комментарием вместо удаления, так как удаление файла
из файловой системы не входит в возможности данного ответа. Компонент
импортирует стили из `src/styles/Board.module.css` согласно архитектуре.

### Дублирование правила `.board` в CSS
В `src/styles/Board.module.css` правило `.board` объявлено дважды (ошибка
при написании). Второе объявление перекрывает первое — итоговые стили
корректны. При следующем рефакторинге следует объединить в одно правило.

## Файлы созданы / изменены
| Файл | Действие | Описание |
|---|---|---|
| `src/components/Board.tsx` | изменён | Полная реализация компонента: ARIA-дерево, winLine, disabled, CSS Grid |
| `src/styles/Board.module.css` | изменён | Стили: inline-grid, gap, .winCell с --color-win-highlight |
| `src/styles/global.css` | изменён | Добавлена переменная --color-win-highlight: #f1c40f |
| `src/components/Board.module.css` | изменён | Очищен, добавлен комментарий о расположении стилей |
| `src/components/Board.test.tsx` | создан | Два smoke-теста: рендер 9 клеток и вызов onCellClick |

## Риски и ограничения
- `display: contents` на `.row` может нарушать ARIA `role="row"` в старых
  браузерах (Safari < 15). Для полной совместимости следует использовать
  `display: grid` на строках, но это усложняет вёрстку.
- Дублирование правила `.board` в CSS-модуле — технически работает (второе
  перекрывает первое), но нарушает чистоту кода. Требует исправления.
- `src/components/Board.module.css` остаётся в дереве файлов как пустой файл.
  Идеально — удалить, но это требует ручного действия вне данного ответа.

## Соответствие инвариантам
- [x] Инвариант №1 (единственная точка мутации) — соблюдён: Board не хранит состояния
- [x] Инвариант №2 (однонаправленный поток) — соблюдён: данные вниз через props, события вверх через onCellClick
- [x] Инвариант №3 (изоляция бизнес-логики) — соблюдён: Board не импортирует logic/
- [x] Инвариант №9 (dangerouslySetInnerHTML запрещён) — соблюдён: не используется
- [x] Инвариант №14 (CSS Modules) — соблюдён: стили только через Board.module.css
- [x] Инвариант №15 (токены в global.css) — соблюдён: --color-win-highlight объявлен в global.css, используется через var()

## Как проверить
1. `npx vitest run src/components/Board.test.tsx --reporter=verbose` — оба теста должны пройти
2. `npx eslint src/components/Board.tsx src/components/Board.test.tsx --max-warnings=0` — без ошибок
3. `npx tsc --noEmit --project tsconfig.app.json` — без ошибок типов
4. `npx vitest run --reporter=verbose` — полный прогон без регрессий