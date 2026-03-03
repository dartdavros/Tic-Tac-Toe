// Unit-тесты для gameReducer.
// Проверяет все переходы GameAction, валидацию ходов и защитное поведение.
// ADR-008: тест располагается рядом с тестируемым файлом (co-location).

import { describe, it, expect } from 'vitest';
import { gameReducer, INITIAL_STATE } from './gameReducer';
import type { GameState, BoardState } from '../types';

// Вспомогательная пустая доска
const EMPTY: BoardState = [null, null, null, null, null, null, null, null, null];

describe('gameReducer — START_GAME', () => {
  it('переходит на экран game в режиме PvP', () => {
    const state = gameReducer(INITIAL_STATE, {
      type: 'START_GAME',
      payload: { mode: 'pvp' },
    });
    expect(state.screen).toBe('game');
    expect(state.settings.mode).toBe('pvp');
    expect(state.board).toEqual(EMPTY);
    expect(state.status).toEqual({ kind: 'playing', currentPlayer: 'X' });
  });

  it('переходит на экран game в режиме PvAI', () => {
    const state = gameReducer(INITIAL_STATE, {
      type: 'START_GAME',
      payload: { mode: 'pvai', humanPlayer: 'X' },
    });
    expect(state.screen).toBe('game');
    expect(state.settings.mode).toBe('pvai');
  });

  it('сбрасывает доску при повторном START_GAME', () => {
    const midGame: GameState = {
      screen: 'game',
      board: ['X', 'O', null, null, null, null, null, null, null],
      status: { kind: 'playing', currentPlayer: 'X' },
      settings: { mode: 'pvp' },
    };
    const state = gameReducer(midGame, {
      type: 'START_GAME',
      payload: { mode: 'pvp' },
    });
    expect(state.board).toEqual(EMPTY);
  });
});

describe('gameReducer — MAKE_MOVE (PvP)', () => {
  const gameState: GameState = {
    screen: 'game',
    board: EMPTY,
    status: { kind: 'playing', currentPlayer: 'X' },
    settings: { mode: 'pvp' },
  };

  it('применяет ход X в клетку 0', () => {
    const state = gameReducer(gameState, { type: 'MAKE_MOVE', payload: { index: 0 } });
    expect(state.board[0]).toBe('X');
  });

  it('передаёт ход следующему игроку (O) после хода X', () => {
    const state = gameReducer(gameState, { type: 'MAKE_MOVE', payload: { index: 0 } });
    expect(state.status.kind).toBe('playing');
    if (state.status.kind === 'playing') {
      expect(state.status.currentPlayer).toBe('O');
    }
  });

  it('игнорирует ход в занятую клетку', () => {
    const board: BoardState = ['X', null, null, null, null, null, null, null, null];
    const state1: GameState = { ...gameState, board, status: { kind: 'playing', currentPlayer: 'O' } };
    const state2 = gameReducer(state1, { type: 'MAKE_MOVE', payload: { index: 0 } });
    expect(state2).toBe(state1);
  });

  it('игнорирует ход с невалидным индексом (< 0)', () => {
    const state = gameReducer(gameState, { type: 'MAKE_MOVE', payload: { index: -1 } });
    expect(state).toBe(gameState);
  });

  it('игнорирует ход с невалидным индексом (> 8)', () => {
    const state = gameReducer(gameState, { type: 'MAKE_MOVE', payload: { index: 9 } });
    expect(state).toBe(gameState);
  });

  it('игнорирует ход когда экран не game', () => {
    const menuState: GameState = { ...INITIAL_STATE };
    const state = gameReducer(menuState, { type: 'MAKE_MOVE', payload: { index: 0 } });
    expect(state).toBe(menuState);
  });

  it('игнорирует ход когда партия завершена', () => {
    const wonState: GameState = {
      screen: 'result',
      board: ['X', 'X', 'X', 'O', 'O', null, null, null, null],
      status: { kind: 'won', winner: 'X', winLine: [0, 1, 2] },
      settings: { mode: 'pvp' },
    };
    const state = gameReducer(wonState, { type: 'MAKE_MOVE', payload: { index: 5 } });
    expect(state).toBe(wonState);
  });

  it('переходит на экран result при победе X', () => {
    // X занимает 0, 1 — ход в 2 = победа
    const board: BoardState = ['X', 'X', null, 'O', 'O', null, null, null, null];
    const state1: GameState = {
      screen: 'game',
      board,
      status: { kind: 'playing', currentPlayer: 'X' },
      settings: { mode: 'pvp' },
    };
    const state2 = gameReducer(state1, { type: 'MAKE_MOVE', payload: { index: 2 } });
    expect(state2.screen).toBe('result');
    expect(state2.status.kind).toBe('won');
    if (state2.status.kind === 'won') {
      expect(state2.status.winner).toBe('X');
    }
  });

  it('переходит на экран result при ничьей', () => {
    // Предпоследний ход — после него ничья
    const board: BoardState = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', null];
    const state1: GameState = {
      screen: 'game',
      board,
      status: { kind: 'playing', currentPlayer: 'X' },
      settings: { mode: 'pvp' },
    };
    const state2 = gameReducer(state1, { type: 'MAKE_MOVE', payload: { index: 8 } });
    expect(state2.screen).toBe('result');
    expect(state2.status.kind).toBe('draw');
  });
});

describe('gameReducer — MAKE_MOVE (PvAI)', () => {
  it('после хода человека ИИ делает ответный ход', () => {
    const state1: GameState = {
      screen: 'game',
      board: EMPTY,
      status: { kind: 'playing', currentPlayer: 'X' },
      settings: { mode: 'pvai', humanPlayer: 'X' },
    };
    const state2 = gameReducer(state1, { type: 'MAKE_MOVE', payload: { index: 0 } });
    // После хода X (человек) и O (ИИ) — на доске должно быть 2 занятых клетки
    const occupied = state2.board.filter((c) => c !== null).length;
    expect(occupied).toBe(2);
  });

  it('ИИ не делает ход если партия завершена после хода человека', () => {
    // X побеждает ходом в клетку 2
    const board: BoardState = ['X', 'X', null, 'O', 'O', null, null, null, null];
    const state1: GameState = {
      screen: 'game',
      board,
      status: { kind: 'playing', currentPlayer: 'X' },
      settings: { mode: 'pvai', humanPlayer: 'X' },
    };
    const state2 = gameReducer(state1, { type: 'MAKE_MOVE', payload: { index: 2 } });
    expect(state2.screen).toBe('result');
    expect(state2.status.kind).toBe('won');
    if (state2.status.kind === 'won') {
      expect(state2.status.winner).toBe('X');
    }
  });
});

describe('gameReducer — RESTART', () => {
  it('возвращает начальное состояние (экран menu)', () => {
    const wonState: GameState = {
      screen: 'result',
      board: ['X', 'X', 'X', 'O', 'O', null, null, null, null],
      status: { kind: 'won', winner: 'X', winLine: [0, 1, 2] },
      settings: { mode: 'pvp' },
    };
    const state = gameReducer(wonState, { type: 'RESTART' });
    expect(state.screen).toBe('menu');
    expect(state.board).toEqual(EMPTY);
  });
});

describe('gameReducer — QUIT_TO_MENU', () => {
  it('возвращает начальное состояние из экрана game', () => {
    const gameState: GameState = {
      screen: 'game',
      board: ['X', null, null, null, null, null, null, null, null],
      status: { kind: 'playing', currentPlayer: 'O' },
      settings: { mode: 'pvp' },
    };
    const state = gameReducer(gameState, { type: 'QUIT_TO_MENU' });
    expect(state.screen).toBe('menu');
  });

  it('возвращает начальное состояние из экрана result', () => {
    const resultState: GameState = {
      screen: 'result',
      board: ['X', 'X', 'X', 'O', 'O', null, null, null, null],
      status: { kind: 'won', winner: 'X', winLine: [0, 1, 2] },
      settings: { mode: 'pvp' },
    };
    const state = gameReducer(resultState, { type: 'QUIT_TO_MENU' });
    expect(state.screen).toBe('menu');
  });
});

describe('gameReducer — защитное поведение', () => {
  it('инвариант: переход menu → result напрямую невозможен', () => {
    // MAKE_MOVE из menu должен игнорироваться
    const state = gameReducer(INITIAL_STATE, { type: 'MAKE_MOVE', payload: { index: 0 } });
    expect(state.screen).toBe('menu');
  });

  it('возвращает текущее состояние при неизвестном действии', () => {
    // Приводим к any для тестирования runtime-защиты
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state = gameReducer(INITIAL_STATE, { type: 'UNKNOWN_ACTION' } as any);
    expect(state).toBe(INITIAL_STATE);
  });
});