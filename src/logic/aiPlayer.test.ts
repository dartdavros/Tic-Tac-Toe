// Unit-тесты для модуля aiPlayer (алгоритм minimax).
// Покрытие ≥ 90% согласно конституции проекта (NFR-02).
// ADR-008: тест располагается рядом с тестируемым файлом (co-location).

import { describe, it, expect } from 'vitest';
import { getBestMove, minimax } from './aiPlayer';
import type { BoardState } from '../types';

const EMPTY_BOARD: BoardState = [null, null, null, null, null, null, null, null, null];

// ─── getBestMove ────────────────────────────────────────────────────────────

describe('getBestMove', () => {
  it('выбрасывает ошибку при полностью заполненной доске без победителя', () => {
    // Ничья — доска полна, победителя нет → 'No available moves'
    const board: BoardState = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
    expect(() => getBestMove(board, 'X')).toThrow('No available moves');
  });

  it('выбрасывает ошибку если на доске уже есть победитель', () => {
    // X победил по первой строке
    const board: BoardState = ['X', 'X', 'X', 'O', 'O', null, null, null, null];
    expect(() => getBestMove(board, 'O')).toThrow('Game is already over');
  });

  it('проверка победителя выполняется раньше проверки заполненности', () => {
    // Доска заполнена, но X побеждает по диагонали [0,4,8] — ошибка 'Game is already over'
    const board: BoardState = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'O', 'X'];
    expect(() => getBestMove(board, 'O')).toThrow('Game is already over');
  });

  it('выполняется менее чем за 50 мс на пустой доске (худший случай)', () => {
    const start = performance.now();
    getBestMove(EMPTY_BOARD, 'X');
    expect(performance.now() - start).toBeLessThan(50);
  });

  it('детерминирован: при одинаковом состоянии всегда возвращает один ход', () => {
    const board: BoardState = ['X', null, null, null, 'O', null, null, null, null];
    const move1 = getBestMove(board, 'X');
    const move2 = getBestMove(board, 'X');
    expect(move1).toBe(move2);
  });

  it('выбирает победный ход для ИИ — X побеждает ходом в клетку 2', () => {
    // X: 0, 1 → ход в 2 = победа; O: 3, 4 → ход в 5 = блокировка O
    // ИИ должен предпочесть победу блокировке
    const board: BoardState = ['X', 'X', null, 'O', 'O', null, null, null, null];
    const move = getBestMove(board, 'X');
    expect(move).toBe(2);
  });

  it('блокирует победный ход противника когда нет собственного победного хода', () => {
    // O: 0, 1 → ход в 2 = победа O; X должен заблокировать
    const board: BoardState = ['O', 'O', null, 'X', null, null, null, null, null];
    const move = getBestMove(board, 'X');
    expect(move).toBe(2);
  });

  it('выбирает центр на пустой доске (оптимальная стратегия minimax)', () => {
    // Центр (индекс 4) — оптимальный первый ход
    const move = getBestMove(EMPTY_BOARD, 'X');
    expect(move).toBe(4);
  });

  it('возвращает индекс в диапазоне [0..8]', () => {
    const board: BoardState = ['X', 'O', null, null, 'X', null, null, null, 'O'];
    const move = getBestMove(board, 'X');
    expect(move).toBeGreaterThanOrEqual(0);
    expect(move).toBeLessThanOrEqual(8);
  });

  it('возвращает только свободную клетку', () => {
    const board: BoardState = ['X', 'O', null, null, 'X', null, null, null, 'O'];
    const move = getBestMove(board, 'X');
    expect(board[move]).toBeNull();
  });

  it('выбирает единственный доступный ход', () => {
    // Осталась одна свободная клетка — индекс 8 (ничья, победителя нет)
    const board: BoardState = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', null];
    const move = getBestMove(board, 'X');
    expect(move).toBe(8);
  });

  it('ИИ за O выбирает победный ход в клетку 5', () => {
    // O: 3, 4 → ход в 5 = победа O
    const board: BoardState = ['X', 'X', null, 'O', 'O', null, null, null, null];
    const move = getBestMove(board, 'O');
    expect(move).toBe(5);
  });

  it('при нескольких равнозначных ходах выбирает первый по индексу', () => {
    // На пустой доске центр (4) — оптимальный ход для любого игрока
    const move = getBestMove(EMPTY_BOARD, 'O');
    expect(move).toBe(4);
  });

  it('ИИ за X блокирует O по столбцу', () => {
    // O: 0, 3 → ход в 6 = победа O; X должен заблокировать клетку 6
    // X стоит на 1 и 4 — нет собственного победного хода по столбцу
    const board: BoardState = ['O', 'X', null, 'O', 'X', null, null, null, null];
    const move = getBestMove(board, 'X');
    expect(move).toBe(6);
  });

  it('ИИ за X выбирает победу по диагонали', () => {
    // X: 0, 4 → ход в 8 = победа по главной диагонали
    const board: BoardState = ['X', 'O', null, null, 'X', 'O', null, null, null];
    const move = getBestMove(board, 'X');
    expect(move).toBe(8);
  });
});

// ─── minimax ─────────────────────────────────────────────────────────────────

describe('minimax', () => {
  it('возвращает +10 при победе ИИ (X) на текущей доске', () => {
    // X уже победил — minimax должен вернуть +10
    const board: BoardState = ['X', 'X', 'X', 'O', 'O', null, null, null, null];
    // isMaximizing=false: ход O, но победа уже есть → терминальное состояние
    const score = minimax(board, 'X', 'O', false);
    expect(score).toBe(10);
  });

  it('возвращает -10 при победе противника (O) на текущей доске', () => {
    // O уже победил — minimax для ИИ=X должен вернуть -10
    const board: BoardState = ['O', 'O', 'O', 'X', 'X', null, null, null, null];
    const score = minimax(board, 'X', 'X', true);
    expect(score).toBe(-10);
  });

  it('возвращает 0 при ничьей', () => {
    // Ничья — все клетки заняты, победителя нет
    const board: BoardState = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
    const score = minimax(board, 'X', 'X', true);
    expect(score).toBe(0);
  });

  it('возвращает положительный счёт для выигрышной позиции ИИ', () => {
    // X может выиграть — счёт должен быть положительным
    const board: BoardState = ['X', 'X', null, 'O', 'O', null, null, null, null];
    // Ход X (максимизирующий)
    const score = minimax(board, 'X', 'X', true);
    expect(score).toBeGreaterThan(0);
  });

  it('возвращает отрицательный счёт для проигрышной позиции ИИ', () => {
    // O может выиграть — счёт для ИИ=X должен быть отрицательным
    const board: BoardState = ['O', 'O', null, 'X', null, null, null, null, null];
    // Ход O (минимизирующий для X)
    const score = minimax(board, 'X', 'O', false);
    expect(score).toBeLessThan(0);
  });

  it('возвращает 0 для пустой доски при игре двух оптимальных игроков', () => {
    // При оптимальной игре обоих — ничья, счёт 0
    const score = minimax(EMPTY_BOARD, 'X', 'X', true);
    expect(score).toBe(0);
  });

  it('экспортируется как именованный экспорт', () => {
    // Проверяем, что minimax доступен для прямого импорта
    expect(typeof minimax).toBe('function');
  });
});