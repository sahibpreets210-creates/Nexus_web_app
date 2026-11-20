import Reveal from '../components/Reveal';
import MarketDash from '../components/MarketDash';

const NOTES = [
  {
    title: 'Controls',
    body: 'Space, Arrow Up or W to jump — hold for a longer hop. P or Escape pauses. On touch devices, tap the game canvas or the jump button.',
  },
  {
    title: 'Offline ready',
    body: 'Once the site has loaded, a service worker caches the app shell, so Market Dash keeps running without a connection. Scores are stored on this device.',
  },
  {
    title: 'Scoring',
    body: 'Distance builds your base score and every knowledge token adds a bonus. Speed ramps up the longer a run lasts.',
  },
];

export default function Arcade() {
  return (
    <div className="page-top w-full pb-24">
      <div className="container-nexus">
        <header className="mx-auto max-w-3xl text-center">
          <p className="eyebrow justify-center">Nexus Arcade</p>
          <h1 className="display mt-5 text-[clamp(2rem,6vw,3.6rem)]">Market Dash</h1>
          <div className="mx-auto mt-6 h-[2px] w-16 rounded-full bg-gradient-to-r from-[#5af05a] to-[#3bd7c4]" />
          <p className="lead mx-auto mt-6 max-w-xl text-sm sm:text-base">
            Run the neon financial district. Jump the firewalls, collect knowledge tokens
            and hold your nerve as the market accelerates.
          </p>
        </header>

        <Reveal className="mt-12">
          <MarketDash />
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {NOTES.map((note, index) => (
            <Reveal key={note.title} delay={index * 0.06}>
              <article className="h-full rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <div className="flex items-baseline justify-between">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#f8f1ea]">
                    {note.title}
                  </h2>
                  <span className="font-mono text-[10px] text-[#5af05a]">0{index + 1}</span>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-[#a4a6a0]">{note.body}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <p className="mt-8 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-[#6f716c]">
          Built and rendered entirely on your device · no server round-trips during play
        </p>
      </div>
    </div>
  );
}
