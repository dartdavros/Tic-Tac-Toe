/**
 * Smoke-тесты компонента App.
 * FR-13: проверяет начальный рендер без ошибок и отображение экрана меню.
 * ADR-008: тест располагается рядом с тестируемым файлом (co-location).
 *
 * Примечание: тест проверяет только начальный рендер (экран меню).
 * Интеграционные сценарии (полная игра) покрываются gameReducer.test.ts.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('App — начальный рендер', () => {
  it('монтируется без ошибок', () => {
    expect(() => render(<App />)).not.toThrow();
  });

  it('отображает экран меню при первом запуске', () => {
    render(<App />);
    // GameSettings отображает заголовок «Крестики-нолики»
    expect(
      screen.getByRole('heading', { name: 'Крестики-нолики' }),
    ).toBeInTheDocument();
  });

  it('отображает кнопку «Начать игру» на экране меню', () => {
    render(<App />);
    expect(
      screen.getByRole('button', { name: 'Начать игру' }),
    ).toBeInTheDocument();
  });

  it('не отображает игровое поле на экране меню', () => {
    render(<App />);
    // Board имеет role="grid" с aria-label="Игровое поле"
    expect(
      screen.queryByRole('grid', { name: 'Игровое поле' }),
    ).not.toBeInTheDocument();
  });

  it('не отображает экран результата при первом запуске', () => {
    render(<App />);
    // ResultScreen содержит кнопки «Играть снова» и «В меню»
    expect(
      screen.queryByRole('button', { name: 'Играть снова' }),
    ).not.toBeInTheDocument();
  });
});