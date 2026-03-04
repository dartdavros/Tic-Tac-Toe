import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from './components/ErrorBoundary';
import { App } from './components/App';
import './styles/global.css';

// FR-03: явная проверка наличия элемента #root перед монтированием.
// Обеспечивает информативное сообщение об ошибке вместо неявного сбоя React.
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Элемент #root не найден');
}

// FR-04: структура дерева <StrictMode><ErrorBoundary><App/></ErrorBoundary></StrictMode>.
// ErrorBoundary в main.tsx — последний рубеж защиты (ADR-005).
// При ошибке на этом уровне dispatch недоступен → перезагрузка страницы.
function handleRootReset() {
  window.location.reload();
}

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary onReset={handleRootReset}>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);