

---

## Review: global-styles

# Кросс-валидация и Code Review

## SPEC ↔ CODE

### Требования спецификации `global-styles`

| ID | Требование | Статус | Комментарий |
|----|-----------|--------|-------------|
| FR-01 | Файл `src/styles/global.css` создан и подключён в `src/main.tsx` | ⚠️ Частично | `import './styles/global.css'` в `main.tsx` присутствует, но сам файл `src/styles/global.css` в предоставленных исходниках **отсутствует** — он не был создан |
| FR-02 | CSS-переменные цветов в `:root` (9 переменных) | ❌ Отсутствует | Файл не создан |
| FR-03 | Переменные размеров клетки + медиазапрос для мобильных | ❌ Отсутствует | Файл не создан |
| FR-04 | Переменные типографики в `:root` | ❌ Отсутствует | Файл не создан |
| FR-05 | CSS-сброс: `box-sizing`, `margin: 0`, `padding: 0` | ❌ Отсутствует | Файл не создан |
| FR-06 | Стили `body` через CSS-переменные | ❌ Отсутствует | Файл не создан |
| FR-07 | `@media (max-width: 480px)` с переопределением переменных | ❌ Отсутствует | Файл не создан |
| FR-08 | Корректное отображение от 320px без горизонтального скролла | ❌ Не проверяемо | Файл не создан |
| FR-09 | Переменная `--border-radius: 8px` | ❌ Отсутствует | Файл не создан |
| FR-10 | Переменная `--spacing-base: 16px` | ❌ Отсутствует | Файл не создан |
| NFR-01 | Файл содержит только глобальные сбросы и переменные | ❌ Не проверяемо | Файл не создан |
| NFR-02 | Все цвета/размеры/шрифты только через CSS-переменные в `:root` | ❌ Не проверяемо | Файл не создан |

**Итог по спецификации:** 10 из 12 требований не реализованы. Единственное частично выполненное требование — импорт в `main.tsx` — уже присутствовал в стартовом коде до начала задачи.

### Код, не описанный в спецификации

| Файл | Что присутствует | Оценка |
|------|-----------------|--------|
| `src/components/App.tsx` | Заглушка компонента с `TODO` | Вне скоупа задачи, но корректно |
| `src/logic/gameReducer.ts` | `EMPTY_BOARD as const` + spread | Вне скоупа, технически корректно |
| `src/utils/logger.ts` | `TODO` для production-аналитики | Вне скоупа, приемлемо |

---

## INVARIANTS

### Архитектурные инварианты (из ADR и Конституции)

| Инвариант | Источник | Статус | Пояснение |
|-----------|---------|--------|-----------|
| №1: Единственный `useReducer` в `App` | ADR-001 | ✅ | `App.tsx` использует один `useReducer` |
| №2: Данные вниз через props, события вверх через callbacks | ADR-001 | ✅ | `Board`, `Cell` следуют паттерну |
| №4: `getBestMove` вызывается только из `gameReducer` | ADR-003 | ✅ | Компоненты не импортируют `aiPlayer.ts` |
| №5: Компоненты не диспатчат переход в `result` напрямую | ADR-001 | ✅ | `GameAction` не содержит `GAME_OVER` |
| №6: `gameReducer` не выбрасывает исключения | ADR-007 | ✅ | `try/catch` присутствует, возвращает `state` |
| №7: `getBestMove` < 50 мс | ADR-002 | ⚠️ | Функция не реализована (`throw new Error`) |
| №12: `BoardState` — кортеж длиной 9 | ADR-001 | ✅ | Тип определён корректно в `types/index.ts` |
| №13: `humanPlayer` доступен только при `mode: 'pvai'` | ADR-006 | ✅ | Дискриминированный union реализован корректно |
| №15: Хардкод значений в `*.module.css` запрещён | Конституция | ⚠️ | CSS-модули ещё не созданы; риск нарушения при реализации |
| ADR-003: Синхронный вызов ИИ внутри `gameReducer` | ADR-003 | ⚠️ | `MAKE_MOVE` возвращает `state` без вызова ИИ |
| ADR-004: CSS Modules как единственный подход | ADR-004 | ⚠️ | Модули не созданы; `global.css` отсутствует |
| ADR-005: `ErrorBoundary` оборачивает дерево | ADR-005 | ✅ | `App.tsx` оборачивает в `<ErrorBoundary>` |
| ADR-008: Тесты рядом с тестируемыми файлами | ADR-008 | ❌ | Тестовые файлы отсутствуют полностью |
| ADR-010: a11y-атрибуты на интерактивных элементах | ADR-010 | ⚠️ | `Cell` имеет `role="button"` и `aria-label`, но `disabled` и `isWinCell` не используются |

---

## MUST FIX

### 🔴 BLOCKER-01: Файл `src/styles/global.css` не создан

**Файл:** `src/styles/global.css` (отсутствует)

Основная задача спецификации не выполнена. `main.tsx` импортирует несуществующий файл — при сборке (`npm run build`) Vite выбросит ошибку `Could not resolve './styles/global.css'` или аналогичную, что нарушает критерий приёмки:

> `npm run build` проходит без ошибок.

**Необходимо создать файл** со следующим содержимым:

```css
/* src/styles/global.css */

/* ===== Сброс стилей ===== */
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}

/* ===== Токены дизайна ===== */
:root {
  /* Цвета */
  --color-player-x: #e74c3c;
  --color-player-o: #3498db;
  --color-bg: #f9f9f9;
  --color-surface: #ffffff;
  --color-border: #cccccc;
  --color-text-primary: #222222;
  --color-text-secondary: #666666;
  --color-accent: #27ae60;
  --color-win-highlight: #f1c40f;

  /* Размеры клетки */
  --cell-size-desktop: 120px;
  --cell-size-mobile: 80px;

  /* Типографика */
  --font-family: 'Segoe UI', system-ui, sans-serif;
  --font-size-base: 16px;
  --font-size-large: 24px;

  /* Прочие токены */
  --border-radius: 8px;
  --spacing-base: 16px;
}

/* ===== Базовые стили body ===== */
body {
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  background-color: var(--color-bg);
  color: var(--color-text-primary);
}

/* ===== Адаптивность ===== */
@media (max-width: 480px) {
  :root {
    --font-size-base: 14px;
    --font-size-large: 18px;
    --cell-size-desktop: 80px;
  }
}
```

**Замечание по структуре:** `margin: 0` и `padding: 0` вынесены в отдельный блок `body` до `:root`, что соответствует FR-05. Однако два блока `body` (сброс и стили) можно объединить — см. SHOULD IMPROVE.

---

### 🔴 BLOCKER-02: Сборка завершается с ошибкой из-за отсутствующего CSS-файла

**Файл:** `src/main.tsx`, строка 4

```typescript
import './styles/global.css'; // ← файл не существует
```

Vite при `npm run build` не найдёт файл и завершит сборку с ошибкой. Это блокирует критерий приёмки.

**Решение:** создать файл согласно BLOCKER-01.

---

### 🔴 BLOCKER-03: Отсутствуют тесты (нарушение Конституции)

**Файлы:** отсутствуют `*.test.ts` / `*.test.tsx`

Конституция требует:
- Минимальное покрытие: **60%**
- Обязательные unit-тесты для `checkWinner`, `getBestMove`
- Обязательные smoke-тесты рендеринга ключевых компонентов

Ни одного тестового файла не предоставлено. Это нарушает ADR-008 и требования Конституции.

> **Примечание:** Для данной задачи (`global-styles`) тесты CSS-переменных нетипичны, однако `src/test-setup.ts` уже настроен, что подразумевает наличие тестов в проекте.

---

## SHOULD IMPROVE

### 🟡 IMPROVE-01: Два отдельных блока `body` в CSS

В предложенном файле `global.css` сброс (`margin: 0; padding: 0`) и стили (`font-family`, `background-color` и т.д.) разнесены в два блока `body`. Это создаёт дублирование и снижает читаемость.

**Рекомендация:** объединить в один блок:

```css
body {
  margin: 0;
  padding: 0;
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  background-color: var(--color-bg);
  color: var(--color-text-primary);
}
```

---

### 🟡 IMPROVE-02: Переменная `--cell-size-mobile` — справочное значение без применения

**Файл:** `src/styles/global.css` (после создания)

Согласно спецификации FR-03, `--cell-size-mobile: 80px` является «справочным значением» и не используется напрямую в компонентах. В медиазапросе переопределяется `--cell-size-desktop`. Это неочевидно для разработчиков.

**Рекомендация:** добавить комментарий в CSS:

```css
/* Справочное значение; применяется косвенно через переопределение
   --cell-size-desktop в медиазапросе @media (max-width: 480px) */
--cell-size-mobile: 80px;
```

---

### 🟡 IMPROVE-03: `Cell.tsx` — `disabled` и `isWinCell` не используются

**Файл:** `src/components/Cell.tsx`

```typescript
// Пропсы деструктурированы, но не применяются:
void isWinCell;
void disabled;
```

Нарушает ADR-010: клетка должна быть недоступна для взаимодействия при `disabled === true`. Отсутствие `aria-disabled` и блокировки кликов — потенциальная проблема доступности и корректности игровой логики.

**Рекомендация:**
```typescript
<div
  role="button"
  aria-label={label}
  aria-disabled={disabled}
  tabIndex={disabled ? -1 : 0}
  onClick={disabled ? undefined : onClick}
  className={`${styles.cell} ${isWinCell ? styles.winCell : ''}`}
  ...
>
```

---

### 🟡 IMPROVE-04: `gameReducer.ts` — все `case` возвращают `state` без изменений

**Файл:** `src/logic/gameReducer.ts`, строки 38–44

```typescript
case 'START_GAME':
case 'MAKE_MOVE':
case 'RESTART':
case 'QUIT_TO_MENU':
  return state; // ← заглушка, логика не реализована
```

Это заглушки с `TODO`, что допустимо по правилам Конституции (`// TODO:` с обоснованием), однако обоснование отсутствует в комментарии к `case`. Формально нарушает правило:

> Do not leave stubs without explicit `// TODO:` with justification

**Рекомендация:** добавить явные `TODO` с обоснованием к каждому `case`.

---

### 🟡 IMPROVE-05: `EMPTY_BOARD as const` + spread создаёт потенциальную проблему типизации

**Файл:** `src/logic/gameReducer.ts`, строки 8–18

```typescript
const EMPTY_BOARD = [null, null, null, null, null, null, null, null, null] as const;

export const INITIAL_STATE: GameState = {
  board: [...EMPTY_BOARD] as GameState['board'],
  // ...
};
```

`as const` делает массив `readonly`, а spread создаёт обычный `null[]`. Приведение через `as GameState['board']` скрывает потенциальное несоответствие типов. TypeScript не проверит длину массива после spread.

**Рекомендация:** явно типизировать `EMPTY_BOARD`:

```typescript
const EMPTY_BOARD: BoardState = [
  null, null, null,
  null, null, null,
  null, null, null,
];
```

---

## NICE TO HAVE

### 🟢 NTH-01: Добавить `overflow-x: hidden` на `body` для FR-08

Спецификация требует отсутствия горизонтального скролла при ширине от 320px. Явное указание `overflow-x: hidden` на `body` или `html` является страховочной мерой:

```css
html, body {
  overflow-x: hidden;
}
```

---

### 🟢 NTH-02: Добавить `min-height: 100dvh` для корректного отображения на мобильных

Современные мобильные браузеры имеют динамическую высоту viewport. `100dvh` вместо `100vh` предотвращает проблемы с адресной строкой:

```css
body {
  min-height: 100dvh;
}
```

---

### 🟢 NTH-03: Добавить smoke-тест для проверки наличия CSS-переменных

Хотя тестирование CSS нетипично для Vitest, можно добавить тест, проверяющий, что `global.css` импортируется без ошибок:

```typescript
// src/styles/global.test.ts
import { describe, it } from 'vitest';

describe('global.css', () => {
  it('импортируется без ошибок', async () => {
    await import('./global.css');
  });
});
```

---

### 🟢 NTH-04: Документировать порядок объявления переменных в `:root`

Для удобства поддержки рекомендуется группировать переменные с комментариями-разделителями (уже частично предложено в BLOCKER-01, но стоит зафиксировать как соглашение команды).

---

## Сводная таблица

| Категория | Кол-во | Критичность |
|-----------|--------|-------------|
| MUST FIX (блокеры) | 3 | 🔴 Блокируют merge |
| SHOULD IMPROVE | 5 | 🟡 Рекомендуется исправить |
| NICE TO HAVE | 4 | 🟢 По желанию |

**Главный вывод:** задача `global-styles` фактически не выполнена — центральный артефакт (`src/styles/global.css`) отсутствует. Импорт в `main.tsx` был в стартовом коде. Все 10 функциональных требований остаются невыполненными. Сборка проекта завершится с ошибкой.


---

## Review: global-styles

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


---

## Review: project-setup

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
