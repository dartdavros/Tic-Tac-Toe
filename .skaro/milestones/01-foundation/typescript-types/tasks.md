# plan.md

## Этап 1: Реализация файла типов `src/types/index.ts`

**Цель:** Создать полное и корректное определение всех общих TypeScript-типов проекта в единственном файле `src/types/index.ts`. Файл является контрактом между всеми слоями приложения (логика, редьюсер, компоненты) и должен быть реализован до начала работы с любым другим модулем.

**Зависит от:** нет (файл не импортирует ничего из проекта)

**Входные данные:**
- Спецификация `typescript-types` (FR-01 — FR-11, NFR-01 — NFR-02)
- Архитектурный документ (раздел «Управление состоянием», типы)
- ADR-006 (дискриминированный union для `GameSettings`)
- Ответы на открытые вопросы (Q1–Q5)
- `tsconfig.app.json` (конфигурация TypeScript со `strict: true`)

**Выходные данные:**
- `src/types/index.ts` — единственный файл с экспортом всех типов

**DoD:**
- [ ] Экспортирован тип `Player = 'X' | 'O'` (FR-01)
- [ ] Экспортирован тип `CellValue = Player | null` (FR-02)
- [ ] Экспортирован тип `BoardState` как кортеж фиксированной длины 9, не `Array<CellValue>` (FR-03, NFR-02)
- [ ] Экспортирован тип `AppScreen = 'menu' | 'game' | 'result'` (FR-04)
- [ ] Экспортирован тип `GameMode = 'pvp' | 'pvai'` (FR-05)
- [ ] Экспортирован тип `WinLine = [number, number, number]` (кортеж длины 3, решение Q1-C)
- [ ] Экспортирован тип `GameStatus` как дискриминированный union с ветками `playing`, `won` (использует `WinLine`), `draw` (FR-06)
- [ ] Экспортирован тип `GameSettings` как дискриминированный union; обращение к `humanPlayer` без проверки `mode === 'pvai'` вызывает ошибку TypeScript (FR-07, ADR-006)
- [ ] Экспортирован интерфейс `GameState` с полями `screen`, `board`, `status`, `settings`; поле `settings` всегда определено с дефолтом `{ mode: 'pvp' }` (FR-08, решение Q4-C)
- [ ] Экспортирован тип `GameAction` как дискриминированный union с четырьмя действиями; индекс клетки типизирован как `number` (FR-09, решение Q2-A, Q5-A)
- [ ] Все 10 типов/интерфейсов экспортированы из `src/types/index.ts` (FR-10)
- [ ] В файле отсутствуют `any` и `unknown` без обоснования (FR-11)
- [ ] `npm run build` проходит без ошибок TypeScript
- [ ] `npm run lint` не выдаёт предупреждений для файла типов

**Риски:**
- Существующий `src/types/index.ts` может содержать частичную реализацию, конфликтующую с другими файлами проекта — необходимо проверить импорты в `src/logic/gameLogic.ts`, `src/logic/gameReducer.ts`, `src/logic/aiPlayer.ts` и компонентах, чтобы новые типы были совместимы с уже написанным кодом
- Тип `WinLine` как кортеж `[number, number, number]` может потребовать явного приведения в `gameLogic.ts` при формировании массива победной линии — это допустимо через `as WinLine`

---

# tasks.md

# Tasks: typescript-types

## Этап 1: Реализация файла типов `src/types/index.ts`

- [ ] Определить и экспортировать примитивные типы (`Player`, `CellValue`, `AppScreen`, `GameMode`) → `src/types/index.ts`
- [ ] Определить и экспортировать тип `BoardState` как кортеж фиксированной длины 9 → `src/types/index.ts`
- [ ] Определить и экспортировать вспомогательный тип `WinLine = [number, number, number]` → `src/types/index.ts`
- [ ] Определить и экспортировать дискриминированный union `GameStatus` с ветками `playing`, `won`, `draw` → `src/types/index.ts`
- [ ] Определить и экспортировать дискриминированный union `GameSettings` с ветками `pvp` и `pvai` (с `humanPlayer`) → `src/types/index.ts`
- [ ] Определить и экспортировать интерфейс `GameState` → `src/types/index.ts`
- [ ] Определить и экспортировать дискриминированный union `GameAction` с четырьмя действиями → `src/types/index.ts`
- [ ] Проверить совместимость типов с существующими файлами (`gameLogic.ts`, `gameReducer.ts`, `aiPlayer.ts`, компоненты) → `src/types/index.ts`
- [ ] Убедиться, что `npm run build` проходит без ошибок TypeScript → проверка в терминале
- [ ] Убедиться, что `npm run lint` не выдаёт предупреждений → проверка в терминале