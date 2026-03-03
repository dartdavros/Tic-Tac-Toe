import { Component, type ErrorInfo, type ReactNode } from 'react';
import { logEvent } from '../utils/logger';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Граница ошибок рендеринга (инвариант ADR-005).
 * Единственный допустимый способ перехвата ошибок рендеринга в React —
 * классовый компонент с getDerivedStateFromError / componentDidCatch.
 *
 * TODO: Реализовать ErrorFallback с кнопкой «Начать заново» и dispatch(RESTART)
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    logEvent('render_error', { error, componentStack: info.componentStack });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div role="alert">
          <p>Произошла ошибка. Пожалуйста, перезагрузите страницу.</p>
        </div>
      );
    }
    return this.props.children;
  }
}