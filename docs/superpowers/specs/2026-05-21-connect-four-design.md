# Capy vs. Corgi Connect Four -- Design Spec

**Date:** 2026-05-21
**Status:** Approved

---

## Overview

A new standalone web app: **Capy vs. Corgi Connect Four**. Local 2-player only (pass & play, same device). No AI opponent, no score tracking across sessions, no login. One game at a time with a simple restart. Designed to encourage in-person interaction.

Visually matches the existing `capy-corgi-tic-tac-toe` app: same fonts, same warm UI palette, same animation patterns -- but with classic red/blue chip colors on the board for readability.

---

## Repository

New repo: `capy-corgi-connect-four`

No connection to the tic-tac-toe repo beyond shared design language.

---

## Tech Stack

| Concern | Choice |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Styles | Tailwind CSS |
| Animations | framer-motion |
| Win celebration | canvas-confetti |
| Deployment | Netlify (static, same `netlify.toml` pattern) |
| Routing | None (single page, single game) |
| UI primitives | Handwritten with Tailwind -- no shadcn/radix dependency |

---

## Project Structure

```
capy-corgi-connect-four/
  client/
    src/
      components/
        Logo.tsx
        GameBoard.tsx
        GameCell.tsx
        GamePiece.tsx
        PlayerCard.tsx
      pages/
        Game.tsx
      index.css
      App.tsx
      main.tsx
    public/
      images/
        capybara.png
        corgi.png
    index.html
  package.json
  vite.config.ts
  tailwind.config.ts
  postcss.config.js
  tsconfig.json
  netlify.toml
```

---

## Game Rules

- Standard Connect Four: 6 rows × 7 columns.
- Players alternate dropping pieces into columns. Piece falls to the lowest empty row in the chosen column.
- First player to connect 4 in a row (horizontal, vertical, or diagonal) wins.
- If all 42 cells fill with no winner: draw.
- Starting player alternates each new game.
- No undo. Drop is a commitment.

---

## Data Model

```typescript
type Player = "capy" | "corgi";
type Cell = Player | null;

const ROWS = 6;
const COLS = 7;

// Flat array, indexed as row * COLS + col
type Board = Cell[];  // length 42
```

State lives entirely in `Game.tsx`:

```typescript
board: Cell[]           // 42 cells
currentPlayer: Player   // whose turn it is
winner: Player | "draw" | null
winningCells: number[]  // indices of the 4 winning cells (empty if no winner yet)
hoveredColumn: number | null
startingPlayer: Player  // alternates on reset
```

---

## Game Logic

### Drop piece

```
dropPiece(col):
  if winner or column is full: return
  find lowest empty row in col (scan from row 5 up to row 0)
  place currentPlayer at that cell
  check for win from that cell
  if win: set winner + winningCells, fire confetti
  else if board full: set winner = "draw"
  else: toggle currentPlayer
```

### Win detection

From the just-placed cell, check 4 directions: horizontal `[0,1]`, vertical `[1,0]`, diagonal-down-right `[1,1]`, diagonal-down-left `[1,-1]`. For each direction, collect consecutive same-player cells in both directions. If total >= 4, return those 4 cell indices.

---

## Components

### `Game.tsx`
All game state and logic. Renders `Logo`, two `PlayerCard`s, `GameBoard`, and game-over / reset controls. No state leaks to child components.

### `GameBoard.tsx`
Props: `board`, `currentPlayer`, `winningCells`, `hoveredColumn`, `onColumnClick(col)`, `onColumnHover(col | null)`, `disabled`.

Renders:
1. A row of 7 column drop zones across the top. Each is a clickable hit target spanning the full column width. On hover (pointer devices), shows the hover preview.
2. The 6×7 cell grid inside a warm slate (`slate-700`) rounded frame.

### `GameCell.tsx`
Props: `cell`, `isWinning`.

- Empty cell: dark circle (`slate-800` bg inside the slate frame).
- Occupied cell: white/light circle background + `GamePiece` image + red ring (capy) or blue ring (corgi). `ring-4 ring-red-500` or `ring-4 ring-blue-500`.
- Winning cell: green ring overrides (`ring-4 ring-green-400`) + slight scale-up.

### `GamePiece.tsx`
Props: `player`, `key` (triggers animation reset).

Renders capy or corgi image filling the cell. On mount: framer-motion spring drop animation `initial: { y: -400 }` → `animate: { y: 0 }`, stiffness 300, damping 25. Slight overshoot gives satisfying landing bounce. Same image fallback text pattern as the existing app.

### `PlayerCard.tsx`
Identical behavior to the tic-tac-toe app. Active player: colored border ring + green ping dot. Winner: green ring + bounce animation. Uses warm orange/yellow palette for borders (character theming), not the red/blue chip colors.

### `Logo.tsx`
Same gradient text pattern as existing app. Title: "Capybara vs Corgis". Subtitle: "Connect Four".

---

## Visual Design

### Palette

| Token | Value | Use |
|---|---|---|
| `--capy-primary` | `28 80% 52%` (orange-brown) | Capy player card border, UI accents |
| `--corgi-primary` | `45 90% 60%` (golden yellow) | Corgi player card border, UI accents |
| Chip: Capy | `ring-red-500` | Board chip outline |
| Chip: Corgi | `ring-blue-500` | Board chip outline |
| Board frame | `bg-slate-700` | Classic Connect Four frame feel |
| Background | warm slate-50 + radial orange/yellow gradients | Same as existing app |

### Typography
- Headings: Chewy (same Google Fonts import)
- Body: Fredoka (same)

### Chip appearance
Circular cells. Full capy or corgi image inside. Red (`ring-red-500`) outline for Capybara's chips, blue (`ring-blue-500`) for Corgi's chips. Empty cells: dark `slate-800` circle, no ring. Winning cells: green ring (`ring-green-400`) overrides chip color.

### Hover preview (pointer devices only)
Semi-transparent (50% opacity) version of the current player's piece renders inside the column drop zone row (above the grid, not inside a grid cell). A small downward chevron below it reinforces the drop affordance. This avoids overlap with any pieces already placed in row 0. Not shown on touch devices.

### Animations
- Piece drop: framer-motion spring, `y: -400` → `y: 0`, stiffness 300, damping 25
- Game over: winner announcement scales in (`scale: 0.8, opacity: 0` → `scale: 1, opacity: 1`)
- Confetti: capy = red/orange particles; corgi = blue/yellow particles

### Responsive
Board cells scale fluidly. Min cell size ~44px so all 7 columns fit on screens ≥ 360px without horizontal scroll.

---

## Controls

**During game (after first move):**
- Reset Board button (outline style)

**Game over:**
- "Play Again" button (primary, rounded-full, large) -- resets and alternates starting player

No undo button.

---

## Accessibility

- `aria-live="polite"` region for turn/winner announcements (screen readers)
- Column drop zones: `aria-label="Column N"`, `aria-disabled` when full
- Cells: `aria-label="Row R, Column C, [empty | Capybara | Corgi][, winning]"`
- Focus-visible ring on interactive elements
- Confetti respects `prefers-reduced-motion`
