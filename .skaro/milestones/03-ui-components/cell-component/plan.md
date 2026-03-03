# План реализации: Компонент Cell

## Обзор

Задача состоит из одного логически завершённого блока: реализация компонента
`Cell` с тестами и стилями. Все зависимости (типы, CSS-переменные, структура
проекта) уже существуют в репозитории. Один этап — одна вертикальная срезка.

---

## Stage 1: Реализация компонента Cell, стилей и smoke-тестов

**Goal:**
Создать полностью рабочий компонент `Cell` согласно спецификации:
нативный `<button>`, корректные `aria-label` / `aria-disabled`, CSS Modules
с классами `cell` / `cellX` / `cellO` / `cellEmpty`, экспорт `CellProps`,
и smoke-тесты, покрывающие все acceptance criteria.

**Depends on:** нет (все зависимости уже существуют в проекте)

**Inputs:**
- `src/types/index.ts` — типы `CellValue`, `Player`
- `src/styles/global.css` — CSS-переменные `--color-player-x`, `--color-player-o`,
  `--cell-size-desktop`, `--cell-size-mobile`
- `src/styles/Cell.module.css` — существующий файл стилей (будет перезаписан)
- `src/components/Cell.tsx` — существующий файл компонента (будет перезаписан)
- Спецификация `cell-component`, Architecture document, Constitution

**Outputs:**
- `src/components/Cell.tsx` — компонент с экспортом `CellProps`
- `src/styles/Cell.module.css` — стили с классами `cell`, `cellX`, `cellO`,
  `cellEmpty` и адаптивной вёрсткой
- `src/components/Cell.test.tsx` — smoke-тесты (все acceptance criteria)

**DoD:**
- [ ] Корневой элемент компонента — нативный `<button>`
- [ ] `aria-label` формируется по шаблону `'Клетка {row}×{col}, {пусто|крестик|нолик}'`
- [ ] `aria-disabled={disabled ?? false}` присутствует всегда
- [ ] Нативный атрибут `disabled` передаётся на `<button>` при `disabled={true}`
- [ ] Клик вызывает `onCellClick(index)` при `disabled` не задан или `false`
- [ ] Клик НЕ вызывает `onCellClick` при `disabled={true}` (нативная блокировка)
- [ ] Базовый класс `cell` присутствует всегда
- [ ] Класс `cellX` при `value='X'`, `cellO` при `value='O'`, `cellEmpty` при `value=null`
- [ ] Интерфейс `CellProps` экспортируется именованным экспортом
- [ ] `useState` не используется в компоненте
- [ ] CSS использует только переменные из `:root`, без хардкода цветов/размеров
- [ ] Адаптивный размер клетки: `--cell-size-desktop` / `--cell-size-mobile`
- [ ] Все smoke-тесты в `Cell.test.tsx` проходят (`npm run test`)
- [ ] `npm run lint` не выдаёт ошибок для изменённых файлов
- [ ] TypeScript компилируется без ошибок (`tsc --noEmit`)

**Risks:**
- CSS Modules в тестовой среде могут возвращать пустые строки для имён классов —
  необходимо убедиться, что `vite.config.ts` / `vitest.config` корректно
  настроен для CSS Modules (обычно через `css: { modules: { ... } }` или
  identity-obj-proxy). Если классы не резолвятся в тестах — проверить
  `src/test-setup.ts` и конфиг Vitest.
- Нативный `<button disabled>` блокирует события на уровне браузера, но
  в jsdom (среда Vitest) поведение может отличаться — тест на `disabled`
  должен проверять именно наличие атрибута `disabled` на элементе, а не
  перехват события.

---

## Verify

- name: Smoke-тесты компонента Cell
  command: npx vitest run src/components/Cell.test.tsx --reporter=verbose
- name: TypeScript — проверка типов
  command: npx tsc --noEmit
- name: Lint изменённых файлов
  command: npx eslint src/components/Cell.tsx src/components/Cell.test.tsx src/styles/Cell.module.css