# План реализации: main-entry-point

## Анализ текущего состояния

Проект уже имеет структуру директорий и большинство файлов реализованы.
Задача ограничена спецификацией `main-entry-point`:
- `src/main.tsx` — точка входа приложения
- `index.html` — корневой HTML-файл
- `src/styles/global.css` — глобальные стили с CSS-сбросом и токенами дизайна
- `public/favicon.svg` — иконка для предотвращения 404

Все компоненты (`App`, `ErrorBoundary`), типы и логика уже существуют в дереве проекта.
Реализация данной задачи — это финальная «склейка» точки входа.

---

## Stage 1: Точка входа приложения — index.html, main.tsx, global.css, favicon

**Goal:**
Реализовать полностью рабочую точку входа приложения согласно спецификации
`main-entry-point`: корректный `index.html` с мета-тегами, `src/main.tsx` с
проверкой `#root` и деревом `<StrictMode><ErrorBoundary><App/></ErrorBoundary></StrictMode>`,
`src/styles/global.css` с CSS-сбросом и токенами дизайна, а также `public/favicon.svg`
для предотвращения 404 в консоли браузера.

**Depends on:** none (все зависимые компоненты уже существуют в проекте)

**Inputs:**
- Спецификация `main-entry-point` (FR-01 — FR-10, NFR-01 — NFR-03)
- Архитектурный документ (раздел «Стилизация», токены дизайна)
- ADR-004 (CSS Modules + global.css), ADR-005 (ErrorBoundary в main.tsx)
- Существующие файлы: `src/components/App.tsx`, `src/components/ErrorBoundary.tsx`
- Существующий `src/styles/global.css` (будет перезаписан/дополнен)
- Существующий `index.html` (будет перезаписан)

**Outputs:**
- `index.html` — корневой HTML с lang="ru", viewport, title, favicon, script
- `src/main.tsx` — точка входа с проверкой #root и монтированием
- `src/styles/global.css` — CSS-сброс + CSS-переменные (токены дизайна) + базовые стили body
- `public/favicon.svg` — минимальная SVG-иконка (emoji ✕ или крестик)

**DoD:**
- [ ] `index.html` содержит `<html lang="ru">`
- [ ] `index.html` содержит `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- [ ] `index.html` содержит `<title>Крестики-нолики</title>`
- [ ] `index.html` содержит `<link rel="icon" href="/favicon.svg">`
- [ ] `index.html` содержит `<div id="root"></div>`
- [ ] `index.html` содержит `<script type="module" src="/src/main.tsx">`
- [ ] `src/main.tsx` импортирует `React`, `ReactDOM`, `App`, `ErrorBoundary`, `'./styles/global.css'`
- [ ] `src/main.tsx` выполняет явную проверку: `if (!rootElement) throw new Error('Элемент #root не найден')`
- [ ] `src/main.tsx` монтирует дерево `<StrictMode><ErrorBoundary><App/></ErrorBoundary></StrictMode>`
- [ ] `src/styles/global.css` содержит правила `box-sizing: border-box`, `margin: 0`, `padding: 0` для `*, *::before, *::after`
- [ ] `src/styles/global.css` содержит все CSS-переменные из архитектурного документа (токены дизайна)
- [ ] `public/favicon.svg` существует и является валидным SVG-файлом
- [ ] `npm run build` завершается без ошибок
- [ ] `npm run dev` запускает приложение без ошибок в консоли браузера
- [ ] В консоли браузера нет 404-запросов (включая favicon)

**Risks:**
- Конфликт между существующим `src/styles/global.css` и новым содержимым —
  необходимо убедиться, что токены дизайна не дублируются с `src/components/*.module.css`
- Существующий `src/components/ErrorBoundary.tsx` и
  `src/components/ErrorBoundary/index.ts` — два варианта импорта;
  необходимо использовать корректный путь импорта в `main.tsx`
- Vite может требовать специфического формата пути для `src/main.tsx` в `index.html`

---

## Verify

- name: Сборка проекта
  command: npm run build

- name: Проверка типов TypeScript
  command: npx tsc --noEmit

- name: Линтинг ESLint
  command: npx eslint src/main.tsx src/styles/global.css --max-warnings 0

- name: Проверка наличия обязательных файлов
  command: >
    test -f index.html &&
    test -f src/main.tsx &&
    test -f src/styles/global.css &&
    test -f public/favicon.svg &&
    echo "Все обязательные файлы присутствуют"

- name: Проверка содержимого index.html
  command: >
    grep -q 'lang="ru"' index.html &&
    grep -q 'name="viewport"' index.html &&
    grep -q 'Крестики-нолики' index.html &&
    grep -q 'favicon.svg' index.html &&
    grep -q 'id="root"' index.html &&
    echo "index.html содержит все обязательные элементы"

- name: Проверка содержимого main.tsx
  command: >
    grep -q 'Элемент #root не найден' src/main.tsx &&
    grep -q 'StrictMode' src/main.tsx &&
    grep -q 'ErrorBoundary' src/main.tsx &&
    grep -q 'global.css' src/main.tsx &&
    echo "main.tsx содержит все обязательные элементы"

- name: Проверка CSS-сброса в global.css
  command: >
    grep -q 'box-sizing: border-box' src/styles/global.css &&
    grep -q 'margin: 0' src/styles/global.css &&
    grep -q 'padding: 0' src/styles/global.css &&
    grep -q '--color-player-x' src/styles/global.css &&
    grep -q '--color-player-o' src/styles/global.css &&
    echo "global.css содержит CSS-сброс и токены дизайна"

- name: Запуск тестов (smoke)
  command: npx vitest run src/components/App.test.tsx