# Clarifications: error-boundary-component

## Question 1
Как именно ErrorBoundary использует prop `fallback`? Спецификация одновременно требует принимать `fallback: React.ReactNode` (FR-04) и рендерить `ErrorFallback` (FR-03), но не объясняет связь между ними.

*Context:* Если `fallback` — это и есть `ErrorFallback`, то как передаётся `onReset`? Если это разные вещи, то когда рендерится каждый из них?

**Options:**
- A) Prop `fallback` игнорируется: ErrorBoundary всегда рендерит встроенный ErrorFallback с onReset через setState
- B) Prop `fallback` заменяет ErrorFallback полностью — ErrorBoundary рендерит `fallback` как есть, ErrorFallback существует отдельно как дефолтное значение
- C) Prop `fallback` удаляется из интерфейса — ErrorBoundary принимает только `children` и `onReset`, всегда рендерит ErrorFallback

**Answer:**
Prop `fallback` игнорируется: ErrorBoundary всегда рендерит встроенный ErrorFallback с onReset через setState

## Question 2
Откуда берётся `onReset` для ErrorFallback — кто его передаёт и что именно он делает на уровне приложения?

*Context:* FR-06 требует вызывать `onReset` при нажатии кнопки, но не определяет, кто предоставляет этот колбэк и что происходит с состоянием игры (gameReducer) при сбросе.

**Options:**
- A) onReset передаётся как prop в ErrorBoundary от App, вызывает dispatch({ type: 'RESET_GAME' }) для сброса игрового состояния
- B) onReset — внутренний метод ErrorBoundary (только setState({ hasError: false })), внешний колбэк не нужен
- C) ErrorBoundary принимает prop `onReset?: () => void` — если передан, вызывается вместе со setState; если нет, только setState

**Answer:**
onReset передаётся как prop в ErrorBoundary от App, вызывает dispatch({ type: 'RESET_GAME' }) для сброса игрового состояния

## Question 3
Нужно ли писать тесты для ErrorBoundary и ErrorFallback, и если да — какой минимальный набор?

*Context:* Конституция требует smoke-тесты рендеринга ключевых компонентов и минимальное покрытие 60%; открытый вопрос в спецификации прямо спрашивает об этом.

**Options:**
- A) Только smoke-тест ErrorFallback: рендерится сообщение и кнопка, клик вызывает onReset
- B) Smoke-тест ErrorFallback + интеграционный тест ErrorBoundary: компонент-бомба бросает ошибку, проверяем что рендерится fallback и вызывается logEvent
- C) Тесты не нужны — ErrorBoundary сложно тестировать, покрытие обеспечивается другими модулями

**Answer:**
Тесты не нужны — ErrorBoundary сложно тестировать, покрытие обеспечивается другими модулями

## Question 4
Где физически располагаются файлы ErrorBoundary и ErrorFallback согласно ADR-008 (co-location) и ADR-004 (CSS Modules)?

*Context:* ADR-008 требует размещать тесты рядом с файлами; ADR-004 требует CSS-модуль для каждого компонента — нужно определить структуру директорий.

**Options:**
- A) Один каталог src/components/ErrorBoundary/: ErrorBoundary.tsx, ErrorFallback.tsx, ErrorBoundary.module.css, ErrorFallback.module.css, index.ts
- B) Два отдельных каталога: src/components/ErrorBoundary/ и src/components/ErrorFallback/ — каждый со своим module.css
- C) Оба компонента в одном файле src/components/ErrorBoundary.tsx без отдельного CSS-модуля (ErrorFallback слишком прост)

**Answer:**
Один каталог src/components/ErrorBoundary/: ErrorBoundary.tsx, ErrorFallback.tsx, ErrorBoundary.module.css, ErrorFallback.module.css, index.ts

## Question 5
Что именно передаётся в logEvent при вызове logEvent('render_error', { error, errorInfo }) — нативные объекты Error и ErrorInfo или сериализованные данные?

*Context:* logEvent упоминается в спецификации и ADR-005, но его сигнатура нигде не определена; от этого зависит типизация вызова в componentDidCatch.

**Options:**
- A) Передаются нативные объекты как есть: logEvent('render_error', { error: Error, errorInfo: React.ErrorInfo })
- B) Передаются сериализованные строки: logEvent('render_error', { error: error.message, stack: errorInfo.componentStack })
- C) logEvent — заглушка-утилита, которую нужно создать в рамках этой задачи с сигнатурой logEvent(event: string, payload: Record<string, unknown>): void

**Answer:**
Передаются нативные объекты как есть: logEvent('render_error', { error: Error, errorInfo: React.ErrorInfo })
