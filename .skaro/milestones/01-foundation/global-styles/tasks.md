# Tasks: global-styles

## Stage 1: Инициализация структуры проекта

- [ ] Создать `package.json` с зависимостями (react, react-dom, typescript, vite, vitest, @testing-library/react, eslint, prettier и др.) → `package.json`
- [ ] Создать конфигурацию Vite → `vite.config.ts`
- [ ] Создать конфигурацию TypeScript для приложения → `tsconfig.json`
- [ ] Создать конфигурацию TypeScript для Node-окружения (Vite config) → `tsconfig.node.json`
- [ ] Создать конфигурацию ESLint (flat config) → `eslint.config.js`
- [ ] Создать конфигурацию Prettier → `.prettierrc`
- [ ] Создать HTML-точку входа → `index.html`
- [ ] Создать точку входа React-приложения (минимальный рендер `<App />`) → `src/main.tsx`
- [ ] Создать декларацию типов Vite → `src/vite-env.d.ts`
- [ ] Создать все TypeScript-типы проекта (`Player`, `CellValue`, `BoardState`, `AppScreen`, `GameMode`, `GameStatus`, `GameSettings`, `GameState`, `GameAction`) → `src/types/index.ts`
- [ ] Создать заглушку корневого компонента → `src/components/App.tsx`
- [ ] Создать пустой CSS-модуль для App → `src/components/App.module.css`
- [ ] Создать заглушку ErrorBoundary (классовый компонент) → `src/components/ErrorBoundary.tsx`
- [ ] Создать заглушку компонента Board → `src/components/Board.tsx`
- [ ] Создать пустой CSS-модуль для Board → `src/components/Board.module.css`
- [ ] Создать заглушку компонента Cell → `src/components/Cell.tsx`
- [ ] Создать пустой CSS-модуль для Cell → `src/components/Cell.module.css`
- [ ] Создать заглушку компонента StatusBar → `src/components/StatusBar.tsx`
- [ ] Создать пустой CSS-модуль для StatusBar → `src/components/StatusBar.module.css`
- [ ] Создать заглушку компонента GameSettings → `src/components/GameSettings.tsx`
- [ ] Создать пустой CSS-модуль для GameSettings → `src/components/GameSettings.module.css`
- [ ] Создать заглушку компонента ResultScreen → `src/components/ResultScreen.tsx`
- [ ] Создать пустой CSS-модуль для ResultScreen → `src/components/ResultScreen.module.css`
- [ ] Создать заглушку модуля игровой логики (сигнатуры с `// TODO:`) → `src/logic/gameLogic.ts`
- [ ] Создать заглушку редьюсера с `INITIAL_STATE` и `gameReducer` → `src/logic/gameReducer.ts`
- [ ] Создать заглушку модуля ИИ (`getBestMove`) → `src/logic/aiPlayer.ts`
- [ ] Создать модуль логирования (`logEvent`) → `src/utils/logger.ts`
- [ ] Создать пустые CSS-модули в папке styles → `src/styles/App.module.css`, `src/styles/Board.module.css`, `src/styles/Cell.module.css`, `src/styles/StatusBar.module.css`, `src/styles/GameSettings.module.css`, `src/styles/ResultScreen.module.css`
- [ ] Создать `AI_NOTES.md` по шаблону → `AI_NOTES.md`

## Stage 2: Глобальные стили и подключение в точку входа

- [ ] Создать `src/styles/global.css` с блоком `:root` содержащим все 16 CSS-переменных согласно таблице спецификации → `src/styles/global.css`
- [ ] Добавить CSS-сброс (`box-sizing`, `margin`, `padding`) в `src/styles/global.css` → `src/styles/global.css`
- [ ] Добавить базовые стили `body` через CSS-переменные в `src/styles/global.css` → `src/styles/global.css`
- [ ] Добавить медиазапрос `@media (max-width: 480px)` с переопределением `--font-size-base`, `--font-size-large`, `--cell-size-desktop` в `src/styles/global.css` → `src/styles/global.css`
- [ ] Добавить `import './styles/global.css'` в точку входа → `src/main.tsx`
- [ ] Обновить `AI_NOTES.md`: зафиксировать принятые решения по global-styles → `AI_NOTES.md`