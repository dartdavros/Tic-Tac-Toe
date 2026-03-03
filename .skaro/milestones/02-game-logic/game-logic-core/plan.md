## plan.md

```markdown
# План реализации: game-logic-core

## Обзор

Задача состоит из одного логически связного модуля: чистые функции игровой
логики в `src/logic/gameLogic.ts` и их тесты в `src/logic/gameLogic.test.ts`.
Все зависимости (типы из `src/types/index.ts`, логгер из `src/utils/logger.ts`)
уже существуют в проекте. Реализация укладывается в один этап.

---

## Stage 1: Реализация модуля gameLogic и его тестов

**Goal:**
Реализовать все чистые функции игровой логики согласно спецификации и покрыть
их тестами с покрытием ≥ 90%. Модуль является фундаментом для редьюсера и
алгоритма ИИ, поэтому он должен быть полностью корректен и протестирован до
того, как эти модули будут использовать его в продакшне.

**Depends on:** нет (типы и конфигурация уже существуют)

**Inputs:**
- `src/types/index.ts` — типы `Player`, `BoardState`, `GameStatus`, `CellValue`
- `src/logic/gameLogic.ts` — существующий файл (возможно, заглушка или пустой)
- `src/logic/gameLogic.test.ts` — существующий файл (возможно, заглушка)
- `package.json` — конфигурация Vitest
- `vite.config.ts` — конфигурация сборки и тестов
- Спецификация `game-logic-core` (FR-01 — FR-08, AC)

**Outputs:**
- `src/logic/gameLogic.ts` — полная реализация:
  - константа `WIN_LINES` (FR-02)
  - `checkWinner(board, currentPlayer): GameStatus` (FR-01)
  - `isBoardFull(board): boolean` (FR-03)
  - `getAvailableMoves(board): number[]` (FR-04)
  - `applyMove(board, index, player): BoardState` (FR-05)
  - `getNextPlayer(current): Player` (FR-08)
- `src/logic/gameLogic.test.ts` — полный набор тестов:
  - `checkWinner`: все 8 выигрышных линий для X и O, ничья, игра продолжается,
    победа имеет приоритет над ничьей, `winner` = игрок с выигрышной линией,
    `currentPlayer` в статусе `playing` совпадает с аргументом
  - `isBoardFull`: пустая доска, частично заполненная, полная
  - `getAvailableMoves`: пустая доска (все 9), частично заполненная,
    полная доска (пустой массив), порядок возрастающий
  - `applyMove`: корректный ход, иммутабельность, ошибка при занятой клетке
    (точный текст), ошибка при индексе < 0 (точный текст),
    ошибка при индексе > 8 (точный текст)
  - `getNextPlayer`: X→O, O→X

**DoD:**
- [ ] `WIN_LINES` содержит ровно 8 комбинаций (3 горизонтали, 3 вертикали, 2 диагонали)
- [ ] `checkWinner` проверяет победителя среди обоих игроков (X и O)
- [ ] `checkWinner` возвращает `winner` равным игроку, чьи символы образовали линию
- [ ] `checkWinner` возвращает `{ kind: 'won', ... }` при одновременной победе и заполненной доске
- [ ] `checkWinner` возвращает `{ kind: 'draw' }` при полной доске без победителя
- [ ] `checkWinner` возвращает `{ kind: 'playing', currentPlayer }` при незавершённой игре
- [ ] `isBoardFull` возвращает `true` только при всех 9 занятых клетках
- [ ] `getAvailableMoves` возвращает индексы в строго возрастающем порядке
- [ ] `getAvailableMoves` возвращает `[]` для полной доски
- [ ] `applyMove` не мутирует исходный `BoardState`
- [ ] `applyMove` выбрасывает `Error('Invalid move: cell is already occupied')` при занятой клетке
- [ ] `applyMove` выбрасывает `Error('Invalid move: index out of range')` при индексе < 0 или > 8
- [ ] `getNextPlayer('X')` возвращает `'O'`; `getNextPlayer('O')` возвращает `'X'`
- [ ] Ни одна функция не превышает 40 строк
- [ ] Покрытие строк и веток ≥ 90% для `gameLogic.ts`
- [ ] `npm run lint` не выдаёт ошибок для обоих файлов
- [ ] Все тесты проходят (`npm run test`)

**Risks:**
- Существующий `gameLogic.ts` может содержать частичную реализацию с другими
  сигнатурами — необходимо привести к спецификации, не нарушив импорты в
  `aiPlayer.ts` и `gameReducer.ts` (проверить после реализации)
- Существующий `gameLogic.test.ts` может содержать тесты с неверными
  ожиданиями — необходимо полностью переписать согласно уточнённой спецификации
- Тип `BoardState` — кортеж фиксированной длины 9; `applyMove` должна
  возвращать именно кортеж, а не `Array<CellValue>` (инвариант №12)

---

## Verify

- name: Запуск тестов gameLogic с покрытием
  command: npx vitest run src/logic/gameLogic.test.ts --coverage
- name: Линтинг gameLogic
  command: npx eslint src/logic/gameLogic.ts src/logic/gameLogic.test.ts
- name: Проверка типов TypeScript
  command: npx tsc --noEmit
```