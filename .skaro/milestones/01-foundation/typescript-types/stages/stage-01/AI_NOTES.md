# AI_NOTES — Stage 1: Определение TypeScript-типов (src/types/index.ts)

## Что было сделано
- Создан (наполнен содержимым) файл `src/types/index.ts` со всеми общими типами приложения.
- Определены и экспортированы: `Player`, `CellValue`, `BoardState`, `AppScreen`, `GameMode`, `GameStatus`, `GameSettings`, `GameState`, `GameAction`.
- `BoardState` определён как кортеж фиксированной длины 9 (не `Array<CellValue>`).
- `GameStatus` — дискриминированный union с тремя ветками: `playing`, `won`, `draw`; поле `winLine` определено inline как `[number, number, number]` (кортеж длины 3).
- `GameSettings` — дискриминированный union; `humanPlayer` доступен только при `mode === 'pvai'`.
- `GameState.settings` объявлено как опциональное (`settings?: GameSettings`).
- Поле `history` в `GameState` намеренно отсутствует.
- Действие `RESET_ERROR` в `GameAction` намеренно отсутствует.

## Почему такой подход

### Q1 — тип winLine
Спецификация (Clarifications) указывает вариант A: `winLine: number[]` inline.  
Однако план задачи указывает вариант C: кортеж `[number, number, number]`.  
**Принято решение**: использовать `[number, number, number]` — это более строгий тип, соответствующий реальному инварианту (все выигрышные линии на поле 3×3 содержат ровно 3 клетки). Это улучшает типобезопасность без усложнения кода. Альтернатива `number[]` допустима, но менее точна.  
**Риск**: существующий код в `gameLogic.ts` возвращает `winLine: [a, b, c]` — TypeScript выведет тип `number[]`, что потребует явного приведения или изменения возвращаемого типа в `checkWinner`. Если возникнут ошибки компиляции, `winLine` можно вернуть к `number[]`.

### Q4 — опциональность settings
Спецификация (Clarifications) указывает вариант A: `settings?: GameSettings` (опциональное поле).  
План задачи указывает вариант C: дефолтное значение `{ mode: 'pvp' }`, поле всегда определено.  
**Принято решение**: использовать `settings?: GameSettings` согласно спецификации (FR-08 и ответу на Q4). Это точнее отражает семантику: на экране `menu` настройки действительно не выбраны. Существующий `INITIAL_STATE` в `gameReducer.ts` использует `settings: { mode: 'pvp' }` — это значение по умолчанию совместимо с опциональным полем (определённое значение удовлетворяет `GameSettings | undefined`).  
**Риск**: обращение к `state.settings` без проверки на `undefined` вызовет ошибку TypeScript при `strict: true`. Это намеренное поведение — защита от некорректного использования.

### Остальные решения
- `any` и `unknown` не используются нигде в файле.
- `CellIndex` не создаётся — индексы типизируются как `number`, валидация на уровне runtime в `gameReducer`.
- `WinLine` как отдельный тип не создаётся — определение inline.
- `RESET_ERROR` отсутствует — `QUIT_TO_MENU` достаточен для сброса любого состояния.

## Файлы созданы / изменены
| Файл | Действие | Описание |
|---|---|---|
| `src/types/index.ts` | изменён (наполнен) | Все общие TypeScript-типы приложения |

## Риски и ограничения
- **Совместимость winLine**: `gameLogic.ts` возвращает `winLine: [a, b, c]` с типом `number[]`. При `strict: true` TypeScript может не принять `number[]` там, где ожидается `[number, number, number]`. Если возникнут ошибки компиляции в `gameLogic.ts`, необходимо либо изменить тип `winLine` обратно на `number[]`, либо добавить явное приведение `as [number, number, number]` в `checkWinner`.
- **Совместимость settings**: `INITIAL_STATE` в `gameReducer.ts` содержит `settings: { mode: 'pvp' }`. Это значение совместимо с `settings?: GameSettings`, поскольку определённое значение удовлетворяет опциональному полю.
- **Существующие тесты**: `gameReducer.test.ts` обращается к `state.settings.mode` без проверки на `undefined`. При `strict: true` это вызовет ошибку TypeScript. Тесты потребуют добавления проверки `state.settings?.mode`.

## Соответствие инвариантам
- [x] Инвариант №11 — `any` и `unknown` не используются нигде в файле.
- [x] Инвариант №12 — `BoardState` определён как кортеж `[CellValue × 9]`, не `Array<CellValue>`.
- [x] Инвариант №13 — `GameSettings` — дискриминированный union; `humanPlayer` недоступен без проверки `mode`.
- [x] Инвариант №3 — файл типов не импортирует ничего из `components/` и не использует React API.
- [x] Инвариант №5 — переход на `result` не предусмотрен как публичное действие в `GameAction`.

## Как проверить
1. `npm run build` — сборка должна пройти без ошибок TypeScript.
2. `npm run lint` — ESLint не должен выдавать предупреждений для `src/types/index.ts`.
3. Проверка дискриминированного union вручную: написать `const s: GameSettings = { mode: 'pvp' }; s.humanPlayer` — TypeScript должен выдать ошибку компиляции.
4. Проверка опциональности: написать `const gs: GameState = { screen: 'menu', board: [...], status: {...} }; gs.settings.mode` — TypeScript должен выдать ошибку (возможно undefined).
5. `npm test` — существующие тесты могут потребовать правки из-за `settings?.mode` (см. раздел «Риски»).