// Чистые функции игровой логики.
// Инвариант №3: не импортирует ничего из components/, не использует React API.
// Инвариант №12: везде используется BoardState (кортеж), не Array<CellValue>.

import type { BoardState, CellValue, GameStatus, Player } from '../types';

/**
 * Все восемь выигрышных линий на поле 3×3.
 * Три строки, три столбца, две диагонали.
 * FR-02: константа экспортируется для использования в тестах и других модулях.
 */
export const WIN_LINES: readonly [number, number, number][] = [
  [0, 1, 2], // первая строка
  [3, 4, 5], // вторая строка
  [6, 7, 8], // третья строка
  [0, 3, 6], // первый столбец
  [1, 4, 7], // второй столбец
  [2, 5, 8], // третий столбец
  [0, 4, 8], // главная диагональ
  [2, 4, 6], // побочная диагональ
] as const;

/**
 * FR-01: Проверяет состояние игры и возвращает GameStatus.
 * Проверяет победителя среди обоих игроков (X и O).
 * Параметр currentPlayer используется только для формирования статуса 'playing'.
 * Приоритет: победа > ничья > продолжение игры.
 *
 * @param board - Текущее состояние доски
 * @param currentPlayer - Игрок, чей ход сейчас (для статуса 'playing')
 * @returns Статус игры
 */
export function checkWinner(board: BoardState, currentPlayer: Player): GameStatus {
  for (const [a, b, c] of WIN_LINES) {
    const cellA = board[a];
    const cellB = board[b];
    const cellC = board[c];
    if (cellA !== null && cellA === cellB && cellA === cellC) {
      return { kind: 'won', winner: cellA, winLine: [a, b, c] };
    }
  }
  if (isBoardFull(board)) {
    return { kind: 'draw' };
  }
  return { kind: 'playing', currentPlayer };
}

/**
 * FR-03: Проверяет, заполнена ли доска полностью (нет пустых клеток).
 *
 * @param board - Текущее состояние доски
 * @returns true, если все 9 клеток заняты
 */
export function isBoardFull(board: BoardState): boolean {
  return board.every((cell) => cell !== null);
}

/**
 * FR-04: Возвращает массив индексов свободных клеток в строго возрастающем порядке.
 * Порядок гарантирует детерминизм алгоритма minimax (ADR-002).
 *
 * @param board - Текущее состояние доски
 * @returns Массив индексов пустых клеток [0..8] в возрастающем порядке
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
 * FR-05: Применяет ход игрока к доске и возвращает новую доску.
 * Не мутирует исходный массив — иммутабельная операция (NFR-03).
 * Выбрасывает Error при невалидном индексе или занятой клетке.
 * Проверка индекса выполняется раньше проверки занятости.
 *
 * @param board - Текущее состояние доски
 * @param index - Индекс клетки [0..8]
 * @param player - Символ игрока
 * @returns Новое состояние доски (кортеж BoardState)
 */
export function applyMove(board: BoardState, index: number, player: Player): BoardState {
  if (index < 0 || index > 8) {
    throw new Error('Invalid move: index out of range');
  }
  if (board[index] !== null) {
    throw new Error('Invalid move: cell is already occupied');
  }
  const next = [...board] as BoardState;
  next[index] = player;
  return next;
}

/**
 * FR-08: Возвращает символ следующего игрока.
 * Используется редьюсером и другими модулями вместо inline-логики (DRY).
 *
 * @param current - Текущий игрок
 * @returns Следующий игрок
 */
export function getNextPlayer(current: Player): Player {
  return current === 'X' ? 'O' : 'X';
}

/**
 * Вспомогательная функция: проверяет, является ли значение клетки символом игрока.
 * Используется в других модулях для type narrowing.
 *
 * @param value - Значение клетки
 * @returns true, если клетка занята
 */
export function isCellOccupied(value: CellValue): value is Player {
  return value !== null;
}

/**
 * Вычисляет текущий статус игры после хода.
 * Удобная обёртка над checkWinner с автоматическим переключением игрока.
 * Используется в gameReducer для определения следующего состояния.
 *
 * @param board - Текущее состояние доски после хода
 * @param playerWhoJustMoved - Игрок, который только что сделал ход
 * @returns Статус игры
 */
export function computeGameStatus(board: BoardState, playerWhoJustMoved: Player): GameStatus {
  const nextPlayer = getNextPlayer(playerWhoJustMoved);
  return checkWinner(board, nextPlayer);
}

/**
 * Вспомогательная функция: возвращает символ противника.
 * Псевдоним для getNextPlayer — используется в aiPlayer для ясности намерений.
 *
 * @param player - Текущий игрок
 * @returns Противник
 */
export function getOpponent(player: Player): Player {
  return getNextPlayer(player);
}