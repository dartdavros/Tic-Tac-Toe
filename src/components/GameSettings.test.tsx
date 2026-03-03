/**
 * Smoke-тесты компонента GameSettings.
 * ADR-008: тест располагается рядом с тестируемым файлом (co-location).
 *
 * Покрываемые сценарии (согласно спецификации и уточнениям):
 * 1. Компонент монтируется без ошибок.
 * 2. PvP: onStartGame вызывается с { mode: 'pvp' }.
 * 3. PvAI + X: onStartGame вызывается с { mode: 'pvai', humanPlayer: 'X' }.
 * 4. PvAI + O: onStartGame вызывается с { mode: 'pvai', humanPlayer: 'O' }.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GameSettings } from './GameSettings';
import type { GameSettings as GameSettingsType } from '../types';

describe('GameSettings — монтирование', () => {
  it('монтируется без ошибок', () => {
    const handleStartGame = vi.fn();
    expect(() => render(<GameSettings onStartGame={handleStartGame} />)).not.toThrow();
  });

  it('отображает заголовок «Крестики-нолики»', () => {
    render(<GameSettings onStartGame={vi.fn()} />);
    expect(screen.getByRole('heading', { name: 'Крестики-нолики' })).toBeInTheDocument();
  });

  it('отображает кнопку «Начать игру»', () => {
    render(<GameSettings onStartGame={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Начать игру' })).toBeInTheDocument();
  });

  it('кнопка «Начать игру» не имеет атрибута disabled', () => {
    render(<GameSettings onStartGame={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Начать игру' })).not.toBeDisabled();
  });

  it('по умолчанию выбран режим PvP', () => {
    render(<GameSettings onStartGame={vi.fn()} />);
    const pvpRadio = screen.getByLabelText('Два игрока');
    expect(pvpRadio).toBeChecked();
  });

  it('по умолчанию блок выбора стороны отсутствует в DOM', () => {
    render(<GameSettings onStartGame={vi.fn()} />);
    // При PvP блок выбора стороны не монтируется (FR-05)
    expect(screen.queryByLabelText('Играть за X')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Играть за O')).not.toBeInTheDocument();
  });
});

describe('GameSettings — сценарий PvP', () => {
  it('вызывает onStartGame с { mode: "pvp" } при нажатии «Начать игру»', async () => {
    const handleStartGame = vi.fn();
    const user = userEvent.setup();

    render(<GameSettings onStartGame={handleStartGame} />);

    await user.click(screen.getByRole('button', { name: 'Начать игру' }));

    expect(handleStartGame).toHaveBeenCalledTimes(1);
    expect(handleStartGame).toHaveBeenCalledWith<[GameSettingsType]>({ mode: 'pvp' });
  });
});

describe('GameSettings — сценарий PvAI + X', () => {
  it('показывает блок выбора стороны при переключении на PvAI', async () => {
    const user = userEvent.setup();
    render(<GameSettings onStartGame={vi.fn()} />);

    await user.click(screen.getByLabelText('Против компьютера'));

    expect(screen.getByLabelText('Играть за X')).toBeInTheDocument();
    expect(screen.getByLabelText('Играть за O')).toBeInTheDocument();
  });

  it('по умолчанию при PvAI выбрана сторона X', async () => {
    const user = userEvent.setup();
    render(<GameSettings onStartGame={vi.fn()} />);

    await user.click(screen.getByLabelText('Против компьютера'));

    expect(screen.getByLabelText('Играть за X')).toBeChecked();
  });

  it('вызывает onStartGame с { mode: "pvai", humanPlayer: "X" }', async () => {
    const handleStartGame = vi.fn();
    const user = userEvent.setup();

    render(<GameSettings onStartGame={handleStartGame} />);

    // Переключаемся на PvAI (сторона X выбрана по умолчанию)
    await user.click(screen.getByLabelText('Против компьютера'));
    await user.click(screen.getByRole('button', { name: 'Начать игру' }));

    expect(handleStartGame).toHaveBeenCalledTimes(1);
    expect(handleStartGame).toHaveBeenCalledWith<[GameSettingsType]>({
      mode: 'pvai',
      humanPlayer: 'X',
    });
  });
});

describe('GameSettings — сценарий PvAI + O', () => {
  it('вызывает onStartGame с { mode: "pvai", humanPlayer: "O" }', async () => {
    const handleStartGame = vi.fn();
    const user = userEvent.setup();

    render(<GameSettings onStartGame={handleStartGame} />);

    // Переключаемся на PvAI
    await user.click(screen.getByLabelText('Против компьютера'));
    // Выбираем сторону O
    await user.click(screen.getByLabelText('Играть за O'));
    await user.click(screen.getByRole('button', { name: 'Начать игру' }));

    expect(handleStartGame).toHaveBeenCalledTimes(1);
    expect(handleStartGame).toHaveBeenCalledWith<[GameSettingsType]>({
      mode: 'pvai',
      humanPlayer: 'O',
    });
  });
});

describe('GameSettings — сброс стороны при переключении режима', () => {
  it('при переключении PvAI → PvP → PvAI сторона сбрасывается до X', async () => {
    const user = userEvent.setup();
    render(<GameSettings onStartGame={vi.fn()} />);

    // Переключаемся на PvAI
    await user.click(screen.getByLabelText('Против компьютера'));
    // Выбираем O
    await user.click(screen.getByLabelText('Играть за O'));
    expect(screen.getByLabelText('Играть за O')).toBeChecked();

    // Возвращаемся на PvP — блок стороны исчезает
    await user.click(screen.getByLabelText('Два игрока'));
    expect(screen.queryByLabelText('Играть за O')).not.toBeInTheDocument();

    // Снова переключаемся на PvAI — сторона должна быть X (FR-08)
    await user.click(screen.getByLabelText('Против компьютера'));
    expect(screen.getByLabelText('Играть за X')).toBeChecked();
    expect(screen.getByLabelText('Играть за O')).not.toBeChecked();
  });
});

describe('GameSettings — доступность (a11y)', () => {
  it('группа режима обёрнута в fieldset с legend «Режим игры»', () => {
    render(<GameSettings onStartGame={vi.fn()} />);
    // RTL позволяет найти группу по роли group (fieldset) с именем legend
    expect(screen.getByRole('group', { name: 'Режим игры' })).toBeInTheDocument();
  });

  it('группа стороны обёрнута в fieldset с legend «Играть за» при PvAI', async () => {
    const user = userEvent.setup();
    render(<GameSettings onStartGame={vi.fn()} />);

    await user.click(screen.getByLabelText('Против компьютера'));

    expect(screen.getByRole('group', { name: 'Играть за' })).toBeInTheDocument();
  });

  it('все радиокнопки режима имеют связанные label', () => {
    render(<GameSettings onStartGame={vi.fn()} />);
    // Если label связан через htmlFor/id, RTL находит input по тексту label
    expect(screen.getByLabelText('Два игрока')).toBeInTheDocument();
    expect(screen.getByLabelText('Против компьютера')).toBeInTheDocument();
  });
});