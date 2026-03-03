// Алгоритм ИИ на основе minimax (полный перебор, без оптимизаций).
// Инвариант №4: вызывается только из gameReducer, не из компонентов.
// Инвариант №7: выполняется менее чем за 50 мс на любом валидном состоянии.
// ADR-002: детерминированный алгоритм — при одинаковом состоянии всегда один результат.
// FR-03: при нескольких равнозначных ходах выбирается первый по индексу.
// FR-05: оценки фиксированы: +10 (победа ИИ), -10 (победа противника), 0 (ничья).

import type { BoardState, Player } from '../types';
import { checkWinner, isBoardFull, getAvailableMoves, applyMove, getOpponent } from './gameLogic';

/**
 * Рекурсивная функция minimax (полный перебор без alpha-beta pruning).
 * Оценки фиксированы без учёта глубины (FR-05, ответ на вопрос Q2).
 *
 * @param board - Текущее состояние доски
 * @param aiSymbol - Символ ИИ ('X' или 'O')
 * @param currentPlayer - Игрок, чей ход сейчас
 * @param isMaximizing - true, если ход максимизирующего игрока (ИИ)
 * @returns Оценка позиции: +10 (победа ИИ), -10 (победа противника), 0 (ничья)
 */
export function minimax(
  board: BoardState,
  aiSymbol: Player,
  currentPlayer: Player,
  isMaximizing: boolean,
): number {
  const winResult = checkWinner(board);
  if (winResult !== null) {
    return winResult.winner === aiSymbol ? 10 : -10;
  }
  if (isBoardFull(board)) {
    return 0;
  }

  const moves = getAvailableMoves(board);
  const nextPlayer = getOpponent(currentPlayer);

  if (isMaximizing) {
    let best = -Infinity;
    for (const move of moves) {
      const nextBoard = applyMove(board, move, currentPlayer);
      const value = minimax(nextBoard, aiSymbol, nextPlayer, false);
      if (value > best) {
        best = value;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (const move of moves) {
      const nextBoard = applyMove(board, move, currentPlayer);
      const value = minimax(nextBoard, aiSymbol, nextPlayer, true);
      if (value < best) {
        best = value;
      }
    }
    return best;
  }
}

/**
 * Возвращает индекс оптимального хода для ИИ на основе minimax.
 *
 * Граничные случаи (FR-10 проверяется раньше FR-04):
 * - Если на доске уже есть победитель — выбрасывает Error('Game is already over').
 * - Если доска полностью заполнена — выбрасывает Error('No available moves').
 *
 * Детерминированность (FR-03): при нескольких равнозначных ходах
 * выбирается первый по индексу (итерация по getAvailableMoves, который
 * возвращает индексы в порядке возрастания).
 *
 * @param board - Текущее состояние доски
 * @param aiPlayer - Символ ИИ ('X' или 'O')
 * @returns Индекс клетки [0..8]
 */
export function getBestMove(board: BoardState, aiPlayer: Player): number {
  // FR-10: проверка победителя выполняется до проверки заполненности
  const winResult = checkWinner(board);
  if (winResult !== null) {
    throw new Error('Game is already over');
  }

  const moves = getAvailableMoves(board);
  if (moves.length === 0) {
    throw new Error('No available moves');
  }

  let bestScore = -Infinity;
  // moves.length > 0 гарантировано проверкой выше
  let bestMove = moves[0] as number;

  for (const move of moves) {
    const nextBoard = applyMove(board, move, aiPlayer);
    const opponent = getOpponent(aiPlayer);
    const score = minimax(nextBoard, aiPlayer, opponent, false);
    // FR-03: строгое сравнение (>) гарантирует выбор первого по индексу
    // при равных оценках, так как moves отсортированы по возрастанию
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}