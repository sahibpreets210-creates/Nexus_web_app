import { useRef } from 'react';
import { motion, useTransform } from 'motion/react';
import { useAutoInert } from '../../animation/director';
import { useScene } from '../../animation/sceneTimeline';
import SceneMarker from './SceneMarker';

interface OriginsStageProps {
  staged: boolean;
  reduced: boolean;
  onNavigate: (path: string) => void;
}

const PILLARS = [
  { label: 'Potentia', hint: 'Power', region: 'Engineering' },
  { label: 'Communitas', hint: 'Fellowship', region: 'Community' },
  { label: 'Educatus', hint: 'Growth', region: 'Mentorship' },
];

interface CopyProps {
  reduced: boolean;
  onNavigate: (path: string) => void;
}

/* ------------------------------- Scene 01 ------------------------------- */

function OriginCopy({ reduced, onNavigate }: CopyProps) {
  return (
    <div className="container-nexus w-full">
      <div className="relative max-w-3xl">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-3 sm:-inset-x-8 -inset-y-14 -z-10 bg-[radial-gradient(ellipse_at_left,rgba(18,19,22,0.95)_0%,rgba(18,19,22,0.62)_46%,transparent_74%)]"
        />

        <SceneMarker index="Scene 01" title="The Origin" />

        <motion.p
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="eyebrow mt-6"
        >
          Visionary Syndicate
        </motion.p>

        <motion.h1
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="display mt-5 text-[clamp(2.3rem,7.4vw,4.9rem)] text-[#f8f1ea]"
        >
          Potentia.
          <br />
          <span className="text-[#a4a6a0]">Communitas,</span>
          <br />
          <span className="bg-gradient-to-r from-[#5af05a] via-[#8dffb0] to-[#3bd7c4] bg-clip-text text-transparent">
            Educatus.
          </span>
        </motion.h1>

        <motion.p
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lead mt-6 max-w-2xl text-sm sm:text-base"
        >
          Nexus is the in-house technology and finance club of Amity International
          School, Vasundhara Sector-1. We are a collective of forward-thinking creators,
          developers, and finance enthusiasts. We push the boundaries of digital and
          economic frontiers, building robust pipelines of collective intelligence.
        </motion.p>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <button type="button" onClick={() => onNavigate('/about')} className="btn btn-primary w-full sm:w-auto">
            Explore Nexus
          </button>
          <button type="button" onClick={() => onNavigate('/arcade')} className="btn btn-ghost w-full sm:w-auto">
            Enter the arcade
          </button>
        </motion.div>

        <div className="mt-10 flex items-center gap-4 text-[10px] uppercase tracking-[0.24em] text-[#7f817b]">
          <div className="flex h-10 w-6 items-start justify-center rounded-full border border-white/15 p-1.5">
            <motion.span
              aria-hidden="true"
              animate={reduced ? undefined : { y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              className="h-1.5 w-1.5 rounded-full bg-[#5af05a]"
            />
          </div>
          <span>Scroll to sync</span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- Scene 02 ------------------------------- */

function ConnectionCopy() {
  return (
    <div className="container-nexus w-full">
      <div className="relative max-w-2xl md:mx-auto md:text-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-3 sm:-inset-x-12 -inset-y-16 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(18,19,22,0.93)_0%,rgba(18,19,22,0.55)_52%,transparent_76%)]"
        />

        <div className="md:flex md:justify-center">
          <SceneMarker index="Scene 02" title="The Connection" />
        </div>

        <h2 className="display mt-6 text-[clamp(1.9rem,5vw,3.25rem)] text-[#f8f1ea]">
          We are Nexus
        </h2>

        <div className="my-6 flex items-center gap-2 md:justify-center">
          <span className="h-[1px] w-12 bg-[#5af05a]/30" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#5af05a] shadow-[0_0_14px_rgba(90,240,90,0.8)]" />
          <span className="h-[1px] w-12 bg-[#5af05a]/30" />
        </div>

        <p className="lead text-sm sm:text-base">
          An elite student tech-finance syndicate at Amity International School,
          Vasundhara Sector-1. We push the frontiers of what is possible, bringing together
          analytical developers, visual designers, and finance visionaries to collaborate,
          learn, and build high-performance solutions for modern challenges. Our alliance
          serves as a breeding ground for innovative leadership and technical competence.
        </p>

        <ul className="mt-8 flex flex-wrap gap-2 md:justify-center">
          {PILLARS.map((pillar) => (
            <li
              key={pillar.label}
              className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-[#c8cac4]"
            >
              <span className="text-[#5af05a]">{pillar.label}</span>
              <span className="mx-2 text-[#5f615c]">/</span>
              {pillar.hint}
            </li>
          ))}
        </ul>

        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-[#6f716c]">
          Three regions · one graph · every edge a collaboration
        </p>
      </div>
    </div>
  );
}

/* -------------------------------- Stage --------------------------------- */

export default function OriginsStage({ staged, reduced, onNavigate }: OriginsStageProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const originPanelRef = useRef<HTMLDivElement | null>(null);
  const connectionPanelRef = useRef<HTMLDivElement | null>(null);

  // One element, two slices of its progress: scene 1 owns the first half of the
  // pinned stage, scene 2 the second.
  const origin = useScene('origin', sectionRef, staged ? 'stage' : 'flow', 0, staged ? 0.5 : 0.5);
  const connection = useScene(
    'connection',
    sectionRef,
    staged ? 'stage' : 'flow',
    staged ? 0.42 : 0.46,
    1
  );

  const originOpacity = useTransform(origin, [0.72, 1], [1, 0]);
  const originShift = useTransform(origin, [0, 1], [0, -64]);
  const connectionOpacity = useTransform(connection, [0, 0.22], [0, 1]);
  const connectionShift = useTransform(connection, [0, 0.5], [52, 0]);

  useAutoInert(originPanelRef, originOpacity, staged);
  useAutoInert(connectionPanelRef, connectionOpacity, staged);

  return (
    <section
      ref={sectionRef}
      aria-label="Nexus introduction"
      className={staged ? 'relative w-full h-[290vh]' : 'relative w-full'}
    >
      {staged ? (
        <div className="sticky top-0 flex h-[100svh] w-full items-center overflow-hidden">
          <motion.div
            ref={originPanelRef}
            style={{ opacity: originOpacity, y: originShift }}
            className="absolute inset-0 flex items-center pb-14 pt-24"
          >
            <OriginCopy reduced={reduced} onNavigate={onNavigate} />
          </motion.div>

          <motion.div
            ref={connectionPanelRef}
            style={{ opacity: connectionOpacity, y: connectionShift }}
            className="absolute inset-0 flex items-center pb-14 pt-24"
          >
            <ConnectionCopy />
          </motion.div>
        </div>
      ) : (
        <>
          <div className="relative flex min-h-[92svh] w-full items-center pb-10 pt-24">
            <OriginCopy reduced={reduced} onNavigate={onNavigate} />
          </div>
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex min-h-[78svh] w-full items-center py-12"
          >
            <ConnectionCopy />
          </motion.div>
        </>
      )}
    </section>
  );
}
