import styles from '../styles/Cell.module.css';
import type { CellValue } from '../types';

/**
 * Интерфейс пропсов компонента Cell.
 * Экспортируется именованным экспортом согласно FR-12.
 */
export interface CellProps {
  value: CellValue;
  index: number;
  onCellClick: (index: number) => void;
  disabled?: boolean;
  isWinCell?: boolean;
}

/**
 * Вычисляет человекочитаемое описание значения клетки для aria-label.
 */
function getCellValueLabel(value: CellValue): string {
  if (value === 'X') return 'крестик';
  if (value === 'O') return 'нолик';
  return 'пусто';
}

/**
 * Вычисляет CSS-класс значения клетки.
 */
function getValueClassName(value: CellValue): string {
  if (value === 'X') return styles.cellX;
  if (value === 'O') return styles.cellO;
  return styles.cellEmpty;
}

/**
 * Компонент отдельной клетки игрового поля.
 *
 * Корневой элемент — нативный <button>, что обеспечивает:
 * - поддержку клавиатурной навигации (Enter, Space) без onKeyDown;
 * - нативную блокировку кликов при disabled={true} на уровне браузера.
 *
 * Не хранит локального состояния.
 * Инвариант ADR-010: aria-label, aria-disabled для скринридеров.
 */
export function Cell({ value, index, onCellClick, disabled = false, isWinCell: _isWinCell }: CellProps) {
  // row и col вычисляются из index (0-based → 1-based)
  const row = Math.floor(index / 3) + 1;
  const col = (index % 3) + 1;
  const ariaLabel = `Клетка ${row}×${col}, ${getCellValueLabel(value)}`;

  // Базовый класс cell присутствует всегда + класс значения
  const className = `${styles.cell} ${getValueClassName(value)}`;

  function handleClick() {
    if (!disabled) {
      onCellClick(index);
    }
  }

  return (
    <button
      className={className}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={handleClick}
    >
      {value}
    </button>
  );
}