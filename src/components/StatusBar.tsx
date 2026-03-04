import styles from '../styles/StatusBar.module.css';
import type { GameStatus } from '../types';

interface StatusBarProps {
  status: GameStatus;
}

/**
 * Вычисляет текст сообщения на основе текущего статуса игры.
 */
function getStatusText(status: GameStatus): string {
  if (status.kind === 'playing') {
    return `Ход игрока ${status.currentPlayer}`;
  }
  if (status.kind === 'won') {
    return `Победил игрок ${status.winner}!`;
  }
  return 'Ничья!';
}

/**
 * Вычисляет CSS-класс для цветовой индикации на основе статуса игры.
 * FR-06: playerX → var(--color-player-x), playerO → var(--color-player-o),
 * draw → var(--color-text-secondary).
 */
function getStatusClassName(status: GameStatus): string {
  if (status.kind === 'playing') {
    return status.currentPlayer === 'X' ? styles.playerX : styles.playerO;
  }
  if (status.kind === 'won') {
    return status.winner === 'X' ? styles.playerX : styles.playerO;
  }
  return styles.draw;
}

/**
 * Компонент строки статуса игры.
 *
 * Чисто презентационный — не хранит локального состояния (NFR-01).
 * Корневой элемент <p> — семантически подходящий тег для короткого
 * текстового сообщения (FR-09).
 *
 * ADR-010: aria-live="polite" и aria-atomic="true" обеспечивают объявление
 * всего текста целиком при каждом изменении статуса для скринридеров.
 *
 * Условный рендеринг (FR-10) — ответственность родительского компонента.
 */
export function StatusBar({ status }: StatusBarProps) {
  return (
    <p
      className={getStatusClassName(status)}
      aria-live="polite"
      aria-atomic="true"
    >
      {getStatusText(status)}
    </p>
  );
}