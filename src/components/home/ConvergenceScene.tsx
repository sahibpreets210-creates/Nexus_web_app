import { useRef } from 'react';
import { motion, useTransform } from 'motion/react';
import { useAutoInert } from '../../animation/director';
import { useScene } from '../../animation/sceneTimeline';
import SceneMarker from './SceneMarker';

interface ConvergenceSceneProps {
  staged: boolean;
  reduced: boolean;
  onNavigate: (path: string) => void;
}

interface CopyProps {
  reduced: boolean;
  onNavigate: (path: string) => void;
}

function ConvergenceCopy({ reduced, onNavigate }: CopyProps) {
  return (
    <div className="container-nexus w-full">
      <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-3 sm:-inset-x-12 -inset-y-20 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(18,19,22,0.94)_0%,rgba(18,19,22,0.6)_55%,transparent_78%)]"
        />

        <span className="brand-mark h-16 w-16 rounded-2xl">
          <img src="/brand/nexus-logo.jpeg" alt="" />
        </span>

        <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.42em] text-[#f8f1ea]">
          Nexus
        </p>

        <div className="mt-6 flex justify-center">
          <SceneMarker index="Scene 06" title="The Convergence" />
        </div>

        <motion.h2
          id="convergence-title"
          initial={reduced ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="display mt-6 text-[clamp(2.2rem,6.4vw,4rem)] text-[#f8f1ea]"
        >
          Foresee the unseen.
        </motion.h2>

        <p className="mt-5 text-[11px] uppercase tracking-[0.24em] text-[#a4a6a0]">
          Get to know us. Connect and build together.
        </p>

        <div className="mx-auto mt-9 grid w-full max-w-md gap-3 sm:grid-cols-2">
          <button type="button" onClick={() => onNavigate('/team')} className="btn btn-ghost w-full">
            Meet the team
          </button>
          <button type="button" onClick={() => onNavigate('/contact')} className="btn btn-primary w-full">
            Connect with us
          </button>
        </div>

        <p className="mt-9 font-mono text-[10px] uppercase tracking-[0.22em] text-[#6f716c]">
          Potentia · Communitas · Educatus
        </p>
      </div>
    </div>
  );
}

export default function ConvergenceScene({ staged, reduced, onNavigate }: ConvergenceSceneProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const progress = useScene('convergence', sectionRef, staged ? 'stage' : 'flow', 0, 0.85);

  const opacity = useTransform(progress, [0, 0.34], [0.12, 1]);
  const shift = useTransform(progress, [0, 0.55], [40, 0]);
  const scale = useTransform(progress, [0, 0.6], [0.97, 1]);

  useAutoInert(panelRef, opacity, staged);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="convergence-title"
      className={staged ? 'relative w-full h-[210vh]' : 'relative w-full'}
    >
      {staged ? (
        <div className="sticky top-0 flex h-[100svh] w-full items-center overflow-hidden">
          <motion.div
            ref={panelRef}
            style={{ opacity, y: shift, scale }}
            className="flex h-full w-full items-center pt-20"
          >
            <ConvergenceCopy reduced={reduced} onNavigate={onNavigate} />
          </motion.div>
        </div>
      ) : (
        <div className="relative flex w-full items-center py-16">
          <ConvergenceCopy reduced={reduced} onNavigate={onNavigate} />
        </div>
      )}
    </section>
  );
}
