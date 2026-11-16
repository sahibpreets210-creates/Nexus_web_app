import { useRef } from 'react';
import { motion, useTransform } from 'motion/react';
import { useScene } from '../../animation/sceneTimeline';
import Reveal from '../Reveal';
import SceneMarker from './SceneMarker';

interface ExperienceSceneProps {
  reduced: boolean;
  onNavigate: (path: string) => void;
}

const TAGS = ['Keyboard + touch', 'Local high scores', 'Works offline'];

export default function ExperienceScene({ reduced, onNavigate }: ExperienceSceneProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const progress = useScene('experience', sectionRef, 'flow', 0, 0.9);
  const portalScale = useTransform(progress, [0, 0.6], [0.94, 1]);
  const portalOpacity = useTransform(progress, [0, 0.28], [0.55, 1]);

  return (
    <section ref={sectionRef} aria-labelledby="experience-title" className="relative w-full">
      <div className="container-nexus section-pad">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal className="relative">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-x-3 sm:-inset-x-8 -inset-y-10 -z-10 bg-[radial-gradient(ellipse_at_left,rgba(18,19,22,0.94)_0%,rgba(18,19,22,0.6)_52%,transparent_78%)]"
            />
            <SceneMarker index="Scene 05" title="The Experience" />

            <h2
              id="experience-title"
              className="display mt-6 text-[clamp(2rem,5.4vw,3.4rem)] text-[#f8f1ea]"
            >
              Market Dash
            </h2>

            <p className="lead mt-5 max-w-lg text-sm sm:text-base">
              An original endless runner through a neon financial city. Jump the firewalls,
              collect knowledge tokens and push your high score — built entirely in the
              browser and playable offline once its assets are cached.
            </p>

            <ul className="mt-7 flex flex-wrap gap-2">
              {TAGS.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-[#5af05a]/25 bg-[#5af05a]/[0.06] px-3.5 py-1.5 text-[10px] uppercase tracking-[0.18em] text-[#8fe6a2]"
                >
                  {tag}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => onNavigate('/arcade')}
                className="btn btn-primary w-full sm:w-auto"
              >
                Play Market Dash
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/about')}
                className="btn btn-quiet w-full sm:w-auto"
              >
                About the club
              </button>
            </div>

            <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#6f716c]">
              Arcade / 01 · runs on this device · no server round-trips
            </p>
          </Reveal>

          <motion.div
            style={{ scale: reduced ? 1 : portalScale, opacity: reduced ? 1 : portalOpacity }}
            className="relative mx-auto aspect-square w-full max-w-[440px] overflow-hidden"
          >
            {/* Portal entrance */}
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(90,240,90,0.12),transparent_62%)]"
            />
            <div aria-hidden="true" className="nexus-portal-ring absolute inset-[4%] rounded-full border border-dashed border-[#5af05a]/25" />
            <div
              aria-hidden="true"
              className="nexus-portal-ring nexus-portal-ring--reverse absolute inset-[13%] rounded-full border border-[#3bd7c4]/25"
            />
            <div aria-hidden="true" className="nexus-portal-ring absolute inset-[22%] rounded-full border border-dashed border-[#5af05a]/20" />

            <div className="absolute inset-[24%] overflow-hidden rounded-full border border-[#5af05a]/35 bg-[radial-gradient(circle_at_50%_38%,rgba(90,240,90,0.24),rgba(12,16,18,0.94)_68%)] shadow-[0_0_70px_-12px_rgba(90,240,90,0.55)] sm:inset-[30%]">
              <div className="relative flex h-full w-full flex-col items-center justify-center gap-1.5 px-3 text-center sm:gap-2 sm:px-4">
                <span className="brand-mark scale-90">
                  <img src="/brand/nexus-logo.jpeg" alt="" />
                </span>
                <span className="text-[8px] uppercase tracking-[0.24em] text-[#8fe6a2] sm:text-[9px]">
                  Arcade / 01
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#f8f1ea] sm:text-sm">
                  Market Dash
                </span>
                <span className="font-mono text-[8px] tracking-[0.14em] text-[#6f716c] sm:text-[9px]">
                  SCORE 0000
                </span>
              </div>
            </div>

            {/* Orbit markers */}
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-[6%] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#5af05a] shadow-[0_0_12px_rgba(90,240,90,0.9)]"
            />
            <span
              aria-hidden="true"
              className="absolute bottom-[12%] left-[10%] h-1.5 w-1.5 rounded-full bg-[#7ee8da] shadow-[0_0_12px_rgba(126,232,218,0.8)]"
            />
            <span
              aria-hidden="true"
              className="absolute right-[12%] top-[26%] h-1 w-1 rounded-full bg-[#8dffb0]"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
