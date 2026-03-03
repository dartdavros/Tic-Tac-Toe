// Общие TypeScript-типы для всего приложения.
// Инвариант №11: нигде не используется any или unknown без обоснования.
// Инвариант №12: BoardState — кортеж фиксированной длины 9.
// Инвариант №13: GameSettings — дискриминированный union.

/**
 * Символ игрока: крестик или нолик.
 */
export type Player = 'X' | 'O';

/**
 * Значение клетки на доске: символ игрока или пустая клетка.
 */
export type CellValue = Player | null;

/**
 * Состояние игровой доски — кортеж фиксированной длины 9.
 * Использование кортежа (а не Array<CellValue>) обеспечивает
 * статическую проверку длины на уровне TypeScript.
 */
export type BoardState = [
  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,
];

/**
 * Текущий экран приложения.
 * Допустимые переходы: menu → game → result → menu.
 */
export type AppScreen = 'menu' | 'game' | 'result';

/**
 * Режим игры: два игрока или игрок против ИИ.
 */
export type GameMode = 'pvp' | 'pvai';

/**
 * Статус текущей партии — дискриминированный union.
 *
 * - playing: партия продолжается, указан текущий игрок
 * - won: партия завершена победой; winLine — кортеж из трёх индексов
 *   победной линии (все выигрышные линии на поле 3×3 содержат ровно 3 клетки)
 * - draw: партия завершена вничью
 */
export type GameStatus =
  | { kind: 'playing'; currentPlayer: Player }
  | { kind: 'won'; winner: Player; winLine: [number, number, number] }
  | { kind: 'draw' };

/**
 * Настройки игры — дискриминированный union.
 * Поле humanPlayer доступно только в режиме pvai.
 * Обращение к humanPlayer без проверки mode === 'pvai'
 * является ошибкой компиляции TypeScript.
 */
export type GameSettings =
  | { mode: 'pvp' }
  | { mode: 'pvai'; humanPlayer: Player };

/**
 * Полное состояние приложения.
 *
 * Поле settings опционально: на экране menu пользователь ещё не выбрал
 * режим игры, поэтому settings может быть undefined.
 * Поля board и status содержат значения по умолчанию на экране menu
 * и не используются для рендеринга до перехода на экран game.
 *
 * Поле history намеренно отсутствует — функция отмены хода
 * вне scope текущей спецификации (см. Q3 в Clarifications).
 */
export interface GameState {
  screen: AppScreen;
  board: BoardState;
  status: GameStatus;
  settings?: GameSettings;
}

/**
 * Действия, доступные компонентам для изменения состояния через dispatch.
 *
 * - START_GAME: начало новой партии с выбранными настройками
 * - MAKE_MOVE: ход игрока по индексу клетки [0..8]
 * - RESTART: сброс к начальному состоянию (экран menu)
 * - QUIT_TO_MENU: выход в меню из любого экрана
 *
 * Действие RESET_ERROR намеренно отсутствует — для сброса
 * любого некорректного состояния достаточно QUIT_TO_MENU (см. Q5).
 * Переход на экран result происходит автоматически внутри gameReducer
 * при обработке MAKE_MOVE — отдельного публичного действия GAME_OVER нет.
 */
export type GameAction =
  | { type: 'START_GAME'; payload: GameSettings }
  | { type: 'MAKE_MOVE'; payload: { index: number } }
  | { type: 'RESTART' }
  | { type: 'QUIT_TO_MENU' };