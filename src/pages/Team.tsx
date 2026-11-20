import { useState } from 'react';
import Reveal from '../components/Reveal';
import { MEMBERS } from '../data/team';
import type { TeamMember } from '../data/team';

function TeamCard({ member, index }: { member: TeamMember; index: number }) {
  const [imageFailed, setImageFailed] = useState(false);
  const showPhoto = Boolean(member.imageUrl) && !imageFailed;

  return (
    <Reveal delay={Math.min(index * 0.06, 0.36)} className="h-full">
      <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#15171b]/85 transition-colors duration-300 hover:border-[#5af05a]/45 focus-within:border-[#5af05a]/45">
        {/* Portrait */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#101215]">
          {showPhoto ? (
            <img
              src={member.imageUrl}
              alt={`${member.name}, ${member.role} of Nexus`}
              loading="lazy"
              decoding="async"
              width={640}
              height={800}
              onError={() => setImageFailed(true)}
              className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div
              className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_50%_35%,rgba(90,240,90,0.14),transparent_60%)]"
              role="img"
              aria-label={`${member.name} — photograph not available`}
            >
              <span className="flex h-20 w-20 items-center justify-center rounded-full border border-[#5af05a]/40 bg-[#121316] text-2xl font-semibold text-[#5af05a]">
                {member.avatarLetter}
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#7f817b]">
                Nexus Core
              </span>
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#15171b] via-[#15171b]/25 to-transparent" />
          <span className="absolute left-4 top-4 rounded-full border border-[#5af05a]/25 bg-[#0d0f11]/70 px-3 py-1 text-[9px] uppercase tracking-[0.2em] text-[#8fe6a2] backdrop-blur">
            Core
          </span>
        </div>

        {/* Identity */}
        <div className="relative -mt-10 flex flex-1 flex-col px-5 pb-6">
          <h3 className="text-lg font-semibold tracking-tight text-[#f8f1ea]">
            {member.name}
          </h3>
          <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-[#5af05a]">
            {member.role}
          </p>
          <div className="mt-4 h-[1px] w-full bg-gradient-to-r from-[#5af05a]/30 via-white/10 to-transparent" />
          <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-[#7f817b]">
            Amity International School
            <br />
            Vasundhara Sector-1
          </p>
        </div>
      </article>
    </Reveal>
  );
}

export default function Team() {
  return (
    <div className="page-top w-full pb-24">
      <div className="container-nexus">
        <header className="mx-auto max-w-3xl text-center">
          <p className="eyebrow justify-center">The Core</p>
          <h1 className="display mt-5 text-[clamp(2.2rem,6vw,3.75rem)]">Our Team</h1>
          <div className="mx-auto mt-6 h-[2px] w-16 rounded-full bg-gradient-to-r from-[#5af05a] to-[#3bd7c4]" />
          <p className="lead mx-auto mt-6 max-w-xl text-sm sm:text-base">
            The analysts, builders and designers steering Nexus — the people behind the
            club&apos;s technology and finance initiatives.
          </p>
        </header>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MEMBERS.map((member, index) => (
            <TeamCard key={member.name} member={member} index={index} />
          ))}
        </div>

        <Reveal>
          <div className="panel mt-14 flex flex-col items-center gap-4 px-6 py-8 text-center sm:px-10">
            <div className="panel-sheen" />
            <h2 className="relative text-lg font-semibold uppercase tracking-[0.12em] text-[#f8f1ea]">
              Want to build with the core?
            </h2>
            <p className="relative max-w-lg text-sm leading-relaxed text-[#a4a6a0]">
              Reach out to the core team for collaborations, mentorship or club
              announcements.
            </p>
            <a href="mailto:nexusaisv1@gmail.com" className="btn btn-primary relative mt-2">
              nexusaisv1@gmail.com
            </a>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
