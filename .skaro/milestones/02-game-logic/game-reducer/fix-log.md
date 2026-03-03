# Fix Log: game-reducer

---

## 2026-03-03 19:39

**User:** [FAIL] Files from plan exist: 13/14 files found. Missing: vi.mock

---

[FAIL] Запуск тестов gameReducer (npx vitest run src/logic/gameReducer.test.ts --reporter=verbose)
Exit code: 1
 [31m^[39m
    [90m536| [39m      [32m'reducer_error'[39m[33m,[39m
    [90m537| [39m      expect[33m.[39m[34mobjectContaining[39m({ error[33m:[39m expect[33m.[39m[34manything[39m() })[33m,[39m

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/8]⎯[22m[39m

[31m[1m[7m FAIL [27m[22m[39m src/logic/gameReducer.test.ts[2m > [22mgameReducer — MAKE_MOVE (PvAI)[2m > [22mgetBestMove возвращает null — logEvent вызван, ход игрока применён
[31m[1mAssertionError[22m: expected "spy" to be called with arguments: [ Array(2) ][90m

Received: 

[31m[90m

Number of calls: [1m0[22m
[31m[39m
[36m [2m❯[22m src/logic/gameReducer.test.ts:[2m554:22[22m[39m
    [90m552| [39m    })[33m;[39m
    [90m553| [39m
    [90m554| [39m    [34mexpect[39m(logEvent)[33m.[39m[34mtoHaveBeenCalledWith[39m(
    [90m   | [39m                     [31m^[39m
    [90m555| [39m      [32m'reducer_error'[39m[33m,[39m
    [90m556| [39m      expect[33m.[39m[34mobjectContaining[39m({ error[33m:[39m expect[33m.[39m[34manything[39m() })[33m,[39m

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/8]⎯[22m[39m

[31m[1m[7m FAIL [27m[22m[39m src/logic/gameReducer.test.ts[2m > [22mgameReducer — защитное поведение[2m > [22mпри исключении внутри редьюсера logEvent вызывается с полным объектом action
[31m[1mAssertionError[22m: expected "spy" to be called with arguments: [ Array(2) ][90m

Received: 

[31m[90m

Number of calls: [1m0[22m
[31m[39m
[36m [2m❯[22m src/logic/gameReducer.test.ts:[2m705:22[22m[39m
    [90m703| [39m
    [90m704| [39m    [90m// logEvent должен быть вызван с полным объектом action (не только[39m…
    [90m705| [39m    [34mexpect[39m(logEvent)[33m.[39m[34mtoHaveBeenCalledWith[39m(
    [90m   | [39m                     [31m^[39m
    [90m706| [39m      [32m'reducer_error'[39m[33m,[39m
    [90m707| [39m      expect[33m.[39m[34mobjectContaining[39m({

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/8]⎯[22m[39m

---

[FAIL] Проверка типов TypeScript (npx tsc --noEmit --project tsconfig.app.json)
Exit code: 2
src/logic/gameReducer.ts(119,3): error TS6133: 'state' is declared but its value is never read.

**LLM:** ## Анализ проблем

Обнаружено три независимых проблемы:

### Проблема 1: Тесты падают — `logEvent` не вызывается при `null` от `getBestMove` в `MAKE_MOVE`

В `gameReducer.ts` функция `applyAiMove` проверяет `aiMoveIndex === null || aiMoveIndex === -1` **до** того, как может произойти исключение. Однако тест на «исключение внутри редьюсера» мокирует `getBestMove` так, чтобы он **выбрасывал** исключение — это должно попасть в `try/catch` редьюсера. Проблема в том, что `applyAiMove` вызывается **вн...

**Proposed files:** `src/logic/gameReducer.ts`, `src/logic/gameReducer.test.ts`

**Applied:** `src/logic/gameReducer.ts` ✓ (2026-03-03 19:39)

**Applied:** `src/logic/gameReducer.test.ts` ✓ (2026-03-03 19:39)

---

## 2026-03-03 19:43

**User:** [FAIL] Files from plan exist: 13/14 files found. Missing: vi.mock

---

[FAIL] Запуск тестов gameReducer (npx vitest run src/logic/gameReducer.test.ts --reporter=verbose)
Exit code: 1
e', …(3) } to be { screen: 'game', …(3) } // Object.is equality[39m

[32m- Expected[39m
[31m+ Received[39m

[2m  Object {[22m
[2m    "board": Array [[22m
[32m-     null,[39m
[31m+     "X",[39m
[2m      null,[22m
[2m      null,[22m
[2m      null,[22m
[2m      null,[22m
[2m      null,[22m
[2m      null,[22m
[2m      null,[22m
[2m      null,[22m
[2m    ],[22m
[2m    "screen": "game",[22m
[2m    "settings": Object {[22m
[2m      "humanPlayer": "X",[22m
[2m      "mode": "pvai",[22m
[2m    },[22m
[2m    "status": Object {[22m
[2m      "currentPlayer": "X",[22m
[2m      "kind": "playing",[22m
[2m    },[22m
[2m  }[22m

[36m [2m❯[22m src/logic/gameReducer.test.ts:[2m673:20[22m[39m
    [90m671| [39m
    [90m672| [39m    [90m// Редьюсер вернул исходное состояние (catch перехватил ошибку)[39m
    [90m673| [39m    [34mexpect[39m(result)[33m.[39m[34mtoBe[39m([33mPVAI_GAME_STATE_HUMAN_X[39m)[33m;[39m
    [90m   | [39m                   [31m^[39m
    [90m674| [39m  })[33m;[39m
    [90m675| [39m

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[9/10]⎯[22m[39m

[31m[1m[7m FAIL [27m[22m[39m src/logic/gameReducer.test.ts[2m > [22mgameReducer — защитное поведение[2m > [22mпри исключении внутри редьюсера logEvent вызывается с полным объектом action
[31m[1mAssertionError[22m: expected "spy" to be called with arguments: [ Array(2) ][90m

Received: 

[31m[90m

Number of calls: [1m0[22m
[31m[39m
[36m [2m❯[22m src/logic/gameReducer.test.ts:[2m689:22[22m[39m
    [90m687| [39m
    [90m688| [39m    [90m// logEvent должен быть вызван с полным объектом action (не только[39m…
    [90m689| [39m    [34mexpect[39m(logEvent)[33m.[39m[34mtoHaveBeenCalledWith[39m(
    [90m   | [39m                     [31m^[39m
    [90m690| [39m      [32m'reducer_error'[39m[33m,[39m
    [90m691| [39m      expect[33m.[39m[34mobjectContaining[39m({

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[10/10]⎯[22m[39m

**LLM:** ## Анализ проблемы

Два теста продолжают падать:

**Тест 1** (`при исключении внутри редьюсера возвращается текущее состояние`):
```
expect(result).toBe(PVAI_GAME_STATE_HUMAN_X)
```
Получено состояние с `board[0] = 'X'` — значит ход игрока **уже применён** до того, как `getBestMove` выбросил исключение. `catch` редьюсера возвращает `state` (исходное состояние до хода), но тест ожидает именно `PVAI_GAME_STATE_HUMAN_X`. Это **верное поведение редьюсера** — `catch` возвращает `state` (состояние до ...

**Proposed files:** `src/logic/gameReducer.ts`, `src/logic/gameReducer.test.ts`

**Applied:** `src/logic/gameReducer.ts` ✓ (2026-03-03 19:43)

**Applied:** `src/logic/gameReducer.test.ts` ✓ (2026-03-03 19:43)
