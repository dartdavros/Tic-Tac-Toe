// Минимальный слой логирования.
// В dev-режиме пишет в консоль, в prod — точка расширения для аналитики.
// Инвариант №6: редьюсер использует logEvent для логирования ошибок без выброса исключений.

type LogPayload = Record<string, unknown>;

/**
 * Логирует событие с опциональными данными.
 * В dev-режиме выводит в консоль.
 * В prod-режиме — точка расширения для подключения аналитики.
 *
 * @param event - Название события
 * @param payload - Дополнительные данные (опционально)
 */
export function logEvent(event: string, payload?: LogPayload): void {
  if (import.meta.env.DEV) {
    console.warn(`[logEvent] ${event}`, payload ?? '');
  }
  // В prod здесь можно подключить аналитику, например:
  // window.analytics?.track(event, payload);
}