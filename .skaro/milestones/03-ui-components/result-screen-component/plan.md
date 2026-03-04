# План реализации: ResultScreen компонент

## Обзор

Задача состоит из одного логически завершённого вертикального среза:
компонент `ResultScreen` + его стили + smoke-тесты. Все зависимости
(типы, CSS-переменные, структура проекта) уже существуют в проекте.
Реализация выполняется в **одну стадию**.

---

## Stage 1: ResultScreen — компонент, стили и тесты

**Goal:**
Реализовать компонент `ResultScreen`, его CSS-модуль и smoke-тесты
в соответствии со спецификацией. Компонент отображает итог партии
(победа / ничья), предоставляет кнопки «Играть снова» и «В меню»,
соответствует требованиям a11y (aria-live="assertive") и дизайн-токенам
проекта (CSS-переменные из `global.css`).

**Depends on:** нет (все зависимости уже существуют в проекте)

**Inputs:**
- `src/types/index.ts` — типы `GameStatus`, `Player`
- `src/styles/global.css` — CSS-переменные `--color-x`, `--color-o`,
  `--color-accent`, `--color-text-primary`, `--color-surface`,
  `--color-border`, `--font-size-large`, `--font-size-base`,
  `--font-family`, `--color-bg`
- `src/components/ResultScreen.tsx` — существующий файл (перезаписывается)
- `src/styles/ResultScreen.module.css` — существующий файл (перезаписывается)
- Спецификация `result-screen-component`
- Архитектурный документ (ADR-004, ADR-010)

**Outputs:**
- `src/components/ResultScreen.tsx` — реализация компонента
- `src/styles/ResultScreen.module.css` — стили компонента
- `src/components/ResultScreen.test.tsx` — smoke-тесты

**DoD:**
- [ ] При `status.kind === 'won'` отображается «Победил игрок X!» или
      «Победил игрок O!» в зависимости от `winner`
- [ ] Имя победителя окрашено через CSS-переменную `--color-x` или
      `--color-o` (inline-стиль с `var(...)`, задокументирован
      комментарием `// STYLE_EXCEPTION`)
- [ ] При `status.kind === 'draw'` отображается «Ничья!»
- [ ] Кнопка «Играть снова» вызывает `onRestart` при клике
- [ ] Кнопка «В меню» вызывает `onQuitToMenu` при клике
- [ ] Обе кнопки — стандартные `<button>` с текстовым содержимым
- [ ] Кнопка «Играть снова» имеет primary-стиль, «В меню» — secondary
- [ ] Кнопки расположены горизонтально, «Играть снова» — левее «В меню»
- [ ] Корневой контейнер имеет `aria-live="assertive"`
- [ ] Компонент не хранит локального состояния (`useState` не используется)
- [ ] Стили используют только CSS-переменные из `global.css` (без хардкода)
- [ ] Стили определены в `src/styles/ResultScreen.module.css`
      (файл в `src/components/ResultScreen.module.css` не используется
      или является реэкспортом — уточнить по факту структуры)
- [ ] Smoke-тесты в `ResultScreen.test.tsx` проходят (`npm run test`)
- [ ] `npm run lint` не выдаёт ошибок для изменённых файлов
- [ ] Адаптивная вёрстка корректна при ширине от 320px

**Risks:**
- В проекте существуют **два** файла стилей для ResultScreen:
  `src/components/ResultScreen.module.css` и `src/styles/ResultScreen.module.css`.
  Необходимо использовать тот, который импортируется в компоненте согласно
  архитектурному документу (`src/styles/`). Если компонент импортирует
  локальный файл — скорректировать импорт.
- CSS-переменные `--color-x` и `--color-o` должны быть определены в
  `global.css`; если они отсутствуют (используются другие имена, например
  `--color-player-x`), необходимо добавить алиасы или использовать
  существующие переменные с документированием отклонения.
- Тип `GameStatus` в `src/types/index.ts` может включать `kind: 'playing'` —
  компонент принимает только `won | draw`, поэтому props-тип должен быть
  явно сужен через Extract или отдельный тип.

## Verify

- name: Smoke-тесты ResultScreen
  command: npx vitest run src/components/ResultScreen.test.tsx --reporter=verbose
- name: Линтинг изменённых файлов
  command: npx eslint src/components/ResultScreen.tsx src/components/ResultScreen.test.tsx src/styles/ResultScreen.module.css --max-warnings=0
- name: Проверка типов
  command: npx tsc --noEmit --project tsconfig.app.json
- name: Полный прогон тестов (регрессия)
  command: npx vitest run --reporter=verbose