# AI_NOTES — Stage 1: Реализация компонента StatusBar, стилей и smoke-тестов

## What was done
- Создан компонент `src/components/StatusBar.tsx` — чисто презентационный, без локального состояния
- Перезаписан файл стилей `src/styles/StatusBar.module.css` с тремя CSS-классами: `playerX`, `playerO`, `draw`
- Создан файл smoke-тестов `src/components/StatusBar.test.tsx` с пятью тестами (по одному на каждый вариант `kind`)

## Why this approach

### Компонент
- Корневой элемент `<p>` выбран согласно FR-09 и уточнению Q4 — семантически подходит для короткого текстового сообщения
- `aria-live="polite"` и `aria-atomic="true"` добавлены на корневой элемент согласно FR-05 и уточнению Q1 — скринридер объявляет весь текст целиком при каждом изменении
- Логика вычисления текста и CSS-класса вынесена в отдельные чистые функции `getStatusText` и `getStatusClassName` — соблюдается ограничение на длину функции (≤ 40 строк) и читаемость
- `useState` не используется — NFR-01 соблюдён
- Inline-стили отсутствуют — инвариант №14 соблюдён

### Стили
- Импорт в компоненте указывает на `src/styles/StatusBar.module.css` (а не на `src/components/StatusBar.module.css`) согласно архитектурному решению: стили компонентов хранятся в `src/styles/`
- Файл `src/components/StatusBar.module.css` существует в дереве проекта, но не используется компонентом — это потенциальный источник путаницы, однако изменять его не требуется (он пустой и не импортируется)
- Все цвета заданы через CSS-переменные из `global.css` — инвариант №15 соблюдён

### Тесты
- Согласно уточнению Q6 выбран уровень «только smoke» — проверяется факт рендеринга без ошибок
- Тип `GameStatus` из `src/types/index.ts` содержит поле `winLine` в варианте `won` (согласно архитектурному документу), поэтому в тестах для `kind === 'won'` передаётся `winLine` — это необходимо для корректной типизации TypeScript

## Files created / modified
| Файл | Действие | Описание |
|---|---|---|
| `src/components/StatusBar.tsx` | перезаписан | Презентационный компонент с `<p>`, aria-атрибутами и динамическими CSS-классами |
| `src/styles/StatusBar.module.css` | перезаписан | CSS-классы `playerX`, `playerO`, `draw` с цветами через CSS-переменные |
| `src/components/StatusBar.test.tsx` | создан | Пять smoke-тестов рендеринга для всех вариантов `GameStatus.kind` |

## Risks and limitations
- **Дублирование файлов стилей:** в дереве проекта существует `src/components/StatusBar.module.css` (пустой). Компонент импортирует из `src/styles/StatusBar.module.css`. Пустой файл в `src/components/` не удаляется в рамках данной задачи — его удаление выходит за пределы Stage 1. Риск: разработчик может случайно импортировать не тот файл.
- **Поле `winLine` в типе `GameStatus`:** если тип `GameStatus` в `src/types/index.ts` не содержит поля `winLine` в варианте `won`, тесты потребуют корректировки. Согласно архитектурному документу (`winLine: number[]` присутствует в типе), тесты написаны с его передачей.

## Invariant compliance
- [x] Инвариант №1 (единственная точка мутации) — не затрагивается, компонент презентационный
- [x] Инвариант №2 (однонаправленный поток данных) — данные только через props, нет callbacks
- [x] Инвариант №3 (изоляция бизнес-логики) — компонент не импортирует из `logic/`
- [x] Инвариант №14 (CSS Modules — единственный механизм стилизации) — inline-стили отсутствуют
- [x] Инвариант №15 (токены дизайна через CSS-переменные) — хардкод цветов отсутствует, используются `var(--color-player-x)`, `var(--color-player-o)`, `var(--color-text-secondary)`

## How to verify
1. `npx vitest run src/components/StatusBar.test.tsx --reporter=verbose` — все 5 smoke-тестов должны пройти
2. `npx tsc --noEmit` — компиляция без ошибок
3. `npx eslint src/components/StatusBar.tsx src/components/StatusBar.test.tsx src/styles/StatusBar.module.css` — линтинг без ошибок