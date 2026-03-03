# Кросс-валидация и комплексный код-ревью

## SPEC ↔ CODE

### FR (Функциональные требования)

| Требование | Статус | Комментарий |
|---|---|---|
| FR-01: Проект инициализирован через Vite с шаблоном react-ts | ✅ | Структура соответствует шаблону |
| FR-02: React 18, react-dom 18, TypeScript 5.x, Vite 5 | ✅ | package.json подтверждает версии |
| FR-03: Все dev-зависимости установлены | ✅ | Все пакеты присутствуют в package.json |
| FR-03: eslint-plugin-jsx-a11y отсутствует | ✅ | Не найден в package.json |
| FR-04: eslint.config.js (flat config) с правилами TS и React | ✅ | Реализован корректно |
| FR-05: .prettierrc с указанными настройками | ⚠️ | Файл `.prettierrc` не предоставлен в исходниках — невозможно верифицировать |
| FR-06: vitest.config.ts с jsdom, v8, thresholds 60% | ✅ | Реализован в `vite.config.ts` (объединён с vite-конфигом) |
| FR-07: Структура папок src/components/, logic/, utils/, types/, styles/ | ✅ | Все папки присутствуют |
| FR-08: Скрипты dev, build, preview, lint, lint:fix, format, format:check, test, test:coverage | ⚠️ | Отсутствует `test:watch` в спецификации, но присутствует в package.json — это не нарушение, но избыток |
| FR-09: tsconfig.json со strict, noUncheckedIndexedAccess, алиасы @/* | ❌ | `noUncheckedIndexedAccess: true` **отсутствует** в tsconfig.app.json и tsconfig.node.json; алиасы `@/*` → `src/*` в `compilerOptions.paths` **отсутствуют** |
| FR-10: .gitignore с node_modules/, dist/, .env | ⚠️ | Файл не предоставлен — невозможно верифицировать |
| FR-11: Удалены заглушки Vite, main.tsx рендерит App | ⚠️ | Спецификация требует чтобы main.tsx **не импортировал App.tsx**, но в текущей реализации main.tsx импортирует App — это противоречие между FR-11 спецификации и реальным планом реализации (план разрешает App.tsx) |
| FR-12: vite.config.ts с resolve.alias @/ → src/ | ❌ | `resolve.alias` в vite.config.ts **отсутствует** |
| FR-13: husky и lint-staged отсутствуют | ✅ | Не найдены в package.json |

### Код, не описанный в спецификации

| Файл/элемент | Описание |
|---|---|
| `src/logic/gameLogic.ts` → `computeGameStatus`, `getOpponent`, `isCellOccupied` | Функции не упомянуты в спецификации setup-задачи, но являются частью архитектуры — допустимо |
| `test:watch` скрипт | Не требовался спецификацией, но безвреден |
| `vite.config.ts` объединяет vitest и vite конфиги | Спецификация требует отдельный `vitest.config.ts`, но объединение — распространённая практика |

---

## INVARIANTS

| Инвариант | Статус | Объяснение |
|---|---|---|
| №1: Единственная точка мутации GameState через dispatch | ✅ | gameReducer — единственное место изменения состояния |
| №2: Однонаправленный поток данных | ✅ | Данные вниз через props, события вверх через callbacks |
| №3: Изоляция бизнес-логики (logic/ не импортирует из components/) | ✅ | Нет импортов React API в logic/ |
| №4: ИИ вызывается только из gameReducer | ✅ | getBestMove вызывается только в gameReducer.ts |
| №5: Переход на result только в редьюсере | ✅ | Компоненты не диспатчат переход на result |
| №6: Редьюсер не выбрасывает исключения | ✅ | try/catch оборачивает всю логику |
| №7: ИИ < 50 мс | ✅ | Minimax для 3×3 детерминированно быстр, тест подтверждает |
| №11: result достижим только из game | ✅ | MAKE_MOVE из menu игнорируется |
| №12: BoardState — кортеж длины 9 | ✅ | Определён как кортеж в types/index.ts |
| №13: GameSettings — дискриминированный union | ✅ | Реализован корректно |
| ADR-001: useReducer как единственный механизм | ⚠️ | App.tsx содержит заглушку с `_state, _dispatch` — не реализован полный рендеринг |
| ADR-002: Minimax без оптимизаций | ✅ | Реализован полный перебор |
| ADR-003: Синхронный вызов ИИ в gameReducer | ✅ | Ход ИИ вычисляется синхронно |
| ADR-004: CSS Modules | ⚠️ | Все CSS-модули пусты (заглушки) |
| ADR-005: ErrorBoundary — классовый компонент | ✅ | Реализован корректно |
| ADR-006: Дискриминированный union GameSettings | ✅ | Реализован |
| ADR-007: Защитный gameReducer с try/catch | ✅ | Реализован |
| ADR-008: Co-location тестов | ✅ | Тесты рядом с тестируемыми файлами |
| ADR-009: Статический хостинг | ✅ | Нет серверной части |
| ADR-010: a11y минимум для интерактивных элементов | ⚠️ | Cell и Board имеют заглушки без полной реализации |

---

## MUST FIX

### 🔴 BLOCKER-01: Отсутствует `noUncheckedIndexedAccess` в tsconfig

**Файл:** `tsconfig.app.json`, `tsconfig.node.json`

Спецификация FR-09 явно требует `"noUncheckedIndexedAccess": true`. Без этой настройки обращения к элементам массива не проверяются TypeScript-компилятором, что противоречит конституции проекта и делает невозможным выполнение критерия приёмки.

```json
// tsconfig.app.json — добавить в compilerOptions:
"noUncheckedIndexedAccess": true
```

**Последствие:** Код в `aiPlayer.ts` использует `moves[0] as number` с комментарием о `noUncheckedIndexedAccess`, но сама настройка не включена — защита отсутствует.

---

### 🔴 BLOCKER-02: Отсутствует `resolve.alias` в vite.config.ts

**Файл:** `vite.config.ts`

FR-12 требует настройки алиаса `@/` → `src/` в `resolve.alias`. Без этого импорты вида `import { foo } from '@/utils/foo'` не будут разрешаться при сборке. Критерий приёмки явно проверяет этот пункт.

```typescript
// vite.config.ts — добавить:
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // ... test config
});
```

Также необходимо добавить `paths` в `tsconfig.app.json`:

```json
"paths": {
  "@/*": ["./src/*"]
}
```

---

### 🔴 BLOCKER-03: Логическая ошибка в `minimax` — некорректная оценка при глубине

**Файл:** `src/logic/aiPlayer.ts`, функция `minimax`

Текущая реализация не учитывает глубину рекурсии в оценочной функции. Это означает, что minimax не различает «победить за 1 ход» и «победить за 5 ходов» — оба варианта дают оценку +10. Для поля 3×3 это не критично с точки зрения корректности (алгоритм всё равно найдёт победный ход), **но** это нарушает тест `'выбирает победный ход для ИИ (X побеждает в следующем ходу)'`:

```typescript
// Тест ожидает move === 2 (победа X)
// Доска: ['X', 'X', null, 'O', 'O', null, null, null, null]
// Без учёта глубины алгоритм может выбрать блокировку O (индекс 5)
// вместо немедленной победы X (индекс 2), если оценки равны
```

Проблема: при текущей реализации ход в клетку 2 (победа X, оценка +10) и ход в клетку 5 (блокировка O, затем долгая игра) могут получить одинаковую оценку на первом уровне, и алгоритм выберет первый по порядку — что случайно может совпасть с ожидаемым, но это хрупко.

**Исправление** — добавить учёт глубины:

```typescript
function minimax(
  board: BoardState,
  isMaximizing: boolean,
  aiSymbol: Player,
  depth: number, // добавить параметр
): number {
  const score = evaluate(board, aiSymbol);
  if (score !== 0) return score - depth * Math.sign(score); // победа быстрее = лучше
  if (isBoardFull(board)) return 0;
  // ...
  // рекурсивные вызовы: minimax(nextBoard, false, aiSymbol, depth + 1)
}
```

---

### 🔴 BLOCKER-04: `App.tsx` не реализован — рендерит заглушку

**Файл:** `src/components/App.tsx`

Компонент содержит `TODO` и рендерит `<div>Tic-Tac-Toe</div>`. Переменные `_state` и `_dispatch` с префиксом `_` означают, что состояние не используется. Это нарушает ADR-001 и делает приложение нефункциональным.

```typescript
// Текущее состояние — заглушка:
const [_state, _dispatch] = useReducer(gameReducer, INITIAL_STATE);
return (
  <ErrorBoundary>
    <div>Tic-Tac-Toe</div>
  </ErrorBoundary>
);
```

Все дочерние компоненты (`GameSettings`, `Board`, `StatusBar`, `ResultScreen`) также являются заглушками с `void` параметрами.

---

### 🔴 BLOCKER-05: Тест `'ИИ за O выбирает победный ход'` конфликтует с логикой

**Файл:** `src/logic/aiPlayer.test.ts`, строка ~последний тест

```typescript
// Доска: ['X', 'X', null, 'O', 'O', null, null, null, null]
// Тест ожидает move === 5 (победа O)
// НО: X также может победить ходом в клетку 2!
// ИИ играет за O, но X тоже угрожает победой
// Minimax за O должен выбрать 5 (победа O немедленно)
// Это корректно ТОЛЬКО если учитывается глубина (см. BLOCKER-03)
```

Без учёта глубины алгоритм может выбрать блокировку X (индекс 2) вместо победы O (индекс 5), если оценки равны по абсолютному значению.

---

### 🔴 BLOCKER-06: `default` ветка в `gameReducer` — ошибка типизации

**Файл:** `src/logic/gameReducer.ts`, ветка `default`

```typescript
default: {
  const _exhaustive: never = action;
  logEvent('invalid_move', { action: _exhaustive });
  return state;
}
```

Присвоение `action` типу `never` корректно для exhaustive check в TypeScript, **но** `logEvent` принимает `Record<string, unknown>`, а `_exhaustive` имеет тип `never`. При передаче `{ action: _exhaustive }` TypeScript может вывести тип объекта некорректно. Кроме того, тест проверяет эту ветку через `as any` — это нормально для тестирования runtime-защиты, но стоит задокументировать.

Более серьёзная проблема: если TypeScript правильно настроен, ветка `default` **никогда не достигается** при корректных типах — это мёртвый код с точки зрения типизации. Но при `as any` в тесте — достигается. Это противоречие нужно явно задокументировать.

---

## SHOULD IMPROVE

### 🟡 IMPROVE-01: `moves[0] as number` — небезопасное приведение типа

**Файл:** `src/logic/aiPlayer.ts`

```typescript
let bestMove = moves[0] as number;
```

Комментарий говорит «Гарантированно не undefined: moves.length > 0 проверено выше» — это верно, но `as number` скрывает потенциальную проблему. Более идиоматичный подход:

```typescript
// Вариант 1: явная проверка с выбросом (уже есть выше)
if (moves.length === 0) throw new Error('No available moves');
const firstMove = moves[0]; // тип: number | undefined при noUncheckedIndexedAccess
if (firstMove === undefined) throw new Error('No available moves'); // дополнительная защита
let bestMove = firstMove;

// Вариант 2: non-null assertion с комментарием
let bestMove = moves[0]!; // безопасно: проверено moves.length > 0 выше
```

После включения `noUncheckedIndexedAccess` (BLOCKER-01) текущий код `moves[0] as number` вызовет ошибку компилятора — нужно исправить заранее.

---

### 🟡 IMPROVE-02: `computeGameStatus` не экспортируется из публичного API, но используется в тестах

**Файл:** `src/logic/gameLogic.ts`

Функция `computeGameStatus` тестируется напрямую, что хорошо. Но она также используется в `gameReducer.ts`. Стоит убедиться, что контракт функции задокументирован — в частности, что `currentPlayer` — это игрок, **который только что сделал ход**, а не следующий. Это неочевидно из названия параметра.

```typescript
// Текущая сигнатура:
export function computeGameStatus(board: BoardState, currentPlayer: Player): GameStatus

// Рекомендация: переименовать параметр для ясности:
export function computeGameStatus(board: BoardState, lastPlayer: Player): GameStatus
```

---

### 🟡 IMPROVE-03: Дублирование `EMPTY_BOARD` в редьюсере и тестах

**Файлы:** `src/logic/gameReducer.ts`, `src/logic/gameReducer.test.ts`, `src/logic/aiPlayer.test.ts`, `src/logic/gameLogic.test.ts`

Константа пустой доски определена в 4 местах:

```typescript
// gameReducer.ts:
const EMPTY_BOARD: BoardState = [null, null, null, null, null, null, null, null, null];

// gameReducer.test.ts:
const EMPTY: BoardState = [null, null, null, null, null, null, null, null, null];

// aiPlayer.test.ts:
const EMPTY: BoardState = [null, null, null, null, null, null, null, null, null];

// gameLogic.test.ts:
const EMPTY: BoardState = [null, null, null, null, null, null, null, null, null];
```

**Рекомендация:** Вынести в `src/utils/testHelpers.ts` или экспортировать `EMPTY_BOARD` из `gameReducer.ts`:

```typescript
// src/logic/gameReducer.ts — сделать экспортируемой:
export const EMPTY_BOARD: BoardState = [null, null, null, null, null, null, null, null, null];
```

---

### 🟡 IMPROVE-04: `ErrorBoundary` не имеет кнопки сброса с dispatch

**Файл:** `src/components/ErrorBoundary.tsx`

TODO-комментарий указывает на необходимость кнопки «Начать заново» с `dispatch(RESTART)`. Текущая реализация показывает только текст без возможности восстановления. Для учебного проекта это приемлемо, но нарушает ADR-005.

Проблема архитектурная: `ErrorBoundary` — классовый компонент, у него нет доступа к `dispatch` из `useReducer`. Решение — передать `onReset` callback через props:

```typescript
interface ErrorBoundaryProps {
  children: ReactNode;
  onReset?: () => void; // callback для сброса состояния
}
```

---

### 🟡 IMPROVE-05: Тест производительности использует `performance.now()` без учёта JIT

**Файл:** `src/logic/aiPlayer.test.ts`

```typescript
it('выполняется менее чем за 50 мс на пустой доске (худший случай)', () => {
  const start = performance.now();
  getBestMove(EMPTY, 'X');
  expect(performance.now() - start).toBeLessThan(50);
});
```

Первый вызов функции в тестовой среде может быть медленнее из-за JIT-компиляции. Рекомендуется прогрев:

```typescript
it('выполняется менее чем за 50 мс на пустой доске (худший случай)', () => {
  getBestMove(EMPTY, 'X'); // прогрев JIT
  const start = performance.now();
  getBestMove(EMPTY, 'X');
  expect(performance.now() - start).toBeLessThan(50);
});
```

---

### 🟡 IMPROVE-06: `gameReducer.test.ts` — тест PvAI не проверяет конкретный ход ИИ

**Файл:** `src/logic/gameReducer.test.ts`

```typescript
it('после хода человека ИИ делает ответный ход', () => {
  // ...
  const occupied = state2.board.filter((c) => c !== null).length;
  expect(occupied).toBe(2);
});
```

Тест проверяет только количество занятых клеток, но не проверяет, что ИИ сделал **оптимальный** ход. Для интеграционного теста редьюсера это допустимо, но стоит добавить проверку, что клетка 0 (ход человека) занята X, а ИИ занял центр (4):

```typescript
expect(state2.board[0]).toBe('X'); // ход человека
expect(state2.board[4]).toBe('O'); // оптимальный ответ ИИ (центр)
```

---

### 🟡 IMPROVE-07: Отсутствует `path` import в vite.config.ts для алиасов

**Файл:** `vite.config.ts`

При добавлении `resolve.alias` потребуется импорт `path` из Node.js. Поскольку проект использует ESM (`"type": "module"`), нужно использовать `import { fileURLToPath } from 'url'` и `import { dirname } from 'path'` или `import.meta.url`:

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // ...
});
```

---

### 🟡 IMPROVE-08: CSS-модули — все файлы пусты

**Файлы:** все `*.module.css` в `src/components/` и `src/styles/`

Все CSS-модули содержат только комментарии-заглушки. Это Stage 2 работы, но стоит отметить, что дублирование CSS-модулей в двух папках (`src/components/` и `src/styles/`) создаёт неоднозначность — нужно определить единое место и придерживаться его.

---

## NICE TO HAVE

### 🟢 NTH-01: Добавить `vitest.config.ts` как отдельный файл

Спецификация FR-06 требует `vitest.config.ts`, а не объединённый `vite.config.ts`. Разделение улучшает читаемость и соответствует спецификации буквально.

---

### 🟢 NTH-02: Добавить `aria-disabled` в Cell для занятых клеток

**Файл:** `src/components/Cell.tsx` (будущая реализация)

При реализации Stage 2 стоит добавить `aria-disabled={disabled}` и `aria-pressed` для улучшения доступности сверх минимального требования ADR-010.

---

### 🟢 NTH-03: Экспортировать `WIN_LINES` для использования в тестах

**Файл:** `src/logic/gameLogic.ts`

Константа `WIN_LINES` приватна. Экспорт позволит тестам проверять все 8 линий параметрически:

```typescript
export const WIN_LINES: [number, number, number][] = [...];

// В тестах:
it.each(WIN_LINES)('определяет победу по линии %j', (a, b, c) => {
  const board = [...EMPTY] as BoardState;
  board[a] = board[b] = board[c] = 'X';
  expect(checkWinner(board)?.winLine).toEqual([a, b, c]);
});
```

---

### 🟢 NTH-04: Добавить `@types/node` для корректной типизации `path` в vite.config.ts

При использовании `path.resolve` или `fileURLToPath` в `vite.config.ts` TypeScript потребует `@types/node`. Обычно он уже установлен транзитивно через Vite, но явная зависимость улучшает надёжность.

---

### 🟢 NTH-05: Рассмотреть `useCallback` для `dispatch`-обёрток в App

При реализации Stage 2 в `App.tsx` callback'и для дочерних компонентов стоит обернуть в `useCallback` для предотвращения лишних ре-рендеров, хотя для учебного проекта это некритично.

---

## Итоговая сводка

| Категория | Критических | Важных | Опциональных |
|---|---|---|---|
| MUST FIX | 6 | — | — |
| SHOULD IMPROVE | — | 8 | — |
| NICE TO HAVE | — | — | 5 |

**Главные блокеры перед мержем:**
1. `noUncheckedIndexedAccess` не включён в tsconfig
2. `resolve.alias` отсутствует в vite.config.ts
3. Minimax без учёта глубины — хрупкие тесты
4. App.tsx и все компоненты — заглушки (Stage 2 не реализован)
5. Тест на победный ход ИИ может быть нестабильным без учёта глубины
6. `default` ветка редьюсера требует документирования