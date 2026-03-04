# Tasks: status-bar-component

## Stage 1: Реализация компонента StatusBar, стилей и smoke-тестов

- [ ] Реализовать презентационный компонент с корневым тегом `<p>`, aria-атрибутами и динамическими CSS-классами → `src/components/StatusBar.tsx`
- [ ] Определить CSS-классы `container`, `playerX`, `playerO`, `draw` с использованием CSS-переменных из `global.css` → `src/styles/StatusBar.module.css`
- [ ] Написать smoke-тесты для всех пяти сценариев рендеринга (playing X, playing O, won X, won O, draw) → `src/components/StatusBar.test.tsx`