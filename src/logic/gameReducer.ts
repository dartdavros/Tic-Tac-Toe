// Редьюсер игрового состояния — единственная точка мутации (инвариант №1).
// Инвариант №6: редьюсер не выбрасывает исключений при любых входных данных.
// ADR-007: защитный try/catch перехватывает все непредвиденные ошибки.
// ADR-003: синхронный вызов ИИ внутри редьюсера гарантирует атомарность.

import type {
  GameState,
  GameAction,
  GameSettings,
  GameStatus,
  BoardState,
} from '../types';
import {
  checkWinner,
  isBoardFull,
  applyMove,
} from './gameLogic';
import { getBestMove } from './aiPlayer';
import { logEvent } from '../utils/logger';

// FR-02: Пустая доска — кортеж фиксированной длины 9 (инвариант №12).
export const EMPTY_BOARD: BoardState = [
  null, null, null,
  null, null, null,
  null, null, null,
];

// FR-01: Начальное состояние приложения.
export const INITIAL_STATE: GameState = {
  screen: 'menu',
  board: EMPTY_BOARD,
  status: { kind: 'playing', currentPlayer: 'X' },
  settings: { mode: 'pvp' },
};

/**
 * FR-12: Определяет, является ли текущий ход ходом ИИ.
 *
 * Возвращает true только если:
 * - режим pvai
 * - статус 'playing'
 * - текущий игрок не совпадает с humanPlayer (т.е. сейчас ходит ИИ)
 *
 * @param status   - Текущий статус игры
 * @param settings - Настройки игры
 * @returns true, если сейчас ход ИИ
 */
export function isAiTurn(status: GameStatus, settings: GameSettings): boolean {
  if (settings.mode !== 'pvai') {
    return false;
  }
  if (status.kind !== 'playing') {
    return false;
  }
  return status.currentPlayer !== settings.humanPlayer;
}

/**
 * Применяет ход ИИ к доске и возвращает новое состояние.
 * Вспомогательная функция для устранения дублирования между START_GAME и MAKE_MOVE.
 *
 * Все ошибки (исключения от getBestMove, невалидный индекс) перехватываются
 * внутри этой функции. При ошибке вызывается logEvent и возвращается
 * stateAfterHuman без изменений (ход ИИ пропускается).
 *
 * Это гарантирует, что catch редьюсера вызывается только при действительно
 * непредвиденных ошибках вне applyAiMove (например, в applyMove хода игрока).
 *
 * @param stateAfterHuman - Состояние после хода человека (или начальное при START_GAME)
 * @param action          - Исходное действие (для логирования ошибок)
 * @returns Новое состояние с применённым ходом ИИ (или то же состояние при ошибке)
 */
function applyAiMove(
  stateAfterHuman: GameState,
  action: GameAction,
): GameState {
  const { board, settings } = stateAfterHuman;

  // Защита: не вызываем getBestMove на полной доске
  if (isBoardFull(board)) {
    return stateAfterHuman;
  }

  // settings.mode === 'pvai' гарантирован вызывающим кодом
  if (settings.mode !== 'pvai') {
    return stateAfterHuman;
  }

  const aiSymbol = settings.humanPlayer === 'X' ? 'O' : 'X';

  let aiMoveIndex: number;

  try {
    // getBestMove может выбросить исключение (например, при некорректном состоянии).
    // Перехватываем здесь, чтобы ход игрока не откатывался через catch редьюсера.
    aiMoveIndex = getBestMove(board, aiSymbol);
  } catch (error) {
    // FR-06 / FR-09: логируем ошибку и возвращаем состояние без хода ИИ.
    logEvent('reducer_error', { action, error });
    return stateAfterHuman;
  }

  // FR-06 / FR-03: если getBestMove вернул null или -1 — логируем и пропускаем ход ИИ.
  if (aiMoveIndex == null || aiMoveIndex === -1) {
    logEvent('reducer_error', {
      action,
      error: new Error(
        `getBestMove вернул недопустимое значение: ${String(aiMoveIndex)}`,
      ),
    });
    return stateAfterHuman;
  }

  const boardAfterAi = applyMove(board, aiMoveIndex, aiSymbol);

  // FR-05 / FR-03: проверяем победителя после хода ИИ (для единообразия)
  const statusAfterAi = checkWinner(boardAfterAi, aiSymbol);

  const isGameOver =
    statusAfterAi.kind === 'won' || statusAfterAi.kind === 'draw';

  return {
    ...stateAfterHuman,
    board: boardAfterAi,
    status: statusAfterAi,
    screen: isGameOver ? 'result' : 'game',
  };
}

/**
 * Обрабатывает действие START_GAME.
 * FR-03: сбрасывает доску, устанавливает настройки, переводит screen: 'game'.
 * Если режим pvai и ИИ ходит первым (humanPlayer === 'O') — применяет ход ИИ.
 */
function handleStartGame(
  action: Extract<GameAction, { type: 'START_GAME' }>,
): GameState {
  const { payload: settings } = action;

  const freshState: GameState = {
    screen: 'game',
    board: EMPTY_BOARD,
    status: { kind: 'playing', currentPlayer: 'X' },
    settings,
  };

  // FR-03: если pvai и ИИ ходит первым (X всегда начинает, humanPlayer === 'O')
  if (settings.mode === 'pvai' && settings.humanPlayer === 'O') {
    return applyAiMove(freshState, action);
  }

  return freshState;
}

/**
 * Обрабатывает действие MAKE_MOVE.
 * FR-04: валидирует ход перед применением.
 * FR-05: проверяет победителя после хода игрока.
 * FR-06: в режиме pvai синхронно применяет ход ИИ (атомарная транзакция).
 */
function handleMakeMove(
  state: GameState,
  action: Extract<GameAction, { type: 'MAKE_MOVE' }>,
): GameState {
  const { index } = action.payload;

  // FR-04: валидация — экран должен быть 'game'
  if (state.screen !== 'game') {
    return state;
  }

  // FR-04: валидация — партия должна продолжаться
  if (state.status.kind !== 'playing') {
    return state;
  }

  // FR-04: валидация — индекс в допустимом диапазоне
  if (index < 0 || index > 8) {
    return state;
  }

  // FR-04: валидация — клетка должна быть свободна
  if (state.board[index] !== null) {
    return state;
  }

  const currentPlayer = state.status.currentPlayer;
  const boardAfterPlayer = applyMove(state.board, index, currentPlayer);

  // FR-05: проверяем победителя после хода игрока
  const statusAfterPlayer = checkWinner(boardAfterPlayer, currentPlayer);
  const isGameOverAfterPlayer =
    statusAfterPlayer.kind === 'won' || statusAfterPlayer.kind === 'draw';

  const stateAfterPlayer: GameState = {
    ...state,
    board: boardAfterPlayer,
    status: statusAfterPlayer,
    screen: isGameOverAfterPlayer ? 'result' : 'game',
  };

  // FR-11: переход в result происходит только внутри редьюсера (инвариант №5)
  if (isGameOverAfterPlayer) {
    return stateAfterPlayer;
  }

  // FR-06: если режим pvai и сейчас ход ИИ — применяем ход ИИ атомарно
  if (isAiTurn(statusAfterPlayer, state.settings)) {
    return applyAiMove(stateAfterPlayer, action);
  }

  return stateAfterPlayer;
}

/**
 * Редьюсер игрового состояния.
 *
 * Инвариант №1: единственная точка мутации GameState.
 * Инвариант №6: никогда не выбрасывает исключений.
 * ADR-008: защитный try/catch — при исключении возвращает текущее состояние.
 * FR-09: logEvent вызывается ТОЛЬКО в блоке catch (здесь и в applyAiMove).
 *
 * @param state  - Текущее состояние
 * @param action - Действие
 * @returns Новое состояние (или текущее при невалидном/неожиданном действии)
 */
export function gameReducer(state: GameState, action: GameAction): GameState {
  try {
    switch (action.type) {
      case 'START_GAME':
        return handleStartGame(action);

      case 'MAKE_MOVE':
        return handleMakeMove(state, action);

      // FR-07: RESTART возвращает полное начальное состояние
      case 'RESTART':
        return INITIAL_STATE;

      // FR-08: QUIT_TO_MENU возвращает полное начальное состояние
      case 'QUIT_TO_MENU':
        return INITIAL_STATE;

      default:
        // Неизвестное действие — возвращаем текущее состояние без изменений
        return state;
    }
  } catch (error) {
    // FR-09: логируем с полным объектом action (ответ на Question 6)
    logEvent('reducer_error', { action, error });
    return state;
  }
}