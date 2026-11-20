import { useEffect } from 'react';
import type { RefObject } from 'react';
import { readSceneProgress, remap, useSceneProgress } from './director';
import type { SceneMode } from './director';

/**
 * The homepage narrative as one ordered timeline.
 *
 * Scene elements register their DOM node (and their slice of that node's
 * progress) with this module. The network field then asks for a single
 * narrative value — 0 = the origin, 5.x = the convergence — so one engine can
 * carry the whole story without competing listeners or duplicated state.
 */
export const SCENE_ORDER = [
  'origin',
  'connection',
  'intelligence',
  'people',
  'experience',
  'convergence',
] as const;

export type SceneId = (typeof SCENE_ORDER)[number];

interface Registration {
  element: HTMLElement;
  mode: SceneMode;
  from: number;
  to: number;
}

const registry = new Map<SceneId, Registration>();

/** Narrative position, continuous across scene boundaries (0 → 5.999). */
export function readNarrative(): number {
  let index = 0;
  let local = 0;

  for (let i = 0; i < SCENE_ORDER.length; i += 1) {
    const entry = registry.get(SCENE_ORDER[i]);
    if (!entry) continue;
    const progress = remap(readSceneProgress(entry.element, entry.mode), entry.from, entry.to);
    if (progress > 0.0008) {
      index = i;
      local = progress;
    }
  }

  return Math.min(SCENE_ORDER.length - 0.001, index + local);
}

/**
 * Registers a scene and returns its progress MotionValue for local transforms.
 */
export function useScene(
  id: SceneId,
  ref: RefObject<HTMLElement | null>,
  mode: SceneMode,
  from = 0,
  to = 1
) {
  const progress = useSceneProgress(ref, mode, from, to);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    registry.set(id, { element, mode, from, to });
    return () => {
      if (registry.get(id)?.element === element) registry.delete(id);
    };
  }, [id, ref, mode, from, to]);

  return progress;
}
