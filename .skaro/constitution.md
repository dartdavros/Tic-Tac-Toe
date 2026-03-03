# Constitution: Tic-Tac-Toe

## Stack
- Language: TypeScript 5.x
- Framework: React 18 (Vite 5 в качестве сборщика)
- Database: нет (состояние хранится в памяти браузера, React state)
- Infrastructure: статический хостинг (GitHub Pages / Vercel); Docker не требуется

## Coding Standards
- Linter: ESLint с конфигом `eslint.config.js` (flat config)
- Formatter: Prettier (`.prettierrc`)
- Naming: camelCase для переменных и функций, PascalCase для компонентов и типов, UPPER_SNAKE_CASE для констант
- Max function length: 40 строк
- Max nesting depth: 3 уровня

## Testing
- Minimum coverage: 60% (учебный проект, ослаблено)
- Required: unit-тесты для логики определения победителя и хода ИИ
- Required: smoke-тесты рендеринга ключевых компонентов
- Framework: Vitest + React Testing Library

## Constraints
- Без бэкенда — вся логика на клиенте
- Бюджет: $0 (бесплатный хостинг, open-source инструменты)
- Совместимость: последние версии Chrome, Firefox, Safari; адаптивная вёрстка (мобильные + десктоп)

## Security
- Authorization: нет (однопользовательская игра, авторизация не требуется)
- Input validation: валидация ходов на уровне игровой логики (занятость клетки, завершённость партии)
- Secrets: отсутствуют (нет API-ключей, нет серверной части)

## LLM Rules
- Do not leave stubs without explicit `// TODO:` with justification
- Do not duplicate code: prefer reuse and clear abstractions
- Do not make hidden assumptions — if unsure, ask
- Always generate `AI_NOTES.md` per template
- Follow the coding style described above