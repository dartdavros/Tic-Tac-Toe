import styles from './ErrorFallback.module.css';

/**
 * Интерфейс пропсов компонента ErrorFallback.
 */
interface ErrorFallbackProps {
  onReset: () => void;
}

/**
 * Компонент заглушки при ошибке рендеринга.
 * NFR-01: максимально прост — не содержит сложной логики,
 * которая сама может выбросить исключение.
 * FR-05: отображает «Что-то пошло не так» и кнопку «Начать заново».
 * FR-07: использует стандартный <button> с понятным текстом.
 */
export function ErrorFallback({ onReset }: ErrorFallbackProps) {
  return (
    <div className={styles.fallback} role="alert">
      <p className={styles.title}>Что-то пошло не так</p>
      <button className={styles.resetButton} onClick={onReset}>
        Начать заново
      </button>
    </div>
  );
}