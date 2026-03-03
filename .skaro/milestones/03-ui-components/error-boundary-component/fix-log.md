# Fix Log: error-boundary-component

---

## 2026-03-03 20:16

**User:** [FAIL] Сборка проекта (npm run build)
Exit code: 1
=> void; }' is not assignable to type 'IntrinsicAttributes & IntrinsicClassAttributes<ErrorBoundary> & Readonly<ErrorBoundaryProps>'.

  Property 'onReset' does not exist on type 'IntrinsicAttributes & IntrinsicClassAttributes<ErrorBoundary> & Readonly<ErrorBoundaryProps>'.

src/components/Board.tsx(45,19): error TS2322: Type '{ value: CellValue; index: 0 | 3 | 1 | 2 | 4 | 5 | 6 | 7 | 8; onClick: () => void; isWinCell: boolean; disabled: boolean; }' is not assignable to type 'IntrinsicAttributes & CellProps'.

  Property 'onClick' does not exist on type 'IntrinsicAttributes & CellProps'.

src/logic/gameReducer.test.ts(20,38): error TS2459: Module '"./gameReducer"' declares 'EMPTY_BOARD' locally, but it is not exported.

src/logic/gameReducer.test.ts(20,51): error TS2305: Module '"./gameReducer"' has no exported member 'isAiTurn'.

src/logic/gameReducer.test.ts(62,31): error TS7006: Parameter 'cell' implicitly has an 'any' type.

src/logic/gameReducer.ts(48,14): error TS2345: Argument of type '"invalid_action"' is not assignable to parameter of type 'LogEventType'.

src/logic/gameReducer.ts(54,14): error TS2345: Argument of type '"invalid_action"' is not assignable to parameter of type 'LogEventType'.

src/logic/gameReducer.ts(60,14): error TS2345: Argument of type '"invalid_action"' is not assignable to parameter of type 'LogEventType'.

src/logic/gameReducer.ts(66,14): error TS2345: Argument of type '"invalid_action"' is not assignable to parameter of type 'LogEventType'.

src/logic/gameReducer.ts(153,20): error TS2345: Argument of type '"invalid_action"' is not assignable to parameter of type 'LogEventType'.

src/logic/gameReducer.ts(179,18): error TS2345: Argument of type '"unknown_action"' is not assignable to parameter of type 'LogEventType'.

vite.config.ts(7,3): error TS2769: No overload matches this call.

  The last overload gave the following error.

    Object literal may only specify known properties, and 'test' does not exist in type 'UserConfigExport'.

---

[FAIL] Запуск существующих тестов редьюсера (не должны сломаться после добавления RESET_GAME) (npx vitest run src/logic/gameReducer.test.ts)
Exit code: 1
meReducer.test.ts[2m > [22mgameReducer — RESTART[2m > [22mlogEvent НЕ вызывается при RESTART
[31m[1mAssertionError[22m: expected "spy" to not be called at all, but actually been called 1 times[90m

Received: 

[1m  1st spy call:

[22m    Array [
      "invalid_action",
      Object {
        "reason": "restart_not_from_result",
      },
    ]
[31m[90m

Number of calls: [1m1[22m
[31m[39m
[36m [2m❯[22m src/logic/gameReducer.test.ts:[2m639:26[22m[39m
    [90m637| [39m  [34mit[39m([32m'logEvent НЕ вызывается при RESTART'[39m[33m,[39m () [33m=>[39m {
    [90m638| [39m    [34mgameReducer[39m([33mPVP_GAME_STATE[39m[33m,[39m { type[33m:[39m [32m'RESTART'[39m })[33m;[39m
    [90m639| [39m    [34mexpect[39m(logEvent)[33m.[39mnot[33m.[39m[34mtoHaveBeenCalled[39m()[33m;[39m
    [90m   | [39m                         [31m^[39m
    [90m640| [39m  })[33m;[39m
    [90m641| [39m})[33m;[39m

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[22/23]⎯[22m[39m

[31m[1m[7m FAIL [27m[22m[39m src/logic/gameReducer.test.ts[2m > [22mgameReducer — защитное поведение[2m > [22mпри исключении в getBestMove возвращается состояние с ходом игрока
[31m[1mAssertionError[22m: expected null to be 'X' // Object.is equality[39m

[32m- Expected:[39m 
"X"

[31m+ Received:[39m 
null

[36m [2m❯[22m src/logic/gameReducer.test.ts:[2m692:29[22m[39m
    [90m690| [39m
    [90m691| [39m    [90m// Ход игрока применён (X в клетку 0)[39m
    [90m692| [39m    [34mexpect[39m(result[33m.[39mboard[[34m0[39m])[33m.[39m[34mtoBe[39m([32m'X'[39m)[33m;[39m
    [90m   | [39m                            [31m^[39m
    [90m693| [39m    [90m// Ход ИИ не применён (только одна занятая клетка)[39m
    [90m694| [39m    [35mconst[39m occupied [33m=[39m result[33m.[39mboard[33m.[39m[34mfilter[39m((c) [33m=>[39m c [33m!==[39m [35mnull[39m)[33m.[39mlength[33m;[39m

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[23/23]⎯[22m[39m

---

[FAIL] Запуск всех тестов с покрытием (npx vitest run --coverage)
Exit code: 1
mponents/Cell.tsx:[2m59:7[22m[39m
    [90m 57| [39m  [35mfunction[39m [34mhandleClick[39m() {
    [90m 58| [39m    [35mif[39m ([33m![39mdisabled) {
    [90m 59| [39m      [34monCellClick[39m(index)[33m;[39m
    [90m   | [39m      [31m^[39m
    [90m 60| [39m    }
    [90m 61| [39m  }
[90m [2m❯[22m HTMLUnknownElement.callCallback node_modules/react-dom/cjs/react-dom.development.js:[2m4164:14[22m[39m
[90m [2m❯[22m HTMLUnknownElement.callTheUserObjectsOperation node_modules/jsdom/lib/jsdom/living/generated/EventListener.js:[2m26:30[22m[39m
[90m [2m❯[22m innerInvokeEventListeners node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:[2m350:25[22m[39m
[90m [2m❯[22m invokeEventListeners node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:[2m286:3[22m[39m
[90m [2m❯[22m HTMLUnknownElementImpl._dispatch node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:[2m233:9[22m[39m
[90m [2m❯[22m HTMLUnknownElementImpl.dispatchEvent node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:[2m104:17[22m[39m
[90m [2m❯[22m HTMLUnknownElement.dispatchEvent node_modules/jsdom/lib/jsdom/living/generated/EventTarget.js:[2m241:34[22m[39m
[90m [2m❯[22m Object.invokeGuardedCallbackDev node_modules/react-dom/cjs/react-dom.development.js:[2m4213:16[22m[39m
[90m [2m❯[22m invokeGuardedCallback node_modules/react-dom/cjs/react-dom.development.js:[2m4277:31[22m[39m

[31mThis error originated in "[1msrc/components/Board.test.tsx[22m" test file. It doesn't mean the error was thrown inside the file itself, but while it was running.[39m
[31mThe latest test that might've caused the error is "[1mвызывает onCellClick с корректным индексом при клике на свободную клетку[22m". It might mean one of the following:
- The error was thrown, while Vitest was running this test.
- If the error occurred after the test had been completed, this was the last documented test before it was thrown.[39m

**LLM:** ## Анализ проблем и план исправлений

Обнаружено несколько независимых ошибок:

1. **`ErrorBoundary` не принимает `onReset`** — старый файл `src/components/ErrorBoundary.tsx` всё ещё существует и перекрывает новый каталог при импорте. `App.tsx` импортирует из `'./ErrorBoundary'`, что резолвится в старый файл без `onReset`.

2. **`Board.tsx` передаёт `onClick` вместо `onCellClick`** — несоответствие имени пропса между `Board.tsx` и `CellProps`.

3. **`EMPTY_BOARD` и `isAiTurn` не экспортируются**...

**Proposed files:** `src/components/ErrorBoundary.tsx`, `src/components/Board.tsx`, `src/components/Cell.tsx`, `src/utils/logger.ts`, `src/logic/gameReducer.ts`, `vite.config.ts`, `src/types/index.ts`, `AI_NOTES.md`

**Applied:** `src/components/ErrorBoundary.tsx` ✓ (2026-03-03 20:17)

**Applied:** `src/components/Board.tsx` ✓ (2026-03-03 20:17)

**Applied:** `src/components/Cell.tsx` ✓ (2026-03-03 20:17)

**Applied:** `src/utils/logger.ts` ✓ (2026-03-03 20:17)

**Applied:** `src/logic/gameReducer.ts` ✓ (2026-03-03 20:17)

**Applied:** `vite.config.ts` ✓ (2026-03-03 20:17)

**Applied:** `src/types/index.ts` ✓ (2026-03-03 20:17)

**Applied:** `AI_NOTES.md` ✓ (2026-03-03 20:17)
