// Чистые функции игровой логики.
// Инвариант №3: не импортирует ничего из components/, не использует React API.
// Инвариант №12: везде используется BoardState (кортеж), не Array<CellValue>.

import type { BoardState, CellValue, GameStatus, Player } from '../types';

/**
 * Все восемь выигрышных линий на поле 3×3.
 * Три строки, три столбца, две диагонали.
 */
const WIN_LINES: [number, number, number][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

/**
 * Проверяет наличие победителя на доске.
 * Возвращает победителя и победную линию или null, если победителя нет.
 *
 * @param board - Текущее состояние доски
 * @returns Объект с победителем и линией или null
 */
export function checkWinner(
  board: BoardState,
): { winner: Player; winLine: number[] } | null {
  for (const [a, b, c] of WIN_LINES) {
    const cellA = board[a];
    const cellB = board[b];
    const cellC = board[c];
    if (cellA !== null && cellA === cellB && cellA === cellC) {
      return { winner: cellA, winLine: [a, b, c] };
    }
  }
  return null;
}

/**
 * Проверяет, заполнена ли доска полностью (нет пустых клеток).
 *
 * @param board - Текущее состояние доски
 * @returns true, если все клетки заняты
 */
export function isBoardFull(board: BoardState): boolean {
  return board.every((cell) => cell !== null);
}

/**
 * Возвращает массив индексов свободных клеток.
 *
 * @param board - Текущее состояние доски
 * @returns Массив индексов пустых клеток [0..8]
 */
export function getAvailableMoves(board: BoardState): number[] {
  const moves: number[] = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      moves.push(i);
    }
  }
  return moves;
}

/**
 * Применяет ход игрока к доске и возвращает новую доску.
 * Не мутирует исходный массив — иммутабельная операция.
 *
 * @param board - Текущее состояние доски
 * @param index - Индекс клетки [0..8]
 * @param player - Символ игрока
 * @returns Новое состояние доски
 */
export function applyMove(board: BoardState, index: number, player: Player): BoardState {
  const next = [...board] as BoardState;
  next[index] = player;
  return next;
}

/**
 * Вычисляет текущий статус игры на основе состояния доски.
 * Используется после каждого хода для определения победителя или ничьей.
 *
 * @param board - Текущее состояние доски
 * @param currentPlayer - Игрок, который только что сделал ход
 * @returns Статус игры
 */
export function computeGameStatus(board: BoardState, currentPlayer: Player): GameStatus {
  const winResult = checkWinner(board);
  if (winResult !== null) {
    return { kind: 'won', winner: winResult.winner, winLine: winResult.winLine };
  }
  if (isBoardFull(board)) {
    return { kind: 'draw' };
  }
  const nextPlayer: Player = currentPlayer === 'X' ? 'O' : 'X';
  return { kind: 'playing', currentPlayer: nextPlayer };
}

/**
 * Вспомогательная функция: возвращает символ противника.
 *
 * @param player - Текущий игрок
 * @returns Противник
 */
export function getOpponent(player: Player): Player {
  return player === 'X' ? 'O' : 'X';
}

/**
 * Проверяет, является ли значение клетки символом игрока (не null).
 *
 * @param value - Значение клетки
 * @returns true, если клетка занята
 */
export function isCellOccupied(value: CellValue): value is Player {
  return value !== null;
}