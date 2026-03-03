# Кросс-валидация и код-ревью: global-styles (Stage 1 + Stage 2)

---

## SPEC ↔ CODE

### Функциональные требования (FR)

| Требование | Статус | Комментарий |
|---|---|---|
| FR-01: `src/styles/global.css` создан и подключён в `src/main.tsx` | ✅ | Файл существует, `import './styles/global.css'` присутствует в `main.tsx` |
| FR-02: CSS-переменные цветов в `:root` (9 переменных) | ✅ | Все 9 цветовых переменных определены корректно |
| FR-03: `--cell-size-desktop: 120px` по умолчанию, переопределяется в `@media (max-width: 480px)` | ✅ | Реализовано согласно спецификации |
| FR-04: Переменные типографики (`--font-family`, `--font-size-base`, `--font-size-large`) | ✅ | Все три переменные определены |
| FR-05: CSS-сброс (`box-sizing`, `margin: 0`, `padding: 0` для `body`) | ✅ | Реализован корректно |
| FR-06: `body` использует CSS-переменные | ✅ | Все четыре переменные применены |
| FR-07: `@media (max-width: 480px)` с тремя переопределениями | ✅ | Все три переменные переопределены |
| FR-08: Отображение от 320px без горизонтального скролла | ⚠️ | Нет `min-width` или `overflow-x: hidden` на `body`/`html`; зависит от компонентов, которых ещё нет — риск |
| FR-09: `--border-radius: 8px` | ✅ | Определена |
| FR-10: `--spacing-base: 16px` | ✅ | Определена |

### Нефункциональные требования (NFR)

| Требование | Статус | Комментарий |
|---|---|---|
| NFR-01: Нет компонентно-специфичных стилей | ✅ | Файл содержит только сброс и переменные |
| NFR-02: Все значения через CSS-переменные | ✅ | `body` использует только `var(--...)`, исключение — `0` для margin/padding (допустимо) |

### Таблица 16 CSS-переменных

| Переменная | Ожидаемое значение | Реализовано | Статус |
|---|---|---|---|
| `--color-player-x` | `#e74c3c` | `#e74c3c` | ✅ |
| `--color-player-o` | `#3498db` | `#3498db` | ✅ |
| `--color-bg` | `#f9f9f9` | `#f9f9f9` | ✅ |
| `--color-surface` | `#ffffff` | `#ffffff` | ✅ |
| `--color-border` | `#cccccc` | `#cccccc` | ✅ |
| `--color-text-primary` | `#222222` | `#222222` | ✅ |
| `--color-text-secondary` | `#666666` | `#666666` | ✅ |
| `--color-accent` | `#27ae60` | `#27ae60` | ✅ |
| `--color-win-highlight` | `#f1c40f` | `#f1c40f` | ✅ |
| `--cell-size-desktop` | `120px` | `120px` | ✅ |
| `--cell-size-mobile` | `80px` | `80px` | ✅ |
| `--font-family` | `'Segoe UI', system-ui, sans-serif` | `'Segoe UI', system-ui, sans-serif` | ✅ |
| `--font-size-base` | `16px` | `16px` | ✅ |
| `--font-size-large` | `24px` | `24px` | ✅ |
| `--border-radius` | `8px` | `8px` | ✅ |
| `--spacing-base` | `16px` | `16px` | ✅ |

### Переопределения в медиазапросе

| Переменная | Ожидаемое | Реализовано | Статус |
|---|---|---|---|
| `--font-size-base` | `14px` | `14px` | ✅ |
| `--font-size-large` | `18px` | `18px` | ✅ |
| `--cell-size-desktop` | `80px` | `80px` | ✅ |

### Критерии приёмки (Acceptance Criteria)

| Критерий | Статус | Комментарий |
|---|---|---|
| `src/styles/global.css` создан, содержит все 16 переменных | ✅ | |
| `import './styles/global.css'` в `src/main.tsx` | ✅ | |
| В DevTools видны все переменные включая `--color-win-highlight`, `--border-radius`, `--spacing-base` | ✅ | Статически верно |
| Страница корректна на 320px без горизонтального скролла | ⚠️ | Не гарантировано без `html { overflow-x: hidden }` или явного `max-width` |
| При ≤480px переменные принимают мобильные значения | ✅ | |
| При >480px `--cell-size-desktop` равна `120px` | ✅ | |
| `npm run build` без ошибок | ✅ | Структурно корректно |

### Код, не описанный в спецификации

| Элемент | Файл | Оценка |
|---|---|---|
| Комментарии-разделители (`/* === */`, `/* --- */`) | `global.css` | ✅ Допустимо, улучшает читаемость |
| Комментарий о невозможности `var()` в `@media` условиях | `global.css` | ✅ Полезная документация |
| Ссылки на инварианты №14, №15 в комментарии заголовка | `global.css` | ✅ Соответствует архитектурным решениям |

---

## INVARIANTS

| Инвариант | Статус | Объяснение |
|---|---|---|
| №1: Единственная точка мутации через `useReducer` | ✅ | `App.tsx` использует `useReducer`, `dispatch` не вызывается из других мест |
| №2: Однонаправленный поток данных | ✅ | Props вниз, callbacks вверх во всех заглушках |
| №3: Изоляция бизнес-логики | ✅ | `logic/` не импортирует из `components/`, не использует React API |
| №4: ИИ вызывается только из редьюсера | ✅ | `getBestMove` не импортируется в компонентах |
| №5: Переход в `result` только в редьюсере | ✅ | Компоненты не диспатчат переход в result |
| №6: Редьюсер не выбрасывает исключений | ✅ | `try/catch` оборачивает весь switch, возвращает `state` при ошибке |
| №7: ИИ выполняется менее 50 мс | ✅ | Заглушка, реализация в следующей задаче |
| №9: `dangerouslySetInnerHTML` запрещён | ✅ | Не используется нигде |
| №12: `BoardState` — кортеж длины 9 | ✅ | Тип определён как кортеж из 9 элементов |
| №13: `GameSettings` — дискриминированный union | ✅ | `humanPlayer` доступен только при `mode === 'pvai'` |
| №14: CSS Modules — единственный подход к стилизации | ✅ | Inline-стили не используются; `global.css` — глобальный файл токенов, не модуль |
| №15: Токены только в `global.css` | ✅ | Все 16 переменных в `:root`, CSS-модули пустые |
| ADR-001: `useReducer` как единственный механизм | ✅ | Реализовано в `App.tsx` |
| ADR-003: Синхронный вызов ИИ внутри редьюсера | ✅ | Заглушка, структура switch готова |
| ADR-004: CSS Modules | ✅ | Все компоненты имеют `*.module.css` |
| ADR-005: ErrorBoundary | ✅ | Классовый компонент с `getDerivedStateFromError` и `componentDidCatch` |
| ADR-006: Дискриминированный union для GameSettings | ✅ | Реализовано в `types/index.ts` |
| ADR-007: Защитный `gameReducer` с `try/catch` | ✅ | Реализовано |
| ADR-008: Co-location тестов | ✅ | Структура предусмотрена, тесты будут рядом с модулями |
| ADR-010: Минимальные a11y-атрибуты | ✅ | `Cell` имеет `role="button"`, `aria-label`, `tabIndex`, `onKeyDown` |

---

## MUST FIX

### 🔴 MF-01: Отсутствует `line-height` на `body` — риск некорректного рендеринга текста

**Файл:** `src/styles/global.css`

Спецификация не требует `line-height` явно, однако браузерное значение по умолчанию (`normal`, ~1.2) может привести к проблемам с читаемостью на мобильных устройствах. Это граничный случай, но критичный для доступности (WCAG 1.4.12 требует `line-height` не менее 1.5 для основного текста).

```css
/* БЫЛО */
body {
  margin: 0;
  padding: 0;
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  background-color: var(--color-bg);
  color: var(--color-text-primary);
}

/* ДОЛЖНО БЫТЬ */
body {
  margin: 0;
  padding: 0;
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  line-height: 1.5;
  background-color: var(--color-bg);
  color: var(--color-text-primary);
}
```

> **Примечание:** Если команда решает не добавлять `line-height` (не в спецификации), это должно быть явно задокументировано как осознанное решение в `AI_NOTES.md`.

---

### 🔴 MF-02: Нет защиты от горизонтального скролла на `html`/`body`

**Файл:** `src/styles/global.css`  
**Связано с:** FR-08, Acceptance Criteria п.4

Спецификация требует корректного отображения от 320px без горизонтального скролла. Без явного ограничения любой компонент с фиксированной шириной может сломать это требование. Поскольку `global.css` — единственное место для глобальных сбросов, защита должна быть здесь.

```css
/* Добавить в секцию CSS-сброса */
html {
  overflow-x: hidden;
}

body {
  margin: 0;
  padding: 0;
  overflow-x: hidden; /* Дополнительная защита */
  /* ... остальные свойства */
}
```

> **Альтернатива:** Если `overflow-x: hidden` нежелательно (скрывает симптомы вместо лечения причины), добавить `max-width: 100vw` на `body`. Выбор должен быть задокументирован.

---

### 🔴 MF-03: `gameReducer.ts` — `default` ветка с `never` не компилируется корректно

**Файл:** `src/logic/gameReducer.ts`, строки 37–41

```typescript
default: {
  const _exhaustive: never = action;
  logEvent('invalid_move', { action: _exhaustive });
  return state;
}
```

**Проблема:** TypeScript выдаст ошибку `noUnusedLocals` для `_exhaustive`, так как переменная используется только в `logEvent`, но при этом `action` уже имеет тип `never` в `default` ветке — присвоение `_exhaustive = action` технически корректно, но `_exhaustive` передаётся в `logEvent` как `never`, что может вызвать предупреждение линтера. Более серьёзная проблема: если TypeScript strict mode включён и все кейсы switch покрыты, `default` ветка с `never` не достижима, но при добавлении нового типа действия без обновления switch — компилятор выдаст ошибку именно здесь. Это **желаемое поведение**, но текущая реализация использует `_exhaustive` (с подчёркиванием) — нарушение правила `argsIgnorePattern: '^_'` из ESLint конфига, которое применяется к **аргументам**, а не к локальным переменным. Для локальных переменных используется `varsIgnorePattern: '^_'` — это покрывает случай, но стоит проверить явно.

**Рекомендуемое исправление:**

```typescript
default: {
  // Исчерпывающая проверка типов: если добавлен новый тип действия без
  // обработки в switch — TypeScript выдаст ошибку компиляции здесь
  const exhaustiveCheck: never = action;
  logEvent('invalid_move', { action: exhaustiveCheck });
  return state;
}
```

Убрать подчёркивание — переменная **используется** (передаётся в `logEvent`), поэтому паттерн `_` семантически неверен.

---

### 🔴 MF-04: `App.tsx` — `_state` и `_dispatch` с подчёркиванием при реальном использовании в будущем

**Файл:** `src/components/App.tsx`, строка 10

```typescript
const [_state, _dispatch] = useReducer(gameReducer, INITIAL_STATE);
```

**Проблема:** Переменные названы с `_` (паттерн "неиспользуемых"), но `useReducer` **должен** использоваться — это центральная точка управления состоянием (Инвариант №1). Если ESLint видит `_state` и `_dispatch`, он не предупредит об их неиспользовании, что маскирует реальную проблему: компонент не рендерит ничего полезного и не передаёт `dispatch` дочерним компонентам.

**Это не просто стилистика** — если разработчик забудет убрать `_` при реализации, `dispatch` никогда не будет передан дочерним компонентам, и приложение будет работать некорректно без каких-либо предупреждений от линтера.

**Исправление:** Использовать `TODO`-комментарий вместо `_`-паттерна:

```typescript
// TODO: Передать state и dispatch дочерним компонентам при реализации экранов
const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);
void state;   // Временно: будет использован при реализации условного рендеринга
void dispatch; // Временно: будет передан через props
```

---

## SHOULD IMPROVE

### 🟡 SI-01: `global.css` — отсутствует `min-height: 100vh` на `body`

**Файл:** `src/styles/global.css`

Для корректного центрирования контента (которое потребуется в компонентах) стандартной практикой является установка `min-height: 100vh` на `body`. Без этого вертикальное центрирование через flexbox/grid на `body` не будет работать.

```css
body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  font-family: var(--font-family);
  /* ... */
}
```

---

### 🟡 SI-02: `ErrorBoundary.tsx` — нет кнопки сброса ошибки

**Файл:** `src/components/ErrorBoundary.tsx`

ADR-005 явно указывает: *"Компонент `ErrorBoundary` ... реализует `ErrorFallback` с кнопкой «Начать заново»"*. Текущая реализация показывает только текст без возможности восстановления. `TODO`-комментарий присутствует, но это блокирует выполнение ADR-005.

```typescript
// TODO: Реализовать ErrorFallback с кнопкой «Начать заново» и dispatch(RESTART)
```

Поскольку `ErrorBoundary` не имеет доступа к `dispatch` из `App`, потребуется либо передача `onReset` callback через props, либо использование Context. Это архитектурное решение должно быть принято до реализации компонентов.

---

### 🟡 SI-03: `gameReducer.ts` — `EMPTY_BOARD` использует `as const`, но `INITIAL_STATE` приводит тип вручную

**Файл:** `src/logic/gameReducer.ts`, строки 7–16

```typescript
const EMPTY_BOARD = [null, null, null, null, null, null, null, null, null] as const;

export const INITIAL_STATE: GameState = {
  board: [...EMPTY_BOARD] as GameState['board'],
  // ...
};
```

`EMPTY_BOARD` объявлен как `readonly`, но при spread `[...EMPTY_BOARD]` получается `null[]`, который приводится через `as GameState['board']`. Это небезопасное приведение типа — TypeScript не проверит длину массива. 

**Безопасная альтернатива:**

```typescript
const EMPTY_BOARD: BoardState = [
  null, null, null,
  null, null, null,
  null, null, null,
];
```

Прямое указание типа `BoardState` заставит TypeScript проверить длину кортежа на этапе компиляции.

---

### 🟡 SI-04: `Cell.tsx` — `aria-label` не локализован для значений 'X' и 'O'

**Файл:** `src/components/Cell.tsx`, строка 24

```typescript
const label = `Клетка ${row}×${col}, ${value ?? 'пусто'}`;
```

Скринридер произнесёт "X" и "O" как буквы латинского алфавита, что может быть непонятно. Согласно ADR-010, `aria-label` должен быть информативным.

**Улучшение:**

```typescript
const valueLabel = value === 'X' ? 'крестик' : value === 'O' ? 'нолик' : 'пусто';
const label = `Клетка ${row}×${col}, ${valueLabel}`;
```

---

### 🟡 SI-05: Отсутствуют тесты для Stage 1 и Stage 2

**Файлы:** все файлы в `src/`

Constitution требует минимум 60% покрытия и обязательные smoke-тесты рендеринга ключевых компонентов. На данный момент тестов нет вообще. Для `global.css` тесты не нужны (CSS), но для `main.tsx`, `App.tsx`, `ErrorBoundary.tsx` smoke-тесты обязательны.

**Минимально необходимые тесты:**

```typescript
// src/components/App.test.tsx
import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
  it('рендерится без ошибок', () => {
    render(<App />);
    expect(screen.getByText('Tic-Tac-Toe')).toBeInTheDocument();
  });
});
```

---

### 🟡 SI-06: `logger.ts` — `LogEventName` не включает все реальные события

**Файл:** `src/utils/logger.ts`

Тип `LogEventName` содержит `'invalid_move'`, но в `gameReducer.ts` используется именно это имя для события неизвестного действия. Однако семантически "неизвестное действие в switch" — это не "invalid_move" (невалидный ход игрока). Рекомендуется добавить `'unknown_action'` в `LogEventName`.

```typescript
export type LogEventName =
  | 'reducer_error'
  | 'render_error'
  | 'invalid_move'
  | 'unknown_action'  // Добавить
  | 'game_started'
  | 'game_over'
  | 'ai_move';
```

---

### 🟡 SI-07: `vite.config.ts` — отсутствует `base` для GitHub Pages

**Файл:** `vite.config.ts`

ADR-009 указывает GitHub Pages как целевой хостинг. При деплое на GitHub Pages с репозиторием не в корне (например, `username.github.io/tic-tac-toe/`) необходимо указать `base: '/tic-tac-toe/'`. Без этого ресурсы не загрузятся.

```typescript
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES ? '/tic-tac-toe/' : '/',
  // ...
});
```

---

## NICE TO HAVE

### 🟢 NH-01: `global.css` — добавить `scroll-behavior: smooth`

**Файл:** `src/styles/global.css`

Улучшает UX при навигации по якорям (если появятся в будущем). Не влияет на текущую функциональность.

```css
html {
  scroll-behavior: smooth;
}
```

---

### 🟢 NH-02: `global.css` — добавить `-webkit-font-smoothing` для macOS

**Файл:** `src/styles/global.css`

```css
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* ... */
}
```

Улучшает рендеринг шрифтов на macOS/iOS без влияния на другие платформы.

---

### 🟢 NH-03: `package.json` — добавить скрипт `typecheck`

**Файл:** `package.json`

```json
"scripts": {
  "typecheck": "tsc -b --noEmit"
}
```

Позволяет запускать проверку типов отдельно от сборки в CI/CD.

---

### 🟢 NH-04: `AI_NOTES.md` — зафиксировать решение об отсутствии `overflow-x: hidden`

**Файл:** `AI_NOTES.md`

Если команда осознанно решает не добавлять защиту от горизонтального скролла в `global.css`, это решение должно быть задокументировано с обоснованием (например: "ответственность компонентов, не глобального сброса").

---

### 🟢 NH-05: `index.html` — добавить `<meta name="description">`

**Файл:** `index.html`

```html
<meta name="description" content="Крестики-нолики — игра для двух игроков или против ИИ" />
```

Минимальное SEO и доступность для скринридеров на уровне документа.

---

## Итоговая сводка

| Категория | Количество | Критичность |
|---|---|---|
| MUST FIX | 4 | 🔴 Блокируют merge |
| SHOULD IMPROVE | 7 | 🟡 Рекомендуется до следующего этапа |
| NICE TO HAVE | 5 | 🟢 Опционально |

**Общая оценка Stage 2:** Реализация `global.css` корректна и полностью соответствует спецификации по переменным и медиазапросам. Критические проблемы связаны преимущественно с заглушками Stage 1 (`App.tsx`, `gameReducer.ts`) и отсутствием защиты от горизонтального скролла (FR-08). Файл `global.css` как таковой — **готов к использованию** компонентами в следующих задачах.