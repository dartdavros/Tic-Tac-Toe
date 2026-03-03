/**
 * Общие TypeScript-типы приложения.
 * Инвариант №12: BoardState — кортеж фиксированной длины 9.
 * Инвариант №13: GameSettings — дискриминированный union (ADR-006).
 */

export type Player = 'X' | 'O';
export type CellValue = Player | null;

/**
 * Инвариант №12: кортеж фиксированной длины 9 — не Array<CellValue>.
 */
export type BoardState = [
  CellValue, CellValue, CellValue,
  CellValue, CellValue, CellValue,
  CellValue, CellValue, CellValue,
];

export type AppScreen = 'menu' | 'game' | 'result';
export type GameMode = 'pvp' | 'pvai';

export type GameStatus =
  | { kind: 'playing'; currentPlayer: Player }
  | { kind: 'won'; winner: Player; winLine: number[] }
  | { kind: 'draw' };

/**
 * Инвариант №13: дискриминированный union.
 * Поле humanPlayer доступно только при mode === 'pvai'.
 * Обращение к humanPlayer без проверки mode является ошибкой компиляции.
 */
export type GameSettings =
  | { mode: 'pvp' }
  | { mode: 'pvai'; humanPlayer: Player };

export interface GameState {
  screen: AppScreen;
  board: BoardState;
  status: GameStatus;
  settings: GameSettings;
}

/**
 * Публичные действия, доступные компонентам.
 * Переход на экран result происходит автоматически внутри редьюсера
 * при обработке MAKE_MOVE — отдельного публичного действия GAME_OVER нет.
 * RESET_GAME используется ErrorBoundary для полного сброса состояния.
 */
export type GameAction =
  | { type: 'START_GAME'; payload: GameSettings }
  | { type: 'MAKE_MOVE'; payload: { index: number } }
  | { type: 'RESTART' }
  | { type: 'QUIT_TO_MENU' }
  | { type: 'RESET_GAME' };