# План реализации: logger (src/utils/logger.ts)

## Анализ зависимостей

Файл `src/utils/logger.ts` уже существует в дереве проекта. Задача —
реализовать его содержимое согласно спецификации. Файл является листовым
модулем: он не зависит ни от каких других модулей проекта, но от него
зависят `gameReducer.ts` и `ErrorBoundary.tsx`.

Тесты для логгера не пишутся (согласно ответу на Question 4 — покрытие
обеспечивается косвенно через тесты редьюсера). Однако тесты редьюсера
уже существуют и используют `vi.stubEnv('DEV', false)` для подавления
вывода — это нужно проверить.

Задача укладывается в **один этап**: реализация единственного файла
`src/utils/logger.ts` с проверкой через линтер и существующие тесты
редьюсера.

---

## Stage 1: Реализация модуля logger

**Goal:**
Реализовать файл `src/utils/logger.ts` согласно спецификации:
- Экспортировать тип `LogEventType` как литеральный union
  `'reducer_error' | 'render_error'`
- Реализовать функцию `logEvent(event: LogEventType, payload?: unknown): void`
- В dev-режиме (`import.meta.env.DEV === true`) вызывать `console.warn`
  с префиксом `[logEvent]`
- В production-режиме — no-op с комментарием `// TODO: подключить аналитику`
- Обернуть тело функции в `try/catch` для гарантии FR-05
- Файл должен проходить линтер и не нарушать архитектурные инварианты

**Depends on:** нет (листовой модуль, не зависит от других модулей проекта)

**Inputs:**
- Спецификация: раздел «Specification: logger»
- Уточнения: раздел «Clarifications: logger»
- Конституция проекта (стандарты кодирования)
- Существующий файл `src/utils/logger.ts` (перезаписывается)
- Существующий файл `src/logic/gameReducer.test.ts` (проверяется совместимость)
- `tsconfig.app.json`, `eslint.config.js`, `.prettierrc`

**Outputs:**
- `src/utils/logger.ts` — полная реализация модуля логгера

**DoD:**
- [ ] Файл `src/utils/logger.ts` создан и содержит экспортируемый тип
  `LogEventType = 'reducer_error' | 'render_error'`
- [ ] Функция `logEvent` экспортируется и принимает
  `(event: LogEventType, payload?: unknown): void`
- [ ] В dev-режиме (`import.meta.env.DEV === true`) вызывается
  `console.warn('[logEvent]', event, payload ?? '')`
- [ ] В production-режиме функция является no-op (не вызывает `console.warn`)
- [ ] Тело функции обёрнуто в `try/catch`; исключение внутри молча
  игнорируется (catch-блок пустой или с комментарием)
- [ ] TypeScript выдаёт ошибку компиляции при вызове
  `logEvent('unknown_event')` — проверяется через `tsc --noEmit`
- [ ] `npm run lint` не выдаёт ошибок для файла `src/utils/logger.ts`
- [ ] Существующие тесты `src/logic/gameReducer.test.ts` проходят без
  изменений (логгер вызывается косвенно, `vi.stubEnv('DEV', false)`
  подавляет вывод)
- [ ] Длина функции не превышает 40 строк (требование конституции)
- [ ] Глубина вложенности не превышает 3 уровней (требование конституции)

**Risks:**
- `import.meta.env.DEV` может быть недоступен в тестовой среде Vitest
  без правильной конфигурации — проверить `vite.config.ts` на наличие
  `define` или использование `import.meta.env`; Vitest поддерживает
  `import.meta.env` нативно через `vi.stubEnv`
- Если `gameReducer.test.ts` не использует `vi.stubEnv('DEV', false)`,
  `console.warn` будет вызываться в тестах и создавать шум — нужно
  убедиться, что тесты редьюсера корректно мокируют окружение

---

## Verify

- name: Проверка типов TypeScript
  command: npx tsc --noEmit --project tsconfig.app.json

- name: Линтер ESLint для файла логгера
  command: npx eslint src/utils/logger.ts

- name: Тесты редьюсера (косвенное покрытие логгера)
  command: npx vitest run src/logic/gameReducer.test.ts

- name: Все тесты проекта (регрессия)
  command: npx vitest run --reporter=verbose