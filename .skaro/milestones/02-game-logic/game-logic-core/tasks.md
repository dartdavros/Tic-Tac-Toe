# Tasks: game-logic-core

## Stage 1: Реализация модуля gameLogic и его тестов

- [ ] Реализовать константу `WIN_LINES` (все 8 выигрышных комбинаций индексов) → `src/logic/gameLogic.ts`
- [ ] Реализовать `checkWinner(board, currentPlayer): GameStatus` — проверка обоих игроков, приоритет победы над ничьей, корректный `winner` → `src/logic/gameLogic.ts`
- [ ] Реализовать `isBoardFull(board): boolean` → `src/logic/gameLogic.ts`
- [ ] Реализовать `getAvailableMoves(board): number[]` — возрастающий порядок, детерминизм → `src/logic/gameLogic.ts`
- [ ] Реализовать `applyMove(board, index, player): BoardState` — иммутабельность, точные сообщения ошибок → `src/logic/gameLogic.ts`
- [ ] Реализовать `getNextPlayer(current: Player): Player` → `src/logic/gameLogic.ts`
- [ ] Написать тесты для `checkWinner`: все 8 выигрышных линий для X → `src/logic/gameLogic.test.ts`
- [ ] Написать тесты для `checkWinner`: все 8 выигрышных линий для O → `src/logic/gameLogic.test.ts`
- [ ] Написать тесты для `checkWinner`: ничья (полная доска без победителя) → `src/logic/gameLogic.test.ts`
- [ ] Написать тесты для `checkWinner`: игра продолжается (поле `currentPlayer` совпадает с аргументом) → `src/logic/gameLogic.test.ts`
- [ ] Написать тест для `checkWinner`: победа имеет приоритет над ничьей (доска полна + выигрышная линия) → `src/logic/gameLogic.test.ts`
- [ ] Написать тесты для `isBoardFull`: пустая, частичная, полная доска → `src/logic/gameLogic.test.ts`
- [ ] Написать тесты для `getAvailableMoves`: пустая доска, частичная, полная, порядок индексов → `src/logic/gameLogic.test.ts`
- [ ] Написать тесты для `applyMove`: корректный ход, иммутабельность исходного массива → `src/logic/gameLogic.test.ts`
- [ ] Написать тест для `applyMove`: ошибка с точным текстом при занятой клетке → `src/logic/gameLogic.test.ts`
- [ ] Написать тест для `applyMove`: ошибка с точным текстом при индексе < 0 → `src/logic/gameLogic.test.ts`
- [ ] Написать тест для `applyMove`: ошибка с точным текстом при индексе > 8 → `src/logic/gameLogic.test.ts`
- [ ] Написать тесты для `getNextPlayer`: X→O и O→X → `src/logic/gameLogic.test.ts`
- [ ] Убедиться, что ни одна функция не превышает 40 строк → `src/logic/gameLogic.ts`
- [ ] Проверить покрытие ≥ 90% командой `npx vitest run src/logic/gameLogic.test.ts --coverage` → `src/logic/gameLogic.ts`
- [ ] Проверить отсутствие ошибок линтера командой `npx eslint src/logic/gameLogic.ts src/logic/gameLogic.test.ts` → оба файла
- [ ] Проверить отсутствие ошибок TypeScript командой `npx tsc --noEmit` → весь проект