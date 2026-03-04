# Clarifications: main-entry-point

## Question 1
Что должно происходить, если элемент `#root` отсутствует в DOM при монтировании приложения?

*Context:* `ReactDOM.createRoot` выбросит исключение при `null`-аргументе — нужно определить стратегию обработки этой ситуации.

**Options:**
- A) Добавить явную проверку с выбросом информативной ошибки: `if (!rootElement) throw new Error('Элемент #root не найден')`
- B) Использовать non-null assertion `document.getElementById('root')!` без дополнительной обработки
- C) Обернуть монтирование в try/catch и вывести сообщение об ошибке в `document.body`

**Answer:**
Добавить явную проверку с выбросом информативной ошибки: `if (!rootElement) throw new Error('Элемент #root не найден')`

## Question 2
Должен ли `ErrorBoundary` (ADR-005) оборачивать `App` уже в `main.tsx`, или его подключение — ответственность самого компонента `App`?

*Context:* ADR-005 говорит, что `ErrorBoundary` оборачивает всё дерево ниже `App`, но не уточняет, где именно он размещается — это влияет на структуру `main.tsx`.

**Options:**
- A) `ErrorBoundary` размещается в `main.tsx` снаружи `App`: `<StrictMode><ErrorBoundary><App/></ErrorBoundary></StrictMode>`
- B) `ErrorBoundary` размещается внутри `App` — `main.tsx` содержит только `<StrictMode><App/></StrictMode>`
- C) `ErrorBoundary` размещается в `main.tsx` между `StrictMode` и `App`, но без вложения в `StrictMode`

**Answer:**
`ErrorBoundary` размещается в `main.tsx` снаружи `App`: `<StrictMode><ErrorBoundary><App/></ErrorBoundary></StrictMode>`

## Question 3
Нужно ли подключать глобальный CSS-сброс (reset/normalize) в `global.css`, и если да — какой именно?

*Context:* FR-01 требует импорта `./styles/global.css`, но ADR-004 лишь упоминает «сброс» без конкретики — это влияет на содержимое файла стилей.

**Options:**
- A) Использовать минимальный собственный сброс (`box-sizing: border-box`, `margin: 0`, `padding: 0`)
- B) Импортировать `modern-normalize` или `normalize.css` как npm-зависимость
- C) Глобальный сброс не нужен — только CSS-переменные и базовые стили `body`

**Answer:**
Использовать минимальный собственный сброс (`box-sizing: border-box`, `margin: 0`, `padding: 0`)

## Question 4
Какой язык (`lang`) должен быть указан в атрибуте `<html lang="...">` в `index.html`?

*Context:* ADR-010 требует минимальной доступности (a11y), а корректный `lang` критичен для скринридеров — при этом спецификация явно не указывает язык документа.

**Options:**
- A) Установить `lang="ru"` — приложение полностью на русском языке
- B) Установить `lang="en"` — технический дефолт, язык интерфейса определяется отдельно
- C) Не указывать явно, оставить дефолт Vite-шаблона

**Answer:**
Установить `lang="ru"` — приложение полностью на русском языке

## Question 5
Нужно ли добавить favicon в `index.html` и `public/`?

*Context:* Спецификация выносит favicon в Open Questions, но отсутствие favicon генерирует 404-запрос в консоли браузера, что нарушает NFR-01.

**Options:**
- A) Добавить минимальный favicon (emoji или простая SVG-иконка) чтобы избежать 404 в консоли
- B) Добавить `<link rel="icon" href="data:,">` для подавления 404 без реального файла
- C) Не добавлять — favicon не входит в границы спецификации

**Answer:**
Добавить минимальный favicon (emoji или простая SVG-иконка) чтобы избежать 404 в консоли
