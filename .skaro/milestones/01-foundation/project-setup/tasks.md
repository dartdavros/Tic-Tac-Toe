# plan.md

## Stage 1: Типы, логика и ИИ
**Goal:** Реализовать фундамент приложения — все TypeScript-типы, чистые функции игровой логики, алгоритм minimax и редьюсер. Это единый логический слой без зависимостей от React.

**Depends on:** нет (файлы уже существуют как пустые/заглушки)

**Inputs:**
- Архитектурный документ (типы `GameState`, `GameAction`, `BoardState` и т.д.)
- Спецификация алгоритма minimax из архитектуры
- Контракт `getBestMove` из архитектуры
- `src/utils/logger.ts` (нужен редьюсеру)

**Outputs:**
- `src/types/index.ts` — все типы проекта
- `src/utils/logger.ts` — `logEvent` функция
- `src/logic/gameLogic.ts` — `checkWinner`, `isBoardFull`, `getAvailableMoves`, `applyMove`
- `src/logic/aiPlayer.ts` — `getBestMove` (minimax)
- `src/logic/gameReducer.ts` — `gameReducer`, `INITIAL_STATE`
- `src/logic/gameLogic.test.ts` — unit-тесты gameLogic (покрытие ≥ 90%)
- `src/logic/aiPlayer.test.ts` — unit-тесты aiPlayer (покрытие ≥ 90%, тест производительности)
- `src/logic/gameReducer.test.ts` — unit-тесты gameReducer (все переходы)

**DoD:**
- [ ] `src/types/index.ts` содержит все типы: `Player`, `CellValue`, `BoardState`, `AppScreen`, `GameMode`, `GameStatus`, `GameSettings` (дискриминированный union), `GameState`, `GameAction`
- [ ] `BoardState` определён как кортеж фиксированной длины 9 (инвариант #12)
- [ ] `GameSettings` — дискриминированный union с `mode: 'pvp'` и `mode: 'pvai'; humanPlayer: Player` (инвариант #13)
- [ ] `logEvent` пишет в консоль в dev, ничего не делает в prod
- [ ] `checkWinner` корректно проверяет все 8 линий победы
- [ ] `isBoardFull` возвращает `true` только при полностью заполненной доске
- [ ] `getAvailableMoves` возвращает индексы пустых клеток
- [ ] `applyMove` возвращает новый `BoardState` без мутации исходного
- [ ] `getBestMove` реализует minimax, детерминирован, выбрасывает `Error('No available moves')` на полной доске
- [ ] `gameReducer` обрабатывает все 4 действия: `START_GAME`, `MAKE_MOVE`, `RESTART`, `QUIT_TO_MENU`
- [ ] `gameReducer` игнорирует невалидные ходы (занятая клетка, неверный индекс, завершённая партия, неверный экран)
- [ ] `gameReducer` автоматически переходит на `screen: 'result'` при победе/ничьей
- [ ] `gameReducer` вызывает ИИ синхронно при `mode: 'pvai'` (инвариант #4)
- [ ] `gameReducer` обёрнут в `try/catch`, не выбрасывает исключений (инвариант #6)
- [ ] `npm test` проходит, все тесты зелёные
- [ ] Покрытие `gameLogic.ts` ≥ 90%
- [ ] Покрытие `aiPlayer.ts` ≥ 90%
- [ ] Тест производительности `getBestMove` < 50 мс на пустой доске

**Risks:**
- Minimax может вернуть некорректный ход при граничных состояниях (почти полная доска) — покрывается тестами
- `noUncheckedIndexedAccess: true` в tsconfig требует явных проверок при обращении к элементам массива — нужно учесть в реализации
- Дискриминированный union `GameSettings` требует явного `mode`-сужения перед обращением к `humanPlayer`

---

## Stage 2: Компоненты React и стили
**Goal:** Реализовать все React-компоненты (презентационные), CSS-модули, глобальные стили и корневой `App` с `useReducer`. Компоненты получают данные через props и сообщают о событиях через callbacks.

**Depends on:** Stage 1 (типы и логика должны быть готовы)

**Inputs:**
- `src/types/index.ts` (Stage 1)
- `src/logic/gameReducer.ts` с `INITIAL_STATE` (Stage 1)
- Архитектурный документ (иерархия компонентов, a11y-требования, токены дизайна)
- CSS-переменные из архитектуры

**Outputs:**
- `src/styles/global.css` — сброс, шрифты, CSS-переменные (токены дизайна)
- `src/components/App.tsx` — корневой компонент с `useReducer`, `ErrorBoundary`, условный рендеринг экранов
- `src/components/ErrorBoundary.tsx` — классовый компонент, `ErrorFallback`
- `src/components/Board.tsx` — сетка 3×3, `role="grid"`, делегирует клики
- `src/components/Cell.tsx` — клетка, `role="button"`, `aria-label`, `tabIndex`, `onKeyDown`
- `src/components/StatusBar.tsx` — статус игры, `aria-live="polite"`
- `src/components/GameSettings.tsx` — форма выбора режима и стороны
- `src/components/ResultScreen.tsx` — экран результата, кнопки «Играть снова» и «В меню»
- `src/styles/App.module.css` — стили App (+ `src/components/App.module.css` если используется)
- `src/styles/Board.module.css` — стили Board (+ `src/components/Board.module.css`)
- `src/styles/Cell.module.css` — стили Cell (+ `src/components/Cell.module.css`)
- `src/styles/StatusBar.module.css` — стили StatusBar (+ `src/components/StatusBar.module.css`)
- `src/styles/GameSettings.module.css` — стили GameSettings (+ `src/components/GameSettings.module.css`)
- `src/styles/ResultScreen.module.css` — стили ResultScreen (+ `src/components/ResultScreen.module.css`)
- `src/main.tsx` — точка входа, монтирует `App`, подключает `global.css`

**DoD:**
- [ ] `App.tsx` использует `useReducer(gameReducer, INITIAL_STATE)`, не использует `useState` для игрового состояния
- [ ] `App.tsx` оборачивает дерево в `ErrorBoundary`
- [ ] Условный рендеринг: `menu` → `GameSettings`, `game` → `Board + StatusBar`, `result` → `ResultScreen`
- [ ] `ErrorBoundary` — классовый компонент с `componentDidCatch`, показывает `ErrorFallback` с кнопкой сброса
- [ ] `Board` имеет `role="grid"` и `aria-label="Игровое поле"`, рендерит ровно 9 `Cell`
- [ ] `Cell` имеет `role="button"`, `aria-label` с описанием позиции и значения, `tabIndex={0}`, обрабатывает Enter/Space
- [ ] `StatusBar` имеет `aria-live="polite"`, отображает все три состояния `GameStatus`
- [ ] `GameSettings` содержит `<label>` для всех `<input>`/`<select>`, вызывает `onStartGame` с корректным `GameSettings`
- [ ] `ResultScreen` показывает победителя или ничью, содержит кнопки «Играть снова» и «В меню»
- [ ] `global.css` содержит все CSS-переменные из архитектуры (`--color-player-x`, `--cell-size-mobile` и т.д.)
- [ ] CSS Modules используются во всех компонентах, inline-стили отсутствуют (кроме задокументированных исключений)
- [ ] Адаптивная вёрстка: `@media (max-width: 480px)` в Board/Cell, корректное отображение от 320px
- [ ] `main.tsx` импортирует `App` и `global.css`, монтирует через `ReactDOM.createRoot`
- [ ] `npm run dev` запускает приложение без ошибок в консоли
- [ ] `npm run build` завершается без ошибок TypeScript
- [ ] Все инварианты потока данных соблюдены: данные вниз через props, события вверх через callbacks, мутации только через `dispatch`

**Risks:**
- Дублирование CSS-модулей: файлы существуют и в `src/components/`, и в `src/styles/` — нужно определить, какие использовать, и не смешивать
- `noUncheckedIndexedAccess: true` может вызвать ошибки TypeScript при обращении к `board[index]` — требует явных проверок или non-null assertions с обоснованием
- `ErrorBoundary` как классовый компонент требует корректной типизации `state` и `props` в TypeScript

---

## Stage 3: Smoke-тесты компонентов и AI_NOTES
**Goal:** Реализовать smoke-тесты для всех React-компонентов, проверить итоговое покрытие, создать `AI_NOTES.md`.

**Depends on:** Stage 1, Stage 2

**Inputs:**
- Все компоненты из Stage 2
- Все типы и логика из Stage 1
- Архитектурный документ (таблица тестов)
- `src/test-setup.ts` (уже существует)

**Outputs:**
- `src/components/App.test.tsx` — smoke: начальный рендер, экран меню
- `src/components/Board.test.tsx` — smoke: 9 клеток, вызов `onCellClick`
- `src/components/Cell.test.tsx` — smoke: X/O/пустая, `role="button"`, `aria-label`
- `src/components/StatusBar.test.tsx` — smoke: все три `GameStatus.kind`, `aria-live`
- `src/components/GameSettings.test.tsx` — smoke: рендер формы, вызов `onStartGame`
- `src/components/ResultScreen.test.tsx` — smoke: победитель/ничья, `onRestart`, `onQuitToMenu`
- `AI_NOTES.md` — документация решений, отклонений, известных проблем

**DoD:**
- [ ] `App.test.tsx` проверяет рендер без падений и наличие экрана меню
- [ ] `Board.test.tsx` проверяет рендер 9 клеток и вызов `onCellClick` при клике
- [ ] `Cell.test.tsx` проверяет рендер 'X', 'O', пустой клетки; наличие `role="button"` и корректного `aria-label`
- [ ] `StatusBar.test.tsx` проверяет отображение для `playing`, `won`, `draw`; наличие `aria-live="polite"`
- [ ] `GameSettings.test.tsx` проверяет рендер формы и вызов `onStartGame` при сабмите
- [ ] `ResultScreen.test.tsx` проверяет отображение победителя и ничьей, вызов `onRestart` и `onQuitToMenu`
- [ ] `npm test` — все тесты зелёные (unit + smoke)
- [ ] Общее покрытие ≥ 60% (строки)
- [ ] `AI_NOTES.md` создан по шаблону, содержит описание принятых решений

**Risks:**
- Общее покрытие может не достичь 60% если smoke-тесты слишком поверхностны — нужно убедиться что unit-тесты из Stage 1 дают достаточную базу
- Тестирование `ErrorBoundary` требует намеренного выброса ошибки в дочернем компоненте — нетривиально с RTL

---

# tasks.md

# Tasks: project-setup (реализация содержимого файлов)

## Stage 1: Типы, логика и ИИ

- [ ] Реализовать все TypeScript-типы → `src/types/index.ts`
- [ ] Реализовать `logEvent` утилиту → `src/utils/logger.ts`
- [ ] Реализовать `checkWinner`, `isBoardFull`, `getAvailableMoves`, `applyMove` → `src/logic/gameLogic.ts`
- [ ] Реализовать `getBestMove` (minimax) → `src/logic/aiPlayer.ts`
- [ ] Реализовать `gameReducer` и `INITIAL_STATE` → `src/logic/gameReducer.ts`
- [ ] Написать unit-тесты для gameLogic (все 8 линий, ничья, граничные случаи) → `src/logic/gameLogic.test.ts`
- [ ] Написать unit-тесты для aiPlayer (детерминированность, блокировка, победа, производительность, полная доска) → `src/logic/aiPlayer.test.ts`
- [ ] Написать unit-тесты для gameReducer (все переходы, невалидные ходы, автопереход на result) → `src/logic/gameReducer.test.ts`

## Stage 2: Компоненты React и стили

- [ ] Реализовать глобальные стили и CSS-переменные → `src/styles/global.css`
- [ ] Реализовать корневой компонент с `useReducer` и `ErrorBoundary` → `src/components/App.tsx`
- [ ] Реализовать `ErrorBoundary` (классовый компонент) и `ErrorFallback` → `src/components/ErrorBoundary.tsx`
- [ ] Реализовать игровое поле с `role="grid"` → `src/components/Board.tsx`
- [ ] Реализовать клетку с a11y-атрибутами → `src/components/Cell.tsx`
- [ ] Реализовать строку статуса с `aria-live` → `src/components/StatusBar.tsx`
- [ ] Реализовать форму настроек игры → `src/components/GameSettings.tsx`
- [ ] Реализовать экран результата → `src/components/ResultScreen.tsx`
- [ ] Реализовать стили App → `src/components/App.module.css` и/или `src/styles/App.module.css`
- [ ] Реализовать стили Board (CSS Grid, адаптив) → `src/components/Board.module.css` и/или `src/styles/Board.module.css`
- [ ] Реализовать стили Cell (размеры, цвета игроков) → `src/components/Cell.module.css` и/или `src/styles/Cell.module.css`
- [ ] Реализовать стили StatusBar → `src/components/StatusBar.module.css` и/или `src/styles/StatusBar.module.css`
- [ ] Реализовать стили GameSettings → `src/components/GameSettings.module.css` и/или `src/styles/GameSettings.module.css`
- [ ] Реализовать стили ResultScreen → `src/components/ResultScreen.module.css` и/или `src/styles/ResultScreen.module.css`
- [ ] Обновить точку входа (монтирование App, подключение global.css) → `src/main.tsx`

## Stage 3: Smoke-тесты компонентов и AI_NOTES

- [ ] Написать smoke-тест App (начальный рендер, экран меню) → `src/components/App.test.tsx`
- [ ] Написать smoke-тест Board (9 клеток, onCellClick) → `src/components/Board.test.tsx`
- [ ] Написать smoke-тест Cell (X/O/пустая, role, aria-label) → `src/components/Cell.test.tsx`
- [ ] Написать smoke-тест StatusBar (все статусы, aria-live) → `src/components/StatusBar.test.tsx`
- [ ] Написать smoke-тест GameSettings (форма, onStartGame) → `src/components/GameSettings.test.tsx`
- [ ] Написать smoke-тест ResultScreen (победитель/ничья, onRestart, onQuitToMenu) → `src/components/ResultScreen.test.tsx`
- [ ] Создать документацию принятых решений → `AI_NOTES.md`