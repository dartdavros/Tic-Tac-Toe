// Минимальный слой логирования.
// В dev-режиме пишет в консоль, в prod подключается к аналитике.
// Инвариант №3: не импортирует ничего из components/, не использует React API.

/**
 * Логирует событие с опциональной полезной нагрузкой.
 * В dev-режиме выводит в консоль через console.warn.
 * В prod-режиме — точка расширения для подключения внешней аналитики.
 *
 * @param event - Название события (например, 'invalid_move', 'reducer_error')
 * @param payload - Опциональные данные события для отладки
 */
export function logEvent(event: string, payload?: unknown): void {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.warn(`[logEvent] ${event}`, payload);
  }
  // TODO: В prod подключить внешнюю аналитику (например, Vercel Analytics)
}