import type { GameSettings as GameSettingsType } from '../types';

interface GameSettingsProps {
  onStartGame: (settings: GameSettingsType) => void;
}

/**
 * Компонент выбора режима игры и стороны (X/O).
 * Инвариант ADR-010: все input и select имеют явные label.
 *
 * TODO: Реализовать форму выбора режима PvP / PvAI и выбора стороны
 */
export function GameSettings({ onStartGame }: GameSettingsProps) {
  void onStartGame;
  return (
    <div>
      {/* TODO: Реализовать форму настроек игры */}
    </div>
  );
}