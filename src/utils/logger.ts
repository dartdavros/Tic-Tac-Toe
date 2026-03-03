/**
 * Минимальный слой логирования.
 * В dev-режиме пишет в консоль, в prod подключается к аналитике.
 * Инвариант: logEvent — единственная точка логирования в приложении.
 */

/**
 * Допустимые типы событий для логирования.
 * Расширяйте этот union при добавлении новых событий.
 */
export type LogEventType =
  | 'render_error'
  | 'reducer_error'
  | 'invalid_action'
  | 'unknown_action';

/**
 * Логирует событие с опциональной полезной нагрузкой.
 *
 * @param event - Тип события
 * @param payload - Дополнительные данные (опционально)
 */
export function logEvent(
  event: LogEventType,
  payload?: Record<string, unknown>,
): void {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.warn(`[logEvent] ${event}`, payload);
  }
  // TODO: В prod подключить внешнюю аналитику (например, Vercel Analytics)
}