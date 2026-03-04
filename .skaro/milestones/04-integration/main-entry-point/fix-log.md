# Fix Log: main-entry-point

---

## 2026-03-04 22:16

**User:** [FAIL] Сборка проекта (npm run build)
Exit code: 2
> tic-tac-toe@0.1.0 build
> tsc -b && vite build

src/components/App.tsx(76,46): error TS2322: Type '{ status: GameStatus; settings: GameSettings; }' is not assignable to type 'IntrinsicAttributes & StatusBarProps'.

  Property 'settings' does not exist on type 'IntrinsicAttributes & StatusBarProps'.

src/components/App.tsx(90,13): error TS2322: Type 'GameStatus' is not assignable to type 'ResultStatus'.

  Type '{ kind: "playing"; currentPlayer: Player; }' is not assignable to type 'ResultStatus'.

    Type '{ kind: "playing"; currentPlayer: Player; }' is not assignable to type '{ kind: "draw"; }'.

      Types of property 'kind' are incompatible.

        Type '"playing"' is not assignable to type '"draw"'.

---

[FAIL] Линтинг ESLint (npx eslint src/main.tsx src/styles/global.css --max-warnings 0)
Exit code: 1
ESLint found too many warnings (maximum: 0).

---

[FAIL] Проверка наличия обязательных файлов (test -f index.html && test -f src/main.tsx && test -f src/styles/global.css && test -f public/favicon.svg && echo "Все обязательные файлы присутствуют"
)
Exit code: 1
"test" �� ���� ����७��� ��� ���譥�

��������, �ᯮ��塞�� �ணࠬ��� ��� ������ 䠩���.

---

[FAIL] Проверка содержимого index.html (grep -q 'lang="ru"' index.html && grep -q 'name="viewport"' index.html && grep -q 'Крестики-нолики' index.html && grep -q 'favicon.svg' index.html && grep -q 'id="root"' index.html && echo "index.html содержит все обязательные элементы"
)
Exit code: 1
"grep" �� ���� ����७��� ��� ���譥�

��������, �ᯮ��塞�� �ணࠬ��� ��� ������ 䠩���.

---

[FAIL] Проверка содержимого main.tsx (grep -q 'Элемент #root не найден' src/main.tsx && grep -q 'StrictMode' src/main.tsx && grep -q 'ErrorBoundary' src/main.tsx && grep -q 'global.css' src/main.tsx && echo "main.tsx содержит все обязательные элементы"
)
Exit code: 1
"grep" �� ���� ����७��� ��� ���譥�

��������, �ᯮ��塞�� �ணࠬ��� ��� ������ 䠩���.

---

[FAIL] Проверка CSS-сброса в global.css (grep -q 'box-sizing: border-box' src/styles/global.css && grep -q 'margin: 0' src/styles/global.css && grep -q 'padding: 0' src/styles/global.css && grep -q '--color-player-x' src/styles/global.css && grep -q '--color-player-o' src/styles/global.css && echo "global.css содержит CSS-сброс и токены дизайна"
)
Exit code: 1
"grep" �� ���� ����७��� ��� ���譥�

��������, �ᯮ��塞�� �ணࠬ��� ��� ������ 䠩���.

**LLM:** ## Анализ проблем и план исправления

### Проблема 1: Ошибки TypeScript в `App.tsx` (критические, блокируют сборку)

**Ошибка 1:** `StatusBar` получает проп `settings`, которого нет в `StatusBarProps`. Судя по коду `StatusBar.tsx`, компонент принимает только `status: GameStatus`. Проп `settings` лишний — его нужно убрать из вызова.

**Ошибка 2:** `ResultScreen` получает `status: GameStatus`, но ожидает `ResultStatus = Extract<GameStatus, { kind: 'won' } | { kind: 'draw' }>`. Нужно добавить прове...

**Proposed files:** `src/components/App.tsx`, `src/main.tsx`, `src/styles/global.css`

**Applied:** `src/components/App.tsx` ✓ (2026-03-04 22:16)

**Applied:** `src/main.tsx` ✓ (2026-03-04 22:16)

**Applied:** `src/styles/global.css` ✓ (2026-03-04 22:17)
