# Tasks: result-screen-component

## Stage 1: ResultScreen — компонент, стили и тесты

- [ ] Реализовать компонент `ResultScreen` с props `status`, `onRestart`,
      `onQuitToMenu`; корневой контейнер с `aria-live="assertive"`;
      условный рендер «Победил игрок {winner}!» / «Ничья!»; имя победителя
      окрашено через inline `color: var(--color-x/--color-o)` с комментарием
      `// STYLE_EXCEPTION`; кнопки «Играть снова» (primary) и «В меню»
      (secondary) в горизонтальном ряду → `src/components/ResultScreen.tsx`

- [ ] Написать CSS-модуль: контейнер (центрирование, отступы), заголовок
      результата, горизонтальный flex-контейнер для кнопок, primary-стиль
      кнопки (акцентный фон `--color-accent`), secondary-стиль кнопки
      (обводка `--color-border`, прозрачный фон), адаптив для 320px →
      `src/styles/ResultScreen.module.css`

- [ ] Написать smoke-тесты: рендер при `won` (X и O), рендер при `draw`,
      клик «Играть снова» вызывает `onRestart`, клик «В меню» вызывает
      `onQuitToMenu`, наличие `aria-live="assertive"` на контейнере,
      наличие обеих кнопок с корректным текстом →
      `src/components/ResultScreen.test.tsx`