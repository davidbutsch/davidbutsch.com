/**
 * Pure snake engine. No DOM, no React, no canvas — rendering lives in
 * @/components/snake-game.
 *
 * The board opens seeded with "DAVID" spelled in apples and plays itself: the
 * snake crawls from a random spawn, hits a wall, blinks, and respawns, looping
 * forever as background animation. Steering with WASD interrupts that loop.
 *
 * Eating the last apple flips the game to a traditional configuration: the
 * snake shrinks back to its starting length and apples spawn one at a time.
 */

export const SPRITE = 9
export const COLS = 28
export const ROWS = 9

/** Native canvas size, before any integer upscale. */
export const NATIVE_WIDTH = COLS * SPRITE
export const NATIVE_HEIGHT = ROWS * SPRITE

/** Constant — 54 apples is punishing enough without a speed ramp. */
export const STEP_MS = 120

/** Snappier than the game tick, so the death blink reads as a flash. */
export const DEATH_FLASH_MS = 90

const DEATH_PULSES = 3
/** One visible and one hidden frame per pulse. */
const DEATH_FRAMES = DEATH_PULSES * 2

const START_LENGTH = 3
/** Cells of clear runway a fresh spawn is guaranteed before its wall. */
const MIN_RUNWAY = 18

export type Direction = "up" | "down" | "left" | "right"
export type Cell = { x: number; y: number }

export type Game = {
  /** Head first. */
  snake: Cell[]
  dir: Direction
  /** Max 2, so a quick double-tap around a corner still registers. */
  queued: Direction[]
  /** 54 while spelling DAVID, exactly 1 afterwards. */
  apples: Cell[]
  phase: "david" | "classic"
  /**
   * `null` while alive; `0..DEATH_FRAMES-1` while the death blink plays.
   * This doubles as the liveness flag — there is no separate status field.
   */
  deathFrame: number | null
}

/** Interval before the next tick. The blink runs faster than the game. */
export function tickMs(game: Game): number {
  return game.deathFrame === null ? STEP_MS : DEATH_FLASH_MS
}

/** False on the hidden half of each death pulse. */
export function snakeVisible(game: Game): boolean {
  return game.deathFrame === null || game.deathFrame % 2 === 0
}

const DELTA: Record<Direction, Cell> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
}

const OPPOSITE: Record<Direction, Direction> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
}

// ---------------------------------------------------------------------------
// Glyphs
// ---------------------------------------------------------------------------

/** 5 rows per letter, "#" = apple. Widths: D 4, A 4, V 5, I 3. */
const GLYPHS: Record<string, string[]> = {
  D: ["###.", "#..#", "#..#", "#..#", "###."],
  A: [".##.", "#..#", "####", "#..#", "#..#"],
  V: ["#...#", "#...#", "#...#", ".#.#.", "..#.."],
  I: ["###", ".#.", ".#.", ".#.", "###"],
}

const WORD = "DAVID"
const GLYPH_ROWS = 5
const LETTER_GAP = 1

const LETTERS = [...WORD].map((char) => GLYPHS[char])

const WORD_WIDTH =
  LETTERS.reduce((sum, glyph) => sum + glyph[0].length, 0) +
  LETTER_GAP * (LETTERS.length - 1)

/**
 * Centered origin of the word block.
 *
 * "DAVID" measures 4+1+4+1+5+1+3+1+4 = 24 columns, so on a 28x9 board it sits
 * at x=2, y=2 and occupies cols 2-25 / rows 2-6. That leaves free lanes in
 * rows 0-1 and 7-8 plus vertical corridors at cols 0, 1, 6, 11, 17, 21, 26 and
 * 27 — which is what keeps the board navigable while the letters still stand.
 */
const ORIGIN_X = Math.floor((COLS - WORD_WIDTH) / 2)
const ORIGIN_Y = Math.floor((ROWS - GLYPH_ROWS) / 2)

function wordApples(): Cell[] {
  const cells: Cell[] = []
  let cursor = ORIGIN_X

  for (const glyph of LETTERS) {
    glyph.forEach((line, row) => {
      ;[...line].forEach((char, col) => {
        if (char === "#") cells.push({ x: cursor + col, y: ORIGIN_Y + row })
      })
    })
    cursor += glyph[0].length + LETTER_GAP
  }

  return cells
}

/**
 * Rows the word never occupies — [0, 1, 7, 8] as laid out today. Autoplay
 * spawns are confined to these so the loop can't eat the letters on its own;
 * only a human steering out of a lane can reach them.
 */
const FREE_LANES = Array.from({ length: ROWS }, (_, y) => y).filter(
  (y) => y < ORIGIN_Y || y >= ORIGIN_Y + GLYPH_ROWS
)

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

function pick<T>(values: readonly T[]): T {
  return values[Math.floor(Math.random() * values.length)]
}

/**
 * A random horizontal spawn in one of the free lanes, guaranteed at least
 * MIN_RUNWAY cells before the wall it is heading for. Kept horizontal on
 * purpose: a vertical spawn out of row 1 or row 7 would drive straight into
 * the letters.
 */
function spawn(): { snake: Cell[]; dir: Direction } {
  const y = pick(FREE_LANES)
  const dir: Direction = pick(["right", "left"] as const)

  // Head must clear its trailing body at one end and MIN_RUNWAY at the other.
  const lowest = START_LENGTH - 1
  const highest = COLS - 1 - MIN_RUNWAY
  const headX =
    dir === "right"
      ? lowest + Math.floor(Math.random() * (highest - lowest + 1))
      : COLS - 1 - lowest - Math.floor(Math.random() * (highest - lowest + 1))

  const trail = dir === "right" ? -1 : 1
  const snake = Array.from({ length: START_LENGTH }, (_, i) => ({
    x: headX + i * trail,
    y,
  }))

  return { snake, dir }
}

export function createGame(): Game {
  const { snake, dir } = spawn()
  return {
    snake,
    dir,
    queued: [],
    apples: wordApples(),
    phase: "david",
    deathFrame: null,
  }
}

export function queueTurn(game: Game, dir: Direction): Game {
  if (game.deathFrame !== null || game.queued.length >= 2) return game

  const last = game.queued.at(-1) ?? game.dir
  if (dir === last || dir === OPPOSITE[last]) return game

  return { ...game, queued: [...game.queued, dir] }
}

function randomFreeCell(occupied: Cell[]): Cell | undefined {
  const taken = new Set(occupied.map((cell) => `${cell.x},${cell.y}`))
  const free: Cell[] = []

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (!taken.has(`${x},${y}`)) free.push({ x, y })
    }
  }

  return free[Math.floor(Math.random() * free.length)]
}

export function stepGame(game: Game): Game {
  // Death blink: hold position, count frames, then respawn.
  if (game.deathFrame !== null) {
    const next = game.deathFrame + 1
    return next >= DEATH_FRAMES ? createGame() : { ...game, deathFrame: next }
  }

  const queued = [...game.queued]
  const next = queued.shift()
  const dir = next && next !== OPPOSITE[game.dir] ? next : game.dir

  const delta = DELTA[dir]
  const head: Cell = {
    x: game.snake[0].x + delta.x,
    y: game.snake[0].y + delta.y,
  }

  const hitWall = head.x < 0 || head.y < 0 || head.x >= COLS || head.y >= ROWS
  // The tail cell frees up on this same tick, so it is not a collision.
  const hitSelf = game.snake
    .slice(0, -1)
    .some((cell) => cell.x === head.x && cell.y === head.y)

  // Start the blink. The head is deliberately NOT advanced into the wall, so
  // the snake flashes at its last legal position before the board resets.
  if (hitWall || hitSelf) return { ...game, deathFrame: 0 }

  const eatenIndex = game.apples.findIndex(
    (apple) => apple.x === head.x && apple.y === head.y
  )
  const ate = eatenIndex !== -1

  const snake = [head, ...game.snake]
  if (!ate) snake.pop()

  if (!ate) return { ...game, snake, dir, queued }

  const apples = game.apples.filter((_, i) => i !== eatenIndex)

  // Last letter eaten — hand over to a traditional game. The head keeps its
  // position and heading so there is no teleport mid-run; only the tail is
  // trimmed back to the starting length.
  if (apples.length === 0 && game.phase === "david") {
    const trimmed = snake.slice(0, START_LENGTH)
    const spawned = randomFreeCell(trimmed)
    return {
      ...game,
      snake: trimmed,
      dir,
      queued,
      apples: spawned ? [spawned] : [],
      phase: "classic",
    }
  }

  if (game.phase === "classic") {
    const spawned = randomFreeCell(snake)
    return {
      ...game,
      snake,
      dir,
      queued,
      apples: spawned ? [spawned] : [],
    }
  }

  return { ...game, snake, dir, queued, apples }
}
