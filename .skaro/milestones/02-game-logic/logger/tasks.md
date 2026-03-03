# Tasks: logger

## Stage 1: Реализация модуля logger

- [ ] Реализовать экспортируемый тип `LogEventType` как литеральный union
  `'reducer_error' | 'render_error'` → `src/utils/logger.ts`
- [ ] Реализовать экспортируемую функцию `logEvent(event: LogEventType, payload?: unknown): void`
  с ветвлением по `import.meta.env.DEV` → `src/utils/logger.ts`
- [ ] Добавить вызов `console.warn('[logEvent]', event, payload ?? '')` в
  dev-ветку функции → `src/utils/logger.ts`
- [ ] Добавить no-op production-ветку с комментарием
  `// TODO: подключить аналитику в production` → `src/utils/logger.ts`
- [ ] Обернуть тело функции в `try/catch` для гарантии FR-05 (функция
  никогда не выбрасывает исключений) → `src/utils/logger.ts`
- [ ] Убедиться, что `npx tsc --noEmit` проходит без ошибок
- [ ] Убедиться, что `npx eslint src/utils/logger.ts` проходит без ошибок
- [ ] Убедиться, что `npx vitest run src/logic/gameReducer.test.ts` проходит
  без ошибок (косвенная проверка логгера)