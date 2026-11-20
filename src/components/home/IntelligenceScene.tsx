import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useInView, useTransform } from 'motion/react';
import { useScene } from '../../animation/sceneTimeline';
import Reveal from '../Reveal';
import SceneMarker from './SceneMarker';

interface IntelligenceSceneProps {
  reduced: boolean;
}

/**
 * Genuine counts, read from this site's own structure. Nothing here is
 * modelled, estimated or invented.
 */
const STATS = [
  { label: 'Core members', value: 7, note: 'The full core listed on the team page.' },
  { label: 'Strategic pillars', value: 3, note: 'Potentia, Communitas, Educatus.' },
  { label: 'Live routes', value: 5, note: 'Home, about, team, arcade and contact.' },
  { label: 'Arcade titles', value: 1, note: 'Market Dash, running in the browser.' },
];

const DIMENSIONS = [
  {
    name: 'Engineering',
    pillar: 'Potentia',
    summary: 'Systems, interfaces and the discipline of shipping something that holds.',
    detail:
      'Developing deep technical mastery, visual frameworks and high-performance system architecture to challenge limits and pioneer digital engineering.',
  },
  {
    name: 'Markets',
    pillar: 'Communitas',
    summary: 'Market structure, capital literacy and the analysis behind the numbers.',
    detail:
      'Fellowship around a shared financial vocabulary — reading markets, comparing signals and understanding how capital actually moves.',
  },
  {
    name: 'Growth',
    pillar: 'Educatus',
    summary: 'Mentorship and shared documentation that lift the whole community.',
    detail:
      'Empowering peers through mentorship, shared documentation of experimental libraries and rigorous technological bootcamps.',
  },
];

/* ------------------------------- Counter -------------------------------- */

function Counter({ value, reduced }: { value: number; reduced: boolean }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (reduced) {
      element.textContent = String(value).padStart(2, '0');
      return;
    }
    if (!inView) return;

    const controls = animate(0, value, {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        element.textContent = String(Math.round(latest)).padStart(2, '0');
      },
    });
    return () => controls.stop();
  }, [inView, reduced, value]);

  return (
    <span ref={ref} aria-label={`${value}`}>
      {String(value).padStart(2, '0')}
    </span>
  );
}

/* ---------------------------- Dimension card ----------------------------- */

function DimensionCard({ item, index }: { item: (typeof DIMENSIONS)[number]; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <Reveal delay={index * 0.06}>
      <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(160deg,rgba(27,29,35,0.9),rgba(17,18,22,0.72))] transition-colors duration-300 hover:border-[#5af05a]/40 focus-within:border-[#5af05a]/40">
        <div className="panel-sheen" />
        <div className="relative flex flex-col gap-3 p-6 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#5af05a]">
                0{index + 1}
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#6f716c]">
                {item.pillar}
              </span>
            </div>
            <h3 className="mt-3 text-base font-semibold uppercase tracking-[0.12em] text-[#f8f1ea]">
              {item.name}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#a4a6a0]">{item.summary}</p>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls={`dimension-panel-${index}`}
            className="flex min-h-[36px] shrink-0 items-center gap-2 self-start rounded-full border border-white/10 px-3.5 py-1.5 text-[9px] uppercase tracking-[0.2em] text-[#c8cac4] transition-colors hover:border-[#5af05a]/45 hover:text-[#5af05a]"
          >
            {open ? 'Close' : 'Detail'}
            <span aria-hidden="true" className="text-[#5af05a]">
              {open ? '−' : '+'}
            </span>
          </button>
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id={`dimension-panel-${index}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="relative overflow-hidden"
            >
              <p className="border-t border-white/[0.07] px-6 py-4 text-xs leading-relaxed text-[#c8cac4]">
                {item.detail}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </article>
    </Reveal>
  );
}

/* ---------------------------- Constellation ------------------------------ */

const PLOT_POINTS = [
  { x: 46, y: 104 },
  { x: 122, y: 74 },
  { x: 208, y: 96 },
  { x: 288, y: 58 },
];

const PLOT_PATH =
  'M46 104 C 78 90, 96 76, 122 74 C 154 72, 178 98, 208 96 C 238 94, 262 76, 288 58';

function Constellation({ reduced, progress }: { reduced: boolean; progress: ReturnType<typeof useScene> }) {
  const pathLength = useTransform(progress, [0.1, 0.72], [0, 1]);

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 334 150"
      className="h-auto w-full"
      role="presentation"
    >
      <defs>
        <linearGradient id="nexus-plot-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3bd7c4" />
          <stop offset="55%" stopColor="#5af05a" />
          <stop offset="100%" stopColor="#8dffb0" />
        </linearGradient>
      </defs>

      {[38, 74, 110, 146].map((y) => (
        <line
          key={y}
          x1="18"
          y1={y}
          x2="316"
          y2={y}
          stroke="rgba(248, 241, 234, 0.07)"
          strokeWidth="1"
        />
      ))}

      {PLOT_POINTS.map((point, index) => (
        <line
          key={`tick-${point.x}`}
          x1={point.x}
          y1={point.y}
          x2={point.x}
          y2="146"
          stroke="rgba(90, 240, 90, 0.08)"
          strokeWidth="1"
          strokeDasharray={index === 0 ? undefined : '2 6'}
        />
      ))}

      <motion.path
        d={PLOT_PATH}
        fill="none"
        stroke="url(#nexus-plot-line)"
        strokeWidth="1.6"
        strokeLinecap="round"
        style={{ pathLength: reduced ? 1 : pathLength }}
      />

      {PLOT_POINTS.map((point, index) => (
        <g key={`point-${point.x}`}>
          <circle cx={point.x} cy={point.y} r="9" fill="rgba(90, 240, 90, 0.09)" />
          <circle cx={point.x} cy={point.y} r="3" fill="#d8ffdd" />
          <circle cx={point.x} cy={point.y} r="5.5" fill="none" stroke="rgba(90, 240, 90, 0.45)" />
          <text
            x={point.x}
            y={point.y - 16}
            textAnchor="middle"
            fontSize="9"
            fill="rgba(248, 241, 234, 0.65)"
            fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          >
            {String(STATS[index].value).padStart(2, '0')}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* -------------------------------- Scene --------------------------------- */

export default function IntelligenceScene({ reduced }: IntelligenceSceneProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const progress = useScene('intelligence', sectionRef, 'flow', 0, 0.85);

  return (
    <section ref={sectionRef} aria-labelledby="intelligence-title" className="relative w-full">
      <div className="container-nexus section-pad">
        <div className="relative max-w-3xl">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-3 sm:-inset-x-10 -inset-y-8 -z-10 bg-[radial-gradient(ellipse_at_left,rgba(18,19,22,0.92)_0%,rgba(18,19,22,0.55)_55%,transparent_80%)]"
          />
          <SceneMarker index="Scene 03" title="The Intelligence" />
          <h2
            id="intelligence-title"
            className="display mt-6 text-[clamp(2rem,5.4vw,3.4rem)] text-[#f8f1ea]"
          >
            Signal <span className="text-[#a4a6a0]">over</span> noise.
          </h2>
          <p className="lead mt-5 max-w-xl text-sm sm:text-base">
            The network stops drifting and starts measuring. Every region of the graph maps
            to a discipline the core actually practises — engineering, markets and the
            shared growth that connects them.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-12">
          <div className="flex flex-col gap-4 lg:col-span-7">
            {DIMENSIONS.map((item, index) => (
              <DimensionCard key={item.name} item={item} index={index} />
            ))}
          </div>

          <Reveal delay={0.08} className="lg:col-span-5">
            <div className="panel h-full p-6 sm:p-7">
              <div className="panel-sheen" />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[#8fe6a2]">
                    Nexus footprint
                  </p>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#6f716c]">
                    Verified site counts
                  </p>
                </div>
                <span className="flex items-center gap-2 rounded-full border border-[#5af05a]/25 bg-[#5af05a]/[0.06] px-3 py-1 text-[9px] uppercase tracking-[0.18em] text-[#8fe6a2]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#5af05a]" aria-hidden="true" />
                  Live
                </span>
              </div>

              <div className="relative mt-6">
                <Constellation reduced={reduced} progress={progress} />
              </div>

              <dl className="relative mt-5 grid grid-cols-2 gap-3">
                {STATS.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3"
                  >
                    <dd className="font-mono text-2xl leading-none text-[#f8f1ea]">
                      <Counter value={stat.value} reduced={reduced} />
                    </dd>
                    <dt className="mt-2 text-[9px] uppercase tracking-[0.2em] text-[#8f918b]">
                      {stat.label}
                    </dt>
                  </div>
                ))}
              </dl>

              <p className="relative mt-4 text-[10px] leading-relaxed text-[#6f716c]">
                Counts are read directly from this site&apos;s own structure. No market
                figures, projections or performance claims are shown or implied.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
