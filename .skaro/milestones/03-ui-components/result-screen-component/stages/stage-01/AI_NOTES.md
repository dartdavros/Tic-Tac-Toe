# AI_NOTES — Stage 1: ResultScreen — компонент, стили и тесты

## What was done
- Реализован компонент `ResultScreen` в `src/components/ResultScreen.tsx`
- Реализованы стили в `src/styles/ResultScreen.module.css`
- Файл `src/components/ResultScreen.module.css` очищен и содержит только комментарий-заглушку (аналогично `Board.module.css`), так как стили хранятся в `src/styles/`
- Написаны smoke-тесты в `src/components/ResultScreen.test.tsx`
- Экспортирован тип `ResultStatus` из компонента для использования в тестах и потенциально в `App`

## Why this approach

### Сужение типа GameStatus
Тип `GameStatus` в `src/types/index.ts` включает `kind: 'playing'`, которое недопустимо для `ResultScreen`. Использован `Extract<GameStatus, { kind: 'won' } | { kind: 'draw' }>` для создания типа `ResultStatus`. Это обеспечивает статическую проверку на уровне TypeScript — передача `{ kind: 'playing' }` в компонент является ошибкой компиляции.

### Inline-стиль для цвета победителя
CSS-переменные `--color-x` и `--color-o` используются через inline-стиль `style={{ color: 'var(--color-x)' }}`. Это единственный способ динамически выбрать CSS-переменную в зависимости от значения `winner` без дублирования логики в CSS. Задокументировано комментарием `// STYLE_EXCEPTION` согласно инварианту №14.

**Риск:** В `global.css` CSS-переменные могут называться `--color-player-x` и `--color-player-o` (согласно архитектурному документу), а не `--color-x` и `--color-o` (согласно спецификации FR-02 и уточнению Q2). Спецификация явно указывает `--color-x` и `--color-o`, поэтому используются именно эти имена. Если в `global.css` определены только `--color-player-x` / `--color-player-o`, необходимо добавить алиасы в `global.css`:
```css
--color-x: var(--color-player-x);
--color-o: var(--color-player-o);