import styles from '../styles/Board.module.css';
import { Cell } from './Cell';
import type { BoardState } from '../types';

interface BoardProps {
  board: BoardState;
  onCellClick: (index: number) => void;
  winLine?: number[];
  disabled?: boolean;
}

/**
 * Компонент игрового поля 3×3.
 * Отрисовывает 9 клеток в структуре ARIA-grid и делегирует клики наверх.
 * Инвариант №2: данные только вниз через props, события только вверх через callbacks.
 * ADR-010: role="grid" → role="row" → role="gridcell" (полное ARIA-дерево).
 */
export function Board({ board, onCellClick, winLine, disabled }: BoardProps) {
  // Три строки по три клетки — формируем ARIA-дерево grid
  const rows = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
  ] as const;

  return (
    <div role="grid" aria-label="Игровое поле" className={styles.board}>
      {rows.map((rowIndices, rowIndex) => (
        <div key={rowIndex} role="row" className={styles.row}>
          {rowIndices.map((cellIndex) => {
            const isWinCell = winLine?.includes(cellIndex) ?? false;
            // Клетка заблокирована если disabled=true ИЛИ клетка занята
            const isCellDisabled = disabled === true || board[cellIndex] !== null;

            return (
              // Обёртка role="gridcell" на уровне Board — не нарушает контракт Cell
              <div
                key={cellIndex}
                role="gridcell"
                className={isWinCell ? styles.winCell : undefined}
              >
                <Cell
                  value={board[cellIndex]}
                  index={cellIndex}
                  onCellClick={() => onCellClick(cellIndex)}
                  isWinCell={isWinCell}
                  disabled={isCellDisabled}
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}