# План реализации: game-settings-component

## Обзор

Задача состоит из двух логически связанных частей:
1. Реализация компонента `GameSettings` с CSS-стилями
2. Написание smoke-тестов для компонента

Поскольку файлы `src/components/GameSettings.tsx`, `src/components/GameSettings.module.css`
и `src/styles/GameSettings.module.css` уже присутствуют в дереве проекта,
задача сводится к **замене/дополнению** существующих файлов корректной реализацией
согласно спецификации, плюс создание тестового файла.

Все изменения логически связаны и не имеют внешних зависимостей от ещё не
реализованных модулей — типы уже определены в `src/types/index.ts`,
стили-токены в `src/styles/global.css`. Поэтому план состоит из **одного этапа**.

---

## Stage 1: Реализация компонента GameSettings и его тестов

**Goal:**
Реализовать компонент `GameSettings` полностью согласно спецификации:
- Форма выбора режима игры (PvP / PvAI) через радиокнопки в `<fieldset>`
- Условный рендеринг блока выбора стороны (X / O) только при PvAI
- Сброс выбора стороны до X при каждом переключении на PvAI
- Вызов `onStartGame` с корректным объектом `GameSettings`
- Полная доступность (a11y): `<fieldset>`, `<legend>`, `<label>` с `htmlFor`/`id`
- CSS-стили через CSS Modules с использованием токенов из `global.css`
- Smoke-тесты: монтирование без ошибок + три сценария вызова `onStartGame`

**Depends on:** нет (все зависимости уже реализованы в проекте)

**Inputs:**
- `src/types/index.ts` — типы `GameSettings`, `Player`, `GameMode`
- `src/styles/global.css` — CSS-переменные (токены дизайна)
- Спецификация `game-settings-component`
- Архитектурный документ (ADR-004, ADR-010, инварианты)
- `src/components/GameSettings.tsx` — существующий файл (будет заменён)
- `src/components/GameSettings.module.css` — существующий файл (будет заменён)
- `src/styles/GameSettings.module.css` — существующий файл (будет обновлён)

**Outputs:**
- `src/components/GameSettings.tsx` — полная реализация компонента
- `src/components/GameSettings.module.css` — стили компонента (CSS Modules)
- `src/components/GameSettings.test.tsx` — smoke-тесты компонента
- `src/styles/GameSettings.module.css` — синхронизирован с компонентным модулем (или оставлен как алиас/пустой, если архитектура предполагает стили в `src/components/`)

**DoD:**
- [ ] Компонент принимает единственный prop `onStartGame: (settings: GameSettings) => void`
- [ ] Отображается заголовок «Крестики-нолики»
- [ ] Группа радиокнопок режима обёрнута в `<fieldset>` с `<legend>`
- [ ] Каждая радиокнопка режима имеет явный `<label>` связанный через `htmlFor`/`id`
- [ ] По умолчанию выбран режим PvP
- [ ] При выборе PvAI монтируется блок выбора стороны (второй `<fieldset>` с `<legend>`)
- [ ] При выборе PvP блок выбора стороны **отсутствует в DOM** (условный рендеринг)
- [ ] При переключении на PvAI выбор стороны сбрасывается до X
- [ ] Кнопка «Начать игру» не имеет атрибута `disabled`
- [ ] Нажатие «Начать игру» в режиме PvP вызывает `onStartGame({ mode: 'pvp' })`
- [ ] Нажатие «Начать игру» в режиме PvAI + X вызывает `onStartGame({ mode: 'pvai', humanPlayer: 'X' })`
- [ ] Нажатие «Начать игру» в режиме PvAI + O вызывает `onStartGame({ mode: 'pvai', humanPlayer: 'O' })`
- [ ] Стили используют только CSS-переменные из `global.css`, без хардкода цветов/размеров
- [ ] Inline-стили (`style={...}`) отсутствуют (нет динамических значений, требующих исключения)
- [ ] Smoke-тест: компонент монтируется без ошибок
- [ ] Smoke-тест: сценарий PvP — `onStartGame` вызывается с `{ mode: 'pvp' }`
- [ ] Smoke-тест: сценарий PvAI + X — `onStartGame` вызывается с `{ mode: 'pvai', humanPlayer: 'X' }`
- [ ] Smoke-тест: сценарий PvAI + O — `onStartGame` вызывается с `{ mode: 'pvai', humanPlayer: 'O' }`
- [ ] `npm run lint` не выдаёт ошибок для изменённых файлов
- [ ] `npm run typecheck` (или `tsc --noEmit`) проходит без ошибок
- [ ] Тесты проходят: `npx vitest run src/components/GameSettings.test.tsx`

**Risks:**
- В проекте существуют **два** файла стилей для одного компонента:
  `src/components/GameSettings.module.css` и `src/styles/GameSettings.module.css`.
  Согласно архитектуре (ADR-004), каждый компонент имеет собственный CSS-модуль
  с одноимённым файлом. Компонент должен импортировать стили из
  `src/components/GameSettings.module.css` (co-location). Файл в `src/styles/`
  может быть пустым или содержать дублирующие стили — необходимо убедиться
  в отсутствии конфликта.
- Тип `GameSettings` является дискриминированным union (ADR-007): при сборке
  объекта настроек необходимо строго соблюдать структуру, иначе TypeScript
  выдаст ошибку компиляции.
- Тестовая среда (Vitest + RTL) должна быть корректно настроена в `src/test-setup.ts`;
  если настройка отсутствует или неполна, тесты могут падать по причинам,
  не связанным с реализацией.

---

## Verify

```yaml
- name: Smoke-тесты компонента GameSettings
  command: npx vitest run src/components/GameSettings.test.tsx

- name: Проверка типов TypeScript
  command: npx tsc --noEmit

- name: Линтинг изменённых файлов
  command: npx eslint src/components/GameSettings.tsx src/components/GameSettings.test.tsx src/components/GameSettings.module.css --max-warnings=0
```