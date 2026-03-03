// Алгоритм ИИ на основе minimax (полный перебор, без оптимизаций).
// Инвариант №4: вызывается только из gameReducer, не из компонентов.
// Инвариант №7: выполняется менее чем за 50 мс на любом валидном состоянии.
// ADR-002: детерминированный алгоритм — при одинаковом состоянии всегда один результат.

import type { BoardState, Player } from '../types';
import { checkWinner, getAvailableMoves, applyMove, isBoardFull } from './gameLogic';
import { getOpponent } from './gameLogic';

/**
 * Оценочная функция для minimax с учётом глубины.
 * Более быстрая победа получает более высокую оценку:
 *   победа ИИ:       +10 - depth (чем быстрее, тем лучше)
 *   победа противника: -10 + depth (чем быстрее поражение, тем хуже)
 *   нет победителя:  0
 *
 * Учёт глубины гарантирует, что алгоритм предпочитает немедленные победы
 * отложенным и блокирует немедленные угрозы противника.
 *
 * @param board - Состояние доски
 * @param aiSymbol - Символ ИИ
 * @param depth - Текущая глубина рекурсии
 * @returns Оценка позиции
 */
function evaluate(board: BoardState, aiSymbol: Player, depth: number): number {
  const result = checkWinner(board);
  if (result === null) {
    return 0;
  }
  return result.winner === aiSymbol ? 10 - depth : -10 + depth;
}

/**
 * Рекурсивная функция minimax с учётом глубины.
 * Полный перебор без alpha-beta pruning — допустимо для поля 3×3.
 *
 * @param board - Текущее состояние доски
 * @param isMaximizing - true, если ход ИИ (максимизирующий игрок)
 * @param aiSymbol - Символ ИИ
 * @param depth - Текущая глубина рекурсии (для оценки скорости победы)
 * @returns Оценка позиции
 */
function minimax(
  board: BoardState,
  isMaximizing: boolean,
  aiSymbol: Player,
  depth: number,
): number {
  const score = evaluate(board, aiSymbol, depth);

  // Терминальные состояния: победа или ничья
  if (score !== 0) {
    return score;
  }
  if (isBoardFull(board)) {
    return 0;
  }

  const currentPlayer: Player = isMaximizing ? aiSymbol : getOpponent(aiSymbol);
  const moves = getAvailableMoves(board);

  if (isMaximizing) {
    let best = -Infinity;
    for (const move of moves) {
      const nextBoard = applyMove(board, move, currentPlayer);
      const value = minimax(nextBoard, false, aiSymbol, depth + 1);
      if (value > best) {
        best = value;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (const move of moves) {
      const nextBoard = applyMove(board, move, currentPlayer);
      const value = minimax(nextBoard, true, aiSymbol, depth + 1);
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
 * Граничные случаи:
 * - Если доска полностью заполнена — выбрасывает Error('No available moves').
 *   Вызывающий код (gameReducer) обязан проверить isBoardFull перед вызовом.
 * - Если победитель уже определён — поведение не определено;
 *   вызывающий код обязан проверить статус игры перед вызовом.
 *
 * @param board - Текущее состояние доски
 * @param aiPlayer - Символ ИИ ('X' или 'O')
 * @returns Индекс клетки [0..8]
 */
export function getBestMove(board: BoardState, aiPlayer: Player): number {
  const moves = getAvailableMoves(board);

  if (moves.length === 0) {
    throw new Error('No available moves');
  }

  let bestScore = -Infinity;
  // Гарантированно не undefined: moves.length > 0 проверено выше
  let bestMove = moves[0] as number;

  for (const move of moves) {
    const nextBoard = applyMove(board, move, aiPlayer);
    // depth=1: первый ход уже сделан, передаём глубину для оценки скорости победы
    const score = minimax(nextBoard, false, aiPlayer, 1);
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}