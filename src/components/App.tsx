import { useReducer, useState, useCallback } from 'react';
import { gameReducer, INITIAL_STATE } from '../logic/gameReducer';
import { ErrorBoundary } from './ErrorBoundary';
import { ErrorFallback } from './ErrorBoundary/ErrorFallback';
import { GameSettings } from './GameSettings';
import { Board } from './Board';
import { StatusBar } from './StatusBar';
import { ResultScreen } from './ResultScreen';
import type { GameSettings as GameSettingsType } from '../types';
import styles from '../styles/App.module.css';

/**
 * Корневой компонент приложения.
 *
 * Владеет единственным useReducer (инвариант №1).
 * Управляет условным рендерингом экранов: menu → game → result.
 *
 * handleReset (FR-10):
 *   1. Диспатчит RESTART — сбрасывает GameState до INITIAL_STATE.
 *   2. Инкрементирует resetKey — принудительно пересоздаёт ErrorBoundary через key-проп.
 *
 * Инвариант №9: dangerouslySetInnerHTML не используется.
 * Инвариант №14: inline-стили отсутствуют.
 */
export function App() {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);
  const [resetKey, setResetKey] = useState(0);

  // FR-05: диспатч START_GAME с настройками
  const handleStartGame = useCallback((settings: GameSettingsType) => {
    dispatch({ type: 'START_GAME', payload: settings });
  }, []);

  // FR-06: диспатч MAKE_MOVE с индексом клетки
  const handleCellClick = useCallback((index: number) => {
    dispatch({ type: 'MAKE_MOVE', payload: { index } });
  }, []);

  // FR-07: диспатч RESTART
  const handleRestart = useCallback(() => {
    dispatch({ type: 'RESTART' });
  }, []);

  // FR-08: диспатч QUIT_TO_MENU
  const handleQuitToMenu = useCallback(() => {
    dispatch({ type: 'QUIT_TO_MENU' });
  }, []);

  // FR-10: сброс ErrorBoundary — сначала сбрасываем состояние, затем пересоздаём границу
  const handleReset = useCallback(() => {
    dispatch({ type: 'RESTART' });
    setResetKey((prev) => prev + 1);
  }, []);

  // FR-12: извлекаем winLine через type narrowing — доступно только при status.kind === 'won'
  const winLine = state.status.kind === 'won' ? state.status.winLine : undefined;

  // FR-11: Board заблокирован при завершённой партии
  const isBoardDisabled = state.status.kind !== 'playing';

  return (
    <ErrorBoundary
      key={resetKey}
      onReset={handleReset}
      fallback={<ErrorFallback onReset={handleReset} />}
    >
      <div className={styles.container}>
        {/* FR-02: экран меню */}
        {state.screen === 'menu' && (
          <GameSettings onStartGame={handleStartGame} />
        )}

        {/* FR-03: игровой экран */}
        {state.screen === 'game' && (
          <div className={styles.gameScreen}>
            <StatusBar status={state.status} settings={state.settings} />
            {/* FR-15: Board получает ровно 4 пропа */}
            <Board
              board={state.board}
              onCellClick={handleCellClick}
              disabled={isBoardDisabled}
              winLine={winLine}
            />
          </div>
        )}

        {/* FR-04: экран результата */}
        {state.screen === 'result' && (
          <ResultScreen
            status={state.status}
            onRestart={handleRestart}
            onQuitToMenu={handleQuitToMenu}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}