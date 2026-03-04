# Tasks: main-entry-point

## Stage 1: Точка входа приложения — index.html, main.tsx, global.css, favicon

- [ ] Создать/перезаписать `index.html` с атрибутом `lang="ru"`, мета-тегом viewport, заголовком «Крестики-нолики», ссылкой на favicon, `<div id="root">` и `<script type="module" src="/src/main.tsx">` → `index.html`
- [ ] Реализовать `src/main.tsx`: импорты React, ReactDOM, App, ErrorBoundary, global.css; явная проверка `#root` с выбросом информативной ошибки; монтирование дерева `<StrictMode><ErrorBoundary><App/></ErrorBoundary></StrictMode>` → `src/main.tsx`
- [ ] Реализовать `src/styles/global.css`: минимальный CSS-сброс (`box-sizing`, `margin`, `padding`), все CSS-переменные токенов дизайна из архитектурного документа, базовые стили `body` → `src/styles/global.css`
- [ ] Создать `public/favicon.svg`: минимальная валидная SVG-иконка (символ крестика или игровая тематика) для предотвращения 404 в консоли браузера → `public/favicon.svg`