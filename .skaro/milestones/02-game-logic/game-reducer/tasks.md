# Tasks: game-reducer

## Stage 1: Реализация gameReducer

- [ ] Объявить и экспортировать константу `EMPTY_BOARD: BoardState` (кортеж из 9 `null`) → `src/logic/gameReducer.ts`
- [ ] Объявить и экспортировать константу `INITIAL_STATE: GameState` с `screen: 'menu'`, пустой доской, `status: { kind: 'playing', currentPlayer: 'X' }`, `settings: { mode: 'pvp' }` → `src/logic/gameReducer.ts`
- [ ] Реализовать и экспортировать чистую функцию `isAiTurn(status: GameStatus, settings: GameSettings): boolean` → `src/logic/gameReducer.ts`
- [ ] Реализовать обработку `START_GAME`: сброс доски, установка настроек, `screen: 'game'`, применение хода ИИ если ИИ ходит первым, вызов `checkWinner` после хода ИИ → `src/logic/gameReducer.ts`
- [ ] Реализовать обработку `MAKE_MOVE`: валидация (screen, status, index, занятость клетки), применение хода, проверка победителя, атомарный ход ИИ в PvAI-режиме → `src/logic/gameReducer.ts`
- [ ] Реализовать обработку `RESTART`: возврат `INITIAL_STATE` → `src/logic/gameReducer.ts`
- [ ] Реализовать обработку `QUIT_TO_MENU`: возврат `INITIAL_STATE` → `src/logic/gameReducer.ts`
- [ ] Обернуть всю логику редьюсера в `try/catch` с вызовом `logEvent('reducer_error', { action, error })` и возвратом текущего состояния → `src/logic/gameReducer.ts`
- [ ] Убедиться, что `logEvent` не вызывается при успешном выполнении любого действия → `src/logic/gameReducer.ts`
- [ ] Убедиться в отсутствии мутации входного состояния (все обновления через spread/новые объекты) → `src/logic/gameReducer.ts`

## Stage 2: Тесты gameReducer

- [ ] Написать тесты для `EMPTY_BOARD` и `INITIAL_STATE` (корректные начальные значения) → `src/logic/gameReducer.test.ts`
- [ ] Написать тесты для `isAiTurn` (все 5 сценариев: pvp, pvai-ИИ ходит, pvai-человек ходит, won, draw) → `src/logic/gameReducer.test.ts`
- [ ] Написать тесты для `START_GAME` в PvP-режиме → `src/logic/gameReducer.test.ts`
- [ ] Написать тесты для `START_GAME` в PvAI-режиме (человек = X, человек = O) → `src/logic/gameReducer.test.ts`
- [ ] Написать тест для `START_GAME` с мок-ошибкой `getBestMove` (проверка `logEvent` и пустой доски) → `src/logic/gameReducer.test.ts`
- [ ] Написать тесты для `MAKE_MOVE` с невалидными входными данными (индекс, занятая клетка, неверный screen, завершённая игра) → `src/logic/gameReducer.test.ts`
- [ ] Написать тесты для `MAKE_MOVE` с победным ходом (PvP) → `src/logic/gameReducer.test.ts`
- [ ] Написать тест для `MAKE_MOVE` с ходом, приводящим к ничьей → `src/logic/gameReducer.test.ts`
- [ ] Написать тест для `MAKE_MOVE` в PvAI-режиме (атомарность хода игрока и ИИ) → `src/logic/gameReducer.test.ts`
- [ ] Написать тест для `MAKE_MOVE` в PvAI-режиме с победой ИИ → `src/logic/gameReducer.test.ts`
- [ ] Написать тест для `MAKE_MOVE` с мок-ошибкой `getBestMove` (проверка `logEvent` и применённого хода игрока) → `src/logic/gameReducer.test.ts`
- [ ] Написать тесты для `RESTART` и `QUIT_TO_MENU` (возврат `INITIAL_STATE`) → `src/logic/gameReducer.test.ts`
- [ ] Написать тест на исключение внутри редьюсера (мок внутренней зависимости, проверка возврата текущего состояния и вызова `logEvent` с полным `action`) → `src/logic/gameReducer.test.ts`
- [ ] Написать тест на отсутствие вызова `logEvent` при успешных действиях (`MAKE_MOVE`, `START_GAME`) → `src/logic/gameReducer.test.ts`