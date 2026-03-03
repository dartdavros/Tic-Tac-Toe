// Редьюсер игрового состояния.
// Инвариант №1: единственная точка мутации GameState.
// Инвариант №6: не выбрасывает исключения — при ошибке возвращает текущее состояние.
// Инвариант №4: ИИ вызывается только отсюда, не из компонентов.
// Инвариант №5: переход на экран result происходит только здесь.
// Инвариант №11: переход menu → result напрямую недопустим.

import type { GameAction, GameState, BoardState } from '../types';
import { logEvent } from '../utils/logger';
import { applyMove, computeGameStatus, isBoardFull } from './gameLogic';
import { getBestMove } from './aiPlayer';

/** Пустая доска — начальное состояние поля */
const EMPTY_BOARD: BoardState = [null, null, null, null, null, null, null, null, null];

/**
 * Начальное состояние приложения.
 * Экспортируется для использования в App и тестах.
 */
export const INITIAL_STATE: GameState = {
  screen: 'menu',
  board: [...EMPTY_BOARD] as BoardState,
  status: { kind: 'playing', currentPlayer: 'X' },
  settings: { mode: 'pvp' },
};

/**
 * Редьюсер игрового состояния.
 * Обрабатывает все действия GameAction атомарно.
 *
 * @param state - Текущее состояние
 * @param action - Действие для обработки
 * @returns Новое состояние
 */
export function gameReducer(state: GameState, action: GameAction): GameState {
  try {
    switch (action.type) {
      case 'START_GAME': {
        return {
          screen: 'game',
          board: [...EMPTY_BOARD] as BoardState,
          status: { kind: 'playing', currentPlayer: 'X' },
          settings: action.payload,
        };
      }

      case 'MAKE_MOVE': {
        // Валидация: допустимо только на экране game
        if (state.screen !== 'game') {
          logEvent('invalid_move', { reason: 'not_game_screen', action });
          return state;
        }

        // Валидация: партия должна быть в процессе
        if (state.status.kind !== 'playing') {
          logEvent('invalid_move', { reason: 'game_not_playing', action });
          return state;
        }

        const { index } = action.payload;

        // Валидация: индекс клетки [0..8]
        if (index < 0 || index > 8) {
          logEvent('invalid_move', { reason: 'invalid_index', index });
          return state;
        }

        // Валидация: клетка не занята
        if (state.board[index] !== null) {
          logEvent('invalid_move', { reason: 'cell_occupied', index });
          return state;
        }

        const currentPlayer = state.status.currentPlayer;

        // Применяем ход игрока
        const boardAfterPlayer = applyMove(state.board, index, currentPlayer);
        const statusAfterPlayer = computeGameStatus(boardAfterPlayer, currentPlayer);

        // Если партия завершена после хода игрока — переходим на result
        if (statusAfterPlayer.kind !== 'playing') {
          return {
            ...state,
            screen: 'result',
            board: boardAfterPlayer,
            status: statusAfterPlayer,
          };
        }

        // Если режим PvAI — вычисляем ход ИИ синхронно (ADR-003)
        if (state.settings.mode === 'pvai') {
          const humanPlayer = state.settings.humanPlayer;
          const aiSymbol = humanPlayer === 'X' ? 'O' : 'X';

          // Ход ИИ только если следующий ход — ИИ
          if (statusAfterPlayer.currentPlayer === aiSymbol) {
            // Защита: не вызываем ИИ на заполненной доске
            if (isBoardFull(boardAfterPlayer)) {
              return {
                ...state,
                screen: 'result',
                board: boardAfterPlayer,
                status: statusAfterPlayer,
              };
            }

            const aiMoveIndex = getBestMove(boardAfterPlayer, aiSymbol);
            const boardAfterAi = applyMove(boardAfterPlayer, aiMoveIndex, aiSymbol);
            const statusAfterAi = computeGameStatus(boardAfterAi, aiSymbol);

            // Если партия завершена после хода ИИ — переходим на result
            if (statusAfterAi.kind !== 'playing') {
              return {
                ...state,
                screen: 'result',
                board: boardAfterAi,
                status: statusAfterAi,
              };
            }

            return {
              ...state,
              board: boardAfterAi,
              status: statusAfterAi,
            };
          }
        }

        // PvP или ход человека в PvAI — возвращаем состояние после хода игрока
        return {
          ...state,
          board: boardAfterPlayer,
          status: statusAfterPlayer,
        };
      }

      case 'RESTART': {
        // Сброс к начальному состоянию — возврат в меню
        return { ...INITIAL_STATE };
      }

      case 'QUIT_TO_MENU': {
        // Выход в меню из любого экрана
        return { ...INITIAL_STATE };
      }

      default: {
        // Защита от неизвестных действий на уровне runtime
        const _exhaustive: never = action;
        logEvent('invalid_move', { action: _exhaustive });
        return state;
      }
    }
  } catch (error) {
    logEvent('reducer_error', { action, error });
    return state;
  }
}