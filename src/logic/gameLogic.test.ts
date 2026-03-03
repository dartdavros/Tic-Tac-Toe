// Unit-тесты для модуля gameLogic.
// Покрытие ≥ 90% согласно конституции проекта (NFR-01).
// ADR-008: тест располагается рядом с тестируемым файлом (co-location).

import { describe, it, expect } from 'vitest';
import {
  WIN_LINES,
  checkWinner,
  isBoardFull,
  getAvailableMoves,
  applyMove,
  getNextPlayer,
  computeGameStatus,
  getOpponent,
  isCellOccupied,
} from './gameLogic';
import type { BoardState } from '../types';

// Вспомогательная пустая доска для тестов
const EMPTY: BoardState = [null, null, null, null, null, null, null, null, null];

// ─── WIN_LINES ───────────────────────────────────────────────────────────────

describe('WIN_LINES', () => {
  it('содержит ровно 8 выигрышных комбинаций (FR-02)', () => {
    expect(WIN_LINES).toHaveLength(8);
  });

  it('содержит 3 горизонтали', () => {
    const horizontals = WIN_LINES.filter(
      ([a, b, c]) =>
        Math.floor(a / 3) === Math.floor(b / 3) &&
        Math.floor(b / 3) === Math.floor(c / 3),
    );
    expect(horizontals).toHaveLength(3);
  });

  it('содержит 3 вертикали', () => {
    const verticals = WIN_LINES.filter(
      ([a, b, c]) => a % 3 === b % 3 && b % 3 === c % 3,
    );
    expect(verticals).toHaveLength(3);
  });

  it('содержит главную диагональ [0, 4, 8]', () => {
    expect(WIN_LINES).toContainEqual([0, 4, 8]);
  });

  it('содержит побочную диагональ [2, 4, 6]', () => {
    expect(WIN_LINES).toContainEqual([2, 4, 6]);
  });
});

// ─── checkWinner ─────────────────────────────────────────────────────────────

describe('checkWinner', () => {
  it('возвращает playing на пустой доске', () => {
    const result = checkWinner(EMPTY, 'X');
    expect(result.kind).toBe('playing');
    if (result.kind === 'playing') {
      expect(result.currentPlayer).toBe('X');
    }
  });

  it('поле currentPlayer в статусе playing совпадает с переданным аргументом', () => {
    const board: BoardState = ['X', 'O', null, null, null, null, null, null, null];
    const result = checkWinner(board, 'O');
    expect(result.kind).toBe('playing');
    if (result.kind === 'playing') {
      expect(result.currentPlayer).toBe('O');
    }
  });

  // Победа по горизонталям

  it('определяет победу X по первой строке [0,1,2]', () => {
    const board: BoardState = ['X', 'X', 'X', null, null, null, null, null, null];
    const result = checkWinner(board, 'O');
    expect(result.kind).toBe('won');
    if (result.kind === 'won') {
      expect(result.winner).toBe('X');
      expect(result.winLine).toEqual([0, 1, 2]);
    }
  });

  it('определяет победу O по второй строке [3,4,5]', () => {
    const board: BoardState = [null, null, null, 'O', 'O', 'O', null, null, null];
    const result = checkWinner(board, 'X');
    expect(result.kind).toBe('won');
    if (result.kind === 'won') {
      expect(result.winner).toBe('O');
      expect(result.winLine).toEqual([3, 4, 5]);
    }
  });

  it('определяет победу X по третьей строке [6,7,8]', () => {
    const board: BoardState = [null, null, null, null, null, null, 'X', 'X', 'X'];
    const result = checkWinner(board, 'O');
    expect(result.kind).toBe('won');
    if (result.kind === 'won') {
      expect(result.winner).toBe('X');
      expect(result.winLine).toEqual([6, 7, 8]);
    }
  });

  // Победа по вертикалям

  it('определяет победу O по первому столбцу [0,3,6]', () => {
    const board: BoardState = ['O', null, null, 'O', null, null, 'O', null, null];
    const result = checkWinner(board, 'X');
    expect(result.kind).toBe('won');
    if (result.kind === 'won') {
      expect(result.winner).toBe('O');
      expect(result.winLine).toEqual([0, 3, 6]);
    }
  });

  it('определяет победу X по второму столбцу [1,4,7]', () => {
    const board: BoardState = [null, 'X', null, null, 'X', null, null, 'X', null];
    const result = checkWinner(board, 'O');
    expect(result.kind).toBe('won');
    if (result.kind === 'won') {
      expect(result.winner).toBe('X');
      expect(result.winLine).toEqual([1, 4, 7]);
    }
  });

  it('определяет победу O по третьему столбцу [2,5,8]', () => {
    const board: BoardState = [null, null, 'O', null, null, 'O', null, null, 'O'];
    const result = checkWinner(board, 'X');
    expect(result.kind).toBe('won');
    if (result.kind === 'won') {
      expect(result.winner).toBe('O');
      expect(result.winLine).toEqual([2, 5, 8]);
    }
  });

  // Победа по диагоналям

  it('определяет победу X по главной диагонали [0,4,8]', () => {
    const board: BoardState = ['X', null, null, null, 'X', null, null, null, 'X'];
    const result = checkWinner(board, 'O');
    expect(result.kind).toBe('won');
    if (result.kind === 'won') {
      expect(result.winner).toBe('X');
      expect(result.winLine).toEqual([0, 4, 8]);
    }
  });

  it('определяет победу O по побочной диагонали [2,4,6]', () => {
    const board: BoardState = [null, null, 'O', null, 'O', null, 'O', null, null];
    const result = checkWinner(board, 'X');
    expect(result.kind).toBe('won');
    if (result.kind === 'won') {
      expect(result.winner).toBe('O');
      expect(result.winLine).toEqual([2, 4, 6]);
    }
  });

  // Ничья

  it('возвращает draw при заполненной доске без победителя', () => {
    // X O X / X O O / O X X — ничья
    const board: BoardState = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
    const result = checkWinner(board, 'X');
    expect(result.kind).toBe('draw');
  });

  // Победа имеет приоритет над ничьёй

  it('возвращает won если доска полна и есть победитель (победа > ничья)', () => {
    // X O X / O X O / O O X — X побеждает по диагонали [0,4,8], доска полна
    const board: BoardState = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'O', 'X'];
    const result = checkWinner(board, 'O');
    expect(result.kind).toBe('won');
    if (result.kind === 'won') {
      expect(result.winner).toBe('X');
    }
  });

  // winner — игрок, чьи символы образовали линию

  it('winner совпадает с игроком, чьи символы образовали линию, а не с currentPlayer', () => {
    // O победил, но currentPlayer передан как X
    const board: BoardState = ['O', 'O', 'O', 'X', 'X', null, null, null, null];
    const result = checkWinner(board, 'X');
    expect(result.kind).toBe('won');
    if (result.kind === 'won') {
      expect(result.winner).toBe('O');
    }
  });

  it('возвращает playing при незавершённой игре', () => {
    const board: BoardState = ['X', 'O', 'X', 'O', 'X', null, null, null, null];
    const result = checkWinner(board, 'O');
    expect(result.kind).toBe('playing');
  });
});

// ─── isBoardFull ─────────────────────────────────────────────────────────────

describe('isBoardFull', () => {
  it('возвращает false для пустой доски', () => {
    expect(isBoardFull(EMPTY)).toBe(false);
  });

  it('возвращает false для частично заполненной доски', () => {
    const board: BoardState = ['X', 'O', null, null, null, null, null, null, null];
    expect(isBoardFull(board)).toBe(false);
  });

  it('возвращает false если хотя бы одна клетка пуста', () => {
    const board: BoardState = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', null];
    expect(isBoardFull(board)).toBe(false);
  });

  it('возвращает true для полностью заполненной доски', () => {
    const board: BoardState = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
    expect(isBoardFull(board)).toBe(true);
  });
});

// ─── getAvailableMoves ───────────────────────────────────────────────────────

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

  it('возвращает индексы в строго возрастающем порядке (FR-04)', () => {
    const board: BoardState = [null, 'X', null, 'O', null, 'X', null, 'O', null];
    const moves = getAvailableMoves(board);
    for (let i = 1; i < moves.length; i++) {
      expect(moves[i]).toBeGreaterThan(moves[i - 1]!);
    }
  });
});

// ─── applyMove ───────────────────────────────────────────────────────────────

describe('applyMove', () => {
  it('применяет ход X на пустую доску', () => {
    const result = applyMove(EMPTY, 4, 'X');
    expect(result[4]).toBe('X');
  });

  it('применяет ход O на доску', () => {
    const result = applyMove(EMPTY, 0, 'O');
    expect(result[0]).toBe('O');
  });

  it('не мутирует исходную доску (NFR-03)', () => {
    const original: BoardState = [...EMPTY] as BoardState;
    applyMove(original, 4, 'X');
    expect(original[4]).toBeNull();
  });

  it('возвращает новый объект BoardState (иммутабельность)', () => {
    const result = applyMove(EMPTY, 0, 'X');
    expect(result).not.toBe(EMPTY);
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

  it('выбрасывает Error с точным текстом при занятой клетке (FR-05)', () => {
    const board: BoardState = ['X', null, null, null, null, null, null, null, null];
    expect(() => applyMove(board, 0, 'O')).toThrow(
      'Invalid move: cell is already occupied',
    );
  });

  it('выбрасывает Error с точным текстом при индексе < 0 (FR-05)', () => {
    expect(() => applyMove(EMPTY, -1, 'X')).toThrow(
      'Invalid move: index out of range',
    );
  });

  it('выбрасывает Error с точным текстом при индексе > 8 (FR-05)', () => {
    expect(() => applyMove(EMPTY, 9, 'X')).toThrow(
      'Invalid move: index out of range',
    );
  });

  it('выбрасывает Error при индексе = -100', () => {
    expect(() => applyMove(EMPTY, -100, 'O')).toThrow(
      'Invalid move: index out of range',
    );
  });

  it('выбрасывает Error при индексе = 100', () => {
    expect(() => applyMove(EMPTY, 100, 'X')).toThrow(
      'Invalid move: index out of range',
    );
  });

  it('проверка индекса выполняется раньше проверки занятости', () => {
    // Индекс -1 невалиден — должна быть ошибка index out of range, не occupied
    expect(() => applyMove(EMPTY, -1, 'X')).toThrow(
      'Invalid move: index out of range',
    );
  });
});

// ─── getNextPlayer ───────────────────────────────────────────────────────────

describe('getNextPlayer', () => {
  it('возвращает O для X (FR-08)', () => {
    expect(getNextPlayer('X')).toBe('O');
  });

  it('возвращает X для O (FR-08)', () => {
    expect(getNextPlayer('O')).toBe('X');
  });
});

// ─── computeGameStatus ───────────────────────────────────────────────────────

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

  it('передаёт ход следующему игроку O после хода X', () => {
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

// ─── getOpponent ─────────────────────────────────────────────────────────────

describe('getOpponent', () => {
  it('возвращает O для X', () => {
    expect(getOpponent('X')).toBe('O');
  });

  it('возвращает X для O', () => {
    expect(getOpponent('O')).toBe('X');
  });
});

// ─── isCellOccupied ──────────────────────────────────────────────────────────

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