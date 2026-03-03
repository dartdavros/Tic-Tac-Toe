# Анализ задачи

Задача `global-styles` — это единая, логически атомарная единица: создать один CSS-файл с переменными и подключить его в точке входа. Никаких зависимостей между частями нет, разбивать на несколько этапов нет смысла.

Однако проект ещё не инициализирован (нет структуры директорий, нет `main.tsx`, нет конфигов). Значит, нужен **Stage 1: Project Structure Setup**, а затем **Stage 2: Global Styles** — итого 2 этапа.

---

## plan.md

# План реализации: global-styles

## Stage 1: Инициализация структуры проекта
**Цель:** Создать полную структуру директорий и базовые конфигурационные файлы
проекта согласно архитектурному документу. После этого этапа проект должен
собираться командой `npm run build` (пусть и с минимальным содержимым).

**Depends on:** нет

**Inputs:**
- Архитектурный документ (структура папок)
- Constitution (стек: Vite 5, React 18, TypeScript 5, Vitest, ESLint flat config, Prettier)

**Outputs:**
- `package.json`
- `vite.config.ts`
- `tsconfig.json`
- `tsconfig.node.json`
- `eslint.config.js`
- `.prettierrc`
- `index.html`
- `src/main.tsx` — точка входа (минимальный, рендерит `<App />`)
- `src/vite-env.d.ts`
- `src/types/index.ts` — все TypeScript-типы (`Player`, `BoardState`, `GameStatus`, `AppScreen`, `GameMode`, `GameSettings`, `GameState`, `GameAction`)
- `src/components/App.tsx` — заглушка (рендерит `<div>Tic-Tac-Toe</div>`)
- `src/components/App.module.css` — пустой модуль
- `src/components/ErrorBoundary.tsx` — заглушка
- `src/components/Board.tsx` — заглушка
- `src/components/Board.module.css` — пустой модуль
- `src/components/Cell.tsx` — заглушка
- `src/components/Cell.module.css` — пустой модуль
- `src/components/StatusBar.tsx` — заглушка
- `src/components/StatusBar.module.css` — пустой модуль
- `src/components/GameSettings.tsx` — заглушка
- `src/components/GameSettings.module.css` — пустой модуль
- `src/components/ResultScreen.tsx` — заглушка
- `src/components/ResultScreen.module.css` — пустой модуль
- `src/logic/gameLogic.ts` — заглушка (экспортирует сигнатуры без реализации с `// TODO:`)
- `src/logic/gameReducer.ts` — заглушка
- `src/logic/aiPlayer.ts` — заглушка
- `src/utils/logger.ts` — заглушка (`logEvent`)
- `src/styles/App.module.css` — пустой модуль
- `src/styles/Board.module.css` — пустой модуль
- `src/styles/Cell.module.css` — пустой модуль
- `src/styles/StatusBar.module.css` — пустой модуль
- `src/styles/GameSettings.module.css` — пустой модуль
- `src/styles/ResultScreen.module.css` — пустой модуль
- `AI_NOTES.md`

**DoD:**
- [ ] Структура директорий соответствует архитектурному документу
- [ ] `npm install` завершается без ошибок
- [ ] `npm run build` завершается без ошибок (TypeScript компилируется)
- [ ] `npm run lint` завершается без ошибок
- [ ] `npm run test` запускается (тестов пока нет, но Vitest стартует)
- [ ] Все TypeScript-типы из `src/types/index.ts` соответствуют спецификации
  (`Player`, `CellValue`, `BoardState`, `AppScreen`, `GameMode`,
  `GameStatus`, `GameSettings`, `GameState`, `GameAction`)
- [ ] Заглушки компонентов и логики не содержат `any` без обоснования
- [ ] `AI_NOTES.md` создан по шаблону

**Risks:**
- Несовместимость версий пакетов (React 18 + Vite 5 + Vitest) — решается
  фиксацией точных версий в `package.json`
- Конфликт конфигурации ESLint flat config с TypeScript-плагином —
  требует аккуратной настройки `eslint.config.js`

---

## Stage 2: Глобальные стили и подключение в точку входа
**Цель:** Создать `src/styles/global.css` со всеми 16 CSS-переменными,
CSS-сбросом, базовыми стилями `body` и медиазапросом для мобильных устройств.
Подключить файл в `src/main.tsx`. После этого этапа все архитектурные
инварианты №14 и №15 становятся выполнимыми для последующих компонентов.

**Depends on:** Stage 1

**Inputs:**
- `src/main.tsx` (из Stage 1)
- Спецификация `global-styles` (таблица переменных, медиазапросы, FR-01–FR-10)
- Уточнения (Clarifications Q1–Q5)

**Outputs:**
- `src/styles/global.css` — полный файл глобальных стилей
- `src/main.tsx` — обновлён: добавлен `import './styles/global.css'`
- `AI_NOTES.md` — обновлён: зафиксированы решения по global-styles

**DoD:**
- [ ] Файл `src/styles/global.css` создан
- [ ] В `:root` определены все 16 переменных согласно таблице спецификации:
  `--color-player-x`, `--color-player-o`, `--color-bg`, `--color-surface`,
  `--color-border`, `--color-text-primary`, `--color-text-secondary`,
  `--color-accent`, `--color-win-highlight`, `--cell-size-desktop`,
  `--cell-size-mobile`, `--font-family`, `--font-size-base`,
  `--font-size-large`, `--border-radius`, `--spacing-base`
- [ ] CSS-сброс применён: `box-sizing: border-box` для `*, *::before, *::after`;
  `margin: 0` и `padding: 0` для `body`
- [ ] `body` использует переменные `--font-family`, `--font-size-base`,
  `--color-bg`, `--color-text-primary`
- [ ] Медиазапрос `@media (max-width: 480px)` переопределяет:
  `--font-size-base: 14px`, `--font-size-large: 18px`,
  `--cell-size-desktop: 80px` (значение мобильного размера клетки)
- [ ] `import './styles/global.css'` присутствует в `src/main.tsx`
- [ ] `npm run build` проходит без ошибок после изменений
- [ ] Файл не содержит компонентно-специфичных стилей (только сброс и переменные)
- [ ] Нет хардкода цветов/размеров/шрифтов вне блока `:root`

**Risks:**
- Опечатка в имени переменной сломает все компоненты, которые её используют —
  минимизируется тщательной сверкой с таблицей спецификации
- Неправильный путь импорта в `main.tsx` приведёт к ошибке сборки —
  проверяется через `npm run build`
