/**
 * Smoke-тесты компонента StatusBar.
 * ADR-008: тест располагается рядом с тестируемым файлом (co-location).
 *
 * Согласно уточнению Q6: проверяется только факт рендеринга без ошибок
 * для каждого из трёх значений kind (smoke-уровень).
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { StatusBar } from './StatusBar';
import type { GameStatus } from '../types';

describe('StatusBar — smoke-тесты рендеринга', () => {
  it('рендерится без ошибок при status.kind === "playing" и currentPlayer === "X"', () => {
    const status: GameStatus = { kind: 'playing', currentPlayer: 'X' };
    expect(() => render(<StatusBar status={status} />)).not.toThrow();
  });

  it('рендерится без ошибок при status.kind === "playing" и currentPlayer === "O"', () => {
    const status: GameStatus = { kind: 'playing', currentPlayer: 'O' };
    expect(() => render(<StatusBar status={status} />)).not.toThrow();
  });

  it('рендерится без ошибок при status.kind === "won" и winner === "X"', () => {
    const status: GameStatus = { kind: 'won', winner: 'X', winLine: [0, 1, 2] };
    expect(() => render(<StatusBar status={status} />)).not.toThrow();
  });

  it('рендерится без ошибок при status.kind === "won" и winner === "O"', () => {
    const status: GameStatus = { kind: 'won', winner: 'O', winLine: [0, 3, 6] };
    expect(() => render(<StatusBar status={status} />)).not.toThrow();
  });

  it('рендерится без ошибок при status.kind === "draw"', () => {
    const status: GameStatus = { kind: 'draw' };
    expect(() => render(<StatusBar status={status} />)).not.toThrow();
  });
});