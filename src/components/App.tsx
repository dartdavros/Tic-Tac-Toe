import { useReducer, useCallback } from 'react';
import { gameReducer, INITIAL_STATE } from '../logic/gameReducer';
import { ErrorBoundary } from './ErrorBoundary';

/**
 * Корневой компонент приложения.
 * Владеет единственным useReducer (инвариант №1).
 * Управляет условным рендерингом экранов: menu → game → result.
 *
 * onReset передаётся в ErrorBoundary и вызывает dispatch({ type: 'RESET_GAME' })
 * для полного сброса игрового состояния при ошибке рендеринга (FR-08).
 *
 * TODO: Реализовать полный рендеринг экранов (GameSettings, Board+StatusBar, ResultScreen)
 */
export function App() {
  const [_state, dispatch] = useReducer(gameReducer, INITIAL_STATE);

  // FR-08: onReset вызывает dispatch({ type: 'RESET_GAME' })
  const handleReset = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, []);

  return (
    <ErrorBoundary onReset={handleReset}>
      <div>Tic-Tac-Toe</div>
    </ErrorBoundary>
  );
}