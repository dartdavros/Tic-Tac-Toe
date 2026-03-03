# Specification: main-entry-point

## Context
Файл `src/main.tsx` является точкой входа приложения. Он монтирует корневой компонент `App` в DOM-элемент `#root`, подключает глобальные стили и настраивает `React.StrictMode`. Без корректной точки входа приложение не запустится.

## User Scenarios
1. **Пользователь открывает приложение в браузере:** страница загружается, отображается экран меню без ошибок в консоли.

## Functional Requirements
- FR-01: `src/main.tsx` импортирует `React`, `ReactDOM`, `App` и `'./styles/global.css'`.
- FR-02: Приложение монтируется в элемент `document.getElementById('root')` через `ReactDOM.createRoot`.
- FR-03: `App` обёрнут в `<React.StrictMode>`.
- FR-04: `index.html` содержит `<div id="root"></div>` и корректный `<script type="module" src="/src/main.tsx">`.
- FR-05: `<title>` в `index.html` установлен в «Крестики-нолики».
- FR-06: В `index.html` добавлен `<meta name="viewport" content="width=device-width, initial-scale=1.0">` для корректного отображения на мобильных.

## Non-Functional Requirements
- NFR-01: Приложение запускается без ошибок в консоли браузера.
- NFR-02: `npm run build` создаёт корректный `dist/index.html`.

## Boundaries (что НЕ входит)
- Не реализуется Service Worker или PWA-манифест.
- Не реализуется серверный рендеринг.

## Acceptance Criteria
- [ ] `npm run dev` запускает приложение, в браузере отображается экран меню.
- [ ] В консоли браузера нет ошибок при запуске.
- [ ] `<title>` страницы — «Крестики-нолики».
- [ ] `<meta name="viewport">` присутствует в `index.html`.
- [ ] `npm run build` завершается без ошибок, `dist/index.html` создан.

## Open Questions
- Нужно ли добавить `<meta name="description">` для SEO?
- Стоит ли добавить favicon?