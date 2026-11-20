import { useRef, useState } from 'react';
import { motion, useTransform } from 'motion/react';
import { MEMBERS } from '../../data/team';
import type { TeamMember } from '../../data/team';
import { useScene } from '../../animation/sceneTimeline';
import Reveal from '../Reveal';
import SceneMarker from './SceneMarker';

interface PeopleSceneProps {
  reduced: boolean;
  onNavigate: (path: string) => void;
}

/** Branches that connect the network trunk to the core columns. */
const BRANCHES = [
  'M600 4 C 600 96, 200 80, 200 210',
  'M600 4 C 600 96, 600 100, 600 210',
  'M600 4 C 600 96, 1000 80, 1000 210',
  'M600 4 C 600 62, 400 60, 400 210',
  'M600 4 C 600 62, 800 60, 800 210',
  'M200 210 C 200 250, 200 268, 200 300',
  'M400 210 C 400 250, 400 268, 400 300',
  'M600 210 C 600 250, 600 268, 600 300',
  'M800 210 C 800 250, 800 268, 800 300',
  'M1000 210 C 1000 250, 1000 268, 1000 300',
];

function PersonCard({ member, index }: { member: TeamMember; index: number }) {
  const [failed, setFailed] = useState(false);
  const showPhoto = Boolean(member.imageUrl) && !failed;

  return (
    <Reveal delay={Math.min(index * 0.05, 0.32)} className="h-full">
      <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#15171b]/85 transition-colors duration-300 hover:border-[#5af05a]/45 focus-within:border-[#5af05a]/45">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#101215]">
          {showPhoto ? (
            <img
              src={member.imageUrl}
              alt={`${member.name}, ${member.role} of Nexus`}
              loading="lazy"
              decoding="async"
              width={480}
              height={600}
              onError={() => setFailed(true)}
              className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            />
          ) : (
            <div
              className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_50%_35%,rgba(90,240,90,0.14),transparent_60%)]"
              role="img"
              aria-label={`${member.name} — photograph not available`}
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-[#5af05a]/40 bg-[#121316] text-xl font-semibold text-[#5af05a]">
                {member.avatarLetter}
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#7f817b]">
                Nexus Core
              </span>
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#15171b] via-[#15171b]/20 to-transparent" />
        </div>

        <div className="relative -mt-8 flex flex-1 flex-col px-3.5 pb-4 sm:px-4 sm:pb-5">
          <h3 className="text-sm font-semibold leading-tight tracking-tight text-[#f8f1ea] sm:text-base">
            {member.name}
          </h3>
          <p className="mt-1 text-[9px] uppercase tracking-[0.22em] text-[#5af05a]">
            {member.role}
          </p>
        </div>
      </article>
    </Reveal>
  );
}

export default function PeopleScene({ reduced, onNavigate }: PeopleSceneProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const progress = useScene('people', sectionRef, 'flow', 0, 0.9);
  const pathLength = useTransform(progress, [0.04, 0.6], [0, 1]);
  const branchOpacity = useTransform(progress, [0, 0.32], [0.12, 0.6]);

  return (
    <section ref={sectionRef} aria-labelledby="people-title" className="relative w-full">
      <div className="container-nexus section-pad">
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex justify-center">
            <SceneMarker index="Scene 04" title="The People" />
          </div>
          <h2 id="people-title" className="display mt-6 text-[clamp(2rem,5.4vw,3.4rem)] text-[#f8f1ea]">
            The people behind the signal.
          </h2>
          <p className="lead mx-auto mt-5 max-w-xl text-sm sm:text-base">
            The analysts, builders and designers steering Nexus — the network branches into
            the core that keeps it moving.
          </p>
        </div>

        <div className="relative mt-14">
          <svg
            aria-hidden="true"
            viewBox="0 0 1200 320"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-x-0 -top-4 h-[260px] w-full"
          >
            <defs>
              <linearGradient id="nexus-branch" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5af05a" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#3bd7c4" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            <motion.g style={{ opacity: reduced ? 0.5 : branchOpacity }}>
              {BRANCHES.map((d) => (
                <motion.path
                  key={d}
                  d={d}
                  fill="none"
                  stroke="url(#nexus-branch)"
                  strokeWidth="1"
                  strokeLinecap="round"
                  style={{ pathLength: reduced ? 1 : pathLength }}
                />
              ))}
              <circle cx="600" cy="4" r="3.5" fill="#5af05a" />
              <circle cx="600" cy="4" r="9" fill="rgba(90, 240, 90, 0.18)" />
            </motion.g>
          </svg>

          <div className="relative grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
            {MEMBERS.map((member, index) => (
              <PersonCard key={member.name} member={member} index={index} />
            ))}
          </div>
        </div>

        <Reveal>
          <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-5 sm:flex-row">
            <p className="text-center text-xs leading-relaxed text-[#a4a6a0] sm:text-left">
              Seven core members, one — reach out for collaborations, mentorship
              or club announcements.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('/team')}
              className="btn btn-quiet w-full shrink-0 sm:w-auto"
            >
              Full team
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
