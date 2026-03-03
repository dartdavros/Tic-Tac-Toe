# Specification: typescript-types

## Context
Все модули проекта (логика, редьюсер, компоненты) используют общие типы. Определение типов в единственном месте (`src/types/index.ts`) обеспечивает согласованность и исключает дублирование. Типы являются контрактом между всеми слоями приложения и должны быть определены до начала реализации логики и компонентов.

## User Scenarios
1. **Разработчик импортирует тип:** пишет `import type { Player, GameState } from '../types'` — TypeScript резолвит типы без ошибок.
2. **Разработчик обращается к humanPlayer в PvP-режиме:** TypeScript выдаёт ошибку компиляции, поскольку `humanPlayer` отсутствует в ветке `{ mode: 'pvp' }` дискриминированного union.
3. **Разработчик обращается к `settings.humanPlayer` без проверки `mode`:** TypeScript выдаёт ошибку компиляции, поскольку поле `humanPlayer` существует только в ветке `{ mode: 'pvai' }`.
4. **Разработчик читает `state.settings` на экране `menu`:** поле `settings` отсутствует (тип `undefined`), что отражает реальное состояние до выбора режима игры.

## Functional Requirements
- FR-01: Определён тип `Player = 'X' | 'O'`.
- FR-02: Определён тип `CellValue = Player | null`.
- FR-03: Определён тип `BoardState` как кортеж фиксированной длины 9: `[CellValue, CellValue, CellValue, CellValue, CellValue, CellValue, CellValue, CellValue, CellValue]`.
- FR-04: Определён тип `AppScreen = 'menu' | 'game' | 'result'`.
- FR-05: Определён тип `GameMode = 'pvp' | 'pvai'`.
- FR-06: Определён тип `GameStatus` как дискриминированный union: `{ kind: 'playing'; currentPlayer: Player } | { kind: 'won'; winner: Player; winLine: number[] } | { kind: 'draw' }`. Поле `winLine` определено inline в ветке `won` как `number[]` — отдельный тип `WinLine` не создаётся.
- FR-07: Определён тип `GameSettings` как дискриминированный union: `{ mode: 'pvp' } | { mode: 'pvai'; humanPlayer: Player }`. Обращение к `humanPlayer` без проверки `mode` является ошибкой компиляции.
- FR-08: Определён интерфейс `GameState` с полями: `screen: AppScreen`, `board: BoardState`, `status: GameStatus`, `settings?: GameSettings`. Поле `settings` является опциональным: на экране `menu` оно отсутствует (`undefined`), поскольку пользователь ещё не выбрал режим игры.
- FR-09: Определён тип `GameAction` как дискриминированный union: `{ type: 'START_GAME'; payload: GameSettings } | { type: 'MAKE_MOVE'; payload: { index: number } } | { type: 'RESTART' } | { type: 'QUIT_TO_MENU' }`. Отдельное действие `RESET_ERROR` не предусмотрено — для сброса любого некорректного состояния используется `QUIT_TO_MENU`.
- FR-10: Все типы экспортируются из `src/types/index.ts`.
- FR-11: Нигде в типах не используется `any` или `unknown` без явного обоснования.
- FR-12: Индексы клеток типизируются как `number` везде в типах и интерфейсах. Тип `CellIndex = 0 | 1 | 2 | ... | 8` не создаётся — валидация корректности индекса выполняется на уровне runtime в `gameReducer`.
- FR-13: Тип `GameState` не содержит поля `history: BoardState[]` и не предусматривает хранение истории ходов — функция отмены хода вне scope текущей спецификации.

## Non-Functional Requirements
- NFR-01: Файл `src/types/index.ts` компилируется без ошибок TypeScript при `strict: true`.
- NFR-02: Тип `BoardState` как кортеж обеспечивает статическую проверку длины массива на уровне TypeScript.

## Boundaries (что НЕ входит)
- Не реализуется никакая логика — только определения типов.
- Не создаются вспомогательные функции для работы с типами.
- Не создаются типы, специфичные для отдельных компонентов (props-типы определяются в файлах компонентов).
- Не создаётся вспомогательный тип `WinLine` — поле `winLine: number[]` определяется inline в ветке `won` типа `GameStatus`.
- Не создаётся тип `CellIndex` — индексы клеток типизируются как `number`.
- Не создаётся действие `RESET_ERROR` в `GameAction` — сброс состояния выполняется через `QUIT_TO_MENU`.
- Не добавляется поле `history` в `GameState` — история ходов вне scope спецификации.

## Acceptance Criteria
- [ ] Файл `src/types/index.ts` создан и экспортирует все типы/интерфейсы: `Player`, `CellValue`, `BoardState`, `AppScreen`, `GameMode`, `GameStatus`, `GameSettings`, `GameState`, `GameAction`.
- [ ] `BoardState` определён как кортеж длины 9, а не как `Array<CellValue>`.
- [ ] `GameSettings` — дискриминированный union; обращение к `settings.humanPlayer` без проверки `settings.mode === 'pvai'` вызывает ошибку TypeScript.
- [ ] `GameStatus` — дискриминированный union с тремя ветками: `playing`, `won`, `draw`; поле `winLine` определено как `number[]` inline в ветке `won`.
- [ ] `GameAction` — дискриминированный union с четырьмя действиями: `START_GAME`, `MAKE_MOVE`, `RESTART`, `QUIT_TO_MENU`; действие `RESET_ERROR` отсутствует.
- [ ] Поле `settings` в `GameState` объявлено как опциональное (`settings?: GameSettings`); обращение к `state.settings` без проверки на `undefined` вызывает предупреждение или ошибку TypeScript при `strict: true`.
- [ ] Поле `history` в `GameState` отсутствует.
- [ ] Нигде в файле не используется тип `any` или `unknown`.
- [ ] Нигде в файле не используются типы `WinLine` или `CellIndex` — они не определяются.
- [ ] `npm run build` проходит без ошибок TypeScript после создания файла.
- [ ] `npm run lint` не выдаёт предупреждений для файла типов.

## Open Questions
*Все открытые вопросы закрыты по результатам уточнений.*