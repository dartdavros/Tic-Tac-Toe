import type { GameStatus } from '../types';

interface ResultScreenProps {
  status: GameStatus;
  onRestart: () => void;
  onQuitToMenu: () => void;
}

/**
 * Экран результата партии.
 * Показывает победителя или ничью, кнопки «Играть снова» и «В меню».
 *
 * TODO: Реализовать полный рендеринг экрана результата
 */
export function ResultScreen({ status, onRestart, onQuitToMenu }: ResultScreenProps) {
  void status;
  return (
    <div>
      <button onClick={onRestart}>Играть снова</button>
      <button onClick={onQuitToMenu}>В меню</button>
    </div>
  );
}