# План реализации: StatusBar компонент

## Обзор

Задача охватывает реализацию компонента `StatusBar`, его стилей и smoke-тестов.
Все необходимые зависимости (типы, CSS-переменные, структура проекта) уже существуют.
Задача выполняется в **одну стадию**, так как все три файла логически связаны
и не имеют внутренних зависимостей между собой — компонент, стили и тесты
образуют единый вертикальный срез.

---

## Stage 1: Реализация компонента StatusBar, стилей и smoke-тестов

**Goal:**
Создать полностью рабочий презентационный компонент `StatusBar`, соответствующий
спецификации: корректный рендеринг для всех трёх `GameStatus.kind`, правильные
aria-атрибуты, динамические CSS-классы для цветовой индикации игроков,
семантический корневой тег `<p>`. Написать smoke-тесты, проверяющие рендеринг
без ошибок для каждого из трёх значений `kind`.

**Depends on:** нет (все зависимости уже существуют в проекте)

**Inputs:**
- `src/types/index.ts` — типы `GameStatus`, `Player`
- `src/styles/global.css` — CSS-переменные (`--color-player-x`, `--color-player-o`, `--color-text-secondary`)
- `src/styles/StatusBar.module.css` — существующий файл стилей (будет перезаписан)
- `src/components/StatusBar.tsx` — существующий файл компонента (будет перезаписан)
- Спецификация `status-bar-component`
- Архитектурный документ (ADR-004, ADR-010, инварианты)
- `src/test-setup.ts` — настройка тестового окружения

**Outputs:**
- `src/components/StatusBar.tsx` — компонент (создан/перезаписан)
- `src/styles/StatusBar.module.css` — стили компонента (создан/перезаписан)
- `src/components/StatusBar.test.tsx` — smoke-тесты (создан)

**DoD:**
- [ ] Компонент принимает `status: GameStatus` как единственный prop
- [ ] При `status.kind === 'playing'` отображается текст «Ход игрока X» или «Ход игрока O»
- [ ] При `status.kind === 'won'` отображается текст «Победил игрок X!» или «Победил игрок O!»
- [ ] При `status.kind === 'draw'` отображается текст «Ничья!»
- [ ] Корневой элемент — тег `<p>`
- [ ] На корневом элементе присутствует `aria-live="polite"`
- [ ] На корневом элементе присутствует `aria-atomic="true"`
- [ ] При `currentPlayer === 'X'` или `winner === 'X'` применяется CSS-класс `playerX`
- [ ] При `currentPlayer === 'O'` или `winner === 'O'` применяется CSS-класс `playerO`
- [ ] При `status.kind === 'draw'` применяется CSS-класс `draw`
- [ ] CSS-классы `playerX`, `playerO`, `draw` определены в `StatusBar.module.css`
- [ ] Класс `playerX` использует `var(--color-player-x)`, `playerO` — `var(--color-player-o)`, `draw` — `var(--color-text-secondary)`
- [ ] Inline-стили (`style={...}`) не используются (нет необходимости в STYLE_EXCEPTION)
- [ ] Компонент не хранит локального состояния (`useState` не используется)
- [ ] Smoke-тест для `kind === 'playing'` (X) проходит без ошибок рендеринга
- [ ] Smoke-тест для `kind === 'playing'` (O) проходит без ошибок рендеринга
- [ ] Smoke-тест для `kind === 'won'` (X) проходит без ошибок рендеринга
- [ ] Smoke-тест для `kind === 'won'` (O) проходит без ошибок рендеринга
- [ ] Smoke-тест для `kind === 'draw'` проходит без ошибок рендеринга
- [ ] `npm run lint` не выдаёт ошибок для изменённых файлов
- [ ] TypeScript компилируется без ошибок (`tsc --noEmit`)

**Risks:**
- Существующий `src/components/StatusBar.tsx` может содержать несовместимую сигнатуру props — необходимо полностью перезаписать файл согласно спецификации
- Существующий `src/styles/StatusBar.module.css` может конфликтовать с `src/styles/global.css` по именам классов — необходимо использовать только CSS Modules (локальные имена)
- Дублирование файлов стилей: в дереве проекта присутствуют как `src/components/StatusBar.module.css`, так и `src/styles/StatusBar.module.css` — согласно архитектуре стили компонентов хранятся в `src/styles/`, импорт должен указывать на правильный путь

---

## Verify

- name: Smoke-тесты StatusBar
  command: npx vitest run src/components/StatusBar.test.tsx --reporter=verbose
- name: Проверка типов TypeScript
  command: npx tsc --noEmit
- name: Линтинг изменённых файлов
  command: npx eslint src/components/StatusBar.tsx src/components/StatusBar.test.tsx src/styles/StatusBar.module.css