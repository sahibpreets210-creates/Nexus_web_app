import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { NexusNetwork } from '../animation/networkEngine';
import { readNarrative } from '../animation/sceneTimeline';
import { director } from '../animation/director';

const COMPACT_QUERY = '(max-width: 767px)';

/**
 * The one shared canvas field behind the homepage. It is purely decorative:
 * every word on the page is real DOM, so a blocked or unsupported canvas
 * leaves the content untouched.
 */
export default function NexusField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduced = Boolean(useReducedMotion());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let engine: NexusNetwork;
    try {
      engine = new NexusNetwork(canvas, {
        compact: window.matchMedia(COMPACT_QUERY).matches,
        reduced,
      });
    } catch (error) {
      // No canvas is not a broken page — the field simply does not appear.
      console.warn('[nexus] network field unavailable', error);
      return;
    }

    const onResize = () => engine.resize();
    window.addEventListener('resize', onResize, { passive: true });

    if (reduced) {
      // Static fallback: a settled constellation, painted once per resize.
      engine.setNarrative(1.5);
      engine.render({
        time: 1,
        dt: 0,
        y: 0,
        progress: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      });
      return () => {
        window.removeEventListener('resize', onResize);
        engine.destroy();
      };
    }

    const unsubscribe = director.subscribe((frame) => {
      engine.setNarrative(readNarrative());
      engine.render(frame);
    });

    return () => {
      unsubscribe();
      window.removeEventListener('resize', onResize);
      engine.destroy();
    };
  }, [reduced]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#121316]">
      <canvas ref={canvasRef} className="h-full w-full" />
      <div className="grid-veil absolute inset-0 opacity-25" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#121316] via-[#121316]/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#121316] to-transparent" />
    </div>
  );
}
