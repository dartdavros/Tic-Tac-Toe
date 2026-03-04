# AI_NOTES — Stage 1: Точка входа приложения — index.html, main.tsx, global.css, favicon

## Что было сделано
- Обновлён `index.html`: заменена ссылка на favicon с `/vite.svg` на `/favicon.svg`, все остальные обязательные атрибуты уже присутствовали (`lang="ru"`, viewport, title, `id="root"`, script).
- Реализован `src/main.tsx`: явная проверка `#root`, монтирование дерева `<StrictMode><ErrorBoundary><App/></ErrorBoundary></StrictMode>`, импорт `global.css`.
- Перезаписан `src/styles/global.css`: добавлен CSS-сброс (`box-sizing`, `margin`, `padding`), все токены дизайна из архитектурного документа, базовые стили `body` и `button`, адаптивная типографика.
- Создан `public/favicon.svg`: минимальная SVG-иконка с изображением крестика (X) в цвете `--color-player-x`.

## Почему такой подход

### `src/main.tsx` — `handleRootReset` через `window.location.reload()`
На уровне `main.tsx` нет доступа к `dispatch` редьюсера — он живёт внутри `App`.
`ErrorBoundary` в `main.tsx` является последним рубежом защиты: если ошибка произошла
в самом `App` до инициализации редьюсера, единственный безопасный способ сброса —
перезагрузка страницы. Внутри дерева `App` уже есть собственный `ErrorBoundary`
с `resetKey` + `dispatch(RESTART)`, который обрабатывает штатные ошибки рендеринга.

### Импорт `ErrorBoundary` из `./components/ErrorBoundary`
В проекте существуют два файла:
- `src/components/ErrorBoundary.tsx` — реэкспорт для обратной совместимости
- `src/components/ErrorBoundary/index.ts` — основная реализация

Импорт из `./components/ErrorBoundary` корректно разрешается через реэкспорт,
что соответствует существующему паттерну в `App.tsx`.

### `public/favicon.svg` — SVG с крестиком
Выбран SVG-формат как наиболее лёгкий и универсальный. Иконка использует цвет
`#e74c3c` (соответствует токену `--color-player-x`) для тематической согласованности.
Размер 32×32 — стандарт для favicon.

### `src/styles/global.css` — полная перезапись
Существующий файл был пустым (судя по дереву проекта). Новый файл содержит:
1. CSS-сброс согласно FR-10
2. Все токены дизайна из архитектурного документа (раздел «Стилизация»)
3. Базовые стили `body` и `button` для корректного наследования шрифта
4. Адаптивную типографику для мобильных (`max-width: 480px`)

## Созданные / изменённые файлы

| Файл | Действие | Описание |
|---|---|---|
| `index.html` | изменён | Заменена ссылка на favicon: `/vite.svg` → `/favicon.svg` |
| `src/main.tsx` | изменён | Точка входа: проверка `#root`, монтирование с `StrictMode` + `ErrorBoundary` + `App` |
| `src/styles/global.css` | изменён | CSS-сброс + токены дизайна + базовые стили + адаптивность |
| `public/favicon.svg` | создан | SVG-иконка крестика для предотвращения 404 в консоли |

## Риски и ограничения

- **`window.location.reload()` в `handleRootReset`**: при ошибке рендеринга на уровне `main.tsx` это единственный безопасный способ сброса без доступа к `dispatch`. Штатные ошибки обрабатываются `ErrorBoundary` внутри `App`.
- **Дублирование `ErrorBoundary`**: в дереве компонентов теперь два `ErrorBoundary` — один в `main.tsx` (внешний, последний рубеж) и один внутри `App` (штатный, с `resetKey`). Это намеренно и соответствует ADR-005.
- **`src/styles/global.css` vs `src/components/*.module.css`**: токены дизайна определены только в `global.css`. Компонентные модули используют `var(--...)` — дублирования нет.

## Соответствие архитектурным инвариантам

- [x] **Инвариант №1** (единственная точка мутации) — соблюдён: `main.tsx` не мутирует состояние напрямую.
- [x] **Инвариант №9** (`dangerouslySetInnerHTML` запрещён) — соблюдён: не используется.
- [x] **Инвариант №14** (inline-стили только для динамических значений) — соблюдён: inline-стили отсутствуют.
- [x] **Инвариант №15** (токены дизайна только в `global.css`) — соблюдён: все CSS-переменные определены в `:root` файла `global.css`.
- [x] **ADR-004** (CSS Modules — единственный подход к стилизации) — соблюдён: `global.css` содержит только глобальные стили и токены, не стили компонентов.
- [x] **ADR-005** (`ErrorBoundary` в `main.tsx`) — соблюдён: структура `<StrictMode><ErrorBoundary><App/></ErrorBoundary></StrictMode>`.

## Как проверить

1. `npm run build` — должен завершиться без ошибок, создать `dist/index.html`.
2. `npx tsc --noEmit` — проверка типов TypeScript без ошибок.
3. `npx eslint src/main.tsx --max-warnings 0` — линтинг без предупреждений.
4. `grep -q 'lang="ru"' index.html && grep -q 'favicon.svg' index.html && echo OK` — проверка содержимого `index.html`.
5. `grep -q 'Элемент #root не найден' src/main.tsx && grep -q 'StrictMode' src/main.tsx && echo OK` — проверка содержимого `main.tsx`.
6. `grep -q 'box-sizing: border-box' src/styles/global.css && grep -q '--color-player-x' src/styles/global.css && echo OK` — проверка CSS-сброса и токенов.
7. `test -f public/favicon.svg && echo OK` — проверка наличия favicon.
8. `npm run dev` → открыть браузер → убедиться в отсутствии ошибок и 404 в консоли.
9. `npx vitest run src/components/App.test.tsx` — smoke-тест начального рендера.