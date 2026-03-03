import type { GameStatus } from '../types';

interface StatusBarProps {
  status: GameStatus;
}

/**
 * Компонент строки статуса игры.
 * Отображает текущий ход, победителя или ничью.
 * Инвариант ADR-010: aria-live="polite" для объявления изменений скринридерам.
 *
 * TODO: Реализовать полный рендеринг с текстовыми сообщениями для каждого статуса
 */
export function StatusBar({ status }: StatusBarProps) {
  void status;
  return (
    <div aria-live="polite">
      {/* TODO: Отобразить текст статуса в зависимости от status.kind */}
    </div>
  );
}