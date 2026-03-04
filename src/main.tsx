import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';
import { App } from './components/App';

/**
 * Точка входа приложения.
 * FR-16: App оборачивается в React.StrictMode.
 * NFR-03: gameReducer является чистой функцией — двойной вызов в StrictMode
 * не приводит к артефактам состояния.
 */
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Корневой элемент #root не найден в DOM');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);