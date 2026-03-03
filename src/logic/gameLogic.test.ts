// Unit-тесты для модуля gameLogic.
// Покрытие ≥ 90% согласно конституции проекта.
// ADR-008: тест располагается рядом с тестируемым файлом (co-location).

import { describe, it, expect } from 'vitest';
import {
  checkWinner,
  isBoardFull,
  getAvailableMoves,
  applyMove,
  computeGameStatus,
  getOpponent,
  isCellOccupied,
} from './gameLogic';
import type { BoardState } from '../types';

// Вспомогательная пустая доска для тестов
const EMPTY: BoardState = [null, null, null, null, null, null, null, null, null];

describe('checkWinner', () => {
  it('возвращает null на пустой доске', () => {
    expect(checkWinner(EMPTY)).toBeNull();
  });

  it('определяет победу по первой строке (X)', () => {
    const board: BoardState = ['X', 'X', 'X', null, null, null, null, null, null];
    const result = checkWinner(board);
    expect(result).not.toBeNull();
    expect(result?.winner).toBe('X');
    expect(result?.winLine).toEqual([0, 1, 2]);
  });

  it('определяет победу по второй строке (O)', () => {
    const board: BoardState = [null, null, null, 'O', 'O', 'O', null, null, null];
    const result = checkWinner(board);
    expect(result?.winner).toBe('O');
    expect(result?.winLine).toEqual([3, 4, 5]);
  });

  it('определяет победу по третьей строке (X)', () => {
    const board: BoardState = [null, null, null, null, null, null, 'X', 'X', 'X'];
    const result = checkWinner(board);
    expect(result?.winner).toBe('X');
    expect(result?.winLine).toEqual([6, 7, 8]);
  });

  it('определяет победу по первому столбцу (O)', () => {
    const board: BoardState = ['O', null, null, 'O', null, null, 'O', null, null];
    const result = checkWinner(board);
    expect(result?.winner).toBe('O');
    expect(result?.winLine).toEqual([0, 3, 6]);
  });

  it('определяет победу по второму столбцу (X)', () => {
    const board: BoardState = [null, 'X', null, null, 'X', null, null, 'X', null];
    const result = checkWinner(board);
    expect(result?.winner).toBe('X');
    expect(result?.winLine).toEqual([1, 4, 7]);
  });

  it('определяет победу по третьему столбцу (O)', () => {
    const board: BoardState = [null, null, 'O', null, null, 'O', null, null, 'O'];
    const result = checkWinner(board);
    expect(result?.winner).toBe('O');
    expect(result?.winLine).toEqual([2, 5, 8]);
  });

  it('определяет победу по главной диагонали (X)', () => {
    const board: BoardState = ['X', null, null, null, 'X', null, null, null, 'X'];
    const result = checkWinner(board);
    expect(result?.winner).toBe('X');
    expect(result?.winLine).toEqual([0, 4, 8]);
  });

  it('определяет победу по побочной диагонали (O)', () => {
    const board: BoardState = [null, null, 'O', null, 'O', null, 'O', null, null];
    const result = checkWinner(board);
    expect(result?.winner).toBe('O');
    expect(result?.winLine).toEqual([2, 4, 6]);
  });

  it('возвращает null при незавершённой игре', () => {
    const board: BoardState = ['X', 'O', 'X', 'O', 'X', null, null, null, null];
    expect(checkWinner(board)).toBeNull();
  });

  it('возвращает null при ничьей (все клетки заняты, победителя нет)', () => {
    const board: BoardState = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
    expect(checkWinner(board)).toBeNull();
  });
});

describe('isBoardFull', () => {
  it('возвращает false для пустой доски', () => {
    expect(isBoardFull(EMPTY)).toBe(false);
  });

  it('возвращает false для частично заполненной доски', () => {
    const board: BoardState = ['X', 'O', null, null, null, null, null, null, null];
    expect(isBoardFull(board)).toBe(false);
  });

  it('возвращает true для полностью заполненной доски', () => {
    const board: BoardState = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
    expect(isBoardFull(board)).toBe(true);
  });

  it('возвращает false если хотя бы одна клетка пуста', () => {
    const board: BoardState = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', null];
    expect(isBoardFull(board)).toBe(false);
  });
});

describe('getAvailableMoves', () => {
  it('возвращает все 9 индексов для пустой доски', () => {
    expect(getAvailableMoves(EMPTY)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('возвращает пустой массив для полной доски', () => {
    const board: BoardState = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
    expect(getAvailableMoves(board)).toEqual([]);
  });

  it('возвращает только свободные клетки', () => {
    const board: BoardState = ['X', null, 'O', null, 'X', null, null, null, 'O'];
    expect(getAvailableMoves(board)).toEqual([1, 3, 5, 6, 7]);
  });

  it('возвращает один индекс если осталась одна клетка', () => {
    const board: BoardState = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', null];
    expect(getAvailableMoves(board)).toEqual([8]);
  });
});

describe('applyMove', () => {
  it('применяет ход X на пустую доску', () => {
    const result = applyMove(EMPTY, 4, 'X');
    expect(result[4]).toBe('X');
  });

  it('применяет ход O на доску', () => {
    const result = applyMove(EMPTY, 0, 'O');
    expect(result[0]).toBe('O');
  });

  it('не мутирует исходную доску', () => {
    const original: BoardState = [...EMPTY] as BoardState;
    applyMove(original, 4, 'X');
    expect(original[4]).toBeNull();
  });

  it('остальные клетки остаются неизменными', () => {
    const board: BoardState = ['X', null, null, null, null, null, null, null, null];
    const result = applyMove(board, 1, 'O');
    expect(result[0]).toBe('X');
    expect(result[1]).toBe('O');
    for (let i = 2; i < 9; i++) {
      expect(result[i]).toBeNull();
    }
  });
});

describe('computeGameStatus', () => {
  it('возвращает статус победы после выигрышного хода X', () => {
    const board: BoardState = ['X', 'X', 'X', 'O', 'O', null, null, null, null];
    const status = computeGameStatus(board, 'X');
    expect(status.kind).toBe('won');
    if (status.kind === 'won') {
      expect(status.winner).toBe('X');
      expect(status.winLine).toEqual([0, 1, 2]);
    }
  });

  it('возвращает статус ничьей при заполненной доске без победителя', () => {
    const board: BoardState = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
    const status = computeGameStatus(board, 'X');
    expect(status.kind).toBe('draw');
  });

  it('возвращает статус playing и передаёт ход следующему игроку', () => {
    const board: BoardState = ['X', null, null, null, null, null, null, null, null];
    const status = computeGameStatus(board, 'X');
    expect(status.kind).toBe('playing');
    if (status.kind === 'playing') {
      expect(status.currentPlayer).toBe('O');
    }
  });

  it('передаёт ход X после хода O', () => {
    const board: BoardState = ['X', 'O', null, null, null, null, null, null, null];
    const status = computeGameStatus(board, 'O');
    expect(status.kind).toBe('playing');
    if (status.kind === 'playing') {
      expect(status.currentPlayer).toBe('X');
    }
  });

  it('возвращает победу O', () => {
    const board: BoardState = ['X', 'X', null, 'O', 'O', 'O', null, null, null];
    const status = computeGameStatus(board, 'O');
    expect(status.kind).toBe('won');
    if (status.kind === 'won') {
      expect(status.winner).toBe('O');
    }
  });
});

describe('getOpponent', () => {
  it('возвращает O для X', () => {
    expect(getOpponent('X')).toBe('O');
  });

  it('возвращает X для O', () => {
    expect(getOpponent('O')).toBe('X');
  });
});

describe('isCellOccupied', () => {
  it('возвращает false для null', () => {
    expect(isCellOccupied(null)).toBe(false);
  });

  it('возвращает true для X', () => {
    expect(isCellOccupied('X')).toBe(true);
  });

  it('возвращает true для O', () => {
    expect(isCellOccupied('O')).toBe(true);
  });
});