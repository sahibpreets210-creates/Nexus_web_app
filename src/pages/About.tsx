import Reveal from '../components/Reveal';

interface AboutProps {
  onNavigate: (path: string) => void;
}

const VALUES = [
  {
    title: 'Power',
    tag: 'Potentia',
    desc: 'Developing deep technical mastery, visual frameworks, and high-performance system architectures to challenge limits and pioneer digital engineering.',
  },
  {
    title: 'Fellowship',
    tag: 'Communitas',
    desc: 'Fostering tight-knit collaborations where top engineers, programmers, and artists synchronize to coordinate advanced web and native builds.',
  },
  {
    title: 'Growth',
    tag: 'Educatus',
    desc: 'Empowering community peers through mentorship, shared documentation of experimental libraries, and rigorous technological bootcamps.',
  },
];

export default function About({ onNavigate }: AboutProps) {
  return (
    <div className="page-top w-full pb-24">
      <div className="container-nexus">
        {/* Header */}
        <header className="mx-auto max-w-3xl text-center">
          <p className="eyebrow justify-center">About Us</p>
          <h1 className="display mt-5 text-[clamp(2.2rem,6.4vw,4rem)]">The Nexus.</h1>
          <div className="mx-auto mt-6 h-[2px] w-16 rounded-full bg-gradient-to-r from-[#5af05a] to-[#3bd7c4]" />
          <p className="lead mx-auto mt-6 max-w-xl text-sm sm:text-base">
            A student-led technology and finance collective building technical depth,
            financial intelligence and collaborative leadership.
          </p>
        </header>

        {/* Mission & Vision */}
        <div className="mt-14 grid items-stretch gap-6 md:grid-cols-2">
          <Reveal>
            <article className="panel h-full p-7 sm:p-9">
              <div className="panel-sheen" />
              <div className="relative flex items-start justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#5af05a]/25 bg-[#5af05a]/10 text-[#5af05a]">
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#6f716c]">
                  Protocol I
                </span>
              </div>
              <h2 className="relative mt-6 text-lg font-semibold uppercase tracking-[0.1em] text-[#f8f1ea]">
                Our Mission
              </h2>
              <p className="relative mt-3 text-sm leading-relaxed text-[#a4a6a0]">
                To empower the student community at Amity International School, Vasundhara
                Sector-1 by providing unparalleled access to peer mentorship, resources, and
                hands-on opportunities in technology and finance. We bridge the gap between
                academic theory and advanced technical execution.
              </p>
            </article>
          </Reveal>

          <Reveal delay={0.08}>
            <article className="panel h-full p-7 sm:p-9">
              <div className="panel-sheen" />
              <div className="relative flex items-start justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#3bd7c4]/25 bg-[#3bd7c4]/10 text-[#7ee8da]">
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#6f716c]">
                  Protocol II
                </span>
              </div>
              <h2 className="relative mt-6 text-lg font-semibold uppercase tracking-[0.1em] text-[#f8f1ea]">
                Our Vision
              </h2>
              <p className="relative mt-3 text-sm leading-relaxed text-[#a4a6a0]">
                To cultivate a lasting legacy of technological innovation, financial
                intelligence, and collaborative capability. We strive to prepare the builders
                of tomorrow to actively shape and lead the autonomous digital frontier with
                integrity and technical mastery.
              </p>
            </article>
          </Reveal>
        </div>

        {/* Core architecture */}
        <section className="mt-20" aria-labelledby="core-architecture">
          <div className="flex flex-col gap-3">
            <p className="text-[10px] uppercase tracking-[0.26em] text-[#7f817b]">
              Operational Standards
            </p>
            <h2
              id="core-architecture"
              className="display text-[clamp(1.6rem,4vw,2.5rem)]"
            >
              Our Core Architecture
            </h2>
          </div>

          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {VALUES.map((value, index) => (
              <Reveal key={value.title} delay={index * 0.07}>
                <article className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(160deg,rgba(27,29,35,0.9),rgba(17,18,22,0.75))] p-7 transition-colors duration-300 hover:border-[#5af05a]/40">
                  <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#5af05a]/[0.07] blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#5af05a]">
                      0{index + 1}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#6f716c]">
                      {value.tag}
                    </span>
                  </div>
                  <h3 className="relative mt-6 text-base font-semibold uppercase tracking-[0.12em] text-[#f8f1ea]">
                    {value.title}
                  </h3>
                  <p className="relative mt-3 text-xs leading-relaxed text-[#a4a6a0]">
                    {value.desc}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* CTA */}
        <Reveal>
          <div className="panel mt-16 overflow-hidden px-6 py-12 text-center sm:px-12">
            <div className="panel-sheen" />
            <h2 className="display relative text-[clamp(1.7rem,4.4vw,2.6rem)]">
              Want to know more?
            </h2>
            <p className="lead relative mx-auto mt-4 max-w-xl text-sm">
              Get in touch with the core syndicate or explore our full team. Let&apos;s form
              connections and link intelligence.
            </p>
            <div className="relative mx-auto mt-8 flex w-full max-w-sm flex-col gap-3 sm:flex-row sm:justify-center">
              <button type="button" onClick={() => onNavigate('/team')} className="btn btn-quiet w-full sm:w-auto">
                Explore Team
              </button>
              <button type="button" onClick={() => onNavigate('/contact')} className="btn btn-primary w-full sm:w-auto">
                Contact Us
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
