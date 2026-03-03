// Smoke-тесты компонента Board.
// FR-08: ровно два теста — рендер 9 клеток и вызов onCellClick.
// ADR-008: тест располагается рядом с тестируемым файлом (co-location).

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Board } from './Board';
import type { BoardState } from '../types';

/** Пустая доска для тестов */
const EMPTY_BOARD: BoardState = [
  null, null, null,
  null, null, null,
  null, null, null,
];

describe('Board', () => {
  it('рендерит ровно 9 клеток', () => {
    const handleClick = vi.fn();

    render(
      <Board
        board={EMPTY_BOARD}
        onCellClick={handleClick}
      />,
    );

    // Каждая клетка Cell имеет role="button" согласно ADR-010
    const cells = screen.getAllByRole('button');
    expect(cells).toHaveLength(9);
  });

  it('вызывает onCellClick с корректным индексом при клике на свободную клетку', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <Board
        board={EMPTY_BOARD}
        onCellClick={handleClick}
      />,
    );

    // Кликаем на первую клетку (индекс 0)
    const cells = screen.getAllByRole('button');
    await user.click(cells[0]!);

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith(0);
  });
});