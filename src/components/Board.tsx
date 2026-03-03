import type { BoardState } from '../types';

interface BoardProps {
  board: BoardState;
  onCellClick: (index: number) => void;
  winLine?: number[];
}

/**
 * Компонент игрового поля 3×3.
 * Отрисовывает 9 клеток и делегирует клики наверх через onCellClick.
 * Инвариант №2: данные только вниз через props, события только вверх через callbacks.
 *
 * TODO: Реализовать полный рендеринг поля с компонентами Cell
 */
export function Board({ board, onCellClick, winLine }: BoardProps) {
  void board;
  void onCellClick;
  void winLine;
  return (
    <div role="grid" aria-label="Игровое поле">
      {/* TODO: Отрендерить 9 компонентов Cell */}
    </div>
  );
}