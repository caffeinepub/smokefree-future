import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Vec2 {
  x: number;
  y: number;
}
interface Entity {
  pos: Vec2;
  vel: Vec2;
  size: number;
}
interface GameState {
  player: Entity;
  cig: Entity;
  score: number;
  alive: boolean;
  started: boolean;
  highScore: number;
  smokeParticles: { x: number; y: number; alpha: number; r: number }[];
}

const CANVAS_W = 480;
const CANVAS_H = 400;
const PLAYER_SPEED = 200;
const CIG_BASE_SPEED = 70;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function makeState(highScore = 0): GameState {
  return {
    player: {
      pos: { x: CANVAS_W / 2, y: CANVAS_H / 2 },
      vel: { x: 0, y: 0 },
      size: 22,
    },
    cig: { pos: { x: 40, y: 40 }, vel: { x: 0, y: 0 }, size: 26 },
    score: 0,
    alive: true,
    started: false,
    highScore,
    smokeParticles: [],
  };
}

export function CigaretteChaseGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState>(makeState());
  const keysRef = useRef<Set<string>>(new Set());
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const [uiState, setUiState] = useState<{
    score: number;
    alive: boolean;
    started: boolean;
    highScore: number;
  }>({ score: 0, alive: true, started: false, highScore: 0 });

  const syncUI = useCallback(() => {
    const s = stateRef.current;
    setUiState({
      score: s.score,
      alive: s.alive,
      started: s.started,
      highScore: s.highScore,
    });
  }, []);

  const startGame = useCallback(() => {
    const hs = stateRef.current.highScore;
    stateRef.current = makeState(hs);
    stateRef.current.started = true;
    lastTimeRef.current = 0;
    syncUI();
    canvasRef.current?.focus();
  }, [syncUI]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional stable game loop with refs
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ── Input ──
    const onKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key.toLowerCase());
      if (
        ["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(
          e.key.toLowerCase(),
        )
      ) {
        e.preventDefault();
      }
      if ((e.key === " " || e.key === "Enter") && !stateRef.current.started) {
        startGame();
      }
    };
    const onKeyUp = (e: KeyboardEvent) =>
      keysRef.current.delete(e.key.toLowerCase());
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    // ── Loop ──
    function loop(ts: number) {
      rafRef.current = requestAnimationFrame(loop);
      const state = stateRef.current;
      if (!state.alive || !state.started) {
        drawStatic(ctx!, state);
        return;
      }

      const dt = lastTimeRef.current
        ? Math.min((ts - lastTimeRef.current) / 1000, 0.05)
        : 0.016;
      lastTimeRef.current = ts;

      // -- Player movement --
      const keys = keysRef.current;
      let dx = 0;
      let dy = 0;
      if (keys.has("arrowleft") || keys.has("a")) dx -= 1;
      if (keys.has("arrowright") || keys.has("d")) dx += 1;
      if (keys.has("arrowup") || keys.has("w")) dy -= 1;
      if (keys.has("arrowdown") || keys.has("s")) dy += 1;

      // Normalize diagonal
      const mag = Math.sqrt(dx * dx + dy * dy);
      if (mag > 0) {
        dx /= mag;
        dy /= mag;
      }

      const p = state.player;
      const r = p.size / 2;
      p.pos.x = Math.max(
        r,
        Math.min(CANVAS_W - r, p.pos.x + dx * PLAYER_SPEED * dt),
      );
      p.pos.y = Math.max(
        r,
        Math.min(CANVAS_H - r, p.pos.y + dy * PLAYER_SPEED * dt),
      );

      // -- Cigarette AI: chase player, speed increases over time --
      const cigSpeed = CIG_BASE_SPEED + state.score * 0.8;
      const cig = state.cig;
      const cdx = p.pos.x - cig.pos.x;
      const cdy = p.pos.y - cig.pos.y;
      const dist = Math.sqrt(cdx * cdx + cdy * cdy);
      if (dist > 0) {
        cig.pos.x += (cdx / dist) * cigSpeed * dt;
        cig.pos.y += (cdy / dist) * cigSpeed * dt;
      }

      // -- Smoke trail --
      if (Math.random() < 0.4) {
        state.smokeParticles.push({
          x: cig.pos.x - (cdx / (dist || 1)) * 14,
          y: cig.pos.y - (cdy / (dist || 1)) * 14,
          alpha: 0.55,
          r: 6 + Math.random() * 6,
        });
      }
      state.smokeParticles = state.smokeParticles
        .map((sp) => ({ ...sp, alpha: sp.alpha - 0.025, r: sp.r + 0.4 }))
        .filter((sp) => sp.alpha > 0);

      // -- Score --
      state.score += dt * 10;
      if (Math.floor(state.score) % 5 === 0) syncUI();

      // -- Collision --
      const colDist = (p.size / 2 + cig.size / 2) * 0.75;
      if (dist < colDist) {
        state.alive = false;
        if (state.score > state.highScore) state.highScore = state.score;
        syncUI();
      }

      drawFrame(ctx!, state);
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
    // biome-ignore lint/correctness/useExhaustiveDependencies: intentional game loop
  }, []);

  // ── Touch / on-screen controls ──
  const movePlayer = useCallback((dx: number, dy: number) => {
    const p = stateRef.current.player;
    const r = p.size / 2;
    p.pos.x = Math.max(r, Math.min(CANVAS_W - r, p.pos.x + dx * 12));
    p.pos.y = Math.max(r, Math.min(CANVAS_H - r, p.pos.y + dy * 12));
  }, []);

  return (
    <section id="chase-game" className="py-20 sm:py-28 section-gradient">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <Badge className="mb-4 bg-orange-100 text-orange-700 border-orange-200 font-body">
            🏃 Run from the Cigarette!
          </Badge>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-foreground mb-4">
            Don't Get Caught!
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            The cigarette is chasing you — dodge it as long as you can! Use
            arrow keys, WASD, or the on-screen buttons.
          </p>
        </div>

        {/* Scoreboard */}
        <div className="flex justify-center gap-6 mb-4">
          <div className="bg-white rounded-2xl border border-border shadow-sm px-6 py-3 text-center min-w-[110px]">
            <div className="font-body text-xs text-muted-foreground uppercase tracking-wide mb-1">
              Score
            </div>
            <div className="font-display font-black text-2xl text-primary">
              {Math.floor(uiState.score)}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-border shadow-sm px-6 py-3 text-center min-w-[110px]">
            <div className="font-body text-xs text-muted-foreground uppercase tracking-wide mb-1">
              Best
            </div>
            <div className="font-display font-black text-2xl text-accent">
              {Math.floor(uiState.highScore)}
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="relative flex justify-center">
          <canvas
            ref={canvasRef}
            width={CANVAS_W}
            height={CANVAS_H}
            tabIndex={0}
            data-ocid="chase_game.canvas_target"
            className="rounded-2xl border-2 border-border shadow-card outline-none focus:ring-2 focus:ring-primary/40 w-full max-w-[480px] cursor-none"
            style={{ imageRendering: "pixelated", background: "#f0fdf4" }}
          />

          {/* Overlay: start / game over */}
          {(!uiState.started || !uiState.alive) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-black/40 backdrop-blur-[2px]">
              {!uiState.started && (
                <>
                  <div className="text-6xl mb-3">🏃💨🚬</div>
                  <p className="font-display font-black text-white text-3xl mb-2">
                    Run for Your Life!
                  </p>
                  <p className="font-body text-white/80 text-sm mb-6 text-center px-4">
                    Dodge the cigarette. The longer you survive, the faster it
                    gets!
                  </p>
                  <Button
                    data-ocid="chase_game.primary_button"
                    onClick={startGame}
                    className="bg-accent text-accent-foreground font-body font-bold text-base px-8 py-3 rounded-full hover:opacity-90"
                  >
                    Start Game
                  </Button>
                </>
              )}
              {!uiState.alive && uiState.started && (
                <>
                  <div className="text-6xl mb-3">💀🚬</div>
                  <p className="font-display font-black text-white text-3xl mb-1">
                    Caught!
                  </p>
                  <p className="font-body text-white/80 text-sm mb-1">
                    Score:{" "}
                    <strong className="text-white">
                      {Math.floor(uiState.score)}
                    </strong>
                  </p>
                  {uiState.score >= uiState.highScore && uiState.score > 0 && (
                    <p className="font-body text-yellow-300 text-sm mb-4 font-bold">
                      🏆 New High Score!
                    </p>
                  )}
                  {uiState.score < uiState.highScore && (
                    <p className="font-body text-white/60 text-sm mb-4">
                      Best: {Math.floor(uiState.highScore)}
                    </p>
                  )}
                  <Button
                    data-ocid="chase_game.primary_button"
                    onClick={startGame}
                    className="bg-accent text-accent-foreground font-body font-bold text-base px-8 py-3 rounded-full hover:opacity-90"
                  >
                    Play Again
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        {/* On-screen D-pad */}
        <div className="flex flex-col items-center mt-5 gap-1 md:hidden">
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl w-12 h-12 text-xl"
            onPointerDown={() => movePlayer(0, -1)}
            data-ocid="chase_game.button"
          >
            ↑
          </Button>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              className="rounded-xl w-12 h-12 text-xl"
              onPointerDown={() => movePlayer(-1, 0)}
              data-ocid="chase_game.button"
            >
              ←
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-xl w-12 h-12 text-xl"
              onPointerDown={() => movePlayer(0, 1)}
              data-ocid="chase_game.button"
            >
              ↓
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-xl w-12 h-12 text-xl"
              onPointerDown={() => movePlayer(1, 0)}
              data-ocid="chase_game.button"
            >
              →
            </Button>
          </div>
        </div>

        <p className="text-center font-body text-xs text-muted-foreground mt-4">
          Tip: Click the game area first, then use Arrow Keys or WASD to move.
        </p>
      </div>
    </section>
  );
}

// ─── Drawing helpers ─────────────────────────────────────────────────────────
function drawFrame(ctx: CanvasRenderingContext2D, state: GameState) {
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

  // Background grid
  ctx.strokeStyle = "rgba(0,180,80,0.07)";
  ctx.lineWidth = 1;
  for (let x = 0; x < CANVAS_W; x += 30) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, CANVAS_H);
    ctx.stroke();
  }
  for (let y = 0; y < CANVAS_H; y += 30) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(CANVAS_W, y);
    ctx.stroke();
  }

  // Smoke particles
  for (const sp of state.smokeParticles) {
    ctx.beginPath();
    ctx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(160,160,160,${sp.alpha})`;
    ctx.fill();
  }

  // Cigarette emoji
  ctx.font = `${state.cig.size * 1.4}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.save();
  const p = state.player;
  const cig = state.cig;
  const angle = Math.atan2(p.pos.y - cig.pos.y, p.pos.x - cig.pos.x);
  ctx.translate(cig.pos.x, cig.pos.y);
  ctx.rotate(angle + Math.PI / 2);
  ctx.fillText("🚬", 0, 0);
  ctx.restore();

  // Player emoji (running person)
  ctx.font = `${p.size * 1.5}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("🏃", p.pos.x, p.pos.y);

  // Shadow under player
  ctx.beginPath();
  ctx.ellipse(
    p.pos.x,
    p.pos.y + p.size / 2 - 2,
    p.size / 3,
    4,
    0,
    0,
    Math.PI * 2,
  );
  ctx.fillStyle = "rgba(0,0,0,0.12)";
  ctx.fill();
}

function drawStatic(ctx: CanvasRenderingContext2D, state: GameState) {
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  // bg
  ctx.fillStyle = "#f0fdf4";
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  if (state.started && !state.alive) {
    drawFrame(ctx, state);
  }
  // dim overlay
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
}

// Smooth lerp for cig target (unused but kept for reference)
void lerp;
