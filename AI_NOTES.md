# AI_NOTES — Исправление ошибок: ResultScreen тесты и gameReducer тесты

## Что было исправлено

### Проблема 1: Ошибка TypeScript в `ResultScreen.test.tsx`

**Симптом:** `error TS2322: Property 'winLine' is missing in type '{ kind: "won"; winner: "X"; }'`

**Причина:** Тип `GameStatus` в `src/types/index.ts` определяет вариант `won` как
`{ kind: 'won'; winner: Player; winLine: number[] }` — поле `winLine` обязательно.
Тестовые константы `STATUS_WON_X` и `STATUS_WON_O` не включали это поле.

**Исправление:** Добавлено поле `winLine` в тестовые константы:
```typescript
const STATUS_WON_X: ResultStatus = { kind: 'won', winner: 'X', winLine: [0, 1, 2] };
const STATUS_WON_O: ResultStatus = { kind: 'won', winner: 'O', winLine: [3, 4, 5] };