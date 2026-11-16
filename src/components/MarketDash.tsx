import { useCallback, useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';

type Phase = 'idle' | 'running' | 'paused' | 'over';

interface Obstacle {
  x: number;
  w: number;
  h: number;
  variant: number;
}

interface Token {
  x: number;
  y: number;
  phase: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  danger: boolean;
}

interface Building {
  x: number;
  w: number;
  h: number;
  seed: number;
}

interface Star {
  x: number;
  y: number;
  size: number;
  alpha: number;
}

const BEST_KEY = 'nexus.marketdash.best';
const MUTE_KEY = 'nexus.marketdash.muted';

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function readNumber(key: string, fallback = 0) {
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? Number(raw) : NaN;
    return Number.isFinite(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function writeValue(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage can be unavailable in private modes; the game still works.
  }
}

/**
 * MARKET DASH — an original NEXUS endless runner.
 * Entirely client-side: physics, collision, rendering, scoring and difficulty
 * run in the browser. High scores live in localStorage; audio is synthesised
 * with the Web Audio API. No network requests during play.
 */
export default function MarketDash() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  const [phase, setPhase] = useState<Phase>('idle');
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => readNumber(BEST_KEY));
  const [muted, setMuted] = useState(() => readNumber(MUTE_KEY) === 1);
  const [isNewBest, setIsNewBest] = useState(false);

  const phaseRef = useRef<Phase>('idle');
  const mutedRef = useRef(muted);
  const bestRef = useRef(best);
  const inViewRef = useRef(true);
  const audioRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    mutedRef.current = muted;
    writeValue(MUTE_KEY, muted ? '1' : '0');
  }, [muted]);

  useEffect(() => {
    bestRef.current = best;
  }, [best]);

  const engineRef = useRef({
    width: 0,
    height: 0,
    groundY: 0,
    player: { x: 0, y: 0, vy: 0, w: 0, h: 0, onGround: true, tilt: 0 },
    speed: 0,
    distance: 0,
    tokens: 0,
    score: 0,
    obstacles: [] as Obstacle[],
    tokenList: [] as Token[],
    particles: [] as Particle[],
    buildingsFar: [] as Building[],
    buildingsMid: [] as Building[],
    stars: [] as Star[],
    worldFar: 0,
    worldMid: 0,
    groundOffset: 0,
    elapsed: 0,
    ambient: 0,
    spawnIn: 2,
    tokenIn: 2.6,
    shake: 0,
    flash: 0,
    jumpBuffer: 0,
    coyote: 0,
    trailIn: 0,
    displayedScore: 0,
  });

  const ensureAudio = useCallback(() => {
    if (!audioRef.current) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return;
      audioRef.current = new Ctor();
    }
    if (audioRef.current.state === 'suspended') {
      void audioRef.current.resume();
    }
  }, []);

  const tone = useCallback(
    (frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.045) => {
      const audio = audioRef.current;
      if (!audio || mutedRef.current) return;
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      const now = audio.currentTime;
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(volume, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      oscillator.connect(gain).connect(audio.destination);
      oscillator.start(now);
      oscillator.stop(now + duration + 0.03);
    },
    []
  );

  const emitBurst = useCallback((x: number, y: number, count: number, danger = false) => {
    const engine = engineRef.current;
    for (let i = 0; i < count; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 160;
      engine.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 40,
        life: 0.4 + Math.random() * 0.5,
        max: 0.9,
        size: 1.5 + Math.random() * 2.5,
        danger,
      });
    }
  }, []);

  const jump = useCallback(() => {
    const engine = engineRef.current;
    if (phaseRef.current === 'idle' || phaseRef.current === 'over') return;
    if (phaseRef.current !== 'running') return;

    if (engine.player.onGround || engine.coyote > 0) {
      const gravity = engine.player.h * 30;
      engine.player.vy = -Math.sqrt(2 * gravity * engine.player.h * 2.35);
      engine.player.onGround = false;
      engine.coyote = 0;
      engine.jumpBuffer = 0;
      emitBurst(engine.player.x, engine.player.y, 7);
      tone(660, 0.11, 'triangle', 0.035);
    } else {
      engine.jumpBuffer = 0.14;
    }
  }, [emitBurst, tone]);

  const startGame = useCallback(() => {
    const engine = engineRef.current;
    if (!engine.width) return;
    engine.player.y = engine.groundY;
    engine.player.vy = 0;
    engine.player.onGround = true;
    engine.player.tilt = 0;
    engine.speed = engine.width * 0.46;
    engine.distance = 0;
    engine.tokens = 0;
    engine.score = 0;
    engine.elapsed = 0;
    engine.obstacles = [];
    engine.tokenList = [];
    engine.particles = [];
    engine.spawnIn = 1.7;
    engine.tokenIn = 2.1;
    engine.shake = 0;
    engine.flash = 0;
    engine.jumpBuffer = 0;
    engine.coyote = 0;
    engine.displayedScore = 0;
    setScore(0);
    setIsNewBest(false);
    setPhase('running');
    phaseRef.current = 'running';
    ensureAudio();
    tone(520, 0.1, 'triangle', 0.04);
  }, [ensureAudio, tone]);

  const togglePause = useCallback(() => {
    if (phaseRef.current === 'running') {
      setPhase('paused');
    } else if (phaseRef.current === 'paused') {
      setPhase('running');
    }
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((current) => !current);
  }, []);

  /* ------------------------------------------------------------------ */
  /* Game loop, rendering and input                                      */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const engine = engineRef.current;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let rafId = 0;
    let lastTime = 0;
    let inView = true;
    let pageVisible = !document.hidden;
    let lastHud = 0;

    /* ------------------------------ layout ------------------------------ */
    const layout = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      engine.width = rect.width;
      engine.height = rect.height;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      engine.groundY = engine.height - Math.max(46, engine.height * 0.19);
      const playerHeight = clamp(engine.height * 0.17, 34, 62);
      engine.player.h = playerHeight;
      engine.player.w = playerHeight * 0.88;
      engine.player.x = clamp(engine.width * 0.18, 52, 190);
      if (engine.player.onGround || !engine.player.y) {
        engine.player.y = engine.groundY;
      }
      if (!engine.speed) engine.speed = engine.width * 0.46;

      const farSpan = engine.width * 1.45;
      const midSpan = engine.width * 1.3;

      engine.buildingsFar = Array.from({ length: 22 }, (_, index) => ({
        x: (index / 22) * farSpan + Math.random() * 14,
        w: 16 + Math.random() * 34,
        h: engine.height * (0.1 + Math.random() * 0.22),
        seed: Math.floor(Math.random() * 999),
      }));
      engine.buildingsMid = Array.from({ length: 16 }, (_, index) => ({
        x: (index / 16) * midSpan + Math.random() * 20,
        w: 24 + Math.random() * 46,
        h: engine.height * (0.16 + Math.random() * 0.3),
        seed: Math.floor(Math.random() * 999),
      }));

      engine.stars = Array.from({ length: reduceMotion ? 22 : 46 }, () => ({
        x: Math.random() * engine.width,
        y: Math.random() * engine.groundY * 0.8,
        size: Math.random() > 0.8 ? 2 : 1,
        alpha: 0.15 + Math.random() * 0.5,
      }));

      draw();
    };

    /* ------------------------------ helpers ----------------------------- */
    const spawnObstacle = () => {
      const playerHeight = engine.player.h;
      const height = playerHeight * (0.85 + Math.random() * 0.75);
      const width = playerHeight * (0.5 + Math.random() * 0.55);
      engine.obstacles.push({
        x: engine.width + width + 20,
        w: width,
        h: height,
        variant: Math.random() > 0.5 ? 1 : 0,
      });
      const gapSeconds = (engine.width * 0.95) / Math.max(1, engine.speed);
      engine.spawnIn = clamp(gapSeconds * (0.92 + Math.random() * 0.6), 0.72, 3.4);
    };

    const spawnTokens = () => {
      const count = 3 + Math.floor(Math.random() * 3);
      const peak = engine.groundY - engine.player.h * (1.7 + Math.random() * 0.7);
      for (let i = 0; i < count; i += 1) {
        const progress = count === 1 ? 0.5 : i / (count - 1);
        engine.tokenList.push({
          x: engine.width + 40 + i * 32,
          y: peak + Math.sin(progress * Math.PI) * -12 + (1 - Math.sin(progress * Math.PI)) * 18,
          phase: Math.random() * Math.PI * 2,
        });
      }
      engine.tokenIn = 2.4 + Math.random() * 3.2;
    };

    const crash = () => {
      engine.shake = reduceMotion ? 0 : 13;
      engine.flash = reduceMotion ? 0 : 1;
      emitBurst(engine.player.x + engine.player.w * 0.2, engine.player.y - engine.player.h * 0.4, 22, true);

      const finalScore = engine.score;
      const previousBest = bestRef.current;
      if (finalScore > previousBest) {
        bestRef.current = finalScore;
        writeValue(BEST_KEY, String(finalScore));
        setBest(finalScore);
        setIsNewBest(true);
      }
      setScore(finalScore);
      setPhase('over');
      phaseRef.current = 'over';
      tone(150, 0.32, 'sawtooth', 0.055);
      window.setTimeout(() => tone(96, 0.42, 'sawtooth', 0.05), 90);
    };

    /* ------------------------------ update ------------------------------ */
    const update = (dt: number) => {
      engine.ambient += dt * (reduceMotion ? 0.25 : 1);

      if (phaseRef.current !== 'running') {
        // Idle / game-over scenes keep a gentle parallax drift (paused stays frozen).
        if (phaseRef.current !== 'paused' && !reduceMotion) {
          engine.worldFar += 8 * dt;
          engine.worldMid += 14 * dt;
          engine.groundOffset += 18 * dt;
        }
        for (const particle of engine.particles) {
          particle.life -= dt;
          particle.x += particle.vx * dt;
          particle.y += particle.vy * dt;
          particle.vy += 240 * dt;
        }
        engine.particles = engine.particles.filter((particle) => particle.life > 0);
        if (engine.shake > 0) engine.shake = Math.max(0, engine.shake - dt * 26);
        if (engine.flash > 0) engine.flash = Math.max(0, engine.flash - dt * 2.4);
        return;
      }

      engine.elapsed += dt;
      engine.speed = Math.min(engine.width * 1.02, engine.width * 0.46 + engine.elapsed * 7.5);
      const travelled = engine.speed * dt;
      engine.distance += travelled;
      engine.worldFar += travelled * 0.16;
      engine.worldMid += travelled * 0.42;
      engine.groundOffset += travelled;

      // Player physics
      const player = engine.player;
      const gravity = player.h * 30;
      player.vy += gravity * dt;
      player.y += player.vy * dt;
      if (player.y >= engine.groundY) {
        player.y = engine.groundY;
        player.vy = 0;
        player.onGround = true;
        engine.coyote = 0.09;
      } else {
        player.onGround = false;
        engine.coyote = Math.max(0, engine.coyote - dt);
      }
      player.tilt = clamp(player.vy / 2400, -0.18, 0.22);

      if (engine.jumpBuffer > 0) {
        engine.jumpBuffer -= dt;
        if (player.onGround) {
          const nextGravity = player.h * 30;
          player.vy = -Math.sqrt(2 * nextGravity * player.h * 2.35);
          player.onGround = false;
          engine.jumpBuffer = 0;
          emitBurst(player.x, player.y, 6);
          tone(660, 0.11, 'triangle', 0.035);
        }
      }

      // Thruster trail
      engine.trailIn -= dt;
      if (engine.trailIn <= 0 && !reduceMotion) {
        engine.trailIn = 0.055;
        engine.particles.push({
          x: player.x - player.w * 0.4,
          y: player.y - player.h * 0.25,
          vx: -engine.speed * 0.2,
          vy: (Math.random() - 0.5) * 26,
          life: 0.35,
          max: 0.35,
          size: 1.5 + Math.random() * 1.8,
          danger: false,
        });
      }

      // Spawners
      engine.spawnIn -= dt;
      if (engine.spawnIn <= 0) spawnObstacle();
      engine.tokenIn -= dt;
      if (engine.tokenIn <= 0) spawnTokens();

      // Move world entities
      for (const obstacle of engine.obstacles) obstacle.x -= travelled;
      engine.obstacles = engine.obstacles.filter((obstacle) => obstacle.x + obstacle.w > -40);
      for (const token of engine.tokenList) {
        token.x -= travelled;
        token.phase += dt * 3;
      }

      // Collect tokens
      const tokenRadius = player.h * 0.34;
      engine.tokenList = engine.tokenList.filter((token) => {
        if (token.x < -30) return false;
        const distance = Math.hypot(token.x - player.x, token.y - (player.y - player.h * 0.55));
        if (distance < tokenRadius + 9) {
          engine.tokens += 1;
          emitBurst(token.x, token.y, 8);
          tone(880 + Math.random() * 120, 0.09, 'sine', 0.03);
          return false;
        }
        return true;
      });

      // Collision
      const inset = player.w * 0.14;
      const playerLeft = player.x - player.w / 2 + inset;
      const playerRight = player.x + player.w / 2 - inset;
      const playerTop = player.y - player.h + 6;
      const playerBottom = player.y - 4;

      for (const obstacle of engine.obstacles) {
        const obstacleTop = engine.groundY - obstacle.h;
        if (
          playerRight > obstacle.x &&
          playerLeft < obstacle.x + obstacle.w &&
          playerBottom > obstacleTop &&
          playerTop < engine.groundY
        ) {
          crash();
          break;
        }
      }

      // Particles
      for (const particle of engine.particles) {
        particle.life -= dt;
        particle.x += particle.vx * dt;
        particle.y += particle.vy * dt;
        particle.vy += 240 * dt;
      }
      engine.particles = engine.particles.filter((particle) => particle.life > 0);

      if (engine.shake > 0) engine.shake = Math.max(0, engine.shake - dt * 26);
      if (engine.flash > 0) engine.flash = Math.max(0, engine.flash - dt * 2.4);

      // Score
      engine.score = Math.floor(engine.distance / 16) + engine.tokens * 15;
      if (engine.score !== engine.displayedScore) {
        engine.displayedScore = engine.score;
        const now = performance.now();
        if (now - lastHud > 90) {
          lastHud = now;
          setScore(engine.score);
        }
      }
    };

    /* ------------------------------ drawing ----------------------------- */
    const drawBuilding = (
      building: Building,
      x: number,
      baseY: number,
      fill: string,
      windows: string | null
    ) => {
      const top = baseY - building.h;
      ctx.fillStyle = fill;
      ctx.fillRect(x, top, building.w, building.h);

      ctx.fillStyle = 'rgba(90, 240, 90, 0.24)';
      ctx.fillRect(x, top, building.w, 1);

      if (windows) {
        ctx.fillStyle = windows;
        const cols = Math.max(1, Math.floor((building.w - 8) / 10));
        const rows = Math.max(1, Math.floor((building.h - 10) / 16));
        for (let row = 0; row < rows; row += 1) {
          for (let col = 0; col < cols; col += 1) {
            if ((row * 3 + col + building.seed) % 4 === 0) continue;
            ctx.fillRect(x + 5 + col * 10, top + 8 + row * 16, 3, 5);
          }
        }
      }
    };

    const drawSkyline = (
      list: Building[],
      offset: number,
      span: number,
      baseY: number,
      fill: string,
      windows: string | null
    ) => {
      for (const building of list) {
        const x = ((((building.x - offset) % span) + span) % span) - span * 0.08;
        if (x > engine.width + building.w || x + building.w < -20) continue;
        drawBuilding(building, x, baseY, fill, windows);
      }
    };

    const drawPlayer = () => {
      const player = engine.player;
      const bob = player.onGround ? Math.sin(engine.ambient * 6.5) * 2.2 : 0;
      const centerY = player.y - player.h / 2 - bob;

      // Ground shadow
      const airHeight = clamp(engine.groundY - player.y, 0, player.h * 4);
      const shadow = 1 - airHeight / (player.h * 5);
      ctx.fillStyle = `rgba(0, 0, 0, ${0.4 * shadow})`;
      ctx.beginPath();
      ctx.ellipse(
        player.x,
        engine.groundY + 5,
        player.w * 0.55 * shadow,
        5 * shadow,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();

      ctx.save();
      ctx.translate(player.x, centerY);
      ctx.rotate(player.tilt);

      const w = player.w;
      const h = player.h;

      // Thruster glow
      const thruster = ctx.createRadialGradient(0, h * 0.42, 0, 0, h * 0.42, w * 0.9);
      thruster.addColorStop(0, 'rgba(90, 240, 90, 0.35)');
      thruster.addColorStop(1, 'rgba(90, 240, 90, 0)');
      ctx.fillStyle = thruster;
      ctx.beginPath();
      ctx.arc(0, h * 0.45, w * 0.9, 0, Math.PI * 2);
      ctx.fill();

      // Hull
      ctx.beginPath();
      ctx.moveTo(-w * 0.5, -h * 0.16);
      ctx.lineTo(-w * 0.28, -h * 0.5);
      ctx.lineTo(w * 0.28, -h * 0.5);
      ctx.lineTo(w * 0.5, -h * 0.16);
      ctx.lineTo(w * 0.34, h * 0.42);
      ctx.lineTo(-w * 0.34, h * 0.42);
      ctx.closePath();
      const hull = ctx.createLinearGradient(0, -h * 0.5, 0, h * 0.42);
      hull.addColorStop(0, '#233038');
      hull.addColorStop(1, '#101a18');
      ctx.fillStyle = hull;
      ctx.fill();
      ctx.lineWidth = 1.4;
      ctx.strokeStyle = 'rgba(141, 255, 176, 0.85)';
      ctx.stroke();

      // Visor
      ctx.fillStyle = 'rgba(90, 240, 90, 0.9)';
      ctx.beginPath();
      ctx.roundRect(-w * 0.26, -h * 0.26, w * 0.52, h * 0.15, 3);
      ctx.fill();

      // Core light
      ctx.fillStyle = '#d6ffdc';
      ctx.beginPath();
      ctx.arc(0, h * 0.06, 2.8, 0, Math.PI * 2);
      ctx.fill();

      // Fins
      ctx.fillStyle = 'rgba(90, 240, 90, 0.55)';
      ctx.beginPath();
      ctx.moveTo(-w * 0.34, h * 0.3);
      ctx.lineTo(-w * 0.62, h * 0.52);
      ctx.lineTo(-w * 0.3, h * 0.44);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(w * 0.34, h * 0.3);
      ctx.lineTo(w * 0.62, h * 0.52);
      ctx.lineTo(w * 0.3, h * 0.44);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    };

    const drawObstacle = (obstacle: Obstacle) => {
      const top = engine.groundY - obstacle.h;
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(obstacle.x, top, obstacle.w, obstacle.h, 4);
      const body = ctx.createLinearGradient(obstacle.x, top, obstacle.x, engine.groundY);
      body.addColorStop(0, '#242b31');
      body.addColorStop(1, '#141a1e');
      ctx.fillStyle = body;
      ctx.fill();
      ctx.lineWidth = 1.4;
      ctx.strokeStyle = 'rgba(255, 95, 109, 0.8)';
      ctx.stroke();

      // Hazard stripes
      ctx.save();
      ctx.clip();
      ctx.strokeStyle = 'rgba(255, 95, 109, 0.28)';
      ctx.lineWidth = 4;
      const step = 14;
      for (let offset = -obstacle.h; offset < obstacle.w + obstacle.h; offset += step) {
        ctx.beginPath();
        ctx.moveTo(obstacle.x + offset, engine.groundY);
        ctx.lineTo(obstacle.x + offset + obstacle.h, top);
        ctx.stroke();
      }
      ctx.restore();

      // Beacon
      ctx.fillStyle = '#ff5f6d';
      ctx.shadowColor = 'rgba(255, 95, 109, 0.8)';
      ctx.shadowBlur = 10;
      ctx.fillRect(obstacle.x + obstacle.w / 2 - 2, top - 4, 4, 4);
      ctx.shadowBlur = 0;

      if (obstacle.variant === 1) {
        ctx.fillStyle = 'rgba(255, 95, 109, 0.16)';
        ctx.fillRect(obstacle.x + 2, top + 2, obstacle.w - 4, 3);
      }
      ctx.restore();
    };

    const drawToken = (token: Token) => {
      const bob = Math.sin(token.phase) * 2.6;
      const size = clamp(engine.player.h * 0.2, 6, 12);
      ctx.save();
      ctx.translate(token.x, token.y + bob);
      ctx.rotate(Math.sin(token.phase * 0.7) * 0.28);

      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(size * 0.78, 0);
      ctx.lineTo(0, size);
      ctx.lineTo(-size * 0.78, 0);
      ctx.closePath();
      ctx.fillStyle = 'rgba(90, 240, 90, 0.16)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(160, 255, 176, 0.92)';
      ctx.lineWidth = 1.4;
      ctx.stroke();

      // Financial bar glyph
      ctx.fillStyle = '#a8ffb8';
      ctx.fillRect(-size * 0.22, -size * 0.1, 1.7, size * 0.5);
      ctx.fillRect(0, -size * 0.34, 1.7, size * 0.74);
      ctx.fillRect(size * 0.22, size * 0.06, 1.7, size * 0.34);
      ctx.restore();
    };

    const draw = () => {
      if (!engine.width || !engine.height) return;
      const { width, height, groundY } = engine;

      ctx.clearRect(0, 0, width, height);

      const shakeX = engine.shake > 0 ? (Math.random() - 0.5) * engine.shake : 0;
      const shakeY = engine.shake > 0 ? (Math.random() - 0.5) * engine.shake : 0;

      ctx.save();
      ctx.translate(shakeX, shakeY);

      // Sky
      const sky = ctx.createLinearGradient(0, 0, 0, groundY);
      sky.addColorStop(0, '#080d13');
      sky.addColorStop(0.55, '#0a1a1c');
      sky.addColorStop(1, '#0d2a23');
      ctx.fillStyle = sky;
      ctx.fillRect(-20, -20, width + 40, height + 40);

      // Aurora glow
      const aurora = ctx.createRadialGradient(
        width * 0.72,
        groundY * 0.25,
        0,
        width * 0.72,
        groundY * 0.25,
        width * 0.6
      );
      aurora.addColorStop(0, 'rgba(59, 215, 196, 0.18)');
      aurora.addColorStop(0.6, 'rgba(90, 240, 90, 0.05)');
      aurora.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = aurora;
      ctx.fillRect(0, 0, width, groundY);

      // Stars
      for (const star of engine.stars) {
        const alpha = star.alpha * (0.65 + 0.35 * Math.sin(engine.ambient * 1.4 + star.x));
        ctx.fillStyle = `rgba(198, 255, 225, ${alpha})`;
        ctx.fillRect(star.x, star.y, star.size, star.size);
      }

      // Distant skyline
      drawSkyline(engine.buildingsFar, engine.worldFar, width * 1.45, groundY, '#101c22', null);
      // Mid skyline with lit windows
      drawSkyline(
        engine.buildingsMid,
        engine.worldMid,
        width * 1.3,
        groundY,
        '#142a2c',
        'rgba(150, 255, 190, 0.32)'
      );

      // Ground plane
      const groundFill = ctx.createLinearGradient(0, groundY, 0, height);
      groundFill.addColorStop(0, '#0b1a18');
      groundFill.addColorStop(1, '#070c0d');
      ctx.fillStyle = groundFill;
      ctx.fillRect(0, groundY, width, height - groundY);

      // Sigma grid
      const spacing = clamp(width * 0.075, 40, 80);
      const startX = -((engine.groundOffset * 0.8) % spacing);
      ctx.lineWidth = 1;
      for (let x = startX; x < width + spacing; x += spacing) {
        ctx.strokeStyle = 'rgba(90, 240, 90, 0.09)';
        ctx.beginPath();
        ctx.moveTo(x, groundY);
        ctx.lineTo(x + (x - width / 2) * 0.5, height);
        ctx.stroke();
      }
      for (let i = 1; i <= 4; i += 1) {
        const t = i / 5;
        const y = groundY + Math.pow(t, 1.7) * (height - groundY);
        ctx.strokeStyle = `rgba(90, 240, 90, ${0.13 - t * 0.09})`;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Horizon
      ctx.fillStyle = 'rgba(90, 240, 90, 0.5)';
      ctx.fillRect(0, groundY, width, 1.4);
      const horizonGlow = ctx.createLinearGradient(0, groundY, 0, groundY + 34);
      horizonGlow.addColorStop(0, 'rgba(90, 240, 90, 0.16)');
      horizonGlow.addColorStop(1, 'rgba(90, 240, 90, 0)');
      ctx.fillStyle = horizonGlow;
      ctx.fillRect(0, groundY + 1, width, 34);

      // Entities
      for (const token of engine.tokenList) drawToken(token);
      for (const obstacle of engine.obstacles) drawObstacle(obstacle);
      drawPlayer();

      // Particles
      for (const particle of engine.particles) {
        const alpha = clamp(particle.life / particle.max, 0, 1);
        ctx.fillStyle = particle.danger
          ? `rgba(255, 120, 130, ${alpha})`
          : `rgba(160, 255, 176, ${alpha})`;
        ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
      }

      // Vignette
      const vignette = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.3,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.75
      );
      vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vignette.addColorStop(1, 'rgba(0, 0, 0, 0.45)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      ctx.restore();

      if (engine.flash > 0) {
        ctx.fillStyle = `rgba(255, 95, 109, ${engine.flash * 0.18})`;
        ctx.fillRect(0, 0, width, height);
      }
    };

    /* ------------------------------ loop -------------------------------- */
    const loop = (now: number) => {
      if (!lastTime) lastTime = now;
      const dt = clamp((now - lastTime) / 1000, 0, 0.05);
      lastTime = now;
      update(dt);
      draw();
      rafId = requestAnimationFrame(loop);
    };

    const start = () => {
      if (rafId) return;
      lastTime = 0;
      rafId = requestAnimationFrame(loop);
    };

    const stop = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
    };

    const syncRunning = () => {
      if (inView && pageVisible) start();
      else stop();
    };

    layout();

    const resizeObserver = new ResizeObserver(() => {
      layout();
    });
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        inView = entries.some((entry) => entry.isIntersecting);
        inViewRef.current = inView;
        syncRunning();
      },
      { rootMargin: '80px' }
    );
    intersectionObserver.observe(stage);

    const onVisibility = () => {
      pageVisible = !document.hidden;
      if (!pageVisible && phaseRef.current === 'running') {
        setPhase('paused');
        phaseRef.current = 'paused';
      }
      syncRunning();
    };
    document.addEventListener('visibilitychange', onVisibility);

    start();

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [emitBurst, tone]);

  /* ------------------------------------------------------------------ */
  /* Keyboard controls                                                   */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const isTypingTarget = (target: EventTarget | null) => {
      const element = target as HTMLElement | null;
      if (!element) return false;
      const tag = element.tagName;
      return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || element.isContentEditable;
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return;
      const { code } = event;

      if (code === 'Space' || code === 'ArrowUp' || code === 'KeyW') {
        if (!inViewRef.current) return;
        event.preventDefault();
        if (phaseRef.current === 'idle' || phaseRef.current === 'over') {
          startGame();
        } else if (phaseRef.current === 'paused') {
          setPhase('running');
          phaseRef.current = 'running';
        } else {
          jump();
        }
        return;
      }

      if (code === 'KeyP' || code === 'Escape') {
        if (!inViewRef.current) return;
        if (phaseRef.current === 'running' || phaseRef.current === 'paused') {
          event.preventDefault();
          togglePause();
        }
      }

      if (code === 'Enter' && inViewRef.current) {
        if (phaseRef.current === 'idle' || phaseRef.current === 'over') {
          event.preventDefault();
          startGame();
        }
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code === 'Space' || event.code === 'ArrowUp' || event.code === 'KeyW') {
        const player = engineRef.current.player;
        if (player.vy < -120) player.vy *= 0.58;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [jump, startGame, togglePause]);

  const handlePointerJump = (event?: React.PointerEvent) => {
    event?.preventDefault();
    if (phaseRef.current === 'idle' || phaseRef.current === 'over') {
      startGame();
      return;
    }
    if (phaseRef.current === 'paused') {
      setPhase('running');
      phaseRef.current = 'running';
      return;
    }
    jump();
  };

  const formatScore = (value: number) => value.toString().padStart(4, '0');

  return (
    <div className="panel overflow-hidden p-3 sm:p-4">
      <div className="panel-sheen" />

      {/* HUD */}
      <div className="relative mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.16em] text-[#a4a6a0]">
          <span>
            Score <span className="ml-1 text-base text-[#5af05a]">{formatScore(score)}</span>
          </span>
          <span className="hidden sm:inline">
            Hi <span className="ml-1 text-[#f8f1ea]">{formatScore(best)}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full border border-[#5af05a]/25 bg-[#5af05a]/[0.06] px-3 py-1.5 text-[9px] uppercase tracking-[0.18em] text-[#8fe6a2] sm:inline-flex">
            Offline ready
          </span>
          <button
            type="button"
            onClick={toggleMute}
            aria-pressed={muted}
            aria-label={muted ? 'Unmute game audio' : 'Mute game audio'}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 text-[#c8cac4] transition-colors hover:border-[#5af05a]/45 hover:text-[#5af05a]"
          >
            {muted ? <VolumeX size={16} aria-hidden="true" /> : <Volume2 size={16} aria-hidden="true" />}
          </button>
          <button
            type="button"
            onClick={togglePause}
            disabled={phase !== 'running' && phase !== 'paused'}
            aria-label={phase === 'paused' ? 'Resume game' : 'Pause game'}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 text-[#c8cac4] transition-colors hover:border-[#5af05a]/45 hover:text-[#5af05a] disabled:opacity-35 disabled:hover:border-white/12 disabled:hover:text-[#c8cac4]"
          >
            {phase === 'paused' ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Stage */}
      <div
        ref={stageRef}
        className="game-stage relative w-full overflow-hidden rounded-xl border border-white/10 bg-[#0a1014]"
      >
        <canvas
          ref={canvasRef}
          className="game-canvas"
          role="img"
          aria-label="Market Dash: a neon financial city where you jump firewalls and collect knowledge tokens. Press Space, arrow up or tap to jump."
          onPointerDown={handlePointerJump}
        />

        {/* Start screen */}
        {phase === 'idle' && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#070b0d]/55 p-4 backdrop-blur-[2px]">
            <div className="w-full max-w-sm text-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#8fe6a2]">
                Nexus Arcade / 01
              </p>
              <h3 className="mt-3 text-2xl font-bold uppercase tracking-[0.08em] text-[#f8f1ea] sm:text-3xl">
                Market Dash
              </h3>
              <p className="mx-auto mt-2 max-w-xs text-xs leading-relaxed text-[#a4a6a0]">
                Jump the firewalls, collect knowledge tokens and survive the financial
                district. The district speeds up the longer you last.
              </p>
              <button type="button" onClick={startGame} className="btn btn-primary mt-5 w-full sm:w-auto">
                <Play size={14} aria-hidden="true" /> Start run
              </button>
              <p className="mt-3 font-mono text-[10px] text-[#6f716c]">
                Space / ↑ to jump · P to pause
              </p>
            </div>
          </div>
        )}

        {/* Paused */}
        {phase === 'paused' && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#070b0d]/65 p-4 backdrop-blur-[2px]">
            <div className="w-full max-w-xs text-center">
              <h3 className="text-xl font-bold uppercase tracking-[0.14em] text-[#f8f1ea]">
                Paused
              </h3>
              <p className="mt-2 text-xs text-[#a4a6a0]">The market is holding.</p>
              <div className="mt-5 flex flex-col gap-2">
                <button type="button" onClick={togglePause} className="btn btn-primary w-full">
                  <Play size={14} aria-hidden="true" /> Resume
                </button>
                <button type="button" onClick={startGame} className="btn btn-quiet w-full">
                  <RotateCcw size={14} aria-hidden="true" /> Restart
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Game over */}
        {phase === 'over' && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-[#070b0d]/70 p-4 backdrop-blur-[2px]"
            role="status"
            aria-live="polite"
          >
            <div className="w-full max-w-sm text-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#ff8b95]">
                Run terminated
              </p>
              <h3 className="mt-2 text-2xl font-bold uppercase tracking-[0.08em] text-[#f8f1ea]">
                {isNewBest ? 'New personal best' : 'Market closed'}
              </h3>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-[#7f817b]">Score</p>
                  <p className="mt-1 font-mono text-xl text-[#5af05a]">{formatScore(score)}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-[#7f817b]">Best</p>
                  <p className="mt-1 font-mono text-xl text-[#f8f1ea]">{formatScore(best)}</p>
                </div>
              </div>
              <div className="mt-5 flex flex-col gap-2">
                <button type="button" onClick={startGame} className="btn btn-primary w-full">
                  <RotateCcw size={14} aria-hidden="true" /> Run again
                </button>
                <p className="mt-1 font-mono text-[10px] text-[#6f716c]">
                  Space or Enter to restart
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="relative mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#7f817b]">
          <span>
            <kbd className="rounded border border-white/15 px-1.5 py-0.5 text-[#c8cac4]">Space</kbd>{' '}
            jump
          </span>
          <span>
            <kbd className="rounded border border-white/15 px-1.5 py-0.5 text-[#c8cac4]">P</kbd>{' '}
            pause
          </span>
          <span className="sm:hidden">Tap the canvas to jump</span>
        </div>
        <button
          type="button"
          onClick={() => handlePointerJump()}
          className="btn btn-ghost h-14 w-full sm:hidden"
          aria-label="Jump"
        >
          Jump
        </button>
      </div>
    </div>
  );
}
