import type { DirectorFrame } from './director';

/**
 * NEXUS NETWORK ENGINE
 *
 * One Canvas 2D field of nodes, edges and travelling packets that carries the
 * six-scene narrative. Every node owns six normalised layouts (origin, cluster,
 * plot, branch, portal, convergence); the engine blends between the current
 * pair from a single narrative value. There is no second animation loop: the
 * scroll director drives `render()`.
 */

interface Vec {
  x: number;
  y: number;
}

interface NetworkNode {
  layouts: Vec[];
  cluster: number;
  depth: number;
  size: number;
  teal: boolean;
  hub: boolean;
  phase: number;
  delay: number;
}

interface NetworkEdge {
  a: number;
  b: number;
  weight: number;
  cross: boolean;
}

interface Packet {
  edge: number;
  t: number;
  speed: number;
  dir: number;
}

interface Mote {
  x: number;
  y: number;
  depth: number;
  size: number;
  phase: number;
}

export interface NetworkOptions {
  compact: boolean;
  reduced: boolean;
}

const TAU = Math.PI * 2;

const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smoothstep = (t: number) => {
  const c = clamp01(t);
  return c * c * (3 - 2 * c);
};
const windowMix = (value: number, center: number, width: number) =>
  clamp01(1 - Math.abs(value - center) / width);

function seeded(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function glowSprite(rgb: string): HTMLCanvasElement | null {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, `rgba(${rgb}, 0.9)`);
  gradient.addColorStop(0.32, `rgba(${rgb}, 0.34)`);
  gradient.addColorStop(0.7, `rgba(${rgb}, 0.07)`);
  gradient.addColorStop(1, `rgba(${rgb}, 0)`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  return canvas;
}

const CLUSTERS = [
  { x: 0.64, y: 0.4, spread: 0.17 },
  { x: 0.35, y: 0.63, spread: 0.14 },
  { x: 0.82, y: 0.69, spread: 0.12 },
];

export class NexusNetwork {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D | null;
  private readonly compact: boolean;
  private readonly reduced: boolean;

  private width = 1;
  private height = 1;
  private dpr = 1;

  private nodes: NetworkNode[] = [];
  private edges: NetworkEdge[] = [];
  private packets: Packet[] = [];
  private motes: Mote[] = [];
  private posX = new Float32Array(0);
  private posY = new Float32Array(0);

  private narrative = 0;
  private time = 0;
  private lastFrame: DirectorFrame = {
    time: 0,
    dt: 0,
    y: 0,
    progress: 0,
    width: 1,
    height: 1,
  };

  private wash: CanvasGradient | null = null;
  private vignette: CanvasGradient | null = null;
  private plotOrder: number[] = [];
  private greenGlow: HTMLCanvasElement | null = null;
  private tealGlow: HTMLCanvasElement | null = null;
  private pointer = { x: -9999, y: -9999, active: false };

  constructor(canvas: HTMLCanvasElement, options: NetworkOptions) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: true });
    this.compact = options.compact;
    this.reduced = options.reduced;

    this.greenGlow = glowSprite('90, 240, 90');
    this.tealGlow = glowSprite('59, 215, 196');

    this.build();
    this.resize();

    window.addEventListener('pointermove', this.onPointerMove, { passive: true });
    window.addEventListener('pointerleave', this.onPointerLeave);
  }

  setNarrative(value: number) {
    this.narrative = Math.max(0, Math.min(5.999, value));
  }

  private onPointerMove = (event: PointerEvent) => {
    if (this.reduced || this.compact || event.pointerType === 'touch') return;
    this.pointer.x = event.clientX;
    this.pointer.y = event.clientY;
    this.pointer.active = true;
  };

  private onPointerLeave = () => {
    this.pointer.active = false;
    this.pointer.x = -9999;
    this.pointer.y = -9999;
  };

  /* ------------------------------------------------------------------ */
  /* Geometry                                                            */
  /* ------------------------------------------------------------------ */

  private build() {
    const random = seeded(0x4e455855);
    const count = this.compact ? 34 : 68;
    const nodes: NetworkNode[] = [];
    const clusterCounts = [0, 0, 0];

    for (let i = 0; i < count; i += 1) {
      const cluster = i < count * 0.48 ? 0 : i < count * 0.78 ? 1 : 2;
      const clusterIndex = clusterCounts[cluster];
      clusterCounts[cluster] += 1;

      const depth = 0.35 + random() * 0.65;

      // Origin: a single luminous seed with a breath of scatter.
      const origin: Vec = {
        x: 0.5 + (random() - 0.5) * 0.02,
        y: 0.45 + (random() - 0.5) * 0.02,
      };

      // Scene 2: three regions of the ecosystem.
      const definition = CLUSTERS[cluster];
      const angle = clusterIndex * 2.39996 + random() * 0.9;
      const radius = Math.sqrt((clusterIndex + 0.6) / (clusterCounts[cluster] + 4)) * definition.spread;
      const clustered: Vec = {
        x: definition.x + Math.cos(angle) * radius,
        y: definition.y + Math.sin(angle) * radius * 1.15,
      };

      // Scene 3: a data constellation that rises across the viewport.
      const t = (i + 0.5) / count;
      const plot: Vec = {
        x: 0.1 + t * 0.8,
        y: 0.68 - t * 0.32 + Math.sin(t * 9.2) * 0.035 + Math.sin(t * 21) * 0.012 + (random() - 0.5) * 0.045,
      };

      // Scene 4: branches fanning up from a single trunk.
      const branch = i % 3;
      const step = Math.floor(i / 3);
      const climb = ((step % 9) + 1) / 10;
      const branchLayout: Vec = {
        x: 0.5 + (branch - 1) * (0.3 * (0.3 + climb)) + (random() - 0.5) * 0.05,
        y: 0.79 - climb * 0.52 + (random() - 0.5) * 0.04,
      };

      // Scene 5: three portal rings.
      const ring = i % 3;
      const ringAngle = (i / count) * TAU * 2.4 + ring * 0.8;
      const portal: Vec = {
        x: 0.5 + Math.cos(ringAngle) * [0.15, 0.24, 0.335][ring],
        y: 0.46 + Math.sin(ringAngle) * [0.235, 0.375, 0.5][ring],
      };

      // Scene 6: everything returns to the core.
      const converge: Vec = {
        x: 0.5 + (random() - 0.5) * 0.025,
        y: 0.44 + (random() - 0.5) * 0.025,
      };

      nodes.push({
        layouts: [origin, clustered, plot, branchLayout, portal, converge],
        cluster,
        depth,
        size: 0.7 + depth * 1.9,
        teal: random() > 0.76,
        hub: random() > 0.87,
        phase: random() * TAU,
        delay: random() * 1.15,
      });
    }

    const edges: NetworkEdge[] = [];
    const seen = new Set<string>();

    const addEdge = (a: number, b: number) => {
      if (a === b) return;
      const key = a < b ? `${a}:${b}` : `${b}:${a}`;
      if (seen.has(key)) return;
      seen.add(key);
      const ax = nodes[a].layouts[1].x;
      const ay = nodes[a].layouts[1].y;
      const bx = nodes[b].layouts[1].x;
      const by = nodes[b].layouts[1].y;
      edges.push({
        a,
        b,
        weight: clamp01(1 - Math.hypot(ax - bx, ay - by) / 0.34),
        cross: nodes[a].cluster !== nodes[b].cluster,
      });
    };

    for (let i = 0; i < count; i += 1) {
      const distances: { index: number; distance: number }[] = [];
      for (let j = 0; j < count; j += 1) {
        if (j === i) continue;
        const dx = nodes[i].layouts[1].x - nodes[j].layouts[1].x;
        const dy = nodes[i].layouts[1].y - nodes[j].layouts[1].y;
        distances.push({ index: j, distance: dx * dx + dy * dy });
      }
      distances.sort((p, q) => p.distance - q.distance);
      const links = i % 6 === 0 ? 3 : 2;
      for (let k = 0; k < links && k < distances.length; k += 1) {
        addEdge(i, distances[k].index);
      }
    }

    // Guarantee that regions are not visually isolated from each other.
    for (let i = 0; i < count; i += 1) {
      if (i % 11 !== 0) continue;
      for (let j = 0; j < count; j += 1) {
        if (nodes[i].cluster === nodes[j].cluster) continue;
        addEdge(i, j);
        break;
      }
    }

    const packetTotal = Math.min(edges.length, this.compact ? 5 : 14);
    const packets: Packet[] = Array.from({ length: packetTotal }, (_, index) => ({
      edge: Math.floor((index / Math.max(1, packetTotal)) * edges.length),
      t: random(),
      speed: 0.08 + random() * 0.16,
      dir: random() > 0.5 ? 1 : -1,
    }));

    this.nodes = nodes;
    this.edges = edges;
    this.packets = packets;
    this.posX = new Float32Array(count);
    this.posY = new Float32Array(count);
    this.plotOrder = nodes
      .map((node, index) => ({ index, x: node.layouts[2].x }))
      .sort((p, q) => p.x - q.x)
      .map((entry) => entry.index);
  }

  private buildMotes() {
    const random = seeded(0x4d4f5445);
    const total = this.compact ? 10 : 24;
    this.motes = Array.from({ length: total }, () => ({
      x: random(),
      y: random(),
      depth: 0.3 + random() * 0.7,
      size: 0.8 + random() * 1.4,
      phase: random() * TAU,
    }));
  }

  resize() {
    const root = document.documentElement;
    const nextWidth = root.clientWidth || window.innerWidth;
    const nextHeight = root.clientHeight || window.innerHeight;

    if (!this.ctx) {
      this.width = Math.max(1, nextWidth);
      this.height = Math.max(1, nextHeight);
      return;
    }

    this.width = Math.max(1, nextWidth);
    this.height = Math.max(1, nextHeight);
    this.dpr = Math.min(window.devicePixelRatio || 1, this.compact ? 1.25 : 1.75);

    this.canvas.width = Math.round(this.width * this.dpr);
    this.canvas.height = Math.round(this.height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    const wash = this.ctx.createRadialGradient(
      this.width * 0.58,
      this.height * 0.34,
      0,
      this.width * 0.58,
      this.height * 0.34,
      Math.max(this.width, this.height) * 0.78
    );
    wash.addColorStop(0, 'rgba(90, 240, 90, 0.055)');
    wash.addColorStop(0.52, 'rgba(59, 215, 196, 0.022)');
    wash.addColorStop(1, 'rgba(18, 19, 22, 0)');
    this.wash = wash;

    const vignette = this.ctx.createRadialGradient(
      this.width * 0.5,
      this.height * 0.46,
      Math.min(this.width, this.height) * 0.28,
      this.width * 0.5,
      this.height * 0.46,
      Math.max(this.width, this.height) * 0.78
    );
    vignette.addColorStop(0, 'rgba(18, 19, 22, 0)');
    vignette.addColorStop(1, 'rgba(18, 19, 22, 0.42)');
    this.vignette = vignette;

    this.buildMotes();

    if (this.reduced) this.render(this.lastFrame);
  }

  destroy() {
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerleave', this.onPointerLeave);
  }

  /* ------------------------------------------------------------------ */
  /* Rendering                                                           */
  /* ------------------------------------------------------------------ */

  render(frame: DirectorFrame) {
    const ctx = this.ctx;
    if (!ctx || this.width < 2 || this.height < 2) return;

    this.lastFrame = frame;
    if (!this.reduced) this.time = frame.time;

    const narrative = this.narrative;
    const width = this.width;
    const height = this.height;

    ctx.clearRect(0, 0, width, height);

    // Layered background wash.
    if (this.wash) {
      ctx.fillStyle = this.wash;
      ctx.fillRect(0, 0, width, height);
    }

    this.projectNodes(frame);

    const chartMix = windowMix(narrative, 2.42, 0.62);
    const portalMix = windowMix(narrative, 4.42, 0.72);

    if (chartMix > 0.01) this.drawChart(ctx, chartMix);
    this.drawEdges(ctx, narrative);
    this.drawPackets(ctx, frame);
    this.drawMotes(ctx, frame);
    this.drawNodes(ctx, narrative);
    if (portalMix > 0.01) this.drawPortal(ctx, portalMix);
    this.drawCore(ctx, narrative);
    this.drawVignette(ctx);
  }

  private projectNodes(frame: DirectorFrame) {
    const narrative = this.narrative;
    const from = Math.min(5, Math.floor(narrative));
    const to = Math.min(5, from + 1);
    const local = narrative - from;
    // Scene 1 expands continuously; later scenes hold their layout, then morph.
    const mix =
      from === 0
        ? smoothstep(clamp01(local / 0.9))
        : smoothstep(clamp01((local - 0.5) / 0.5));

    const parallax = this.reduced ? 0 : frame.y * 0.01;
    const interactive = this.pointer.active && !this.reduced && !this.compact;

    for (let i = 0; i < this.nodes.length; i += 1) {
      const node = this.nodes[i];
      const a = node.layouts[from];
      const b = node.layouts[to];

      let nx = lerp(a.x, b.x, mix);
      let ny = lerp(a.y, b.y, mix);

      if (!this.reduced) {
        nx += Math.sin(this.time * 0.42 + node.phase) * 0.0032 * node.depth;
        ny += Math.cos(this.time * 0.35 + node.phase * 1.4) * 0.0032 * node.depth;
      }

      let px = nx * this.width;
      let py = ny * this.height - parallax * node.depth;

      if (interactive) {
        const dx = px - this.pointer.x;
        const dy = py - this.pointer.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 170 && distance > 0.01) {
          const force = (1 - distance / 170) * 22;
          px += (dx / distance) * force;
          py += (dy / distance) * force;
        }
      }

      this.posX[i] = px;
      this.posY[i] = py;
    }
  }

  private drawChart(ctx: CanvasRenderingContext2D, mix: number) {
    const width = this.width;
    const height = this.height;
    const top = height * 0.24;
    const bottom = height * 0.76;

    ctx.save();
    ctx.globalAlpha = mix * 0.55;

    // Baseline grid
    ctx.strokeStyle = 'rgba(248, 241, 234, 0.06)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 3; i += 1) {
      const y = lerp(top, bottom, i / 3);
      ctx.beginPath();
      ctx.moveTo(width * 0.06, y);
      ctx.lineTo(width * 0.94, y);
      ctx.stroke();
    }

    // Trend path through the plot layout
    ctx.beginPath();
    this.plotOrder.forEach((nodeIndex, position) => {
      const node = this.nodes[nodeIndex];
      const x = node.layouts[2].x * width;
      const y = node.layouts[2].y * height;
      if (position === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = 'rgba(90, 240, 90, 0.34)';
    ctx.lineWidth = 1.3;
    ctx.stroke();

    // Data points
    for (let i = 0; i < this.plotOrder.length; i += 7) {
      const node = this.nodes[this.plotOrder[i]];
      const x = node.layouts[2].x * width;
      const y = node.layouts[2].y * height;
      ctx.fillStyle = 'rgba(208, 255, 214, 0.62)';
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = 'rgba(90, 240, 90, 0.2)';
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, TAU);
      ctx.stroke();
    }

    ctx.restore();
  }

  private drawEdges(ctx: CanvasRenderingContext2D, narrative: number) {
    const reveal = clamp01((narrative - 0.35) / 0.85);
    const exit = 1 - smoothstep(clamp01((narrative - 5.15) / 0.8));
    const base = reveal * exit * (this.compact ? 0.75 : 1);
    if (base <= 0.01) return;

    const reach = Math.min(this.width, this.height) * 0.46;
    ctx.lineWidth = 0.7;

    for (const edge of this.edges) {
      const ax = this.posX[edge.a];
      const ay = this.posY[edge.a];
      const bx = this.posX[edge.b];
      const by = this.posY[edge.b];
      if (ax === undefined || bx === undefined) continue;

      const distance = Math.hypot(ax - bx, ay - by);
      const fade = clamp01(1 - distance / reach);
      if (fade <= 0.02) continue;

      const pulse =
        edge.cross && !this.reduced ? 0.5 + 0.5 * Math.sin(this.time * 1.05 + edge.a * 1.7) : 0;
      const alpha = base * (0.045 + edge.weight * fade * (0.2 + pulse * 0.14));

      ctx.strokeStyle = edge.cross
        ? `rgba(96, 214, 200, ${alpha})`
        : `rgba(120, 242, 132, ${alpha})`;
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.stroke();
    }
  }

  private drawPackets(ctx: CanvasRenderingContext2D, frame: DirectorFrame) {
    const reveal = clamp01((this.narrative - 1) / 0.8);
    if (reveal <= 0.01) return;

    ctx.lineWidth = 1.2;
    for (const packet of this.packets) {
      const edge = this.edges[packet.edge];
      if (!edge) continue;
      const ax = this.posX[edge.a];
      const ay = this.posY[edge.a];
      const bx = this.posX[edge.b];
      const by = this.posY[edge.b];
      if (ax === undefined || bx === undefined) continue;

      const t = packet.dir > 0 ? packet.t : 1 - packet.t;
      const tail = Math.max(0, Math.min(1, t - 0.06 * packet.dir));
      const x = lerp(ax, bx, t);
      const y = lerp(ay, by, t);

      ctx.strokeStyle = `rgba(170, 255, 182, ${0.32 * reveal})`;
      ctx.beginPath();
      ctx.moveTo(lerp(ax, bx, tail), lerp(ay, by, tail));
      ctx.lineTo(x, y);
      ctx.stroke();

      ctx.fillStyle = `rgba(210, 255, 216, ${0.6 * reveal})`;
      ctx.beginPath();
      ctx.arc(x, y, 1.3, 0, TAU);
      ctx.fill();

      if (!this.reduced) {
        packet.t += packet.speed * frame.dt;
        if (packet.t > 1) packet.t -= 1;
      }
    }
  }

  private drawMotes(ctx: CanvasRenderingContext2D, frame: DirectorFrame) {
    const height = this.height;
    for (const mote of this.motes) {
      let y = mote.y * height - (this.reduced ? 0 : frame.y * 0.02 * mote.depth);
      y = ((y % height) + height) % height;
      const x = mote.x * this.width + Math.sin(this.time * 0.18 + mote.phase) * 10;
      const alpha = 0.05 + mote.depth * (this.reduced ? 0.12 : 0.16 + 0.1 * Math.sin(this.time * 0.7 + mote.phase));
      ctx.fillStyle = `rgba(200, 255, 210, ${clamp01(alpha)})`;
      ctx.fillRect(x, y, mote.size, mote.size);
    }
  }

  private drawNodes(ctx: CanvasRenderingContext2D, narrative: number) {
    const dissolve = 1 - smoothstep(clamp01((narrative - 5.45) / 0.5));

    for (let i = 0; i < this.nodes.length; i += 1) {
      const node = this.nodes[i];
      const emerge = clamp01(narrative * 2.2 - node.delay * 0.85);
      if (emerge <= 0.01) continue;

      const alpha = (0.16 + node.depth * 0.45) * emerge * dissolve;
      if (alpha <= 0.01) continue;

      const x = this.posX[i];
      const y = this.posY[i];

      if (node.hub) {
        const sprite = node.teal ? this.tealGlow : this.greenGlow;
        if (sprite) {
          const size = node.size * (this.compact ? 9 : 16);
          ctx.globalAlpha = alpha * 0.55;
          ctx.drawImage(sprite, x - size / 2, y - size / 2, size, size);
          ctx.globalAlpha = 1;
        }
      }

      ctx.fillStyle = node.teal
        ? `rgba(126, 232, 218, ${alpha})`
        : `rgba(148, 255, 156, ${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, node.size, 0, TAU);
      ctx.fill();
    }
  }

  private drawPortal(ctx: CanvasRenderingContext2D, mix: number) {
    const cx = this.width * 0.5;
    const cy = this.height * 0.46;
    const rings = [
      { rx: 0.15, ry: 0.235, color: '90, 240, 90' },
      { rx: 0.24, ry: 0.375, color: '59, 215, 196' },
      { rx: 0.335, ry: 0.5, color: '90, 240, 90' },
    ];

    ctx.save();
    for (let i = 0; i < rings.length; i += 1) {
      const ring = rings[i];
      const spin = this.reduced ? i * 0.8 : this.time * (0.16 + i * 0.05) + i * 0.9;
      ctx.strokeStyle = `rgba(${ring.color}, ${mix * (0.22 - i * 0.04)})`;
      ctx.lineWidth = 1;
      ctx.setLineDash(i === 1 ? [6, 12] : []);
      ctx.beginPath();
      ctx.ellipse(
        cx,
        cy,
        ring.rx * this.width,
        ring.ry * this.height,
        0,
        spin,
        spin + 1.9 + i * 0.5
      );
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(
        cx,
        cy,
        ring.rx * this.width,
        ring.ry * this.height,
        0,
        spin + Math.PI,
        spin + Math.PI + 1.1
      );
      ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.restore();
  }

  private drawCore(ctx: CanvasRenderingContext2D, narrative: number) {
    const seed = clamp01(1 - narrative * 1.4);
    const collapse = smoothstep(clamp01((narrative - 5.05) / 0.85));
    const strength = Math.max(seed, collapse);
    if (strength <= 0.01) return;

    const cx = this.width * 0.5;
    const cy = this.height * (collapse > 0.05 ? 0.44 : 0.45);

    const seedRadius = lerp(11, 46, smoothstep(clamp01(narrative / 0.8)));
    const collapseRadius = lerp(210, 92, collapse);
    const radius = seed > collapse ? seedRadius : collapseRadius;

    if (this.greenGlow) {
      const size = radius * 7;
      ctx.globalAlpha = strength * 0.62;
      ctx.drawImage(this.greenGlow, cx - size / 2, cy - size / 2, size, size);
      ctx.globalAlpha = 1;
    }

    ctx.strokeStyle = `rgba(200, 255, 208, ${strength * 0.24})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.4, 0, TAU);
    ctx.stroke();

    ctx.strokeStyle = `rgba(90, 240, 90, ${strength * 0.14})`;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 2.1, 0, TAU);
    ctx.stroke();

    ctx.fillStyle = `rgba(232, 255, 236, ${strength * 0.85})`;
    ctx.beginPath();
    ctx.arc(cx, cy, Math.max(1.8, radius * 0.14), 0, TAU);
    ctx.fill();
  }

  private drawVignette(ctx: CanvasRenderingContext2D) {
    if (!this.vignette) return;
    ctx.fillStyle = this.vignette;
    ctx.fillRect(0, 0, this.width, this.height);
  }
}
