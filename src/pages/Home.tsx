import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import Reveal from '../components/Reveal';

interface HomeProps {
  isLoaded: boolean;
  totalFrames: number;
  drawFrame: (canvas: HTMLCanvasElement | null, frameIndex: number) => void;
  onNavigate: (path: string) => void;
}

const PILLARS = [
  { label: 'Potentia', hint: 'Power' },
  { label: 'Communitas', hint: 'Fellowship' },
  { label: 'Educatus', hint: 'Growth' },
];

export default function Home({ isLoaded, totalFrames, drawFrame, onNavigate }: HomeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);

  // Size the hero canvas and animate frame transitions with one shared loop.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      drawFrame(canvas, currentFrameRef.current);
    };

    resize();
    window.addEventListener('resize', resize);

    let rafId = 0;
    const tick = () => {
      const target = targetFrameRef.current;
      const current = currentFrameRef.current;
      if (target !== current) {
        // Ease toward the scroll target so fast wheels don't strobe frames.
        const step = Math.max(1, Math.round(Math.abs(target - current) / 3));
        const next = current < target ? Math.min(target, current + step) : Math.max(target, current - step);
        currentFrameRef.current = next;
        drawFrame(canvas, next);
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafId);
    };
  }, [drawFrame, isLoaded]);

  // Map hero scroll progress onto the frame sequence.
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const totalScrollable = Math.max(1, rect.height - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / totalScrollable));

      targetFrameRef.current = Math.min(
        totalFrames - 1,
        Math.floor(progress * totalFrames)
      );
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [totalFrames]);

  return (
    <div className="relative w-full">
      {/* ============================= HERO ============================= */}
      <section ref={containerRef} className="relative h-[280vh] w-full" aria-label="Nexus introduction">
        <div className="sticky top-0 z-0 h-[100svh] w-full overflow-hidden">
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="absolute inset-0 h-full w-full opacity-90 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_45%,transparent_0%,#121316_72%)] opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#121316] via-[#121316]/70 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#121316] to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#121316] to-transparent" />
        </div>

        <div className="absolute inset-x-0 top-0 z-10">
          {/* Segment 1 — introduction */}
          <div className="flex min-h-[100svh] items-center pb-16 pt-28 md:pb-24">
            <div className="container-nexus">
              <div className="max-w-3xl">
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={isLoaded ? { opacity: 1, y: 0 } : undefined}
                  transition={{ duration: 0.6 }}
                  className="eyebrow"
                >
                  Visionary Syndicate
                </motion.p>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={isLoaded ? { opacity: 1, y: 0 } : undefined}
                  transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="display mt-5 text-[clamp(2.4rem,8.6vw,5.2rem)] text-[#f8f1ea]"
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
                  initial={{ opacity: 0, y: 16 }}
                  animate={isLoaded ? { opacity: 1, y: 0 } : undefined}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="lead mt-7 max-w-2xl text-sm sm:text-base"
                >
                  Nexus is the in-house technology and finance club of Amity International
                  School, Vasundhara Sector-1. We are a collective of forward-thinking
                  creators, developers, and finance enthusiasts. We push the boundaries of
                  digital and economic frontiers, building robust pipelines of collective
                  intelligence.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={isLoaded ? { opacity: 1, y: 0 } : undefined}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
                >
                  <button type="button" onClick={() => onNavigate('/about')} className="btn btn-primary w-full sm:w-auto">
                    Explore Nexus
                  </button>
                  <button type="button" onClick={() => onNavigate('/arcade')} className="btn btn-ghost w-full sm:w-auto">
                    Enter the arcade
                  </button>
                </motion.div>

                <div className="mt-12 flex items-center gap-4 text-[10px] uppercase tracking-[0.24em] text-[#7f817b]">
                  <div className="flex h-10 w-6 items-start justify-center rounded-full border border-white/15 p-1.5">
                    <motion.span
                      aria-hidden="true"
                      animate={{ y: [0, 12, 0] }}
                      transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                      className="h-1.5 w-1.5 rounded-full bg-[#5af05a]"
                    />
                  </div>
                  <span>Scroll to sync</span>
                </div>
              </div>
            </div>
          </div>

          {/* Segment 2 — who we are */}
          <div className="flex min-h-[100svh] items-center">
            <div className="container-nexus">
              <div className="max-w-2xl md:mx-auto md:text-center">
                <p className="eyebrow">Core Pillars</p>
                <h2 className="display mt-5 text-[clamp(1.9rem,5vw,3.25rem)] text-[#f8f1ea]">
                  We are Nexus
                </h2>

                <div className="my-7 flex items-center gap-2 md:justify-center">
                  <span className="h-[1px] w-12 bg-[#5af05a]/30" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#5af05a] shadow-[0_0_14px_rgba(90,240,90,0.8)]" />
                  <span className="h-[1px] w-12 bg-[#5af05a]/30" />
                </div>

                <p className="lead text-sm sm:text-base">
                  An elite student tech-finance syndicate at Amity International School,
                  Vasundhara Sector-1. We push the frontiers of what is possible, bringing
                  together analytical developers, visual designers, and finance visionaries
                  to collaborate, learn, and build high-performance solutions for modern
                  challenges. Our alliance serves as a breeding ground for innovative
                  leadership and technical competence.
                </p>

                <ul className="mt-9 flex flex-wrap gap-2 md:justify-center">
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
              </div>
            </div>
          </div>

          {/* Segment 3 — call to action */}
          <div className="flex min-h-[100svh] items-center">
            <div className="container-nexus">
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="display text-[clamp(2.1rem,6.4vw,4rem)] text-[#f8f1ea]">
                  Foresee the unseen.
                </h2>
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
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================= ARCADE TEASER ============================= */}
      <section className="relative section-pad border-t border-white/[0.07]" aria-labelledby="arcade-teaser-title">
        <div className="container-nexus">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <Reveal>
              <p className="eyebrow">Nexus Arcade</p>
              <h2
                id="arcade-teaser-title"
                className="display mt-5 text-[clamp(2rem,5.6vw,3.4rem)] text-[#f8f1ea]"
              >
                Market Dash
              </h2>
              <p className="lead mt-5 max-w-lg text-sm sm:text-base">
                An original endless runner through a neon financial city. Jump the firewalls,
                collect knowledge tokens and push your high score — built entirely in the
                browser and playable offline once its assets are cached.
              </p>

              <ul className="mt-7 flex flex-wrap gap-2">
                {['Keyboard + touch', 'Local high scores', 'Works offline'].map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-[#5af05a]/25 bg-[#5af05a]/[0.06] px-3.5 py-1.5 text-[10px] uppercase tracking-[0.18em] text-[#8fe6a2]"
                  >
                    {tag}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={() => onNavigate('/arcade')} className="btn btn-primary w-full sm:w-auto">
                  Play Market Dash
                </button>
                <button type="button" onClick={() => onNavigate('/about')} className="btn btn-quiet w-full sm:w-auto">
                  About the club
                </button>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="panel overflow-hidden p-3">
                <div className="game-stage relative overflow-hidden rounded-xl border border-white/10 bg-[#0a1014]">
                  {/* Decorative illustration of the Market Dash world (not interactive) */}
                  <div aria-hidden="true" className="absolute inset-0">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(59,215,196,0.18),transparent_60%)]" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#0b1620,#0a1014_60%)]" />
                    <div className="absolute left-[8%] top-[24%] h-[34%] w-[10%] rounded-t-sm bg-[#14262c]" />
                    <div className="absolute left-[22%] top-[16%] h-[42%] w-[8%] rounded-t-sm bg-[#173039]" />
                    <div className="absolute left-[34%] top-[28%] h-[30%] w-[12%] rounded-t-sm bg-[#12242a]" />
                    <div className="absolute right-[26%] top-[12%] h-[46%] w-[9%] rounded-t-sm bg-[#173039]" />
                    <div className="absolute right-[10%] top-[26%] h-[32%] w-[11%] rounded-t-sm bg-[#14262c]" />
                    <div className="absolute inset-x-0 bottom-[26%] h-[1px] bg-[#5af05a]/50" />
                    <div className="absolute inset-x-0 bottom-0 h-[26%] bg-[linear-gradient(to_right,rgba(90,240,90,0.14)_1px,transparent_1px)] bg-[length:38px_100%]" />
                    <div className="absolute bottom-[8%] left-[18%] h-10 w-10 rotate-45 rounded-lg border border-[#5af05a]/70 bg-[#5af05a]/15 shadow-[0_0_24px_rgba(90,240,90,0.35)]" />
                    <div className="absolute bottom-[26%] right-[32%] h-12 w-4 rounded-sm bg-[#ff5f6d]/70 shadow-[0_0_20px_rgba(255,95,109,0.4)]" />
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0a1014] to-transparent" />
                  </div>
                  <div className="relative flex h-full flex-col justify-between p-4">
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-[#8fe6a2]">
                      <span>Market Dash</span>
                      <span className="text-[#6f716c]">Preview</span>
                    </div>
                    <div className="flex items-center justify-between font-mono text-[10px] text-[#7f817b]">
                      <span>SCORE 0000</span>
                      <span>HI 0000</span>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================= CLOSING BAND ============================= */}
      <section className="relative section-pad pt-0" aria-labelledby="home-connect-title">
        <div className="container-nexus">
          <Reveal>
            <div className="panel px-6 py-10 sm:px-10 md:py-12">
              <div className="panel-sheen" />
              <div className="relative flex flex-col items-start justify-between gap-7 md:flex-row md:items-center">
                <div>
                  <p className="eyebrow">Protocol III</p>
                  <h2 id="home-connect-title" className="display mt-4 text-[clamp(1.6rem,4vw,2.4rem)]">
                    Link intelligence with us
                  </h2>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#a4a6a0]">
                    Join the syndicate, collaborate on builds, or open a direct channel with
                    the core team.
                  </p>
                </div>
                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                  <button type="button" onClick={() => onNavigate('/team')} className="btn btn-quiet w-full sm:w-auto">
                    Our team
                  </button>
                  <button type="button" onClick={() => onNavigate('/contact')} className="btn btn-primary w-full sm:w-auto">
                    Contact us
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
