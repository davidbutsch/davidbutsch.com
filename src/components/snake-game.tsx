import { useEffect, useRef } from "react"

import {
  COLS,
  NATIVE_HEIGHT,
  NATIVE_WIDTH,
  ROWS,
  SPRITE,
  createGame,
  queueTurn,
  snakeVisible,
  stepGame,
  tickMs,
  type Direction,
  type Game,
} from "@/lib/snake"

const SOURCES = {
  apple: "red_apple.png",
  head: "green_snake_head.png",
  body: "green_snake_body.png",
  tail: "green_snake_tail.png",
} as const

type SpriteName = keyof typeof SOURCES

/** The head sprite is drawn facing right; the rest are 90° steps from there. */
const ROTATION: Record<Direction, number> = {
  right: 0,
  down: Math.PI / 2,
  left: Math.PI,
  up: -Math.PI / 2,
}

const KEYS: Record<string, Direction> = {
  w: "up",
  a: "left",
  s: "down",
  d: "right",
}

function isTyping(target: EventTarget | null) {
  const el = target as HTMLElement | null
  if (!el) return false
  return (
    el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName ?? "")
  )
}

/**
 * The board opens with "DAVID" spelled in apples and plays itself: the snake
 * crawls from a random spawn, crashes, blinks, and respawns on a loop. WASD
 * takes over the steering at any point.
 *
 * Game state is held in this effect's closure rather than React state: at
 * ~8 ticks a second, a state update per tick would re-render the header
 * continuously for no benefit. The loop draws to the canvas imperatively and
 * this component never re-renders.
 */
export function SnakeGame() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const canvas = canvasRef.current
    if (!wrapper || !canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.imageSmoothingEnabled = false

    let game: Game = createGame()
    let sprites: Record<SpriteName, HTMLImageElement> | null = null
    let boardA = ""
    let boardB = ""
    let raf = 0
    let last = 0
    let disposed = false

    // ---- theme ----------------------------------------------------------
    // Board tones come from the site's own tokens, so the checker is beige in
    // light mode and the matching charcoal pair in dark.
    function readColors() {
      const style = getComputedStyle(document.documentElement)
      boardA = style.getPropertyValue("--snake-board").trim()
      boardB = style.getPropertyValue("--snake-board-alt").trim()
    }

    // ---- rendering ------------------------------------------------------
    function drawTile(
      img: HTMLImageElement,
      x: number,
      y: number,
      rot: number
    ) {
      const px = x * SPRITE
      const py = y * SPRITE
      if (rot === 0) {
        ctx!.drawImage(img, px, py)
        return
      }
      ctx!.save()
      ctx!.translate(px + SPRITE / 2, py + SPRITE / 2)
      ctx!.rotate(rot)
      ctx!.drawImage(img, -SPRITE / 2, -SPRITE / 2)
      ctx!.restore()
    }

    function render() {
      if (!sprites) return

      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          ctx!.fillStyle = (x + y) % 2 ? boardB : boardA
          ctx!.fillRect(x * SPRITE, y * SPRITE, SPRITE, SPRITE)
        }
      }

      for (const apple of game.apples) {
        ctx!.drawImage(sprites.apple, apple.x * SPRITE, apple.y * SPRITE)
      }

      // Board and apples keep drawing every frame, so only the snake blinks
      // through the death flash.
      if (!snakeVisible(game)) return

      // Tail first so the head paints on top at a self-overlap.
      for (let i = game.snake.length - 1; i >= 0; i--) {
        const cell = game.snake[i]
        if (i === 0) {
          drawTile(sprites.head, cell.x, cell.y, ROTATION[game.dir])
        } else if (i === game.snake.length - 1) {
          const prev = game.snake[i - 1]
          const facing: Direction =
            prev.x > cell.x
              ? "right"
              : prev.x < cell.x
                ? "left"
                : prev.y > cell.y
                  ? "down"
                  : "up"
          drawTile(sprites.tail, cell.x, cell.y, ROTATION[facing])
        } else {
          // Not rotated: the body sprite carries a fixed light direction, and
          // spinning it would flip the lighting from segment to segment.
          drawTile(sprites.body, cell.x, cell.y, 0)
        }
      }
    }

    // ---- loop -----------------------------------------------------------
    // Runs until unmount. The interval comes from the engine, so the death
    // blink automatically ticks faster than the game. RAF already suspends on
    // a hidden tab, so no extra visibility handling is needed.
    function loop(now: number) {
      if (disposed) {
        raf = 0
        return
      }
      if (now - last >= tickMs(game)) {
        last = now
        game = stepGame(game)
        render()
      }
      raf = requestAnimationFrame(loop)
    }

    // ---- input ----------------------------------------------------------
    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (isTyping(event.target)) return

      const dir = KEYS[event.key.toLowerCase()]
      if (!dir) return

      game = queueTurn(game, dir)
    }

    // ---- sizing ---------------------------------------------------------
    // Largest whole-number scale that fits, so every source pixel maps to an
    // exact NxN block and nothing smears. 504px pane -> 2x, mobile -> 1x.
    function fit() {
      const scale = Math.max(1, Math.floor(wrapper!.clientWidth / NATIVE_WIDTH))
      canvas!.style.width = `${NATIVE_WIDTH * scale}px`
      canvas!.style.height = `${NATIVE_HEIGHT * scale}px`
    }

    // ---- boot -----------------------------------------------------------
    readColors()
    fit()

    const themeObserver = new MutationObserver(() => {
      readColors()
      render()
    })
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    const resizeObserver = new ResizeObserver(fit)
    resizeObserver.observe(wrapper)

    window.addEventListener("keydown", onKeyDown)

    const base = import.meta.env.BASE_URL
    void Promise.all(
      Object.entries(SOURCES).map(async ([name, file]) => {
        const img = new Image()
        img.src = `${base}snake/${file}`
        await img.decode()
        return [name, img] as const
      })
    ).then((entries) => {
      if (disposed) return
      sprites = Object.fromEntries(entries) as Record<
        SpriteName,
        HTMLImageElement
      >
      render()
      last = performance.now()
      raf = requestAnimationFrame(loop)
    })

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      themeObserver.disconnect()
      resizeObserver.disconnect()
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [])

  return (
    <div className="mb-8">
      <div ref={wrapperRef}>
        <canvas
          ref={canvasRef}
          width={NATIVE_WIDTH}
          height={NATIVE_HEIGHT}
          aria-hidden="true"
          className="block max-w-full border border-border hard-shadow-sm [image-rendering:pixelated]"
        />
      </div>
      <p className="mt-3 hidden text-xs text-muted-foreground sm:block">WASD</p>
    </div>
  )
}
