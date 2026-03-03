/**
 * Smoke-тесты компонента Cell.
 * ADR-008: тест располагается рядом с тестируемым файлом (co-location).
 * Покрывают все acceptance criteria из спецификации cell-component.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Cell } from './Cell';
import type { CellProps } from './Cell';

// ─── Вспомогательные функции ─────────────────────────────────────────────────

/**
 * Рендерит Cell с заданными пропсами и возвращает кнопку.
 */
function renderCell(props: CellProps) {
  render(<Cell {...props} />);
  return screen.getByRole('button');
}

// ─── Рендеринг для разных значений ───────────────────────────────────────────

describe('Cell — рендеринг', () => {
  it('рендерится без ошибок при value=null', () => {
    const handleClick = vi.fn();
    expect(() =>
      render(<Cell value={null} index={0} onCellClick={handleClick} />),
    ).not.toThrow();
  });

  it('рендерится без ошибок при value="X"', () => {
    const handleClick = vi.fn();
    expect(() =>
      render(<Cell value="X" index={0} onCellClick={handleClick} />),
    ).not.toThrow();
  });

  it('рендерится без ошибок при value="O"', () => {
    const handleClick = vi.fn();
    expect(() =>
      render(<Cell value="O" index={0} onCellClick={handleClick} />),
    ).not.toThrow();
  });

  it('корневым элементом является нативный <button>', () => {
    const button = renderCell({ value: null, index: 0, onCellClick: vi.fn() });
    expect(button.tagName).toBe('BUTTON');
  });

  it('доступен через getByRole("button") — нативная кнопка имеет role по умолчанию', () => {
    renderCell({ value: null, index: 0, onCellClick: vi.fn() });
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('отображает "X" при value="X"', () => {
    const button = renderCell({ value: 'X', index: 0, onCellClick: vi.fn() });
    expect(button).toHaveTextContent('X');
  });

  it('отображает "O" при value="O"', () => {
    const button = renderCell({ value: 'O', index: 0, onCellClick: vi.fn() });
    expect(button).toHaveTextContent('O');
  });
});

// ─── aria-label ───────────────────────────────────────────────────────────────

describe('Cell — aria-label', () => {
  it('aria-label содержит "пусто" при value=null (индекс 0 → клетка 1×1)', () => {
    const button = renderCell({ value: null, index: 0, onCellClick: vi.fn() });
    expect(button).toHaveAttribute('aria-label', 'Клетка 1×1, пусто');
  });

  it('aria-label содержит "крестик" при value="X" (индекс 0 → клетка 1×1)', () => {
    const button = renderCell({ value: 'X', index: 0, onCellClick: vi.fn() });
    expect(button).toHaveAttribute('aria-label', 'Клетка 1×1, крестик');
  });

  it('aria-label содержит "нолик" при value="O" (индекс 0 → клетка 1×1)', () => {
    const button = renderCell({ value: 'O', index: 0, onCellClick: vi.fn() });
    expect(button).toHaveAttribute('aria-label', 'Клетка 1×1, нолик');
  });

  it('aria-label корректно вычисляет row и col для индекса 4 (центр → 2×2)', () => {
    const button = renderCell({ value: null, index: 4, onCellClick: vi.fn() });
    expect(button).toHaveAttribute('aria-label', 'Клетка 2×2, пусто');
  });

  it('aria-label корректно вычисляет row и col для индекса 8 (правый нижний → 3×3)', () => {
    const button = renderCell({ value: null, index: 8, onCellClick: vi.fn() });
    expect(button).toHaveAttribute('aria-label', 'Клетка 3×3, пусто');
  });

  it('aria-label корректно вычисляет row и col для индекса 5 (2×3)', () => {
    const button = renderCell({ value: 'O', index: 5, onCellClick: vi.fn() });
    expect(button).toHaveAttribute('aria-label', 'Клетка 2×3, нолик');
  });
});

// ─── aria-disabled ────────────────────────────────────────────────────────────

describe('Cell — aria-disabled', () => {
  it('aria-disabled="false" при disabled не передан', () => {
    const button = renderCell({ value: null, index: 0, onCellClick: vi.fn() });
    expect(button).toHaveAttribute('aria-disabled', 'false');
  });

  it('aria-disabled="false" при disabled={false}', () => {
    const button = renderCell({
      value: null,
      index: 0,
      onCellClick: vi.fn(),
      disabled: false,
    });
    expect(button).toHaveAttribute('aria-disabled', 'false');
  });

  it('aria-disabled="true" при disabled={true}', () => {
    const button = renderCell({
      value: null,
      index: 0,
      onCellClick: vi.fn(),
      disabled: true,
    });
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });
});

// ─── Нативный атрибут disabled ───────────────────────────────────────────────

describe('Cell — нативный атрибут disabled', () => {
  it('кнопка не имеет атрибута disabled при disabled не передан', () => {
    const button = renderCell({ value: null, index: 0, onCellClick: vi.fn() });
    expect(button).not.toBeDisabled();
  });

  it('кнопка имеет нативный атрибут disabled при disabled={true}', () => {
    const button = renderCell({
      value: null,
      index: 0,
      onCellClick: vi.fn(),
      disabled: true,
    });
    expect(button).toBeDisabled();
  });
});

// ─── Обработка кликов ─────────────────────────────────────────────────────────

describe('Cell — обработка кликов', () => {
  it('клик вызывает onCellClick с корректным index', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    const button = renderCell({ value: null, index: 3, onCellClick: handleClick });

    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith(3);
  });

  it('клик вызывает onCellClick с index=0', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    const button = renderCell({ value: null, index: 0, onCellClick: handleClick });

    await user.click(button);

    expect(handleClick).toHaveBeenCalledWith(0);
  });

  it('при disabled={true} клик не вызывает onCellClick', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    const button = renderCell({
      value: null,
      index: 0,
      onCellClick: handleClick,
      disabled: true,
    });

    await user.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });
});

// ─── Клавиатурная навигация ───────────────────────────────────────────────────

describe('Cell — клавиатурная навигация (нативное поведение <button>)', () => {
  it('нажатие Enter вызывает onCellClick (нативное поведение кнопки)', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    const button = renderCell({ value: null, index: 2, onCellClick: handleClick });

    button.focus();
    await user.keyboard('{Enter}');

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith(2);
  });

  it('нажатие Space вызывает onCellClick (нативное поведение кнопки)', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    const button = renderCell({ value: null, index: 7, onCellClick: handleClick });

    button.focus();
    await user.keyboard(' ');

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith(7);
  });
});

// ─── CSS-классы ───────────────────────────────────────────────────────────────

describe('Cell — CSS-классы', () => {
  /*
   * Примечание: в тестовой среде Vitest с identity-obj-proxy CSS Modules
   * возвращают имя класса как строку (например, "cell", "cellX").
   * Тесты проверяют наличие/отсутствие классов по имени.
   */

  it('базовый класс "cell" присутствует всегда при value=null', () => {
    const button = renderCell({ value: null, index: 0, onCellClick: vi.fn() });
    expect(button.className).toContain('cell');
  });

  it('базовый класс "cell" присутствует всегда при value="X"', () => {
    const button = renderCell({ value: 'X', index: 0, onCellClick: vi.fn() });
    expect(button.className).toContain('cell');
  });

  it('базовый класс "cell" присутствует всегда при value="O"', () => {
    const button = renderCell({ value: 'O', index: 0, onCellClick: vi.fn() });
    expect(button.className).toContain('cell');
  });

  it('класс "cellX" присутствует при value="X"', () => {
    const button = renderCell({ value: 'X', index: 0, onCellClick: vi.fn() });
    expect(button.className).toContain('cellX');
  });

  it('классы "cellO" и "cellEmpty" отсутствуют при value="X"', () => {
    const button = renderCell({ value: 'X', index: 0, onCellClick: vi.fn() });
    // При использовании identity-obj-proxy классы возвращаются как есть
    // Проверяем что нет отдельных слов cellO и cellEmpty
    const classes = button.className.split(/\s+/);
    expect(classes).not.toContain('cellO');
    expect(classes).not.toContain('cellEmpty');
  });

  it('класс "cellO" присутствует при value="O"', () => {
    const button = renderCell({ value: 'O', index: 0, onCellClick: vi.fn() });
    expect(button.className).toContain('cellO');
  });

  it('классы "cellX" и "cellEmpty" отсутствуют при value="O"', () => {
    const button = renderCell({ value: 'O', index: 0, onCellClick: vi.fn() });
    const classes = button.className.split(/\s+/);
    expect(classes).not.toContain('cellX');
    expect(classes).not.toContain('cellEmpty');
  });

  it('класс "cellEmpty" присутствует при value=null', () => {
    const button = renderCell({ value: null, index: 0, onCellClick: vi.fn() });
    expect(button.className).toContain('cellEmpty');
  });

  it('классы "cellX" и "cellO" отсутствуют при value=null', () => {
    const button = renderCell({ value: null, index: 0, onCellClick: vi.fn() });
    const classes = button.className.split(/\s+/);
    expect(classes).not.toContain('cellX');
    expect(classes).not.toContain('cellO');
  });
});

// ─── Экспорт типа CellProps ───────────────────────────────────────────────────

describe('Cell — экспорт CellProps', () => {
  it('CellProps экспортируется как именованный экспорт из Cell.tsx', () => {
    // Проверяем через использование типа в тесте — если импорт не сломан,
    // TypeScript скомпилирует файл без ошибок.
    // Дополнительно проверяем, что компонент Cell является функцией.
    expect(typeof Cell).toBe('function');
  });
});