# AI_NOTES — Stage 1: Реализация модуля aiPlayer (minimax)

## Что было сделано
- Реализован `src/logic/aiPlayer.ts` с функциями `getBestMove` и `minimax`
- Реализован `src/logic/aiPlayer.test.ts` с полным набором unit-тестов
- Оба файла заменяют существующие заглушки (в дереве проекта файлы уже присутствовали)

## Почему такой подход

### Сигнатура `minimax`
Спецификация (FR-05) требует сигнатуру:
```typescript
minimax(board, aiPlayer, currentPlayer, isMaximizing): number