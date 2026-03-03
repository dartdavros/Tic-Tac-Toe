# AI_NOTES — Stage 1: Инициализация структуры проекта

## Что было сделано

- Создан `package.json` с зафиксированными версиями всех зависимостей
  (React 18.3.1, Vite 5.4.11, TypeScript 5.7.2, Vitest 2.1.8, ESLint 9.17.0)
- Создан `vite.config.ts` с настройкой Vitest (jsdom, globals, coverage)
- Созданы `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
  (разделение конфигов для приложения и конфигурационных файлов)
- Создан `eslint.config.js` в формате flat config с плагинами react, react-hooks, typescript-eslint
- Создан `.prettierrc` с единым стилем форматирования
- Создан `index.html` с корневым элементом `#root` и lang="ru"
- Создан `src/vite-env.d.ts` с референсом на типы Vite
- Создан `src/test-setup.ts` для подключения `@testing-library/jest-dom`
- Созданы все TypeScript-типы в `src/types/index.ts` согласно спецификации
- Создан `src/utils/logger.ts` — минимальный слой логирования
- Созданы заглушки всех модулей логики: `gameLogic.ts`, `gameReducer.ts`, `aiPlayer.ts`
- Созданы заглушки всех компонентов: `App`, `ErrorBoundary`, `Board`, `Cell`,
  `StatusBar`, `GameSettings`, `ResultScreen`
- Созданы пустые CSS-модули для всех компонентов (в `src/components/` и `src/styles/`)
- Создан `src/main.tsx` — точка входа, рендерит `<App />` в StrictMode

## Почему такой подход

### Разделение tsconfig на app и node
Vite 5 рекомендует разделять конфигурации TypeScript для исходного кода
приложения (`tsconfig.app.json`) и конфигурационных файлов сборщика
(`tsconfig.node.json`). Корневой `tsconfig.json` использует `references`
для объединения. Это стандартный шаблон `create-vite`.

### Заглушки с TODO вместо пустых файлов
Заглушки содержат корректные сигнатуры типов и экспорты, чтобы TypeScript
компилировался без ошибок. Тела функций содержат `// TODO:` с обоснованием
и `void` для подавления предупреждений об неиспользуемых параметрах.

### `gameReducer.ts` — switch без реализации
Редьюсер содержит полный switch по всем типам действий с `default: never`
для исчерпывающей проверки типов. Это гарантирует, что при добавлении нового
типа действия TypeScript выдаст ошибку компиляции.

### `getBestMove` выбрасывает Error в заглушке
Согласно контракту из архитектурного документа, функция должна выбрасывать
`Error('No available moves')` при вызове с полной доской. Заглушка выбрасывает
ошибку с сообщением о нереализованности, что корректно для Stage 1.

### Два места CSS-модулей
Архитектурный документ определяет CSS-модули в двух местах:
- `src/components/*.module.css` — рядом с компонентами (co-location)
- `src/styles/*.module.css` — в отдельной папке стилей

Оба набора созданы как пустые файлы. Компоненты в Stage 1 не импортируют
CSS-модули (нет стилей для применения). В последующих задачах компоненты
будут использовать модули из `src/styles/`.

### Версии пакетов зафиксированы точно
Для устранения риска несовместимости версий все зависимости указаны без
диапазонов (`^` или `~`). Это гарантирует воспроизводимость сборки.

## Альтернативы, которые были рассмотрены

### `tsconfig.json` — единый файл vs. разделённые
**Альтернатива:** единый `tsconfig.json` для всего проекта.
**Отклонено:** Vite 5 генерирует разделённые конфиги по умолчанию;
единый конфиг создаёт проблемы с типами для `vite.config.ts` (Node.js API
vs. Browser API).

### ESLint — `eslint-plugin-react-refresh` vs. без него
**Альтернатива:** добавить `eslint-plugin-react-refresh` (стандарт для Vite).
**Решение:** не добавлен, так как Constitution не упоминает этот плагин,
а его отсутствие не влияет на корректность кода.

### `src/test-setup.ts` — отдельный файл vs. inline в vite.config.ts
**Альтернатива:** настроить jest-dom через `setupFiles` inline.
**Решение:** отдельный файл `src/test-setup.ts` — стандартная практика,
упрощает расширение в будущем.

## Файлы созданы / изменены

| Файл | Действие | Описание |
|---|---|---|
| `package.json` | создан | Зависимости и скрипты проекта |
| `vite.config.ts` | создан | Конфигурация Vite + Vitest |
| `tsconfig.json` | создан | Корневой tsconfig с references |
| `tsconfig.app.json` | создан | TypeScript для исходного кода приложения |
| `tsconfig.node.json` | создан | TypeScript для конфигурационных файлов |
| `eslint.config.js` | создан | ESLint flat config с react, react-hooks, typescript-eslint |
| `.prettierrc` | создан | Конфигурация Prettier |
| `index.html` | создан | Точка входа HTML |
| `src/vite-env.d.ts` | создан | Типы Vite для клиентского кода |
| `src/test-setup.ts` | создан | Настройка тестового окружения (jest-dom) |
| `src/main.tsx` | создан | Точка входа React-приложения |
| `src/types/index.ts` | создан | Все TypeScript-типы согласно спецификации |
| `src/utils/logger.ts` | создан | Минимальный слой логирования |
| `src/logic/gameLogic.ts` | создан | Заглушки чистых функций игровой логики |
| `src/logic/gameReducer.ts` | создан | Заглушка редьюсера с INITIAL_STATE |
| `src/logic/aiPlayer.ts` | создан | Заглушка функции getBestMove |
| `src/components/App.tsx` | создан | Корневой компонент (заглушка) |
| `src/components/App.module.css` | создан | Пустой CSS-модуль |
| `src/components/ErrorBoundary.tsx` | создан | Граница ошибок (заглушка) |
| `src/components/Board.tsx` | создан | Компонент поля (заглушка) |
| `src/components/Board.module.css` | создан | Пустой CSS-модуль |
| `src/components/Cell.tsx` | создан | Компонент клетки (заглушка) |
| `src/components/Cell.module.css` | создан | Пустой CSS-модуль |
| `src/components/StatusBar.tsx` | создан | Строка статуса (заглушка) |
| `src/components/StatusBar.module.css` | создан | Пустой CSS-модуль |
| `src/components/GameSettings.tsx` | создан | Настройки игры (заглушка) |
| `src/components/GameSettings.module.css` | создан | Пустой CSS-модуль |
| `src/components/ResultScreen.tsx` | создан | Экран результата (заглушка) |
| `src/components/ResultScreen.module.css` | создан | Пустой CSS-модуль |
| `src/styles/App.module.css` | создан | Пустой CSS-модуль (папка styles) |
| `src/styles/Board.module.css` | создан | Пустой CSS-модуль (папка styles) |
| `src/styles/Cell.module.css` | создан | Пустой CSS-модуль (папка styles) |
| `src/styles/StatusBar.module.css` | создан | Пустой CSS-модуль (папка styles) |
| `src/styles/GameSettings.module.css` | создан | Пустой CSS-модуль (папка styles) |
| `src/styles/ResultScreen.module.css` | создан | Пустой CSS-модуль (папка styles) |
| `AI_NOTES.md` | создан | Документация решений Stage 1 |

## Риски и ограничения

- **Заглушки не проходят тесты бизнес-логики.** `gameLogic.ts` и `aiPlayer.ts`
  содержат нереализованные функции. Тесты для них будут добавлены в
  соответствующих задачах вместе с реализацией.

- **`getBestMove` всегда выбрасывает ошибку.** Это ожидаемо для Stage 1.
  Редьюсер-заглушка не вызывает `getBestMove`, поэтому сборка проходит.

- **`noUnusedLocals` и `noUnusedParameters` включены.** Заглушки используют
  `void param` для подавления ошибок TypeScript. Это временное решение,
  которое будет устранено при реализации функций.

- **Версии пакетов могут устареть.** Зафиксированные версии актуальны на
  момент создания. При обновлении зависимостей необходима проверка совместимости.

- **`eslint-plugin-react` версии 7.x** — последняя стабильная версия,
  совместимая с ESLint 9 flat config. Версия 8.x находится в разработке.

## Соответствие архитектурным инвариантам

- [x] **Инвариант №1** (единственная точка мутации) — соблюдён: `useReducer`
  в `App.tsx`, все изменения через `dispatch`
- [x] **Инвариант №2** (однонаправленный поток данных) — соблюдён: props вниз,
  callbacks вверх во всех компонентах-заглушках
- [x] **Инвариант №3** (изоляция бизнес-логики) — соблюдён: `logic/` не
  импортирует из `components/`, не использует React API
- [x] **Инвариант №4** (ИИ только из редьюсера) — соблюдён: `getBestMove`
  не вызывается из компонентов
- [x] **Инвариант №5** (переход в result только в редьюсере) — соблюдён:
  компоненты не диспатчат переход в result
- [x] **Инвариант №6** (редьюсер не выбрасывает) — соблюдён: `try/catch`
  в `gameReducer`, возврат текущего состояния при ошибке
- [x] **Инвариант №9** (`dangerouslySetInnerHTML` запрещён) — соблюдён:
  не используется нигде
- [x] **Инвариант №12** (`BoardState` — кортеж длины 9) — соблюдён:
  тип определён как кортеж из 9 элементов
- [x] **Инвариант №13** (`GameSettings` — дискриминированный union) — соблюдён:
  `humanPlayer` доступен только при `mode === 'pvai'`
- [x] **Инвариант №14** (CSS Modules — единственный подход) — соблюдён:
  заглушки компонентов не используют inline-стили
- [x] **Инвариант №15** (токены только в global.css) — не применимо в Stage 1:
  `global.css` создаётся в Stage 2; CSS-модули пустые

## Как проверить

1. `npm install` — должен завершиться без ошибок
2. `npm run build` — TypeScript компилируется, Vite собирает бандл
3. `npm run lint` — ESLint не выдаёт ошибок
4. `npm run format:check` — Prettier не выдаёт предупреждений
5. `npm run test` — Vitest запускается (тестов нет, выход с кодом 0)
6. Проверить в DevTools: приложение рендерит `<div>Tic-Tac-Toe</div>`
7. Убедиться, что в `src/types/index.ts` экспортированы все 8 типов:
   `Player`, `CellValue`, `BoardState`, `AppScreen`, `GameMode`,
   `GameStatus`, `GameSettings`, `GameState`, `GameAction`