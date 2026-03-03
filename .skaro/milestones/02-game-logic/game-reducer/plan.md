# План реализации: game-reducer

## Обзор

Задача состоит из двух логически связанных частей:
1. Реализация самого редьюсера (`gameReducer.ts`) с вспомогательной функцией `isAiTurn`.
2. Реализация тестов (`gameReducer.test.ts`), покрывающих все acceptance criteria.

Оба файла уже существуют в дереве проекта (созданы ранее как заглушки).
Зависимости: `gameLogic.ts`, `aiPlayer.ts`, `logger.ts`, `types/index.ts` — уже реализованы.

---

## Stage 1: Реализация gameReducer

**Goal:** Реализовать полностью рабочий `gameReducer` согласно спецификации:
- Экспортировать `EMPTY_BOARD`, `INITIAL_STATE`, `isAiTurn`, `gameReducer`.
- Обработать все четыре действия: `START_GAME`, `MAKE_MOVE`, `RESTART`, `QUIT_TO_MENU`.
- Реализовать защитный `try/catch`, валидацию ходов, атомарное применение хода ИИ.

**Depends on:** нет (все зависимости уже реализованы)

**Inputs:**
- `src/types/index.ts` — типы `GameState`, `GameAction`, `GameSettings`, `BoardState`, `Player`, `GameStatus`
- `src/logic/gameLogic.ts` — функции `checkWinner`, `isBoardFull`, `applyMove`, `getAvailableMoves`
- `src/logic/aiPlayer.ts` — функция `getBestMove`
- `src/utils/logger.ts` — функция `logEvent`
- Спецификация (FR-01 — FR-12, все Acceptance Criteria)
- Архитектурные инварианты №1–15

**Outputs:**
- `src/logic/gameReducer.ts` — полная реализация

**DoD:**
- [ ] Экспортирована константа `EMPTY_BOARD: BoardState` — кортеж из 9 `null`
- [ ] Экспортирована константа `INITIAL_STATE: GameState` с корректными начальными значениями
- [ ] Экспортирована чистая функция `isAiTurn(status, settings): boolean`
- [ ] `isAiTurn` возвращает `false` для режима `pvp` при любом `status`
- [ ] `isAiTurn` возвращает `true`, когда текущий игрок — ИИ в режиме `pvai`
- [ ] `isAiTurn` возвращает `false`, когда текущий игрок — человек в режиме `pvai`
- [ ] `isAiTurn` возвращает `false`, если `status.kind !== 'playing'`
- [ ] `START_GAME` сбрасывает доску, устанавливает настройки, переводит `screen: 'game'`
- [ ] `START_GAME` в PvAI-режиме с ИИ-первым применяет ход ИИ и вызывает `checkWinner`
- [ ] При `getBestMove` возвращающем `null`/`-1` в `START_GAME` — вызывается `logEvent`, доска без хода ИИ
- [ ] `MAKE_MOVE` валидирует: `screen === 'game'`, `status.kind === 'playing'`, `index` в `[0..8]`, клетка свободна
- [ ] `MAKE_MOVE` при невалидном ходе возвращает текущее состояние без изменений
- [ ] После хода игрока вызывается `checkWinner`; при победе/ничьей — `screen: 'result'`
- [ ] В PvAI-режиме ход игрока и ответ ИИ применяются атомарно
- [ ] При `getBestMove` возвращающем `null`/`-1` в `MAKE_MOVE` — `logEvent` + возврат состояния с ходом игрока
- [ ] `RESTART` возвращает `INITIAL_STATE` полностью
- [ ] `QUIT_TO_MENU` возвращает `INITIAL_STATE`
- [ ] Весь код обёрнут в `try/catch`; при исключении — `logEvent('reducer_error', { action, error })` + возврат текущего состояния
- [ ] `logEvent` **не** вызывается при успешном выполнении любого действия
- [ ] Нет мутации входного состояния (чистая функция)
- [ ] `npm run lint` не выдаёт ошибок для файла

**Risks:**
- Некорректное определение «ИИ ходит первым» при `START_GAME` — нужно проверить `humanPlayer === 'O'`
- Мутация `board` вместо создания нового массива — нарушение инварианта №1
- Вызов `getBestMove` на полной доске при `START_GAME` — нужна проверка `isBoardFull` перед вызовом
- Двойной вызов `logEvent` при ошибке (и в специфичном месте, и в `catch`) — нужно пробрасывать ошибку или использовать флаг

---

## Stage 2: Тесты gameReducer

**Goal:** Реализовать полный набор unit-тестов для `gameReducer.ts` и `isAiTurn`,
покрывающих все Acceptance Criteria спецификации.

**Depends on:** Stage 1

**Inputs:**
- `src/logic/gameReducer.ts` — реализация из Stage 1
- `src/logic/gameLogic.ts` — для построения тестовых состояний доски
- `src/types/index.ts` — типы
- Спецификация (все Acceptance Criteria)
- `src/test-setup.ts` — настройка тестового окружения

**Outputs:**
- `src/logic/gameReducer.test.ts` — полный набор тестов

**DoD:**
- [ ] Тест: `INITIAL_STATE` имеет корректные начальные значения
- [ ] Тест: `EMPTY_BOARD` — кортеж из 9 `null`
- [ ] Тест: `isAiTurn` возвращает `false` для `pvp`
- [ ] Тест: `isAiTurn` возвращает `true` для `pvai` когда ход ИИ
- [ ] Тест: `isAiTurn` возвращает `false` для `pvai` когда ход человека
- [ ] Тест: `isAiTurn` возвращает `false` при `status.kind === 'won'`
- [ ] Тест: `isAiTurn` возвращает `false` при `status.kind === 'draw'`
- [ ] Тест: `START_GAME` (PvP) — корректная инициализация
- [ ] Тест: `START_GAME` (PvAI, человек = X) — ИИ не ходит первым
- [ ] Тест: `START_GAME` (PvAI, человек = O) — ИИ ходит первым, доска не пустая
- [ ] Тест: `START_GAME` (PvAI, человек = O) — после хода ИИ вызывается `checkWinner`
- [ ] Тест: `START_GAME` с мок-ошибкой `getBestMove` — `logEvent` вызван, доска пустая
- [ ] Тест: `MAKE_MOVE` в свободную клетку (PvP) — ход применён, смена игрока
- [ ] Тест: `MAKE_MOVE` с невалидным индексом (< 0, > 8) — состояние не изменилось
- [ ] Тест: `MAKE_MOVE` в занятую клетку — состояние не изменилось
- [ ] Тест: `MAKE_MOVE` при `screen !== 'game'` — состояние не изменилось
- [ ] Тест: `MAKE_MOVE` при `status.kind === 'won'` — состояние не изменилось
- [ ] Тест: `MAKE_MOVE` завершает игру победой — `screen: 'result'`, `status.kind === 'won'`
- [ ] Тест: `MAKE_MOVE` завершает игру ничьёй — `screen: 'result'`, `status.kind === 'draw'`
- [ ] Тест: `MAKE_MOVE` в PvAI-режиме — ход игрока и ИИ применены атомарно
- [ ] Тест: `MAKE_MOVE` в PvAI-режиме — победа ИИ переводит в `result`
- [ ] Тест: `MAKE_MOVE` с мок-ошибкой `getBestMove` — `logEvent` вызван, ход игрока применён
- [ ] Тест: `RESTART` возвращает `INITIAL_STATE`
- [ ] Тест: `QUIT_TO_MENU` возвращает `INITIAL_STATE`
- [ ] Тест: исключение внутри редьюсера — возврат текущего состояния
- [ ] Тест: при исключении `logEvent` вызван с полным объектом `action`
- [ ] Тест: `logEvent` **не** вызывается при успешном `MAKE_MOVE`
- [ ] Тест: `logEvent` **не** вызывается при успешном `START_GAME`
- [ ] `npx vitest run src/logic/gameReducer.test.ts` проходит без ошибок
- [ ] Покрытие `gameReducer.ts` ≥ 80% (строки)

**Risks:**
- Сложность мокирования `getBestMove` и `logEvent` в Vitest — нужен `vi.mock`
- Тест на исключение требует мокирования внутренней зависимости (например, `applyMove`) — нужно продумать подход
- Тест на атомарность PvAI-хода требует проверки промежуточного состояния — нужно проверять финальный результат

---

## Verify

```yaml
- name: Запуск тестов gameReducer
  command: npx vitest run src/logic/gameReducer.test.ts --reporter=verbose

- name: Проверка типов TypeScript
  command: npx tsc --noEmit --project tsconfig.app.json

- name: Линтинг gameReducer
  command: npx eslint src/logic/gameReducer.ts src/logic/gameReducer.test.ts
```