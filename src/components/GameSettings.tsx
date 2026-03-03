import { useState } from 'react';
import type { GameSettings as GameSettingsType, Player, GameMode } from '../types';
import styles from './GameSettings.module.css';

interface GameSettingsProps {
  onStartGame: (settings: GameSettingsType) => void;
}

/**
 * Компонент начального экрана: выбор режима игры и стороны.
 *
 * Локальное состояние:
 * - mode: выбранный режим ('pvp' | 'pvai')
 * - humanPlayer: выбранная сторона ('X' | 'O'), актуально только при PvAI
 *
 * FR-08: при каждом переключении на PvAI выбор стороны сбрасывается до 'X'.
 * FR-05: блок выбора стороны не монтируется в DOM при режиме PvP.
 * ADR-010: все input имеют явные label через htmlFor/id; группы — fieldset+legend.
 * ADR-004: стили только через CSS Modules (GameSettings.module.css).
 * Инвариант №14: inline-стили отсутствуют.
 */
export function GameSettings({ onStartGame }: GameSettingsProps) {
  const [mode, setMode] = useState<GameMode>('pvp');
  const [humanPlayer, setHumanPlayer] = useState<Player>('X');

  function handleModeChange(newMode: GameMode) {
    setMode(newMode);
    // FR-08, FR-09: при переключении на PvAI (и с PvAI) сбрасываем сторону до X
    setHumanPlayer('X');
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // ADR-007: дискриминированный union — строим корректный объект настроек
    const settings: GameSettingsType =
      mode === 'pvai'
        ? { mode: 'pvai', humanPlayer }
        : { mode: 'pvp' };

    onStartGame(settings);
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Крестики-нолики</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Группа выбора режима игры */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Режим игры</legend>

          <label className={styles.label} htmlFor="mode-pvp">
            <input
              id="mode-pvp"
              type="radio"
              name="mode"
              value="pvp"
              checked={mode === 'pvp'}
              onChange={() => handleModeChange('pvp')}
              className={styles.radio}
            />
            Два игрока
          </label>

          <label className={styles.label} htmlFor="mode-pvai">
            <input
              id="mode-pvai"
              type="radio"
              name="mode"
              value="pvai"
              checked={mode === 'pvai'}
              onChange={() => handleModeChange('pvai')}
              className={styles.radio}
            />
            Против компьютера
          </label>
        </fieldset>

        {/* FR-05: блок выбора стороны монтируется только при PvAI */}
        {mode === 'pvai' && (
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Играть за</legend>

            <label className={styles.label} htmlFor="player-x">
              <input
                id="player-x"
                type="radio"
                name="humanPlayer"
                value="X"
                checked={humanPlayer === 'X'}
                onChange={() => setHumanPlayer('X')}
                className={styles.radio}
              />
              Играть за X
            </label>

            <label className={styles.label} htmlFor="player-o">
              <input
                id="player-o"
                type="radio"
                name="humanPlayer"
                value="O"
                checked={humanPlayer === 'O'}
                onChange={() => setHumanPlayer('O')}
                className={styles.radio}
              />
              Играть за O
            </label>
          </fieldset>
        )}

        {/* FR-10: кнопка всегда активна, disabled не используется */}
        <button type="submit" className={styles.submitButton}>
          Начать игру
        </button>
      </form>
    </div>
  );
}