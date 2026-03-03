import type { CellValue } from '../types';

interface CellProps {
  value: CellValue;
  index: number;
  onClick: () => void;
  isWinCell?: boolean;
  disabled?: boolean;
}

/**
 * Компонент отдельной клетки игрового поля.
 * Не хранит локального состояния.
 * Инвариант ADR-010: role="button", aria-label, tabIndex, onKeyDown.
 *
 * TODO: Реализовать полный рендеринг с a11y-атрибутами и обработкой клавиш
 */
export function Cell({ value, index, onClick, isWinCell, disabled }: CellProps) {
  void isWinCell;
  void disabled;

  const row = Math.floor(index / 3) + 1;
  const col = (index % 3) + 1;
  const label = `Клетка ${row}×${col}, ${value ?? 'пусто'}`;

  return (
    <div
      role="button"
      aria-label={label}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
    >
      {value}
    </div>
  );
}