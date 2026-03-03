/**
 * Модуль логирования событий приложения.
 * Инвариант №3: не импортирует ничего из components/ и не использует React API.
 * FR-04: экспортирует тип LogEventType и функцию logEvent.
 */

/**
 * Строгий union допустимых типов событий.
 * Передача неизвестного типа вызывает ошибку компиляции TypeScript (FR-01).
 */
export type LogEventType = 'reducer_error' | 'render_error';

/**
 * Логирует событие приложения.
 *
 * В dev-режиме (import.meta.env.DEV === true) выводит сообщение в консоль
 * через console.warn с префиксом [logEvent] (FR-02).
 *
 * В production-режиме является no-op (FR-03).
 *
 * Тело обёрнуто в try/catch — функция никогда не выбрасывает исключений (FR-05).
 *
 * @param event   - Тип события (ограничен union LogEventType)
 * @param payload - Произвольные данные события (опционально)
 */
export function logEvent(event: LogEventType, payload?: unknown): void {
  try {
    if (import.meta.env.DEV) {
      console.warn('[logEvent]', event, payload ?? '');
    } else {
      // TODO: подключить аналитику в production
    }
  } catch {
    // Исключение внутри логгера молча игнорируется,
    // чтобы логгер никогда не нарушал работу вызывающего кода (FR-05).
  }
}