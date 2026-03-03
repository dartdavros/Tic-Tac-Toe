# Tasks: game-settings-component

## Stage 1: Реализация компонента GameSettings и его тестов

- [ ] Реализовать компонент с локальным `useState` для режима (`mode`) и стороны (`humanPlayer`) → `src/components/GameSettings.tsx`
- [ ] Добавить заголовок «Крестики-нолики» в разметку компонента → `src/components/GameSettings.tsx`
- [ ] Реализовать группу радиокнопок режима (PvP / PvAI) в `<fieldset>` с `<legend>` и явными `<label>` → `src/components/GameSettings.tsx`
- [ ] Реализовать условный рендеринг блока выбора стороны (X / O) только при `mode === 'pvai'` → `src/components/GameSettings.tsx`
- [ ] Реализовать сброс `humanPlayer` до `'X'` при каждом переключении на режим PvAI → `src/components/GameSettings.tsx`
- [ ] Реализовать обработчик кнопки «Начать игру»: формирует корректный объект `GameSettings` и вызывает `onStartGame` → `src/components/GameSettings.tsx`
- [ ] Убедиться, что кнопка «Начать игру» не имеет атрибута `disabled` ни в одном состоянии → `src/components/GameSettings.tsx`
- [ ] Написать CSS-стили компонента с использованием только CSS-переменных из `global.css` (без хардкода) → `src/components/GameSettings.module.css`
- [ ] Обеспечить адаптивную вёрстку формы от 320px (медиазапрос `@media (max-width: 480px)`) → `src/components/GameSettings.module.css`
- [ ] Синхронизировать или очистить дублирующий файл стилей → `src/styles/GameSettings.module.css`
- [ ] Написать smoke-тест: компонент монтируется без ошибок → `src/components/GameSettings.test.tsx`
- [ ] Написать smoke-тест: сценарий PvP — клик «Начать игру» вызывает `onStartGame({ mode: 'pvp' })` → `src/components/GameSettings.test.tsx`
- [ ] Написать smoke-тест: сценарий PvAI + X — выбор PvAI, клик «Начать игру» вызывает `onStartGame({ mode: 'pvai', humanPlayer: 'X' })` → `src/components/GameSettings.test.tsx`
- [ ] Написать smoke-тест: сценарий PvAI + O — выбор PvAI, выбор O, клик «Начать игру» вызывает `onStartGame({ mode: 'pvai', humanPlayer: 'O' })` → `src/components/GameSettings.test.tsx`