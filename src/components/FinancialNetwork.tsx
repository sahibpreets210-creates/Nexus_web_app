import { useEffect, useRef } from 'react';

interface NetworkNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  depth: number;
  hub: boolean;
  hue: number;
}

interface Edge {
  a: number;
  b: number;
  weight: number;
}

interface Packet {
  edge: number;
  t: number;
  speed: number;
  dir: number;
}

interface FinancialNetworkProps {
  /** Density multiplier used to raise or lower node counts. */
  density?: number;
  className?: string;
}

const MAX_NODES_DESKTOP = 64;
const MAX_NODES_MOBILE = 26;
const LINK_DISTANCE_DESKTOP = 200;
const LINK_DISTANCE_MOBILE = 140;
const POINTER_RADIUS = 190;

/**
 * Nexus financial network: one shared Canvas 2D field of financial nodes,
 * edges and travelling data packets. It is mounted once at the app shell,
 * pauses off-screen, honours prefers-reduced-motion, and scales its own
 * node count down on small screens.
 */
export default function FinancialNetwork({ density = 1, className = '' }: FinancialNetworkProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const element: HTMLCanvasElement = canvasEl;
    const ctx = element.getContext('2d', { alpha: true });
    if (!ctx) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduced = motionQuery.matches;

    let width = 0;
    let height = 0;
    let nodes: NetworkNode[] = [];
    let edges: Edge[] = [];
    let packets: Packet[] = [];

    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999, active: false };

    let rafId = 0;
    let running = false;
    let lastTime = 0;
    let inView = true;
    let pageVisible = !document.hidden;

    const isSmall = () => width > 0 && width < 720;

    function build() {
      const small = isSmall();
      const areaTarget = small ? 20000 : 23000;
      const count = Math.max(
        small ? 14 : 24,
        Math.min(
          small ? MAX_NODES_MOBILE : MAX_NODES_DESKTOP,
          Math.round(((width * height) / areaTarget) * density)
        )
      );

      nodes = Array.from({ length: count }, () => {
        const depth = 0.35 + Math.random() * 0.65;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * (small ? 9 : 13),
          vy: (Math.random() - 0.5) * (small ? 7 : 10),
          r: 0.7 + depth * 1.9,
          depth,
          hub: Math.random() > 0.87,
          hue: Math.random() > 0.78 ? 168 : 112,
        };
      });

      edges = [];
      const maxDistance = small ? LINK_DISTANCE_MOBILE : LINK_DISTANCE_DESKTOP;
      const maxEdges = Math.round(count * 1.9);

      for (let i = 0; i < nodes.length && edges.length < maxEdges; i += 1) {
        let linked = 0;
        for (let j = i + 1; j < nodes.length && linked < 3 && edges.length < maxEdges; j += 1) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.hypot(dx, dy);
          if (distance < maxDistance) {
            edges.push({ a: i, b: j, weight: 1 - distance / maxDistance });
            linked += 1;
          }
        }
      }

      packets = [];
      const packetCount = Math.min(edges.length, small ? 5 : 13);
      for (let i = 0; i < packetCount; i += 1) {
        packets.push({
          edge: Math.floor((i / Math.max(1, packetCount)) * edges.length),
          t: Math.random(),
          speed: 0.08 + Math.random() * 0.16,
          dir: Math.random() > 0.5 ? 1 : -1,
        });
      }
    }

    function resize() {
      const rect = element.getBoundingClientRect();
      const nextWidth = Math.max(1, Math.round(rect.width));
      const nextHeight = Math.max(1, Math.round(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = nextWidth;
      height = nextHeight;
      element.width = Math.round(nextWidth * dpr);
      element.height = Math.round(nextHeight * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
      render(0);
    }

    function drawAmbientGlow() {
      const glow = ctx!.createRadialGradient(
        width * 0.28,
        height * 0.22,
        0,
        width * 0.28,
        height * 0.22,
        Math.max(width, height) * 0.55
      );
      glow.addColorStop(0, 'rgba(90, 240, 90, 0.055)');
      glow.addColorStop(0.55, 'rgba(64, 168, 150, 0.022)');
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx!.fillStyle = glow;
      ctx!.fillRect(0, 0, width, height);
    }

    function render(dt: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      if (width < 2 || height < 2) return;

      drawAmbientGlow();
      if (!reduced) {
        pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 4);
        pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 4);
      }

      const interaction = pointer.active && !reduced && !isSmall();

      if (!reduced && dt > 0) {
        for (const node of nodes) {
          node.x += node.vx * node.depth * dt;
          node.y += node.vy * node.depth * dt;

          if (node.x < -20) node.x = width + 20;
          if (node.x > width + 20) node.x = -20;
          if (node.y < -20) node.y = height + 20;
          if (node.y > height + 20) node.y = -20;

          if (interaction) {
            const dx = node.x - pointer.x;
            const dy = node.y - pointer.y;
            const distance = Math.hypot(dx, dy);
            if (distance < POINTER_RADIUS && distance > 0.01) {
              const force = (1 - distance / POINTER_RADIUS) * 26;
              node.x += (dx / distance) * force * dt;
              node.y += (dy / distance) * force * dt;
            }
          }
        }
      }

      ctx.lineWidth = 0.7;
      for (const edge of edges) {
        const a = nodes[edge.a];
        const b = nodes[edge.b];
        if (!a || !b) continue;
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        const reach = isSmall() ? LINK_DISTANCE_MOBILE : LINK_DISTANCE_DESKTOP;
        const fade = Math.max(0, 1 - distance / (reach * 1.35));
        if (fade <= 0.01) continue;
        const alpha = 0.035 + edge.weight * fade * 0.16;
        ctx.strokeStyle =
          a.hue === 168 || b.hue === 168
            ? `rgba(96, 214, 200, ${alpha})`
            : `rgba(90, 240, 90, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      for (const packet of packets) {
        const edge = edges[packet.edge];
        if (!edge) continue;
        const a = nodes[edge.a];
        const b = nodes[edge.b];
        if (!a || !b) continue;
        const t = packet.dir > 0 ? packet.t : 1 - packet.t;
        const x = a.x + (b.x - a.x) * t;
        const y = a.y + (b.y - a.y) * t;
        const tailT = Math.max(0, Math.min(1, t - 0.05 * packet.dir));
        const tx = a.x + (b.x - a.x) * tailT;
        const ty = a.y + (b.y - a.y) * tailT;

        const gradient = ctx.createLinearGradient(tx, ty, x, y);
        gradient.addColorStop(0, 'rgba(90, 240, 90, 0)');
        gradient.addColorStop(1, 'rgba(160, 255, 170, 0.5)');
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(x, y);
        ctx.stroke();

        ctx.fillStyle = 'rgba(200, 255, 205, 0.75)';
        ctx.beginPath();
        ctx.arc(x, y, 1.35, 0, Math.PI * 2);
        ctx.fill();

        if (!reduced && dt > 0) {
          packet.t += packet.speed * dt;
          if (packet.t > 1) packet.t -= 1;
        }
      }

      for (const node of nodes) {
        const alpha = 0.22 + node.depth * 0.5;
        if (node.hub) {
          // Keep the glow tight on phones so it stays texture, not bokeh.
          const haloRadius = node.r * (isSmall() ? 4.5 : 9);
          const halo = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, haloRadius);
          halo.addColorStop(0, isSmall() ? 'rgba(90, 240, 90, 0.2)' : 'rgba(90, 240, 90, 0.32)');
          halo.addColorStop(1, 'rgba(90, 240, 90, 0)');
          ctx.fillStyle = halo;
          ctx.beginPath();
          ctx.arc(node.x, node.y, haloRadius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle =
          node.hue === 168
            ? `rgba(126, 232, 218, ${alpha})`
            : `rgba(148, 255, 156, ${alpha})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (interaction) {
        let connections = 0;
        for (const node of nodes) {
          if (connections >= 4) break;
          const distance = Math.hypot(node.x - pointer.x, node.y - pointer.y);
          if (distance < POINTER_RADIUS * 0.85) {
            const alpha = (1 - distance / (POINTER_RADIUS * 0.85)) * 0.28;
            ctx.strokeStyle = `rgba(90, 240, 90, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(pointer.x, pointer.y);
            ctx.lineTo(node.x, node.y);
            ctx.stroke();
            connections += 1;
          }
        }
        ctx.fillStyle = 'rgba(90, 240, 90, 0.5)';
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function loop(now: number) {
      if (!running) return;
      const dt = Math.min(0.05, Math.max(0, (now - lastTime) / 1000));
      lastTime = now;
      render(dt);
      rafId = requestAnimationFrame(loop);
    }

    function start() {
      if (running || reduced) return;
      running = true;
      lastTime = performance.now();
      rafId = requestAnimationFrame(loop);
    }

    function stop() {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
    }

    function sync() {
      if (inView && pageVisible && !reduced) start();
      else stop();
      if (!inView || !pageVisible || reduced) render(0);
    }

    function onPointerMove(event: PointerEvent) {
      if (event.pointerType === 'touch' || reduced) return;
      const rect = element.getBoundingClientRect();
      pointer.tx = event.clientX - rect.left;
      pointer.ty = event.clientY - rect.top;
      pointer.active = true;
      if (!running) render(0);
    }

    function onPointerLeave() {
      pointer.active = false;
      pointer.tx = -9999;
      pointer.ty = -9999;
    }

    function onVisibility() {
      pageVisible = !document.hidden;
      sync();
    }

    function onMotionChange(event: MediaQueryListEvent) {
      reduced = event.matches;
      pointer.active = false;
      sync();
    }

    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(element);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        inView = entries.some((entry) => entry.isIntersecting);
        sync();
      },
      { rootMargin: '120px' }
    );
    intersectionObserver.observe(element);

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave);
    document.addEventListener('visibilitychange', onVisibility);
    motionQuery.addEventListener('change', onMotionChange);

    if (reduced) render(0);
    else start();

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibility);
      motionQuery.removeEventListener('change', onMotionChange);
    };
  }, [density]);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
