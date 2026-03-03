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
}

/**
 * Вычисляет человекочитаемое описание значения клетки для aria-label.
 * FR-04: 'пусто' | 'крестик' | 'нолик'
 */
function getCellValueLabel(value: CellValue): string {
  if (value === 'X') return 'крестик';
  if (value === 'O') return 'нолик';
  return 'пусто';
}

/**
 * Вычисляет CSS-класс значения клетки согласно FR-11.
 * Базовый класс cell присутствует всегда — добавляется снаружи.
 */
function getValueClassName(value: CellValue): string {
  if (value === 'X') return styles.cellX;
  if (value === 'O') return styles.cellO;
  return styles.cellEmpty;
}

/**
 * Компонент отдельной клетки игрового поля.
 *
 * Корневой элемент — нативный <button> (FR-03), что обеспечивает:
 * - поддержку клавиатурной навигации (Enter, Space) без onKeyDown;
 * - нативную блокировку кликов при disabled={true} на уровне браузера.
 *
 * Не хранит локального состояния (NFR-01).
 * Инвариант ADR-010: aria-label, aria-disabled для скринридеров.
 */
export function Cell({ value, index, onCellClick, disabled = false }: CellProps) {
  // FR-04: row и col вычисляются из index (0-based → 1-based)
  const row = Math.floor(index / 3) + 1;
  const col = (index % 3) + 1;
  const ariaLabel = `Клетка ${row}×${col}, ${getCellValueLabel(value)}`;

  // FR-11: базовый класс cell присутствует всегда + класс значения
  const className = `${styles.cell} ${getValueClassName(value)}`;

  // FR-05: onClick вызывает onCellClick(index)
  // FR-06: при disabled нативная кнопка блокирует клик на уровне браузера,
  //        onCellClick не вызывается без дополнительной проверки
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