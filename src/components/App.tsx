import { useReducer } from 'react';
import { gameReducer, INITIAL_STATE } from '../logic/gameReducer';
import { ErrorBoundary } from './ErrorBoundary';

/**
 * Корневой компонент приложения.
 * Владеет единственным useReducer (инвариант №1).
 * Управляет условным рендерингом экранов: menu → game → result.
 *
 * TODO: Реализовать полный рендеринг экранов (GameSettings, Board+StatusBar, ResultScreen)
 */
export function App() {
  const [_state, _dispatch] = useReducer(gameReducer, INITIAL_STATE);

  return (
    <ErrorBoundary>
      <div>Tic-Tac-Toe</div>
    </ErrorBoundary>
  );
}