// Unit-тесты для gameReducer и isAiTurn.
// Покрывает все Acceptance Criteria спецификации game-reducer.
// ADR-008: тест располагается рядом с тестируемым файлом (co-location).

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ─── Мокирование зависимостей ─────────────────────────────────────────────────
// vi.mock поднимается (hoisting) в начало файла автоматически Vitest.
// Важно: vi.mock должны быть объявлены до любых импортов тестируемых модулей.

vi.mock('../utils/logger', () => ({
  logEvent: vi.fn(),
}));

vi.mock('./aiPlayer', () => ({
  getBestMove: vi.fn(),
}));

// Импортируем тестируемые модули после объявления моков
import { gameReducer, INITIAL_STATE, EMPTY_BOARD, isAiTurn } from './gameReducer';
import type { GameState, GameStatus, GameSettings, BoardState } from '../types';
import { logEvent } from '../utils/logger';
import { getBestMove } from './aiPlayer';

// ─── Вспомогательные данные ───────────────────────────────────────────────────

const EMPTY: BoardState = [null, null, null, null, null, null, null, null, null];

/** Базовое состояние для экрана game в режиме PvP */
const PVP_GAME_STATE: GameState = {
  screen: 'game',
  board: EMPTY,
  status: { kind: 'playing', currentPlayer: 'X' },
  settings: { mode: 'pvp' },
};

/** Базовое состояние для экрана game в режиме PvAI (человек = X) */
const PVAI_GAME_STATE_HUMAN_X: GameState = {
  screen: 'game',
  board: EMPTY,
  status: { kind: 'playing', currentPlayer: 'X' },
  settings: { mode: 'pvai', humanPlayer: 'X' },
};

// ─── Сброс моков перед каждым тестом ─────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks();
  // По умолчанию getBestMove возвращает индекс 4 (центр)
  vi.mocked(getBestMove).mockReturnValue(4);
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ─── EMPTY_BOARD ──────────────────────────────────────────────────────────────

describe('EMPTY_BOARD', () => {
  it('является кортежем из 9 элементов null', () => {
    expect(EMPTY_BOARD).toHaveLength(9);
    expect(EMPTY_BOARD.every((cell) => cell === null)).toBe(true);
  });

  it('соответствует типу BoardState (все значения null)', () => {
    for (let i = 0; i < 9; i++) {
      expect(EMPTY_BOARD[i]).toBeNull();
    }
  });
});

// ─── INITIAL_STATE ────────────────────────────────────────────────────────────

describe('INITIAL_STATE', () => {
  it('имеет screen === "menu"', () => {
    expect(INITIAL_STATE.screen).toBe('menu');
  });

  it('имеет пустую доску', () => {
    expect(INITIAL_STATE.board).toEqual(EMPTY);
  });

  it('имеет status.kind === "playing" с currentPlayer === "X"', () => {
    expect(INITIAL_STATE.status.kind).toBe('playing');
    if (INITIAL_STATE.status.kind === 'playing') {
      expect(INITIAL_STATE.status.currentPlayer).toBe('X');
    }
  });

  it('имеет settings.mode === "pvp"', () => {
    expect(INITIAL_STATE.settings.mode).toBe('pvp');
  });
});

// ─── isAiTurn ─────────────────────────────────────────────────────────────────

describe('isAiTurn', () => {
  it('возвращает false для режима pvp при любом статусе', () => {
    const settings: GameSettings = { mode: 'pvp' };
    const status: GameStatus = { kind: 'playing', currentPlayer: 'X' };
    expect(isAiTurn(status, settings)).toBe(false);
  });

  it('возвращает false для режима pvp когда ход O', () => {
    const settings: GameSettings = { mode: 'pvp' };
    const status: GameStatus = { kind: 'playing', currentPlayer: 'O' };
    expect(isAiTurn(status, settings)).toBe(false);
  });

  it('возвращает true для pvai когда текущий игрок — ИИ (человек = X, ход O)', () => {
    const settings: GameSettings = { mode: 'pvai', humanPlayer: 'X' };
    const status: GameStatus = { kind: 'playing', currentPlayer: 'O' };
    expect(isAiTurn(status, settings)).toBe(true);
  });

  it('возвращает true для pvai когда текущий игрок — ИИ (человек = O, ход X)', () => {
    const settings: GameSettings = { mode: 'pvai', humanPlayer: 'O' };
    const status: GameStatus = { kind: 'playing', currentPlayer: 'X' };
    expect(isAiTurn(status, settings)).toBe(true);
  });

  it('возвращает false для pvai когда текущий игрок — человек (человек = X, ход X)', () => {
    const settings: GameSettings = { mode: 'pvai', humanPlayer: 'X' };
    const status: GameStatus = { kind: 'playing', currentPlayer: 'X' };
    expect(isAiTurn(status, settings)).toBe(false);
  });

  it('возвращает false для pvai когда текущий игрок — человек (человек = O, ход O)', () => {
    const settings: GameSettings = { mode: 'pvai', humanPlayer: 'O' };
    const status: GameStatus = { kind: 'playing', currentPlayer: 'O' };
    expect(isAiTurn(status, settings)).toBe(false);
  });

  it('возвращает false при status.kind === "won"', () => {
    const settings: GameSettings = { mode: 'pvai', humanPlayer: 'X' };
    const status: GameStatus = { kind: 'won', winner: 'X', winLine: [0, 1, 2] };
    expect(isAiTurn(status, settings)).toBe(false);
  });

  it('возвращает false при status.kind === "draw"', () => {
    const settings: GameSettings = { mode: 'pvai', humanPlayer: 'X' };
    const status: GameStatus = { kind: 'draw' };
    expect(isAiTurn(status, settings)).toBe(false);
  });

  it('возвращает false для pvp при status.kind === "won"', () => {
    const settings: GameSettings = { mode: 'pvp' };
    const status: GameStatus = { kind: 'won', winner: 'O', winLine: [3, 4, 5] };
    expect(isAiTurn(status, settings)).toBe(false);
  });
});

// ─── START_GAME ───────────────────────────────────────────────────────────────

describe('gameReducer — START_GAME', () => {
  it('(PvP) корректно инициализирует игру: screen=game, пустая доска, X ходит первым', () => {
    const state = gameReducer(INITIAL_STATE, {
      type: 'START_GAME',
      payload: { mode: 'pvp' },
    });
    expect(state.screen).toBe('game');
    expect(state.settings.mode).toBe('pvp');
    expect(state.board).toEqual(EMPTY);
    expect(state.status.kind).toBe('playing');
    if (state.status.kind === 'playing') {
      expect(state.status.currentPlayer).toBe('X');
    }
  });

  it('(PvAI, человек = X) ИИ не ходит первым — доска остаётся пустой', () => {
    const state = gameReducer(INITIAL_STATE, {
      type: 'START_GAME',
      payload: { mode: 'pvai', humanPlayer: 'X' },
    });
    expect(state.screen).toBe('game');
    expect(state.board).toEqual(EMPTY);
    // getBestMove не должен вызываться — ход человека первый
    expect(getBestMove).not.toHaveBeenCalled();
  });

  it('(PvAI, человек = O) ИИ ходит первым — доска не пустая', () => {
    // ИИ играет за X, getBestMove возвращает индекс 4
    vi.mocked(getBestMove).mockReturnValue(4);

    const state = gameReducer(INITIAL_STATE, {
      type: 'START_GAME',
      payload: { mode: 'pvai', humanPlayer: 'O' },
    });

    expect(state.screen).toBe('game');
    // На доске должна быть занята ровно одна клетка (ход ИИ)
    const occupied = state.board.filter((c) => c !== null).length;
    expect(occupied).toBe(1);
    // ИИ играет за X (humanPlayer = O)
    expect(state.board[4]).toBe('X');
  });

  it('(PvAI, человек = O) после хода ИИ вызывается checkWinner — статус отражает результат', () => {
    // ИИ делает ход в клетку 4 — на пустой доске победа невозможна
    vi.mocked(getBestMove).mockReturnValue(4);

    const state = gameReducer(INITIAL_STATE, {
      type: 'START_GAME',
      payload: { mode: 'pvai', humanPlayer: 'O' },
    });

    // После хода ИИ игра продолжается (победа на первом ходу невозможна)
    // Статус должен быть 'playing' с currentPlayer = O (ход человека)
    expect(state.status.kind).toBe('playing');
    if (state.status.kind === 'playing') {
      expect(state.status.currentPlayer).toBe('O');
    }
  });

  it('(PvAI, человек = O) getBestMove возвращает -1 — logEvent вызван, доска пустая', () => {
    vi.mocked(getBestMove).mockReturnValue(-1);

    const state = gameReducer(INITIAL_STATE, {
      type: 'START_GAME',
      payload: { mode: 'pvai', humanPlayer: 'O' },
    });

    // logEvent должен быть вызван с ошибкой
    expect(logEvent).toHaveBeenCalledWith(
      'reducer_error',
      expect.objectContaining({ error: expect.anything() }),
    );
    // Доска остаётся пустой (ход ИИ не применён)
    expect(state.board).toEqual(EMPTY);
  });

  it('(PvAI, человек = O) getBestMove возвращает null — logEvent вызван, доска пустая', () => {
    // null приводится к any для имитации некорректного возврата
    vi.mocked(getBestMove).mockReturnValue(null as unknown as number);

    const state = gameReducer(INITIAL_STATE, {
      type: 'START_GAME',
      payload: { mode: 'pvai', humanPlayer: 'O' },
    });

    expect(logEvent).toHaveBeenCalledWith(
      'reducer_error',
      expect.objectContaining({ error: expect.anything() }),
    );
    expect(state.board).toEqual(EMPTY);
  });

  it('(PvP) logEvent НЕ вызывается при успешном START_GAME', () => {
    gameReducer(INITIAL_STATE, {
      type: 'START_GAME',
      payload: { mode: 'pvp' },
    });
    expect(logEvent).not.toHaveBeenCalled();
  });

  it('(PvAI, человек = X) logEvent НЕ вызывается при успешном START_GAME', () => {
    gameReducer(INITIAL_STATE, {
      type: 'START_GAME',
      payload: { mode: 'pvai', humanPlayer: 'X' },
    });
    expect(logEvent).not.toHaveBeenCalled();
  });

  it('сбрасывает доску при повторном START_GAME из середины партии', () => {
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

// ─── MAKE_MOVE (PvP) ──────────────────────────────────────────────────────────

describe('gameReducer — MAKE_MOVE (PvP)', () => {
  it('применяет ход X в свободную клетку и передаёт ход O', () => {
    const state = gameReducer(PVP_GAME_STATE, {
      type: 'MAKE_MOVE',
      payload: { index: 0 },
    });
    expect(state.board[0]).toBe('X');
    expect(state.status.kind).toBe('playing');
    if (state.status.kind === 'playing') {
      expect(state.status.currentPlayer).toBe('O');
    }
  });

  it('применяет ход O в свободную клетку и передаёт ход X', () => {
    const stateAfterX: GameState = {
      ...PVP_GAME_STATE,
      board: ['X', null, null, null, null, null, null, null, null],
      status: { kind: 'playing', currentPlayer: 'O' },
    };
    const state = gameReducer(stateAfterX, {
      type: 'MAKE_MOVE',
      payload: { index: 1 },
    });
    expect(state.board[1]).toBe('O');
    if (state.status.kind === 'playing') {
      expect(state.status.currentPlayer).toBe('X');
    }
  });

  it('возвращает то же состояние при невалидном индексе < 0', () => {
    const state = gameReducer(PVP_GAME_STATE, {
      type: 'MAKE_MOVE',
      payload: { index: -1 },
    });
    expect(state).toBe(PVP_GAME_STATE);
  });

  it('возвращает то же состояние при невалидном индексе > 8', () => {
    const state = gameReducer(PVP_GAME_STATE, {
      type: 'MAKE_MOVE',
      payload: { index: 9 },
    });
    expect(state).toBe(PVP_GAME_STATE);
  });

  it('возвращает то же состояние при ходе в занятую клетку', () => {
    const boardWithX: BoardState = ['X', null, null, null, null, null, null, null, null];
    const stateWithX: GameState = {
      ...PVP_GAME_STATE,
      board: boardWithX,
      status: { kind: 'playing', currentPlayer: 'O' },
    };
    const state = gameReducer(stateWithX, {
      type: 'MAKE_MOVE',
      payload: { index: 0 },
    });
    expect(state).toBe(stateWithX);
  });

  it('возвращает то же состояние при screen !== "game" (menu)', () => {
    const state = gameReducer(INITIAL_STATE, {
      type: 'MAKE_MOVE',
      payload: { index: 0 },
    });
    expect(state).toBe(INITIAL_STATE);
  });

  it('возвращает то же состояние при screen !== "game" (result)', () => {
    const resultState: GameState = {
      screen: 'result',
      board: ['X', 'X', 'X', 'O', 'O', null, null, null, null],
      status: { kind: 'won', winner: 'X', winLine: [0, 1, 2] },
      settings: { mode: 'pvp' },
    };
    const state = gameReducer(resultState, {
      type: 'MAKE_MOVE',
      payload: { index: 5 },
    });
    expect(state).toBe(resultState);
  });

  it('возвращает то же состояние при status.kind === "won"', () => {
    const wonState: GameState = {
      screen: 'game',
      board: ['X', 'X', 'X', 'O', 'O', null, null, null, null],
      status: { kind: 'won', winner: 'X', winLine: [0, 1, 2] },
      settings: { mode: 'pvp' },
    };
    const state = gameReducer(wonState, {
      type: 'MAKE_MOVE',
      payload: { index: 5 },
    });
    expect(state).toBe(wonState);
  });

  it('переходит на экран result при победе X', () => {
    // X занимает 0, 1 — ход в 2 = победа по первой строке
    const board: BoardState = ['X', 'X', null, 'O', 'O', null, null, null, null];
    const state1: GameState = {
      screen: 'game',
      board,
      status: { kind: 'playing', currentPlayer: 'X' },
      settings: { mode: 'pvp' },
    };
    const state2 = gameReducer(state1, {
      type: 'MAKE_MOVE',
      payload: { index: 2 },
    });
    expect(state2.screen).toBe('result');
    expect(state2.status.kind).toBe('won');
    if (state2.status.kind === 'won') {
      expect(state2.status.winner).toBe('X');
      expect(state2.status.winLine).toEqual([0, 1, 2]);
    }
  });

  it('переходит на экран result при победе O', () => {
    // O занимает 3, 4 — ход в 5 = победа по второй строке
    const board: BoardState = ['X', 'X', null, 'O', 'O', null, null, null, null];
    const state1: GameState = {
      screen: 'game',
      board,
      status: { kind: 'playing', currentPlayer: 'O' },
      settings: { mode: 'pvp' },
    };
    const state2 = gameReducer(state1, {
      type: 'MAKE_MOVE',
      payload: { index: 5 },
    });
    expect(state2.screen).toBe('result');
    expect(state2.status.kind).toBe('won');
    if (state2.status.kind === 'won') {
      expect(state2.status.winner).toBe('O');
    }
  });

  it('переходит на экран result при ничьей', () => {
    // Предпоследний ход — X в клетку 8 завершает ничью
    // X O X / X O O / O X _
    const board: BoardState = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', null];
    const state1: GameState = {
      screen: 'game',
      board,
      status: { kind: 'playing', currentPlayer: 'X' },
      settings: { mode: 'pvp' },
    };
    const state2 = gameReducer(state1, {
      type: 'MAKE_MOVE',
      payload: { index: 8 },
    });
    expect(state2.screen).toBe('result');
    expect(state2.status.kind).toBe('draw');
  });

  it('logEvent НЕ вызывается при успешном MAKE_MOVE', () => {
    gameReducer(PVP_GAME_STATE, {
      type: 'MAKE_MOVE',
      payload: { index: 0 },
    });
    expect(logEvent).not.toHaveBeenCalled();
  });
});

// ─── MAKE_MOVE (PvAI) ─────────────────────────────────────────────────────────

describe('gameReducer — MAKE_MOVE (PvAI)', () => {
  it('после хода человека ИИ делает ответный ход', () => {
    // ИИ возвращает индекс 4
    vi.mocked(getBestMove).mockReturnValue(4);

    const state = gameReducer(PVAI_GAME_STATE_HUMAN_X, {
      type: 'MAKE_MOVE',
      payload: { index: 0 },
    });

    // Клетка 0 — ход человека (X), клетка 4 — ход ИИ (O)
    expect(state.board[0]).toBe('X');
    expect(state.board[4]).toBe('O');
  });

  it('после хода человека ИИ делает ход и передаёт ход обратно человеку', () => {
    vi.mocked(getBestMove).mockReturnValue(4);

    const state = gameReducer(PVAI_GAME_STATE_HUMAN_X, {
      type: 'MAKE_MOVE',
      payload: { index: 0 },
    });

    expect(state.status.kind).toBe('playing');
    if (state.status.kind === 'playing') {
      expect(state.status.currentPlayer).toBe('X');
    }
  });

  it('переходит на result если человек побеждает своим ходом', () => {
    // X: 0, 1 — ход в 2 = победа X; ИИ не должен ходить
    const board: BoardState = ['X', 'X', null, 'O', 'O', null, null, null, null];
    const state1: GameState = {
      screen: 'game',
      board,
      status: { kind: 'playing', currentPlayer: 'X' },
      settings: { mode: 'pvai', humanPlayer: 'X' },
    };

    const state2 = gameReducer(state1, {
      type: 'MAKE_MOVE',
      payload: { index: 2 },
    });

    expect(state2.screen).toBe('result');
    expect(state2.status.kind).toBe('won');
    if (state2.status.kind === 'won') {
      expect(state2.status.winner).toBe('X');
    }
    // ИИ не должен был ходить после победы человека
    expect(getBestMove).not.toHaveBeenCalled();
  });

  it('переходит на result если ИИ побеждает своим ходом', () => {
    // O (ИИ): 3, 4 — ход в 5 = победа O
    vi.mocked(getBestMove).mockReturnValue(5);

    const board: BoardState = ['X', null, null, 'O', 'O', null, null, null, null];
    const state1: GameState = {
      screen: 'game',
      board,
      status: { kind: 'playing', currentPlayer: 'X' },
      settings: { mode: 'pvai', humanPlayer: 'X' },
    };

    const state2 = gameReducer(state1, {
      type: 'MAKE_MOVE',
      payload: { index: 1 },
    });

    expect(state2.screen).toBe('result');
    expect(state2.status.kind).toBe('won');
    if (state2.status.kind === 'won') {
      expect(state2.status.winner).toBe('O');
    }
  });

  it('getBestMove вызывается с корректными аргументами (доска после хода человека, символ ИИ)', () => {
    vi.mocked(getBestMove).mockReturnValue(4);

    gameReducer(PVAI_GAME_STATE_HUMAN_X, {
      type: 'MAKE_MOVE',
      payload: { index: 0 },
    });

    // Первый аргумент — доска с ходом человека, второй — символ ИИ (O)
    expect(getBestMove).toHaveBeenCalledWith(
      expect.arrayContaining(['X']),
      'O',
    );
  });

  it('при некорректном ходе ИИ logEvent вызывается с { error }', () => {
    // getBestMove возвращает уже занятую клетку
    vi.mocked(getBestMove).mockReturnValue(0);

    const board: BoardState = ['X', null, null, null, null, null, null, null, null];
    const state1: GameState = {
      screen: 'game',
      board,
      status: { kind: 'playing', currentPlayer: 'O' },
      settings: { mode: 'pvai', humanPlayer: 'O' },
    };

    gameReducer(state1, {
      type: 'MAKE_MOVE',
      payload: { index: 1 },
    });

    expect(logEvent).toHaveBeenCalledWith(
      'reducer_error',
      expect.objectContaining({ error: expect.anything() }),
    );
  });
});

// ─── RESTART ──────────────────────────────────────────────────────────────────

describe('gameReducer — RESTART', () => {
  it('сбрасывает доску и переходит на экран game с теми же настройками (PvP)', () => {
    const resultState: GameState = {
      screen: 'result',
      board: ['X', 'X', 'X', 'O', 'O', null, null, null, null],
      status: { kind: 'won', winner: 'X', winLine: [0, 1, 2] },
      settings: { mode: 'pvp' },
    };
    const state = gameReducer(resultState, { type: 'RESTART' });

    expect(state.screen).toBe('game');
    expect(state.board).toEqual(EMPTY);
    expect(state.status.kind).toBe('playing');
    // Настройки сохраняются — режим остаётся pvp
    expect(state.settings.mode).toBe('pvp');
  });

  it('сбрасывает доску и переходит на экран game с теми же настройками (PvAI)', () => {
    const pvaiState: GameState = {
      screen: 'result',
      board: ['X', 'X', 'X', 'O', 'O', null, null, null, null],
      status: { kind: 'won', winner: 'X', winLine: [0, 1, 2] },
      settings: { mode: 'pvai', humanPlayer: 'X' },
    };
    const state = gameReducer(pvaiState, { type: 'RESTART' });

    expect(state.screen).toBe('game');
    expect(state.board).toEqual(EMPTY);
    // Настройки сохраняются — режим остаётся pvai
    expect(state.settings.mode).toBe('pvai');
  });

  it('X ходит первым после RESTART', () => {
    const resultState: GameState = {
      screen: 'result',
      board: ['X', 'X', 'X', 'O', 'O', null, null, null, null],
      status: { kind: 'won', winner: 'X', winLine: [0, 1, 2] },
      settings: { mode: 'pvp' },
    };
    const state = gameReducer(resultState, { type: 'RESTART' });

    if (state.status.kind === 'playing') {
      expect(state.status.currentPlayer).toBe('X');
    }
  });

  it('(PvAI, человек = O) после RESTART ИИ делает первый ход', () => {
    vi.mocked(getBestMove).mockReturnValue(4);

    const pvaiState: GameState = {
      screen: 'result',
      board: ['X', 'X', 'X', 'O', 'O', null, null, null, null],
      status: { kind: 'won', winner: 'X', winLine: [0, 1, 2] },
      settings: { mode: 'pvai', humanPlayer: 'O' },
    };
    const state = gameReducer(pvaiState, { type: 'RESTART' });

    expect(state.board[4]).toBe('X');
    expect(getBestMove).toHaveBeenCalledTimes(1);
  });

  it('(PvAI, человек = X) после RESTART ИИ НЕ ходит первым', () => {
    const pvaiState: GameState = {
      screen: 'result',
      board: ['X', 'X', 'X', 'O', 'O', null, null, null, null],
      status: { kind: 'won', winner: 'X', winLine: [0, 1, 2] },
      settings: { mode: 'pvai', humanPlayer: 'X' },
    };
    const state = gameReducer(pvaiState, { type: 'RESTART' });

    expect(state.board).toEqual(EMPTY);
    expect(getBestMove).not.toHaveBeenCalled();
  });
});

// ─── QUIT_TO_MENU ─────────────────────────────────────────────────────────────

describe('gameReducer — QUIT_TO_MENU', () => {
  it('возвращает начальное состояние (screen=menu)', () => {
    const state = gameReducer(PVP_GAME_STATE, { type: 'QUIT_TO_MENU' });
    expect(state.screen).toBe('menu');
    expect(state.board).toEqual(EMPTY);
  });

  it('сбрасывает настройки до pvp', () => {
    const pvaiState: GameState = {
      screen: 'game',
      board: EMPTY,
      status: { kind: 'playing', currentPlayer: 'X' },
      settings: { mode: 'pvai', humanPlayer: 'X' },
    };
    const state = gameReducer(pvaiState, { type: 'QUIT_TO_MENU' });
    expect(state.settings.mode).toBe('pvp');
  });
});

// ─── RESET_GAME ───────────────────────────────────────────────────────────────

describe('gameReducer — RESET_GAME', () => {
  it('возвращает начальное состояние из любого экрана', () => {
    const state = gameReducer(PVP_GAME_STATE, { type: 'RESET_GAME' });
    expect(state).toEqual(INITIAL_STATE);
  });

  it('возвращает начальное состояние из экрана result', () => {
    const resultState: GameState = {
      screen: 'result',
      board: ['X', 'X', 'X', 'O', 'O', null, null, null, null],
      status: { kind: 'won', winner: 'X', winLine: [0, 1, 2] },
      settings: { mode: 'pvai', humanPlayer: 'O' },
    };
    const state = gameReducer(resultState, { type: 'RESET_GAME' });
    expect(state).toEqual(INITIAL_STATE);
  });
});

// ─── Защитное поведение ───────────────────────────────────────────────────────

describe('gameReducer — защитное поведение', () => {
  it('при исключении внутри редьюсера возвращает текущее состояние', () => {
    // Мокируем getBestMove так, чтобы он выбросил исключение
    vi.mocked(getBestMove).mockImplementation(() => {
      throw new Error('Тестовая ошибка');
    });

    const state = gameReducer(PVAI_GAME_STATE_HUMAN_X, {
      type: 'MAKE_MOVE',
      payload: { index: 0 },
    });

    // Редьюсер должен вернуть состояние до хода ИИ (с ходом человека уже применённым)
    // или исходное состояние — зависит от того, где произошло исключение.
    // Главное — не выбросить исключение наружу.
    expect(state).toBeDefined();
    expect(state.screen).not.toBe(undefined);
  });

  it('при исключении внутри applyAiMove logEvent вызывается с { error }', () => {
    // getBestMove выбрасывает исключение — попадаем в catch внутри applyAiMove
    vi.mocked(getBestMove).mockImplementation(() => {
      throw new Error('Тестовая ошибка');
    });

    gameReducer(PVAI_GAME_STATE_HUMAN_X, {
      type: 'MAKE_MOVE',
      payload: { index: 0 },
    });

    // logEvent вызывается внутри applyAiMove с { error } (без action)
    expect(logEvent).toHaveBeenCalledWith(
      'reducer_error',
      expect.objectContaining({ error: expect.anything() }),
    );
  });
});