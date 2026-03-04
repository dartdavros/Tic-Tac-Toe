/**
 * Smoke-тесты компонента ResultScreen.
 * ADR-008: тест располагается рядом с тестируемым файлом (co-location).
 *
 * Покрываемые сценарии (согласно спецификации result-screen-component):
 * 1. Рендер без ошибок при победе X.
 * 2. Рендер без ошибок при победе O.
 * 3. Рендер без ошибок при ничьей.
 * 4. Отображение корректного текста при победе X.
 * 5. Отображение корректного текста при победе O.
 * 6. Отображение «Ничья!» при ничьей.
 * 7. Кнопка «Играть снова» вызывает onRestart.
 * 8. Кнопка «В меню» вызывает onQuitToMenu.
 * 9. Обе кнопки — стандартные <button> с текстовым содержимым.
 * 10. Корневой контейнер имеет aria-live="assertive".
 * 11. Имя победителя содержит inline-стиль с CSS-переменной.
 * 12. Кнопка «Играть снова» расположена левее кнопки «В меню».
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResultScreen } from './ResultScreen';
import type { ResultStatus } from './ResultScreen';

// ─── Вспомогательные константы ───────────────────────────────────────────────

// winLine обязателен согласно типу GameStatus { kind: 'won'; winner: Player; winLine: number[] }
const STATUS_WON_X: ResultStatus = { kind: 'won', winner: 'X', winLine: [0, 1, 2] };
const STATUS_WON_O: ResultStatus = { kind: 'won', winner: 'O', winLine: [3, 4, 5] };
const STATUS_DRAW: ResultStatus = { kind: 'draw' };

// ─── Рендеринг без ошибок ─────────────────────────────────────────────────────

describe('ResultScreen — рендеринг без ошибок', () => {
  it('монтируется без ошибок при победе X', () => {
    expect(() =>
      render(
        <ResultScreen
          status={STATUS_WON_X}
          onRestart={vi.fn()}
          onQuitToMenu={vi.fn()}
        />,
      ),
    ).not.toThrow();
  });

  it('монтируется без ошибок при победе O', () => {
    expect(() =>
      render(
        <ResultScreen
          status={STATUS_WON_O}
          onRestart={vi.fn()}
          onQuitToMenu={vi.fn()}
        />,
      ),
    ).not.toThrow();
  });

  it('монтируется без ошибок при ничьей', () => {
    expect(() =>
      render(
        <ResultScreen
          status={STATUS_DRAW}
          onRestart={vi.fn()}
          onQuitToMenu={vi.fn()}
        />,
      ),
    ).not.toThrow();
  });
});

// ─── Отображение текста результата ───────────────────────────────────────────

describe('ResultScreen — текст результата', () => {
  it('отображает «Победил игрок X!» при победе X', () => {
    render(
      <ResultScreen
        status={STATUS_WON_X}
        onRestart={vi.fn()}
        onQuitToMenu={vi.fn()}
      />,
    );
    // Текст разбит на несколько узлов — используем exact: false
    expect(screen.getByText(/Победил игрок/)).toBeInTheDocument();
    expect(screen.getByText('X')).toBeInTheDocument();
  });

  it('отображает «Победил игрок O!» при победе O', () => {
    render(
      <ResultScreen
        status={STATUS_WON_O}
        onRestart={vi.fn()}
        onQuitToMenu={vi.fn()}
      />,
    );
    expect(screen.getByText(/Победил игрок/)).toBeInTheDocument();
    expect(screen.getByText('O')).toBeInTheDocument();
  });

  it('отображает «Ничья!» при ничьей', () => {
    render(
      <ResultScreen
        status={STATUS_DRAW}
        onRestart={vi.fn()}
        onQuitToMenu={vi.fn()}
      />,
    );
    expect(screen.getByText('Ничья!')).toBeInTheDocument();
  });

  it('НЕ отображает «Победил игрок» при ничьей', () => {
    render(
      <ResultScreen
        status={STATUS_DRAW}
        onRestart={vi.fn()}
        onQuitToMenu={vi.fn()}
      />,
    );
    expect(screen.queryByText(/Победил игрок/)).not.toBeInTheDocument();
  });
});

// ─── Цвет имени победителя ────────────────────────────────────────────────────

describe('ResultScreen — цвет имени победителя', () => {
  it('имя победителя X имеет inline-стиль с CSS-переменной --color-x', () => {
    render(
      <ResultScreen
        status={STATUS_WON_X}
        onRestart={vi.fn()}
        onQuitToMenu={vi.fn()}
      />,
    );
    // Находим span с именем победителя по тексту
    const winnerSpan = screen.getByText('X');
    expect(winnerSpan).toHaveStyle({ color: 'var(--color-x)' });
  });

  it('имя победителя O имеет inline-стиль с CSS-переменной --color-o', () => {
    render(
      <ResultScreen
        status={STATUS_WON_O}
        onRestart={vi.fn()}
        onQuitToMenu={vi.fn()}
      />,
    );
    const winnerSpan = screen.getByText('O');
    expect(winnerSpan).toHaveStyle({ color: 'var(--color-o)' });
  });
});

// ─── Кнопки ───────────────────────────────────────────────────────────────────

describe('ResultScreen — кнопки', () => {
  it('отображает кнопку «Играть снова»', () => {
    render(
      <ResultScreen
        status={STATUS_WON_X}
        onRestart={vi.fn()}
        onQuitToMenu={vi.fn()}
      />,
    );
    expect(screen.getByRole('button', { name: 'Играть снова' })).toBeInTheDocument();
  });

  it('отображает кнопку «В меню»', () => {
    render(
      <ResultScreen
        status={STATUS_WON_X}
        onRestart={vi.fn()}
        onQuitToMenu={vi.fn()}
      />,
    );
    expect(screen.getByRole('button', { name: 'В меню' })).toBeInTheDocument();
  });

  it('кнопка «Играть снова» является нативным <button>', () => {
    render(
      <ResultScreen
        status={STATUS_WON_X}
        onRestart={vi.fn()}
        onQuitToMenu={vi.fn()}
      />,
    );
    const btn = screen.getByRole('button', { name: 'Играть снова' });
    expect(btn.tagName).toBe('BUTTON');
  });

  it('кнопка «В меню» является нативным <button>', () => {
    render(
      <ResultScreen
        status={STATUS_WON_X}
        onRestart={vi.fn()}
        onQuitToMenu={vi.fn()}
      />,
    );
    const btn = screen.getByRole('button', { name: 'В меню' });
    expect(btn.tagName).toBe('BUTTON');
  });

  it('кнопка «Играть снова» вызывает onRestart при клике', async () => {
    const handleRestart = vi.fn();
    const user = userEvent.setup();

    render(
      <ResultScreen
        status={STATUS_WON_X}
        onRestart={handleRestart}
        onQuitToMenu={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Играть снова' }));

    expect(handleRestart).toHaveBeenCalledTimes(1);
  });

  it('кнопка «В меню» вызывает onQuitToMenu при клике', async () => {
    const handleQuitToMenu = vi.fn();
    const user = userEvent.setup();

    render(
      <ResultScreen
        status={STATUS_WON_X}
        onRestart={vi.fn()}
        onQuitToMenu={handleQuitToMenu}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'В меню' }));

    expect(handleQuitToMenu).toHaveBeenCalledTimes(1);
  });

  it('кнопка «Играть снова» вызывает onRestart при ничьей', async () => {
    const handleRestart = vi.fn();
    const user = userEvent.setup();

    render(
      <ResultScreen
        status={STATUS_DRAW}
        onRestart={handleRestart}
        onQuitToMenu={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Играть снова' }));

    expect(handleRestart).toHaveBeenCalledTimes(1);
  });

  it('кнопка «В меню» вызывает onQuitToMenu при ничьей', async () => {
    const handleQuitToMenu = vi.fn();
    const user = userEvent.setup();

    render(
      <ResultScreen
        status={STATUS_DRAW}
        onRestart={vi.fn()}
        onQuitToMenu={handleQuitToMenu}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'В меню' }));

    expect(handleQuitToMenu).toHaveBeenCalledTimes(1);
  });

  it('onRestart не вызывается при клике на «В меню»', async () => {
    const handleRestart = vi.fn();
    const user = userEvent.setup();

    render(
      <ResultScreen
        status={STATUS_WON_X}
        onRestart={handleRestart}
        onQuitToMenu={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'В меню' }));

    expect(handleRestart).not.toHaveBeenCalled();
  });

  it('onQuitToMenu не вызывается при клике на «Играть снова»', async () => {
    const handleQuitToMenu = vi.fn();
    const user = userEvent.setup();

    render(
      <ResultScreen
        status={STATUS_WON_X}
        onRestart={vi.fn()}
        onQuitToMenu={handleQuitToMenu}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Играть снова' }));

    expect(handleQuitToMenu).not.toHaveBeenCalled();
  });
});

// ─── Порядок кнопок ───────────────────────────────────────────────────────────

describe('ResultScreen — порядок кнопок', () => {
  it('кнопка «Играть снова» расположена левее кнопки «В меню» в DOM', () => {
    render(
      <ResultScreen
        status={STATUS_WON_X}
        onRestart={vi.fn()}
        onQuitToMenu={vi.fn()}
      />,
    );

    const buttons = screen.getAllByRole('button');
    // Первая кнопка в DOM — «Играть снова», вторая — «В меню»
    expect(buttons[0]).toHaveTextContent('Играть снова');
    expect(buttons[1]).toHaveTextContent('В меню');
  });
});

// ─── Доступность (a11y) ───────────────────────────────────────────────────────

describe('ResultScreen — доступность (a11y)', () => {
  it('корневой контейнер имеет aria-live="assertive"', () => {
    const { container } = render(
      <ResultScreen
        status={STATUS_WON_X}
        onRestart={vi.fn()}
        onQuitToMenu={vi.fn()}
      />,
    );
    // Корневой div компонента — первый дочерний элемент контейнера RTL
    const rootDiv = container.firstChild as HTMLElement;
    expect(rootDiv).toHaveAttribute('aria-live', 'assertive');
  });

  it('aria-live="assertive" присутствует при ничьей', () => {
    const { container } = render(
      <ResultScreen
        status={STATUS_DRAW}
        onRestart={vi.fn()}
        onQuitToMenu={vi.fn()}
      />,
    );
    const rootDiv = container.firstChild as HTMLElement;
    expect(rootDiv).toHaveAttribute('aria-live', 'assertive');
  });
});

// ─── CSS-классы кнопок ────────────────────────────────────────────────────────

describe('ResultScreen — CSS-классы кнопок', () => {
  /*
   * В тестовой среде Vitest с identity-obj-proxy CSS Modules возвращают
   * имя класса как строку. Проверяем наличие классов по имени.
   */

  it('кнопка «Играть снова» имеет класс buttonPrimary', () => {
    render(
      <ResultScreen
        status={STATUS_WON_X}
        onRestart={vi.fn()}
        onQuitToMenu={vi.fn()}
      />,
    );
    const btn = screen.getByRole('button', { name: 'Играть снова' });
    expect(btn.className).toContain('buttonPrimary');
  });

  it('кнопка «В меню» имеет класс buttonSecondary', () => {
    render(
      <ResultScreen
        status={STATUS_WON_X}
        onRestart={vi.fn()}
        onQuitToMenu={vi.fn()}
      />,
    );
    const btn = screen.getByRole('button', { name: 'В меню' });
    expect(btn.className).toContain('buttonSecondary');
  });
});