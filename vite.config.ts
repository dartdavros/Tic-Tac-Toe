import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    // Среда jsdom для тестирования React-компонентов
    environment: 'jsdom',
    // Файл настройки тестовой среды (jest-dom матчеры)
    setupFiles: ['./src/test-setup.ts'],
    // Глобальные переменные Vitest (describe, it, expect) без импорта
    globals: true,
    // Настройка покрытия кода
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      // Включаем только файлы логики — компоненты и утилиты
      // покрываются отдельными тестами и не должны влиять на
      // пороги при запуске тестов логики.
      include: ['src/logic/**/*.ts'],
      exclude: [
        // Тестовые файлы не входят в покрытие
        'src/logic/**/*.test.ts',
      ],
      // Глобальные пороги покрытия для модулей логики.
      // Конституция проекта: gameLogic и aiPlayer ≥ 90%,
      // общий порог ≥ 60%.
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 85,
        statements: 90,
      },
    },
  },
});