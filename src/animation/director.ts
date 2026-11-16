import { useEffect, useState } from 'react';
import { motionValue, useReducedMotion } from 'motion/react';
import type { MotionValue } from 'motion/react';
import type { RefObject } from 'react';

/**
 * NEXUS SCROLL DIRECTOR
 *
 * One requestAnimationFrame loop and one passive resize measurement for the
 * whole scroll experience. Every scene subscribes to this director instead of
 * registering its own scroll listener, so the network and the page always read
 * the same scroll state on the same frame.
 */

export interface DirectorFrame {
  /** Seconds since page load (from rAF timestamps). */
  time: number;
  /** Seconds since the previous frame, clamped to 50ms. */
  dt: number;
  /** window.scrollY at this frame. */
  y: number;
  /** 0 → 1 across the whole document. */
  progress: number;
  width: number;
  height: number;
}

type FrameSubscriber = (frame: DirectorFrame) => void;

/** A pinned stage measures its travel; a flowing section measures its pass. */
export type SceneMode = 'stage' | 'flow';

export const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value);

export const remap = (value: number, from: number, to: number) => {
  if (to === from) return value >= to ? 1 : 0;
  return clamp01((value - from) / (to - from));
};

class ScrollDirector {
  readonly pageProgress = motionValue(0);
  private subscribers = new Set<FrameSubscriber>();
  private rafId = 0;
  private lastTime = 0;
  private maxScroll = 1;
  private running = false;
  private framesSinceMeasure = 0;

  private measure = () => {
    const documentElement = document.documentElement;
    const next = documentElement.scrollHeight - window.innerHeight;
    this.maxScroll = Math.max(1, next);
  };

  private handleVisibility = () => {
    if (document.hidden) this.pause();
    else if (this.subscribers.size) this.resume();
  };

  private handleResize = () => {
    this.measure();
  };

  constructor() {
    if (typeof window === 'undefined') return;
    window.addEventListener('resize', this.handleResize, { passive: true });
    document.addEventListener('visibilitychange', this.handleVisibility);
  }

  subscribe(subscriber: FrameSubscriber): () => void {
    this.subscribers.add(subscriber);
    this.measure();
    subscriber(this.buildFrame(performance.now(), 0));
    if (!this.running) this.resume();

    return () => {
      this.subscribers.delete(subscriber);
      if (this.subscribers.size === 0) this.pause();
    };
  }

  private buildFrame(now: number, dt: number): DirectorFrame {
    const y = window.scrollY;
    const progress = clamp01(y / this.maxScroll);
    this.pageProgress.set(progress);
    return {
      time: now / 1000,
      dt,
      y,
      progress,
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  private tick = (now: number) => {
    if (!this.running) return;
    if (this.subscribers.size === 0) {
      this.running = false;
      return;
    }

    const dt = this.lastTime ? Math.min(0.05, Math.max(0, (now - this.lastTime) / 1000)) : 0.016;
    this.lastTime = now;

    // Layout can shift as fonts and photos settle. Re-measure occasionally
    // rather than every frame to avoid forcing layout 60 times a second.
    this.framesSinceMeasure += 1;
    if (this.framesSinceMeasure > 45) {
      this.framesSinceMeasure = 0;
      this.measure();
    }

    const frame = this.buildFrame(now, dt);
    for (const subscriber of this.subscribers) subscriber(frame);

    this.rafId = requestAnimationFrame(this.tick);
  };

  private resume() {
    if (this.running || document.hidden) return;
    this.running = true;
    this.lastTime = 0;
    this.framesSinceMeasure = 0;
    this.rafId = requestAnimationFrame(this.tick);
  }

  private pause() {
    this.running = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = 0;
  }
}

export const director = new ScrollDirector();

/**
 * Raw progress of one element.
 * - `stage`: how far a tall pinned section has travelled through its pin.
 * - `flow`: how far a normal section has passed through the viewport.
 */
export function readSceneProgress(element: HTMLElement, mode: SceneMode) {
  const rect = element.getBoundingClientRect();
  const viewport = window.innerHeight || 1;

  if (mode === 'stage') {
    const travel = Math.max(1, rect.height - viewport);
    return clamp01(-rect.top / travel);
  }

  return clamp01((viewport - rect.top) / Math.max(1, rect.height + viewport));
}

/**
 * Scene progress as a MotionValue. Updates arrive from the shared director on
 * its single frame loop; this hook never installs a scroll listener and never
 * triggers a React re-render.
 */
export function useSceneProgress(
  ref: RefObject<HTMLElement | null>,
  mode: SceneMode,
  from = 0,
  to = 1,
  enabled = true
): MotionValue<number> {
  const value = motionValue(0);

  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;

    return director.subscribe(() => {
      value.set(remap(readSceneProgress(element, mode), from, to));
    });
  }, [ref, mode, from, to, enabled, value]);

  return value;
}

/**
 * Keeps content that has faded out of a pinned stage out of the tab order and
 * the accessibility tree. Purely imperative, so it costs no re-renders.
 */
export function useAutoInert(
  ref: RefObject<HTMLElement | null>,
  opacity: MotionValue<number>,
  enabled = true
) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (!enabled) {
      element.inert = false;
      return;
    }

    let inert = false;
    return director.subscribe(() => {
      const next = opacity.get() < 0.06;
      if (next === inert) return;
      inert = next;
      element.inert = next;
    });
  }, [ref, opacity, enabled]);
}

export interface NexusMotion {
  /** prefers-reduced-motion is active. */
  reduced: boolean;
  /** Small screens get a simplified, non-pinned layout. */
  compact: boolean;
  /** Pinned, scroll-linked staging is appropriate. */
  staged: boolean;
}

const COMPACT_QUERY = '(max-width: 767px)';

export function useNexusMotion(): NexusMotion {
  const prefersReduced = useReducedMotion();
  const [compact, setCompact] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(COMPACT_QUERY).matches
  );

  useEffect(() => {
    const query = window.matchMedia(COMPACT_QUERY);
    const update = (event: MediaQueryListEvent) => setCompact(event.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  const reduced = Boolean(prefersReduced);
  return { reduced, compact, staged: !reduced && !compact };
}
