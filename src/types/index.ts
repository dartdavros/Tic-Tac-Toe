// Общие TypeScript-типы для всего приложения.
// Инвариант №12: BoardState — кортеж фиксированной длины 9.
// Инвариант №13: GameSettings — дискриминированный union (ADR-006).

/** Символ игрока: крестик или нолик */
export type Player = 'X' | 'O';

/** Значение клетки: символ игрока или пустая клетка */
export type CellValue = Player | null;

/**
 * Состояние игрового поля — кортеж фиксированной длины 9.
 * Инвариант №12: нигде не используется Array<CellValue> вместо BoardState.
 */
export type BoardState = [
  CellValue, CellValue, CellValue,
  CellValue, CellValue, CellValue,
  CellValue, CellValue, CellValue,
];

/** Текущий экран приложения */
export type AppScreen = 'menu' | 'game' | 'result';

/** Режим игры */
export type GameMode = 'pvp' | 'pvai';

/**
 * Статус текущей игры.
 * Дискриминированный union по полю kind.
 */
export type GameStatus =
  | { kind: 'playing'; currentPlayer: Player }
  | { kind: 'won'; winner: Player; winLine: number[] }
  | { kind: 'draw' };

/**
 * Настройки игры — дискриминированный union (ADR-006, ADR-007).
 * Поле humanPlayer доступно только при mode === 'pvai'.
 * Инвариант №13: обращение к humanPlayer без проверки mode — ошибка компиляции.
 */
export type GameSettings =
  | { mode: 'pvp' }
  | { mode: 'pvai'; humanPlayer: Player };

/**
 * Полное состояние приложения.
 * Хранится в useReducer (ADR-001, инвариант №1).
 */
export interface GameState {
  screen: AppScreen;
  board: BoardState;
  status: GameStatus;
  settings: GameSettings;
}

/**
 * Все допустимые действия для gameReducer.
 * Переход на экран result происходит автоматически внутри редьюсера
 * при обработке MAKE_MOVE — отдельного публичного действия GAME_OVER нет.
 */
export type GameAction =
  | { type: 'START_GAME'; payload: GameSettings }
  | { type: 'MAKE_MOVE'; payload: { index: number } }
  | { type: 'RESTART' }
  | { type: 'QUIT_TO_MENU' };