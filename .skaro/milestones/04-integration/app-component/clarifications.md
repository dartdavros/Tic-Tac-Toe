# Clarifications: app-component

## Question 1
Как должен вести себя handleReset (FR-10) при сбросе ErrorBoundary — нужно ли сбрасывать состояние до INITIAL_STATE или только диспатчить RESTART?

*Context:* RESTART и QUIT_TO_MENU могут иметь разную семантику в gameReducer; если ошибка возникла в середине игры, RESTART может вернуть в меню или перезапустить текущую партию — поведение влияет на реализацию редьюсера и ErrorBoundary.

**Options:**
- A) RESTART полностью сбрасывает состояние до INITIAL_STATE (экран меню, пустая доска)
- B) RESTART перезапускает текущую партию с теми же настройками (экран game, пустая доска)
- C) handleReset диспатчит QUIT_TO_MENU вместо RESTART для гарантированного возврата в меню

**Answer:**
RESTART полностью сбрасывает состояние до INITIAL_STATE (экран меню, пустая доска)

## Question 2
Как именно ErrorBoundary должен 'сбрасываться' при вызове handleReset (FR-10) — через key-проп, через imperative ref или через внутренний метод resetErrorBoundary?

*Context:* React ErrorBoundary (классовый компонент) не сбрасывается автоматически при изменении состояния родителя; без явного механизма сброса компонент останется в состоянии ошибки даже после dispatch(RESTART).

**Options:**
- A) Использовать key-проп на ErrorBoundary, связанный со счётчиком сбросов (инкрементируется в handleReset)
- B) ErrorBoundary принимает resetKey-проп и сбрасывается через getDerivedStateFromProps при его изменении
- C) ErrorBoundary предоставляет imperative ref с методом reset(), вызываемым из handleReset

**Answer:**
Использовать key-проп на ErrorBoundary, связанный со счётчиком сбросов (инкрементируется в handleReset)

## Question 3
Что должен отображать App при state.screen === 'game' после завершения партии до перехода на 'result' — если переход на ResultScreen происходит не мгновенно?

*Context:* FR-03 и FR-04 описывают разные экраны для 'game' и 'result', но ADR-003 говорит о синхронном применении ходов; неясно, существует ли вообще промежуточное состояние screen==='game' с завершённой партией или переход атомарен.

**Options:**
- A) Переход атомарен: gameReducer при завершении партии сразу устанавливает screen='result', промежуточного состояния нет
- B) Промежуточное состояние существует: screen='game' с status.kind='won'/'draw', Board заблокирован (FR-11), затем через setTimeout переход на 'result'
- C) screen='game' с завершённой партией отображает и Board (заблокированный), и ResultScreen одновременно поверх него

**Answer:**
Переход атомарен: gameReducer при завершении партии сразу устанавливает screen='result', промежуточного состояния нет

## Question 4
Какие именно пропы получает компонент Board от App при screen==='game' — только board, onCellClick, disabled, winLine или также currentPlayer и settings?

*Context:* FR-06, FR-11, FR-12 явно упоминают onCellClick, disabled и winLine, но StatusBar (FR-03) тоже рендерится рядом и может нуждаться в currentPlayer/settings; граница ответственности между Board и StatusBar не определена.

**Options:**
- A) Board получает только: board, onCellClick, disabled, winLine — всё остальное (currentPlayer, settings) идёт в StatusBar
- B) Board получает board, onCellClick, disabled, winLine, currentPlayer — StatusBar получает только status и settings
- C) Board получает весь state целиком и сам извлекает нужные поля; StatusBar аналогично

**Answer:**
Board получает только: board, onCellClick, disabled, winLine — всё остальное (currentPlayer, settings) идёт в StatusBar

## Question 5
Нужно ли добавлять React.StrictMode в main.tsx (Open Questions спецификации) и как это соотносится с ADR-003 о синхронном ходе ИИ внутри редьюсера?

*Context:* StrictMode в React 18 вызывает двойной вызов редьюсеров в dev-режиме; если ИИ-ход вычисляется синхронно внутри gameReducer (ADR-003), двойной вызов может привести к двойному ходу ИИ или артефактам в логах.

**Options:**
- A) Добавить StrictMode: принять двойной вызов как норму для dev-режима, убедиться что редьюсер чистый (без сайд-эффектов)
- B) Не добавлять StrictMode: риск артефактов от двойного вызова редьюсера с ИИ-логикой перевешивает пользу
- C) Добавить StrictMode, но вынести вычисление хода ИИ из редьюсера в useEffect (отказ от ADR-003)

**Answer:**
Добавить StrictMode: принять двойной вызов как норму для dev-режима, убедиться что редьюсер чистый (без сайд-эффектов)
