// Редьюсер игрового состояния.
// ADR-001: единственная точка мутации GameState.
// ADR-007: защитный редьюсер с try/catch — при исключении возвращает текущее состояние.
// ADR-003: синхронный вызов ИИ внутри редьюсера (инвариант №4).

import type { GameState, GameAction, BoardState, GameStatus, GameSettings } from '../types';
import {
  applyMove,
  checkWinner,
  isBoardFull,
  getAvailableMoves,
} from './gameLogic';
import { getBestMove } from './aiPlayer';
import { logEvent } from '../utils/logger';

/**
 * Пустая доска — экспортируется для использования в тестах.
 */
export const EMPTY_BOARD: BoardState = [
  null, null, null,
  null, null, null,
  null, null, null,
];

export const INITIAL_STATE: GameState = {
  screen: 'menu',
  board: EMPTY_BOARD,
  status: { kind: 'playing', currentPlayer: 'X' },
  settings: { mode: 'pvp' },
};

/**
 * Определяет, является ли текущий ход ходом ИИ.
 * Экспортируется для использования в тестах.
 *
 * @param status - Текущий статус игры
 * @param settings - Настройки игры
 * @returns true, если сейчас должен ходить ИИ
 */
export function isAiTurn(status: GameStatus, settings: GameSettings): boolean {
  if (settings.mode !== 'pvai') return false;
  if (status.kind !== 'playing') return false;
  return status.currentPlayer !== settings.humanPlayer;
}

/**
 * Вычисляет статус игры после хода.
 * Возвращает новый GameStatus на основе текущей доски и следующего игрока.
 */
function computeStatus(board: BoardState, nextPlayer: 'X' | 'O'): GameStatus {
  return checkWinner(board, nextPlayer);
}

/**
 * Применяет ход ИИ к доске и возвращает новое состояние.
 * При ошибке логирует и возвращает состояние до хода ИИ (с ходом игрока уже применённым).
 *
 * Инвариант №4: ИИ вызывается только из редьюсера.
 * Инвариант №6: не выбрасывает исключения.
 */
function applyAiMove(
  stateBeforeAi: GameState,
  aiSymbol: 'X' | 'O',
  humanPlayer: 'X' | 'O',
): GameState {
  // Проверяем, есть ли ходы для ИИ
  if (isBoardFull(stateBeforeAi.board) || getAvailableMoves(stateBeforeAi.board).length === 0) {
    return {
      ...stateBeforeAi,
      screen: 'result',
    };
  }

  try {
    const aiMoveIndex = getBestMove(stateBeforeAi.board, aiSymbol);

    // Валидация возвращённого индекса
    if (
      typeof aiMoveIndex !== 'number' ||
      aiMoveIndex < 0 ||
      aiMoveIndex > 8 ||
      stateBeforeAi.board[aiMoveIndex] !== null
    ) {
      throw new Error(`Некорректный ход ИИ: индекс ${aiMoveIndex}`);
    }

    const boardAfterAi = applyMove(stateBeforeAi.board, aiMoveIndex, aiSymbol);
    const statusAfterAi = computeStatus(boardAfterAi, humanPlayer);

    if (statusAfterAi.kind !== 'playing') {
      return {
        ...stateBeforeAi,
        board: boardAfterAi,
        status: statusAfterAi,
        screen: 'result',
      };
    }

    return {
      ...stateBeforeAi,
      board: boardAfterAi,
      status: statusAfterAi,
    };
  } catch (error) {
    // При ошибке ИИ логируем и возвращаем состояние с ходом игрока (без хода ИИ)
    logEvent('reducer_error', { error });
    return stateBeforeAi;
  }
}

/**
 * Обрабатывает действие MAKE_MOVE.
 * Инвариант №5: переход на экран result происходит только здесь.
 * Инвариант №4: ИИ вызывается только из редьюсера.
 */
function handleMakeMove(
  state: GameState,
  index: number,
): GameState {
  // Валидация: только на экране game
  if (state.screen !== 'game') {
    return state;
  }

  // Валидация: партия должна быть в процессе
  if (state.status.kind !== 'playing') {
    return state;
  }

  // Валидация: индекс клетки
  if (index < 0 || index > 8) {
    return state;
  }

  // Валидация: клетка не занята
  if (state.board[index] !== null) {
    return state;
  }

  const currentPlayer = state.status.currentPlayer;
  const boardAfterPlayer = applyMove(state.board, index, currentPlayer);
  const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';
  const statusAfterPlayer = computeStatus(boardAfterPlayer, nextPlayer);

  // Партия завершена после хода игрока
  if (statusAfterPlayer.kind !== 'playing') {
    return {
      ...state,
      board: boardAfterPlayer,
      status: statusAfterPlayer,
      screen: 'result',
    };
  }

  // Режим PvP — просто передаём ход
  if (state.settings.mode === 'pvp') {
    return {
      ...state,
      board: boardAfterPlayer,
      status: statusAfterPlayer,
    };
  }

  // Режим PvAI — вычисляем ход ИИ синхронно
  const humanPlayer = state.settings.humanPlayer;
  const aiSymbol = humanPlayer === 'X' ? 'O' : 'X';

  const stateAfterPlayer: GameState = {
    ...state,
    board: boardAfterPlayer,
    status: statusAfterPlayer,
  };

  return applyAiMove(stateAfterPlayer, aiSymbol, humanPlayer);
}

/**
 * Обрабатывает действие START_GAME.
 * Если режим PvAI и человек играет за O — ИИ делает первый ход.
 */
function handleStartGame(
  action: Extract<GameAction, { type: 'START_GAME' }>,
): GameState {
  const baseState: GameState = {
    screen: 'game',
    board: EMPTY_BOARD,
    status: { kind: 'playing', currentPlayer: 'X' },
    settings: action.payload,
  };

  // Если PvAI и человек = O, то ИИ (X) ходит первым
  if (action.payload.mode === 'pvai' && action.payload.humanPlayer === 'O') {
    return applyAiMove(baseState, 'X', 'O');
  }

  return baseState;
}

/**
 * Редьюсер игрового состояния.
 * Инвариант №6: не выбрасывает исключения — все ошибки перехватываются try/catch.
 * Инвариант №1: единственная точка мутации GameState.
 */
export function gameReducer(state: GameState, action: GameAction): GameState {
  try {
    switch (action.type) {
      case 'START_GAME': {
        return handleStartGame(action);
      }

      case 'MAKE_MOVE': {
        return handleMakeMove(state, action.payload.index);
      }

      case 'RESTART': {
        // Перезапуск с теми же настройками — работает с любого экрана game или result
        const firstPlayer = 'X';
        const baseState: GameState = {
          ...state,
          screen: 'game',
          board: EMPTY_BOARD,
          status: { kind: 'playing', currentPlayer: firstPlayer },
        };

        // Если PvAI и человек = O, ИИ делает первый ход
        if (state.settings.mode === 'pvai' && state.settings.humanPlayer === 'O') {
          return applyAiMove(baseState, 'X', 'O');
        }

        return baseState;
      }

      case 'QUIT_TO_MENU': {
        return { ...INITIAL_STATE };
      }

      case 'RESET_GAME': {
        // Полный сброс в начальное состояние (используется ErrorBoundary)
        return { ...INITIAL_STATE };
      }

      default: {
        // Защита от неизвестных действий на уровне типов
        const _exhaustive: never = action;
        logEvent('unknown_action', { action: _exhaustive });
        return state;
      }
    }
  } catch (error) {
    logEvent('reducer_error', { action, error });
    return state;
  }
}