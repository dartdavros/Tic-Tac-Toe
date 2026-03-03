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
  it('применяет ход игрока и ответный ход ИИ атомарно (две занятые клетки)', () => {
    // Человек = X, ИИ = O; getBestMove возвращает 4
    vi.mocked(getBestMove).mockReturnValue(4);

    const state = gameReducer(PVAI_GAME_STATE_HUMAN_X, {
      type: 'MAKE_MOVE',
      payload: { index: 0 },
    });

    // После одного вызова редьюсера на доске должно быть 2 занятые клетки
    const occupied = state.board.filter((c) => c !== null).length;
    expect(occupied).toBe(2);
    expect(state.board[0]).toBe('X'); // ход человека
    expect(state.board[4]).toBe('O'); // ход ИИ
  });

  it('ход ИИ передаёт ход обратно человеку (currentPlayer = X)', () => {
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

  it('победа ИИ переводит игру в screen=result', () => {
    // Доска: X занимает 0; O занимает 3, 4 — ИИ (O) ходит в 5 = победа
    const board: BoardState = ['X', null, null, 'O', 'O', null, null, null, null];
    const pvaiState: GameState = {
      screen: 'game',
      board,
      status: { kind: 'playing', currentPlayer: 'X' },
      settings: { mode: 'pvai', humanPlayer: 'X' },
    };

    // Человек (X) ходит в 1, затем ИИ (O) ходит в 5 = победа O
    vi.mocked(getBestMove).mockReturnValue(5);

    const state = gameReducer(pvaiState, {
      type: 'MAKE_MOVE',
      payload: { index: 1 },
    });

    expect(state.screen).toBe('result');
    expect(state.status.kind).toBe('won');
    if (state.status.kind === 'won') {
      expect(state.status.winner).toBe('O');
    }
  });

  it('победа человека не вызывает ход ИИ', () => {
    // X занимает 0, 1 — ход в 2 = победа X; ИИ не должен ходить
    const board: BoardState = ['X', 'X', null, 'O', 'O', null, null, null, null];
    const pvaiState: GameState = {
      screen: 'game',
      board,
      status: { kind: 'playing', currentPlayer: 'X' },
      settings: { mode: 'pvai', humanPlayer: 'X' },
    };

    const state = gameReducer(pvaiState, {
      type: 'MAKE_MOVE',
      payload: { index: 2 },
    });

    expect(state.screen).toBe('result');
    expect(state.status.kind).toBe('won');
    // getBestMove не должен вызываться — игра завершена после хода человека
    expect(getBestMove).not.toHaveBeenCalled();
  });

  it('getBestMove возвращает null — logEvent вызван, ход игрока применён', () => {
    // null имитирует некорректный возврат из getBestMove
    vi.mocked(getBestMove).mockReturnValue(null as unknown as number);

    const state = gameReducer(PVAI_GAME_STATE_HUMAN_X, {
      type: 'MAKE_MOVE',
      payload: { index: 0 },
    });

    // logEvent должен быть вызван с ошибкой
    expect(logEvent).toHaveBeenCalledWith(
      'reducer_error',
      expect.objectContaining({ error: expect.anything() }),
    );
    // Ход игрока применён (клетка 0 занята X)
    expect(state.board[0]).toBe('X');
    // Ход ИИ не применён (только одна занятая клетка)
    const occupied = state.board.filter((c) => c !== null).length;
    expect(occupied).toBe(1);
  });

  it('getBestMove возвращает -1 — logEvent вызван, ход игрока применён', () => {
    vi.mocked(getBestMove).mockReturnValue(-1);

    const state = gameReducer(PVAI_GAME_STATE_HUMAN_X, {
      type: 'MAKE_MOVE',
      payload: { index: 0 },
    });

    expect(logEvent).toHaveBeenCalledWith(
      'reducer_error',
      expect.objectContaining({ error: expect.anything() }),
    );
    expect(state.board[0]).toBe('X');
    const occupied = state.board.filter((c) => c !== null).length;
    expect(occupied).toBe(1);
  });

  it('getBestMove выбрасывает исключение — logEvent вызван через applyAiMove', () => {
    // Имитируем непредвиденную ошибку внутри getBestMove
    vi.mocked(getBestMove).mockImplementation(() => {
      throw new Error('Непредвиденная ошибка minimax');
    });

    // Редьюсер не должен выбрасывать исключение
    expect(() =>
      gameReducer(PVAI_GAME_STATE_HUMAN_X, {
        type: 'MAKE_MOVE',
        payload: { index: 0 },
      }),
    ).not.toThrow();

    // logEvent должен быть вызван — исключение перехвачено в applyAiMove
    expect(logEvent).toHaveBeenCalledWith(
      'reducer_error',
      expect.objectContaining({ error: expect.anything() }),
    );
  });

  it('getBestMove выбрасывает исключение — ход игрока сохранён в результате', () => {
    // Исключение перехватывается в applyAiMove, который возвращает stateAfterPlayer.
    // Ход игрока (X в клетку 0) уже применён до вызова getBestMove.
    vi.mocked(getBestMove).mockImplementation(() => {
      throw new Error('Непредвиденная ошибка minimax');
    });

    const result = gameReducer(PVAI_GAME_STATE_HUMAN_X, {
      type: 'MAKE_MOVE',
      payload: { index: 0 },
    });

    // Ход игрока применён (applyAiMove возвращает stateAfterPlayer при ошибке)
    expect(result.board[0]).toBe('X');
    // Ход ИИ не применён
    const occupied = result.board.filter((c) => c !== null).length;
    expect(occupied).toBe(1);
  });
});

// ─── RESTART ──────────────────────────────────────────────────────────────────

describe('gameReducer — RESTART', () => {
  it('возвращает INITIAL_STATE полностью', () => {
    const midGame: GameState = {
      screen: 'game',
      board: ['X', 'O', null, null, 'X', null, null, null, null],
      status: { kind: 'playing', currentPlayer: 'O' },
      settings: { mode: 'pvai', humanPlayer: 'X' },
    };
    const state = gameReducer(midGame, { type: 'RESTART' });
    expect(state).toEqual(INITIAL_STATE);
  });

  it('возвращает screen === "menu"', () => {
    const state = gameReducer(PVP_GAME_STATE, { type: 'RESTART' });
    expect(state.screen).toBe('menu');
  });

  it('возвращает settings.mode === "pvp"', () => {
    const pvaiState: GameState = {
      screen: 'result',
      board: ['X', 'X', 'X', 'O', 'O', null, null, null, null],
      status: { kind: 'won', winner: 'X', winLine: [0, 1, 2] },
      settings: { mode: 'pvai', humanPlayer: 'X' },
    };
    const state = gameReducer(pvaiState, { type: 'RESTART' });
    expect(state.settings.mode).toBe('pvp');
  });

  it('возвращает пустую доску', () => {
    const state = gameReducer(PVP_GAME_STATE, { type: 'RESTART' });
    expect(state.board).toEqual(EMPTY);
  });

  it('logEvent НЕ вызывается при RESTART', () => {
    gameReducer(PVP_GAME_STATE, { type: 'RESTART' });
    expect(logEvent).not.toHaveBeenCalled();
  });
});

// ─── QUIT_TO_MENU ─────────────────────────────────────────────────────────────

describe('gameReducer — QUIT_TO_MENU', () => {
  it('возвращает INITIAL_STATE полностью', () => {
    const state = gameReducer(PVP_GAME_STATE, { type: 'QUIT_TO_MENU' });
    expect(state).toEqual(INITIAL_STATE);
  });

  it('возвращает screen === "menu"', () => {
    const state = gameReducer(PVP_GAME_STATE, { type: 'QUIT_TO_MENU' });
    expect(state.screen).toBe('menu');
  });

  it('logEvent НЕ вызывается при QUIT_TO_MENU', () => {
    gameReducer(PVP_GAME_STATE, { type: 'QUIT_TO_MENU' });
    expect(logEvent).not.toHaveBeenCalled();
  });
});

// ─── Защитное поведение (try/catch) ───────────────────────────────────────────

describe('gameReducer — защитное поведение', () => {
  it('редьюсер не выбрасывает исключение при любых входных данных', () => {
    vi.mocked(getBestMove).mockImplementation(() => {
      throw new Error('Тестовая ошибка');
    });

    expect(() =>
      gameReducer(PVAI_GAME_STATE_HUMAN_X, {
        type: 'MAKE_MOVE',
        payload: { index: 0 },
      }),
    ).not.toThrow();
  });

  it('при исключении в getBestMove возвращается состояние с ходом игрока', () => {
    // applyAiMove перехватывает исключение от getBestMove и возвращает
    // stateAfterPlayer (с ходом игрока, но без хода ИИ).
    // Это корректное поведение: ход игрока не откатывается.
    vi.mocked(getBestMove).mockImplementation(() => {
      throw new Error('Тестовая ошибка');
    });

    const result = gameReducer(PVAI_GAME_STATE_HUMAN_X, {
      type: 'MAKE_MOVE',
      payload: { index: 0 },
    });

    // Ход игрока применён (X в клетку 0)
    expect(result.board[0]).toBe('X');
    // Ход ИИ не применён (только одна занятая клетка)
    const occupied = result.board.filter((c) => c !== null).length;
    expect(occupied).toBe(1);
    // Экран остаётся 'game' (игра не завершена)
    expect(result.screen).toBe('game');
  });

  it('при исключении внутри редьюсера logEvent вызывается с полным объектом action', () => {
    // applyAiMove перехватывает исключение и вызывает logEvent с полным action
    vi.mocked(getBestMove).mockImplementation(() => {
      throw new Error('Тестовая ошибка');
    });

    const action = {
      type: 'MAKE_MOVE' as const,
      payload: { index: 0 },
    };

    gameReducer(PVAI_GAME_STATE_HUMAN_X, action);

    // logEvent должен быть вызван с полным объектом action
    expect(logEvent).toHaveBeenCalledWith(
      'reducer_error',
      expect.objectContaining({
        action: expect.objectContaining({
          type: 'MAKE_MOVE',
          payload: { index: 0 },
        }),
        error: expect.anything(),
      }),
    );
  });

  it('logEvent НЕ вызывается при успешном MAKE_MOVE в PvAI-режиме', () => {
    vi.mocked(getBestMove).mockReturnValue(4);

    gameReducer(PVAI_GAME_STATE_HUMAN_X, {
      type: 'MAKE_MOVE',
      payload: { index: 0 },
    });

    expect(logEvent).not.toHaveBeenCalled();
  });

  it('logEvent НЕ вызывается при успешном START_GAME в PvAI-режиме с ходом ИИ', () => {
    vi.mocked(getBestMove).mockReturnValue(4);

    gameReducer(INITIAL_STATE, {
      type: 'START_GAME',
      payload: { mode: 'pvai', humanPlayer: 'O' },
    });

    expect(logEvent).not.toHaveBeenCalled();
  });
});