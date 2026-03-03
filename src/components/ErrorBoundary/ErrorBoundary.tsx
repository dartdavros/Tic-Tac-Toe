import { Component, type ErrorInfo, type ReactNode } from 'react';
import { logEvent } from '../../utils/logger';
import { ErrorFallback } from './ErrorFallback';
import styles from './ErrorBoundary.module.css';

/**
 * Пропсы компонента ErrorBoundary.
 * FR-04: принимает children, fallback (для совместимости интерфейса,
 * игнорируется при рендеринге) и onReset.
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  /** Принимается для совместимости интерфейса, но игнорируется при рендеринге. */
  fallback?: ReactNode;
  onReset: () => void;
}

/**
 * Внутреннее состояние ErrorBoundary.
 */
interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Граница ошибок рендеринга (ADR-005).
 * Единственный допустимый способ перехвата ошибок рендеринга в React —
 * классовый компонент с getDerivedStateFromError / componentDidCatch.
 *
 * FR-01: реализует getDerivedStateFromError и componentDidCatch.
 * FR-02: при перехвате вызывает logEvent с нативными объектами Error и ErrorInfo.
 * FR-03: при hasError рендерит встроенный ErrorFallback; prop fallback игнорируется.
 * FR-06: кнопка «Начать заново» сбрасывает hasError и вызывает onReset от App.
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
    this.handleReset = this.handleReset.bind(this);
  }

  static getDerivedStateFromError(_error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // FR-02: передаём нативные объекты как есть, без сериализации
    logEvent('render_error', { error, errorInfo });
  }

  /**
   * Сбрасывает внутреннее состояние границы ошибки и вызывает onReset от App.
   * FR-06: одновременно setState({ hasError: false }) и dispatch({ type: 'RESET_GAME' }).
   */
  handleReset(): void {
    this.setState({ hasError: false });
    this.props.onReset();
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // FR-03: всегда рендерим встроенный ErrorFallback, prop fallback игнорируется
      return (
        <div className={styles.container}>
          <ErrorFallback onReset={this.handleReset} />
        </div>
      );
    }
    return this.props.children;
  }
}