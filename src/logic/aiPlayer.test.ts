// Unit-тесты для модуля aiPlayer (алгоритм minimax).
// Покрытие ≥ 90% согласно конституции проекта.
// ADR-008: тест располагается рядом с тестируемым файлом (co-location).

import { describe, it, expect } from 'vitest';
import { getBestMove } from './aiPlayer';
import type { BoardState } from '../types';

const EMPTY: BoardState = [null, null, null, null, null, null, null, null, null];

describe('getBestMove', () => {
  it('выбрасывает ошибку при полностью заполненной доске', () => {
    const board: BoardState = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
    expect(() => getBestMove(board, 'X')).toThrow('No available moves');
  });

  it('выполняется менее чем за 50 мс на пустой доске (худший случай)', () => {
    const start = performance.now();
    getBestMove(EMPTY, 'X');
    expect(performance.now() - start).toBeLessThan(50);
  });

  it('детерминирован: при одинаковом состоянии всегда возвращает один ход', () => {
    const board: BoardState = ['X', null, null, null, 'O', null, null, null, null];
    const move1 = getBestMove(board, 'X');
    const move2 = getBestMove(board, 'X');
    expect(move1).toBe(move2);
  });

  it('выбирает победный ход для ИИ (X побеждает в следующем ходу)', () => {
    // X занимает 0 и 1, следующий ход в 2 — победа
    const board: BoardState = ['X', 'X', null, 'O', 'O', null, null, null, null];
    // ИИ играет за X и должен выбрать клетку 2 (победный ход),
    // а не клетку 5 (блокировка O)
    const move = getBestMove(board, 'X');
    expect(move).toBe(2);
  });

  it('блокирует победный ход противника', () => {
    // O занимает 0 и 1, X должен заблокировать клетку 2
    const board: BoardState = ['O', 'O', null, 'X', null, null, null, null, null];
    const move = getBestMove(board, 'X');
    expect(move).toBe(2);
  });

  it('выбирает центр на пустой доске (оптимальная стратегия)', () => {
    // Центр (индекс 4) — оптимальный первый ход для minimax
    const move = getBestMove(EMPTY, 'X');
    expect(move).toBe(4);
  });

  it('возвращает индекс в диапазоне [0..8]', () => {
    const board: BoardState = ['X', 'O', null, null, 'X', null, null, null, 'O'];
    const move = getBestMove(board, 'X');
    expect(move).toBeGreaterThanOrEqual(0);
    expect(move).toBeLessThanOrEqual(8);
  });

  it('возвращает свободную клетку', () => {
    const board: BoardState = ['X', 'O', null, null, 'X', null, null, null, 'O'];
    const move = getBestMove(board, 'X');
    expect(board[move]).toBeNull();
  });

  it('выбирает единственный доступный ход', () => {
    // Осталась одна свободная клетка — индекс 8
    const board: BoardState = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', null];
    const move = getBestMove(board, 'X');
    expect(move).toBe(8);
  });

  it('ИИ за O выбирает победный ход', () => {
    // O занимает 3 и 4, следующий ход в 5 — победа O
    const board: BoardState = ['X', 'X', null, 'O', 'O', null, null, null, null];
    const move = getBestMove(board, 'O');
    expect(move).toBe(5);
  });
});