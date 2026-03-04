# Specification: main-entry-point

## Context
Файл `src/main.tsx` является точкой входа приложения. Он монтирует корневой компонент `App` в DOM-элемент `#root`, подключает глобальные стили и настраивает `React.StrictMode`. Без корректной точки входа приложение не запустится.

Согласно ADR-005, компонент `ErrorBoundary` размещается в `main.tsx` снаружи `App`, чтобы перехватывать ошибки рендеринга всего дерева компонентов.

## User Scenarios
1. **Пользователь открывает приложение в браузере:** страница загружается, отображается экран меню без ошибок в консоли.
2. **Элемент `#root` отсутствует в DOM:** приложение выбрасывает информативную ошибку вместо молчаливого сбоя, что упрощает диагностику проблем окружения.

## Functional Requirements
- FR-01: `src/main.tsx` импортирует `React`, `ReactDOM`, `App`, `ErrorBoundary` и `'./styles/global.css'`.
- FR-02: Приложение монтируется в элемент `document.getElementById('root')` через `ReactDOM.createRoot`.
- FR-03: Перед вызовом `createRoot` выполняется явная проверка наличия элемента: `if (!rootElement) throw new Error('Элемент #root не найден')`. Проверка обеспечивает информативное сообщение об ошибке вместо неявного сбоя.
- FR-04: `App` обёрнут в `<React.StrictMode>` и `<ErrorBoundary>` в следующем порядке вложенности: `<StrictMode><ErrorBoundary><App/></ErrorBoundary></StrictMode>`.
- FR-05: `index.html` содержит `<div id="root"></div>` и корректный `<script type="module" src="/src/main.tsx">`.
- FR-06: `<title>` в `index.html` установлен в «Крестики-нолики».
- FR-07: В `index.html` добавлен `<meta name="viewport" content="width=device-width, initial-scale=1.0">` для корректного отображения на мобильных.
- FR-08: Атрибут `<html lang="ru">` установлен в `index.html`, так как приложение полностью на русском языке.
- FR-09: В `index.html` подключён favicon для предотвращения ошибки 404 в консоли браузера. Допустимый вариант — SVG-иконка или emoji-favicon, размещённые в директории `public/`.
- FR-10: Файл `src/styles/global.css` содержит минимальный собственный CSS-сброс:
  ```css
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  ```

## Non-Functional Requirements
- NFR-01: Приложение запускается без ошибок в консоли браузера.
- NFR-02: `npm run build` создаёт корректный `dist/index.html`.
- NFR-03: Отсутствие запроса с ошибкой 404 на favicon в консоли браузера.

## Boundaries (что НЕ входит)
- Не реализуется Service Worker или PWA-манифест.
- Не реализуется серверный рендеринг.
- Не подключается сторонняя библиотека CSS-сброса (normalize.css, reset.css и т.п.) — используется только собственный минимальный сброс.

## Acceptance Criteria
- [ ] `npm run dev` запускает приложение, в браузере отображается экран меню.
- [ ] В консоли браузера нет ошибок при запуске.
- [ ] В консоли браузера нет запросов с ошибкой 404 (включая favicon).
- [ ] `<title>` страницы — «Крестики-нолики».
- [ ] `<meta name="viewport">` присутствует в `index.html`.
- [ ] `<html lang="ru">` присутствует в `index.html`.
- [ ] Favicon подключён в `index.html` и файл иконки присутствует в `public/`.
- [ ] При удалении `<div id="root">` из `index.html` и перезапуске приложения в консоли отображается сообщение `'Элемент #root не найден'`, а не неинформативная ошибка React.
- [ ] Дерево компонентов в `main.tsx` соответствует структуре `<StrictMode><ErrorBoundary><App/></ErrorBoundary></StrictMode>`.
- [ ] `src/styles/global.css` содержит правила `box-sizing: border-box`, `margin: 0`, `padding: 0` для универсального селектора.
- [ ] `npm run build` завершается без ошибок, `dist/index.html` создан.

## Open Questions
*Все открытые вопросы закрыты по результатам уточнений.*