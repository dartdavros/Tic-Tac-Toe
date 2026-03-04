import styles from '../styles/ResultScreen.module.css';
import type { GameStatus } from '../types';

/**
 * Тип пропсов компонента ResultScreen.
 * Принимает только завершённые состояния игры: 'won' или 'draw'.
 * Тип 'playing' исключён через Extract — инвариант №13 (дискриминированный union).
 */
export type ResultStatus = Extract<GameStatus, { kind: 'won' } | { kind: 'draw' }>;

interface ResultScreenProps {
  status: ResultStatus;
  onRestart: () => void;
  onQuitToMenu: () => void;
}

/**
 * Компонент экрана результата партии.
 *
 * Отображается после завершения игры (победа или ничья).
 * Полностью заменяет Board в дереве рендеринга — App рендерит либо Board,
 * либо ResultScreen, но не оба одновременно (ADR-004, FR-04 из архитектуры).
 *
 * Инварианты:
 * - Не хранит локального состояния (NFR-01).
 * - Стили только через CSS Modules из src/styles/ResultScreen.module.css (ADR-004).
 * - aria-live="assertive" на корневом контейнере (FR-09, ADR-010).
 * - Имя победителя окрашено через inline-стиль с CSS-переменной (FR-02).
 */
export function ResultScreen({ status, onRestart, onQuitToMenu }: ResultScreenProps) {
  return (
    <div
      className={styles.container}
      aria-live="assertive"
    >
      <div className={styles.card}>
        {/* Заголовок результата */}
        <p className={styles.resultText}>
          {status.kind === 'won' ? (
            <>
              {'Победил игрок '}
              {/*
               * STYLE_EXCEPTION: цвет победителя задаётся динамически через
               * CSS-переменную --color-x или --color-o в зависимости от значения
               * winner. Невозможно выразить через статический CSS-класс без
               * дублирования логики в CSS. Переменные определены в global.css.
               */}
              <span
                className={styles.winnerName}
                style={{
                  color: `var(--color-${status.winner === 'X' ? 'x' : 'o'})`,
                }}
              >
                {status.winner}
              </span>
              {'!'}
            </>
          ) : (
            'Ничья!'
          )}
        </p>

        {/* Кнопки действий — горизонтально, «Играть снова» левее «В меню» (FR-10) */}
        <div className={styles.actions}>
          {/* FR-04: primary-стиль, вызывает onRestart */}
          <button
            type="button"
            className={styles.buttonPrimary}
            onClick={onRestart}
          >
            Играть снова
          </button>

          {/* FR-05: secondary-стиль, вызывает onQuitToMenu */}
          <button
            type="button"
            className={styles.buttonSecondary}
            onClick={onQuitToMenu}
          >
            В меню
          </button>
        </div>
      </div>
    </div>
  );
}