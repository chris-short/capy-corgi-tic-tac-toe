# Capy vs. Corgi Connect Four Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone React/TypeScript Connect Four web app styled to match the Capy vs. Corgi Tic-Tac-Toe app, with red/blue chip outlines, capy/corgi images as pieces, hover preview in the column drop zone, and confetti on win.

**Architecture:** Single-page React app with all game state in `Game.tsx`. Pure game logic (`findLandingRow`, `checkWin`, `isBoardFull`) lives in `gameLogic.ts` and is unit-tested with Vitest. All other components are stateless and receive props from `Game.tsx`.

**Tech Stack:** React 18, TypeScript, Vite 5, Tailwind CSS 3, framer-motion, canvas-confetti, lucide-react, clsx, tailwind-merge, vitest

---

## File Map

| File | Responsibility |
|---|---|
| `package.json` | Dependencies and scripts |
| `vite.config.ts` | Vite build, `client/` root, `@/` alias |
| `tailwind.config.ts` | Tailwind content paths, chewy/fredoka font families |
| `postcss.config.js` | Tailwind + autoprefixer |
| `tsconfig.json` | TypeScript strict config, `@/*` path alias |
| `vitest.config.ts` | Vitest setup for `client/src/**/*.test.ts` |
| `netlify.toml` | Build command + publish dir |
| `client/index.html` | HTML shell, Google Fonts import |
| `client/src/index.css` | Tailwind directives, CSS vars, body font |
| `client/src/main.tsx` | React root mount |
| `client/src/App.tsx` | Thin wrapper rendering `Game` |
| `client/src/lib/utils.ts` | `cn()` helper (clsx + tailwind-merge) |
| `client/src/lib/gameLogic.ts` | `createBoard`, `findLandingRow`, `checkWin`, `isBoardFull` |
| `client/src/lib/gameLogic.test.ts` | Unit tests for all game logic |
| `client/src/components/Logo.tsx` | Gradient heading + "Connect Four" subtitle |
| `client/src/components/GamePiece.tsx` | Capy/corgi image with spring drop animation |
| `client/src/components/GameCell.tsx` | Single circular cell, red/blue/green ring |
| `client/src/components/PlayerCard.tsx` | Active/winner player indicator card |
| `client/src/components/GameBoard.tsx` | 7 drop-zone buttons + 6×7 grid in slate frame |
| `client/src/pages/Game.tsx` | All game state, logic wiring, confetti, controls |
| `client/public/images/capybara.png` | Copied from tic-tac-toe repo |
| `client/public/images/corgi.png` | Copied from tic-tac-toe repo |

---

## Task 1: Bootstrap repo and install dependencies

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tailwind.config.ts`
- Create: `postcss.config.js`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `.gitignore`

- [ ] **Step 1: Create the repo directory and initialize git**

```bash
mkdir ~/Projects/capy-corgi-connect-four
cd ~/Projects/capy-corgi-connect-four
git init
git branch -M main
mkdir -p client/src/components client/src/pages client/src/lib client/public/images
```

- [ ] **Step 2: Write package.json**

```json
{
  "name": "capy-corgi-connect-four",
  "version": "1.0.0",
  "type": "module",
  "license": "MIT",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "dependencies": {
    "@types/canvas-confetti": "^1.9.0",
    "canvas-confetti": "^1.9.4",
    "clsx": "^2.1.1",
    "framer-motion": "^11.18.2",
    "lucide-react": "^0.453.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "tailwind-merge": "^2.6.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.11",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.7.0",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.17",
    "typescript": "5.6.3",
    "vite": "^5.4.0",
    "vitest": "^2.1.0"
  }
}
```

- [ ] **Step 3: Write vite.config.ts**

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: "./client",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
    },
  },
});
```

- [ ] **Step 4: Write tailwind.config.ts**

```typescript
import type { Config } from "tailwindcss";

export default {
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        chewy: ["'Chewy'", "cursive"],
        fredoka: ["'Fredoka'", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
```

- [ ] **Step 5: Write postcss.config.js**

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 6: Write tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "paths": {
      "@/*": ["./client/src/*"]
    }
  },
  "include": ["client/src"]
}
```

- [ ] **Step 7: Write vitest.config.ts**

```typescript
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["client/src/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
    },
  },
});
```

- [ ] **Step 8: Write .gitignore**

```
node_modules/
dist/
.DS_Store
```

- [ ] **Step 9: Install dependencies**

```bash
npm install
```

Expected: `node_modules/` populated, no errors in terminal output.

- [ ] **Step 10: Commit scaffold**

```bash
git add package.json vite.config.ts tailwind.config.ts postcss.config.js tsconfig.json vitest.config.ts .gitignore
git commit -m "chore: scaffold project with Vite, React, Tailwind"
```

---

## Task 2: Base HTML, CSS, and skeleton app files

**Files:**
- Create: `client/index.html`
- Create: `client/src/index.css`
- Create: `client/src/main.tsx`
- Create: `client/src/App.tsx`
- Create: `client/src/lib/utils.ts`
- Create: `client/src/pages/Game.tsx` (placeholder)

- [ ] **Step 1: Write client/index.html**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Capybara vs Corgis: Connect Four</title>
    <meta name="description" content="Play Connect Four with Capybara vs Corgi! Local 2-player pass-and-play." />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Chewy&family=Fredoka:wght@400;500;600&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 2: Write client/src/index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --capy-primary: #ea6e1a;
  --corgi-primary: #eab308;
}

body {
  font-family: 'Fredoka', sans-serif;
  background-color: #f9f8f6;
  background-image:
    radial-gradient(circle at 10% 20%, rgba(255, 150, 50, 0.05) 0%, transparent 20%),
    radial-gradient(circle at 90% 80%, rgba(255, 200, 50, 0.05) 0%, transparent 20%);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

- [ ] **Step 3: Write client/src/main.tsx**

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Step 4: Write client/src/App.tsx**

```tsx
import Game from "./pages/Game";

function App() {
  return <Game />;
}

export default App;
```

- [ ] **Step 5: Write client/src/lib/utils.ts**

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 6: Write placeholder client/src/pages/Game.tsx**

```tsx
export default function Game() {
  return <div className="p-8 font-chewy text-4xl">Connect Four</div>;
}
```

- [ ] **Step 7: Verify dev server starts**

```bash
npm run dev
```

Expected: terminal prints `Local: http://localhost:5173/` (or nearby port). Open in browser -- "Connect Four" appears in Chewy font. No console errors.

- [ ] **Step 8: Commit**

```bash
git add client/
git commit -m "feat: add base HTML, CSS, and app skeleton"
```

---

## Task 3: Game logic (TDD)

**Files:**
- Create: `client/src/lib/gameLogic.test.ts`
- Create: `client/src/lib/gameLogic.ts`

- [ ] **Step 1: Write the failing tests first**

Create `client/src/lib/gameLogic.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import {
  createBoard,
  findLandingRow,
  checkWin,
  isBoardFull,
  ROWS,
  COLS,
} from "./gameLogic";

describe("createBoard", () => {
  it("returns a 42-cell array of nulls", () => {
    const board = createBoard();
    expect(board).toHaveLength(ROWS * COLS);
    expect(board.every((c) => c === null)).toBe(true);
  });
});

describe("findLandingRow", () => {
  it("returns the bottom row for an empty column", () => {
    const board = createBoard();
    expect(findLandingRow(board, 0)).toBe(ROWS - 1);
  });

  it("returns the row above an existing piece", () => {
    const board = createBoard();
    board[(ROWS - 1) * COLS + 0] = "capy";
    expect(findLandingRow(board, 0)).toBe(ROWS - 2);
  });

  it("returns null for a full column", () => {
    const board = createBoard();
    for (let r = 0; r < ROWS; r++) board[r * COLS + 0] = "capy";
    expect(findLandingRow(board, 0)).toBeNull();
  });
});

describe("checkWin", () => {
  it("detects a horizontal win", () => {
    const board = createBoard();
    const row = ROWS - 1;
    board[row * COLS + 0] = "capy";
    board[row * COLS + 1] = "capy";
    board[row * COLS + 2] = "capy";
    board[row * COLS + 3] = "capy";
    const result = checkWin(board, row, 3, "capy");
    expect(result).not.toBeNull();
    expect(result!.length).toBeGreaterThanOrEqual(4);
  });

  it("detects a vertical win", () => {
    const board = createBoard();
    const col = 3;
    for (let r = ROWS - 4; r < ROWS; r++) board[r * COLS + col] = "corgi";
    const result = checkWin(board, ROWS - 1, col, "corgi");
    expect(result).not.toBeNull();
    expect(result!.length).toBeGreaterThanOrEqual(4);
  });

  it("detects a diagonal win going up-right (rows 5,4,3,2 cols 0,1,2,3)", () => {
    const board = createBoard();
    board[5 * COLS + 0] = "capy";
    board[4 * COLS + 1] = "capy";
    board[3 * COLS + 2] = "capy";
    board[2 * COLS + 3] = "capy";
    const result = checkWin(board, 5, 0, "capy");
    expect(result).not.toBeNull();
  });

  it("detects a diagonal win going down-right (rows 0,1,2,3 cols 0,1,2,3)", () => {
    const board = createBoard();
    board[0 * COLS + 0] = "corgi";
    board[1 * COLS + 1] = "corgi";
    board[2 * COLS + 2] = "corgi";
    board[3 * COLS + 3] = "corgi";
    const result = checkWin(board, 3, 3, "corgi");
    expect(result).not.toBeNull();
  });

  it("returns null when fewer than 4 in a line", () => {
    const board = createBoard();
    board[(ROWS - 1) * COLS + 0] = "capy";
    board[(ROWS - 1) * COLS + 1] = "capy";
    board[(ROWS - 1) * COLS + 2] = "capy";
    expect(checkWin(board, ROWS - 1, 2, "capy")).toBeNull();
  });

  it("does not count opponent pieces in the line", () => {
    const board = createBoard();
    const row = ROWS - 1;
    board[row * COLS + 0] = "capy";
    board[row * COLS + 1] = "capy";
    board[row * COLS + 2] = "corgi";
    board[row * COLS + 3] = "capy";
    expect(checkWin(board, row, 3, "capy")).toBeNull();
  });
});

describe("isBoardFull", () => {
  it("returns false for an empty board", () => {
    expect(isBoardFull(createBoard())).toBe(false);
  });

  it("returns false for a partially filled board", () => {
    const board = createBoard();
    board[0] = "capy";
    expect(isBoardFull(board)).toBe(false);
  });

  it("returns true when all cells are filled", () => {
    const board = createBoard().map((_, i) =>
      i % 2 === 0 ? ("capy" as const) : ("corgi" as const)
    );
    expect(isBoardFull(board)).toBe(true);
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm test
```

Expected: `FAIL` with `Cannot find module './gameLogic'`.

- [ ] **Step 3: Write client/src/lib/gameLogic.ts**

```typescript
export type Player = "capy" | "corgi";
export type Cell = Player | null;

export const ROWS = 6;
export const COLS = 7;

export function createBoard(): Cell[] {
  return Array(ROWS * COLS).fill(null);
}

export function findLandingRow(board: Cell[], col: number): number | null {
  for (let row = ROWS - 1; row >= 0; row--) {
    if (board[row * COLS + col] === null) return row;
  }
  return null;
}

export function checkWin(
  board: Cell[],
  row: number,
  col: number,
  player: Player
): number[] | null {
  const directions: [number, number][] = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];

  for (const [dr, dc] of directions) {
    const cells: number[] = [row * COLS + col];

    for (const sign of [1, -1] as const) {
      for (let i = 1; i < 4; i++) {
        const r = row + sign * dr * i;
        const c = col + sign * dc * i;
        if (
          r >= 0 &&
          r < ROWS &&
          c >= 0 &&
          c < COLS &&
          board[r * COLS + c] === player
        ) {
          cells.push(r * COLS + c);
        } else {
          break;
        }
      }
    }

    if (cells.length >= 4) return cells;
  }

  return null;
}

export function isBoardFull(board: Cell[]): boolean {
  return board.every((cell) => cell !== null);
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npm test
```

Expected:
```
 ✓ client/src/lib/gameLogic.test.ts (11)

 Test Files  1 passed (1)
      Tests  11 passed (11)
```

- [ ] **Step 5: Commit**

```bash
git add client/src/lib/
git commit -m "feat: add game logic with unit tests"
```

---

## Task 4: Logo and GamePiece components

**Files:**
- Create: `client/src/components/Logo.tsx`
- Create: `client/src/components/GamePiece.tsx`
- Copy: `client/public/images/capybara.png`
- Copy: `client/public/images/corgi.png`

- [ ] **Step 1: Copy images from the tic-tac-toe repo**

```bash
cp ~/Projects/capy-corgi-tic-tac-toe/client/public/images/capybara.png client/public/images/
cp ~/Projects/capy-corgi-tic-tac-toe/client/public/images/corgi.png client/public/images/
```

- [ ] **Step 2: Write client/src/components/Logo.tsx**

```tsx
export function Logo() {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl md:text-6xl font-chewy text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-400 drop-shadow-sm">
        Capybara vs Corgis
      </h1>
      <p className="text-sm md:text-base font-medium text-slate-500 -mt-1 md:-mt-2">
        Connect Four
      </p>
    </div>
  );
}
```

- [ ] **Step 3: Write client/src/components/GamePiece.tsx**

```tsx
import { motion } from "framer-motion";
import type { Player } from "../lib/gameLogic";

interface GamePieceProps {
  player: Player;
  animate?: boolean;
}

export function GamePiece({ player, animate = true }: GamePieceProps) {
  const isCapy = player === "capy";
  const src = isCapy ? "/images/capybara.png" : "/images/corgi.png";
  const alt = isCapy ? "Capybara" : "Corgi";
  const fallbackColor = isCapy ? "#ea580c" : "#ca8a04";

  return (
    <motion.div
      initial={animate ? { y: -400 } : false}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="w-full h-full flex items-center justify-center"
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-contain"
        onError={(e) => {
          const el = e.currentTarget;
          el.style.display = "none";
          const parent = el.parentElement;
          if (parent) {
            parent.style.color = fallbackColor;
            parent.style.fontFamily = "'Chewy', cursive";
            parent.style.fontSize = "0.625rem";
            parent.innerText = isCapy ? "CAPY" : "CORGI";
          }
        }}
      />
    </motion.div>
  );
}
```

- [ ] **Step 4: Verify in dev server**

Update `client/src/pages/Game.tsx` to preview both pieces:

```tsx
import { GamePiece } from "../components/GamePiece";

export default function Game() {
  return (
    <div className="flex gap-4 p-8">
      <div className="w-16 h-16"><GamePiece player="capy" /></div>
      <div className="w-16 h-16"><GamePiece player="corgi" /></div>
    </div>
  );
}
```

Expected: both images appear with a spring drop animation on load. Reload the page to re-trigger. No console errors about missing images.

- [ ] **Step 5: Commit**

```bash
git add client/src/components/Logo.tsx client/src/components/GamePiece.tsx client/public/images/
git commit -m "feat: add Logo, GamePiece components and character images"
```

---

## Task 5: GameCell and PlayerCard components

**Files:**
- Create: `client/src/components/GameCell.tsx`
- Create: `client/src/components/PlayerCard.tsx`

- [ ] **Step 1: Write client/src/components/GameCell.tsx**

```tsx
import { cn } from "../lib/utils";
import { GamePiece } from "./GamePiece";
import type { Cell } from "../lib/gameLogic";

interface GameCellProps {
  cell: Cell;
  isWinning: boolean;
  row: number;
  col: number;
}

export function GameCell({ cell, isWinning, row, col }: GameCellProps) {
  const cellLabel =
    cell === "capy" ? "Capybara" : cell === "corgi" ? "Corgi" : "empty";
  const ariaLabel = `Row ${row + 1}, Column ${col + 1}, ${cellLabel}${
    isWinning ? ", winning" : ""
  }`;

  return (
    <div
      aria-label={ariaLabel}
      role="gridcell"
      className={cn(
        "rounded-full aspect-square flex items-center justify-center overflow-hidden transition-all duration-200",
        !cell && "bg-slate-800",
        cell === "capy" && !isWinning && "bg-white ring-4 ring-red-500 p-0.5",
        cell === "corgi" && !isWinning && "bg-white ring-4 ring-blue-500 p-0.5",
        isWinning && "bg-white ring-4 ring-green-400 scale-110 p-0.5"
      )}
    >
      {cell && <GamePiece player={cell} />}
    </div>
  );
}
```

- [ ] **Step 2: Write client/src/components/PlayerCard.tsx**

```tsx
import { cn } from "../lib/utils";
import { GamePiece } from "./GamePiece";
import type { Player } from "../lib/gameLogic";

interface PlayerCardProps {
  player: Player;
  isActive: boolean;
  isWinner?: boolean;
}

export function PlayerCard({ player, isActive, isWinner }: PlayerCardProps) {
  const isCapy = player === "capy";
  const name = isCapy ? "Capybara" : "Corgi";

  return (
    <div
      aria-current={isActive ? "true" : undefined}
      className={cn(
        "relative p-4 rounded-2xl border-2 transition-all duration-300 w-32 md:w-40 flex flex-col items-center gap-3 bg-white shadow-sm",
        isActive &&
          isCapy &&
          "border-orange-500 ring-2 ring-orange-500/20 shadow-lg scale-105",
        isActive &&
          !isCapy &&
          "border-yellow-400 ring-2 ring-yellow-400/20 shadow-lg scale-105",
        !isActive && "border-transparent opacity-60 grayscale-[50%]",
        isWinner &&
          "ring-4 ring-green-400 bg-green-50 animate-bounce border-transparent"
      )}
    >
      <div className="w-16 h-16 md:w-20 md:h-20 relative">
        <GamePiece player={player} animate={false} />

        {isActive && !isWinner && (
          <span
            className="absolute -top-2 -right-2 flex h-4 w-4"
            aria-hidden="true"
          >
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500" />
          </span>
        )}
      </div>

      <div className="text-center">
        <p className="font-chewy text-lg md:text-xl leading-none mb-1">
          {name}
        </p>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {isWinner ? "Winner!" : isActive ? "Your turn" : "Waiting"}
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify PlayerCard in dev server**

Update `client/src/pages/Game.tsx`:

```tsx
import { PlayerCard } from "../components/PlayerCard";

export default function Game() {
  return (
    <div className="flex gap-8 p-8">
      <PlayerCard player="capy" isActive={true} />
      <PlayerCard player="corgi" isActive={false} />
    </div>
  );
}
```

Expected: Capy card has orange border, scale, green ping dot. Corgi card is dimmed and grayscale. No console errors.

- [ ] **Step 4: Commit**

```bash
git add client/src/components/GameCell.tsx client/src/components/PlayerCard.tsx
git commit -m "feat: add GameCell and PlayerCard components"
```

---

## Task 6: GameBoard component

**Files:**
- Create: `client/src/components/GameBoard.tsx`

- [ ] **Step 1: Write client/src/components/GameBoard.tsx**

```tsx
import { ChevronDown } from "lucide-react";
import { GameCell } from "./GameCell";
import { GamePiece } from "./GamePiece";
import { ROWS, COLS } from "../lib/gameLogic";
import type { Cell, Player } from "../lib/gameLogic";

interface GameBoardProps {
  board: Cell[];
  currentPlayer: Player;
  winningCells: number[];
  hoveredColumn: number | null;
  onColumnClick: (col: number) => void;
  onColumnHover: (col: number | null) => void;
  disabled: boolean;
}

export function GameBoard({
  board,
  currentPlayer,
  winningCells,
  hoveredColumn,
  onColumnClick,
  onColumnHover,
  disabled,
}: GameBoardProps) {
  const isColumnFull = (col: number) => board[0 * COLS + col] !== null;

  return (
    <div className="w-full max-w-lg mx-auto select-none">
      {/* Drop zone row -- px-3 matches the board frame's p-3 so columns align */}
      <div
        className="grid grid-cols-7 gap-2 px-3 mb-2"
        onMouseLeave={() => onColumnHover(null)}
      >
        {Array.from({ length: COLS }, (_, col) => (
          <button
            key={col}
            aria-label={`Drop in column ${col + 1}`}
            aria-disabled={disabled || isColumnFull(col) || undefined}
            disabled={disabled || isColumnFull(col)}
            onClick={() => onColumnClick(col)}
            onMouseEnter={() => onColumnHover(col)}
            className="h-14 flex flex-col items-center justify-center rounded-lg hover:bg-slate-200/60 transition-colors disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
          >
            {hoveredColumn === col && !disabled && !isColumnFull(col) && (
              <div className="flex flex-col items-center gap-0.5">
                <div className="w-7 h-7 opacity-50">
                  <GamePiece player={currentPlayer} animate={false} />
                </div>
                <ChevronDown
                  className="w-3 h-3 text-slate-500"
                  aria-hidden="true"
                />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Board frame */}
      <div className="bg-slate-700 rounded-3xl p-3 shadow-2xl">
        <div
          className="grid grid-cols-7 gap-2"
          role="grid"
          aria-label="Connect Four board"
        >
          {board.map((cell, i) => {
            const row = Math.floor(i / COLS);
            const col = i % COLS;
            return (
              <GameCell
                key={`${row}-${col}-${cell ?? "e"}`}
                cell={cell}
                isWinning={winningCells.includes(i)}
                row={row}
                col={col}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify GameBoard in dev server**

Update `client/src/pages/Game.tsx`:

```tsx
import { useState } from "react";
import { GameBoard } from "../components/GameBoard";
import { createBoard } from "../lib/gameLogic";
import type { Cell } from "../lib/gameLogic";

export default function Game() {
  const [board, setBoard] = useState<Cell[]>(createBoard());
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="p-8">
      <GameBoard
        board={board}
        currentPlayer="capy"
        winningCells={[]}
        hoveredColumn={hovered}
        onColumnClick={(col) => {
          const b = [...board];
          b[5 * 7 + col] = "capy";
          setBoard(b);
        }}
        onColumnHover={setHovered}
        disabled={false}
      />
    </div>
  );
}
```

Expected:
- Slate-700 rounded frame with 42 dark circles in a 6×7 grid.
- Hovering a column button shows a semi-transparent capy image + chevron in the drop zone row above the grid. The preview is aligned with the column.
- Clicking a column places a capy chip (red ring, white background, capy image) in the bottom row with a spring drop animation.
- No console errors.

- [ ] **Step 3: Commit**

```bash
git add client/src/components/GameBoard.tsx
git commit -m "feat: add GameBoard component with drop zones and hover preview"
```

---

## Task 7: Game page -- full state and UI

**Files:**
- Modify: `client/src/pages/Game.tsx`

- [ ] **Step 1: Replace client/src/pages/Game.tsx with the full implementation**

```tsx
import { useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { RotateCcw } from "lucide-react";
import { Logo } from "../components/Logo";
import { GameBoard } from "../components/GameBoard";
import { PlayerCard } from "../components/PlayerCard";
import {
  createBoard,
  findLandingRow,
  checkWin,
  isBoardFull,
  COLS,
} from "../lib/gameLogic";
import type { Player, Cell } from "../lib/gameLogic";

export default function Game() {
  const [board, setBoard] = useState<Cell[]>(createBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>("capy");
  const [startingPlayer, setStartingPlayer] = useState<Player>("capy");
  const [winner, setWinner] = useState<Player | "draw" | null>(null);
  const [winningCells, setWinningCells] = useState<number[]>([]);
  const [hoveredColumn, setHoveredColumn] = useState<number | null>(null);

  const dropPiece = (col: number) => {
    if (winner) return;

    const landingRow = findLandingRow(board, col);
    if (landingRow === null) return;

    const newBoard = [...board];
    newBoard[landingRow * COLS + col] = currentPlayer;
    setBoard(newBoard);

    const winCells = checkWin(newBoard, landingRow, col, currentPlayer);
    if (winCells) {
      setWinner(currentPlayer);
      setWinningCells(winCells);
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors:
            currentPlayer === "capy"
              ? ["#ef4444", "#f97316", "#dc2626"]
              : ["#3b82f6", "#60a5fa", "#eab308"],
        });
      }
      return;
    }

    if (isBoardFull(newBoard)) {
      setWinner("draw");
      return;
    }

    setCurrentPlayer(currentPlayer === "capy" ? "corgi" : "capy");
  };

  const resetGame = () => {
    const nextStarter: Player = startingPlayer === "capy" ? "corgi" : "capy";
    setBoard(createBoard());
    setCurrentPlayer(nextStarter);
    setStartingPlayer(nextStarter);
    setWinner(null);
    setWinningCells([]);
    setHoveredColumn(null);
  };

  const statusMessage = winner
    ? winner === "draw"
      ? "It's a tie!"
      : `${winner === "capy" ? "Capybara" : "Corgi"} wins!`
    : `${currentPlayer === "capy" ? "Capybara" : "Corgi"}'s turn`;

  const gameHasStarted = board.some((cell) => cell !== null);

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {statusMessage}
      </div>

      <header className="w-full max-w-2xl flex justify-center items-center mb-6 pt-4">
        <Logo />
      </header>

      <main className="flex flex-col items-center w-full gap-6">
        <div className="flex justify-between w-full max-w-lg gap-4">
          <PlayerCard
            player="capy"
            isActive={currentPlayer === "capy" && !winner}
            isWinner={winner === "capy"}
          />
          <PlayerCard
            player="corgi"
            isActive={currentPlayer === "corgi" && !winner}
            isWinner={winner === "corgi"}
          />
        </div>

        <GameBoard
          board={board}
          currentPlayer={currentPlayer}
          winningCells={winningCells}
          hoveredColumn={hoveredColumn}
          onColumnClick={dropPiece}
          onColumnHover={setHoveredColumn}
          disabled={!!winner}
        />

        {winner && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center space-y-4"
          >
            <h2 className="text-4xl font-chewy text-slate-800">
              {winner === "draw"
                ? "It's a Tie!"
                : `${winner === "capy" ? "Capybara" : "Corgi"} Wins!`}
            </h2>
            <button
              onClick={resetGame}
              className="inline-flex items-center gap-2 px-8 py-3 text-lg font-bold rounded-full bg-orange-500 text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2"
            >
              <RotateCcw className="h-5 w-5" aria-hidden="true" />
              Play Again
            </button>
          </motion.div>
        )}

        {!winner && gameHasStarted && (
          <button
            onClick={resetGame}
            className="px-6 py-2 rounded-full border-2 border-slate-300 text-slate-500 hover:text-slate-700 hover:border-slate-400 transition-all font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
          >
            Reset Board
          </button>
        )}
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Play through the full game flow in the dev server**

Start `npm run dev` and test each scenario:

1. **Initial load:** Capybara card has orange border + scale + green ping dot. Corgi card is dimmed. Board shows 42 dark circles in a slate frame.
2. **First drop:** Click column 3. Capy chip drops with spring animation to row 5. Red ring. Turn switches to Corgi.
3. **Second drop:** Click same column. Corgi chip drops to row 4. Blue ring.
4. **Win:** Drop 4 capy chips in a row. "Capybara Wins!" scales in. Confetti fires in red/orange. Winning chips get green rings. Column drop zones are disabled.
5. **Play Again:** Board clears. Corgi now goes first (starting player alternated).
6. **Draw:** Manually fill all 42 cells without 4-in-a-row. "It's a Tie!" appears.
7. **Reset Board:** After 1+ moves with no winner, "Reset Board" button appears. Click it -- board clears, same starting player goes again.
8. **Hover preview:** On a desktop pointer device, hover over a column -- semi-transparent capy/corgi image + chevron appears in the drop zone. Moving to another column updates the preview. Moving off the board clears it.

- [ ] **Step 3: Commit**

```bash
git add client/src/pages/Game.tsx
git commit -m "feat: implement full Game page with Connect Four logic and UI"
```

---

## Task 8: Type check, build verification, and Netlify config

**Files:**
- Create: `netlify.toml`

- [ ] **Step 1: Run TypeScript type check**

```bash
npm run build
```

Expected: TypeScript compiles with zero errors. Vite builds successfully. Output:

```
dist/index.html
dist/assets/index-[hash].js
dist/assets/index-[hash].css
dist/images/capybara.png
dist/images/corgi.png
```

Fix any type errors before continuing.

- [ ] **Step 2: Run tests one final time**

```bash
npm test
```

Expected:
```
 ✓ client/src/lib/gameLogic.test.ts (11)

 Test Files  1 passed (1)
      Tests  11 passed (11)
```

- [ ] **Step 3: Write netlify.toml**

```toml
[build]
  command = "npm run build"
  publish = "dist"
```

- [ ] **Step 4: Final commit**

```bash
git add netlify.toml
git commit -m "chore: add Netlify deployment config"
```

- [ ] **Step 5: Tag v1.0.0**

```bash
git tag v1.0.0
```
