// Алгоритм ИИ на основе minimax (полный перебор, без оптимизаций).
// Инвариант №4: вызывается только из gameReducer, не из компонентов.
// Инвариант №7: выполняется менее чем за 50 мс на любом валидном состоянии.
// ADR-002: детерминированный алгоритм — при одинаковом состоянии всегда один результат.

import type { BoardState, Player } from '../types';
import {
  getAvailableMoves,
  applyMove,
  getOpponent,
  checkWinner,
} from './gameLogic';

/**
 * Вычисляет числовую оценку терминального состояния доски.
 * Возвращает null если состояние не терминальное (игра продолжается).
 *
 * @param board - Текущее состояние доски
 * @param aiSymbol - Символ ИИ
 * @returns +10 (победа ИИ), -10 (победа противника), 0 (ничья), null (игра продолжается)
 */
function evaluateTerminal(board: BoardState, aiSymbol: Player): number | null {
  // Передаём aiSymbol как currentPlayer — для определения победителя значение не важно,
  // оно используется только для статуса 'playing', который здесь не нужен.
  const status = checkWinner(board, aiSymbol);

  if (status.kind === 'won') {
    return status.winner === aiSymbol ? 10 : -10;
  }
  if (status.kind === 'draw') {
    return 0;
  }
  return null;
}

/**
 * Рекурсивная функция minimax (полный перебор без alpha-beta pruning).
 * Оценки фиксированы без учёта глубины: +10, -10, 0.
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
  // Проверяем терминальное состояние перед рекурсией
  const terminalScore = evaluateTerminal(board, aiSymbol);
  if (terminalScore !== null) {
    return terminalScore;
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
 * Граничные случаи (проверка победителя выполняется раньше проверки заполненности):
 * - Если на доске уже есть победитель — выбрасывает Error('Game is already over').
 * - Если доска полностью заполнена — выбрасывает Error('No available moves').
 *
 * Детерминированность: при нескольких равнозначных ходах выбирается первый
 * по индексу (итерация по getAvailableMoves, возвращающей индексы по возрастанию).
 *
 * @param board - Текущее состояние доски
 * @param aiPlayer - Символ ИИ ('X' или 'O')
 * @returns Индекс клетки [0..8]
 */
export function getBestMove(board: BoardState, aiPlayer: Player): number {
  // Проверка победителя выполняется до проверки заполненности (контракт)
  const status = checkWinner(board, aiPlayer);
  if (status.kind === 'won') {
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
    // Строгое сравнение (>) гарантирует выбор первого по индексу
    // при равных оценках, так как moves отсортированы по возрастанию
    const score = minimax(nextBoard, aiPlayer, opponent, false);
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}