import { useNexusMotion } from '../animation/director';
import OriginsStage from '../components/home/OriginsStage';
import IntelligenceScene from '../components/home/IntelligenceScene';
import PeopleScene from '../components/home/PeopleScene';
import ExperienceScene from '../components/home/ExperienceScene';
import ConvergenceScene from '../components/home/ConvergenceScene';

interface HomeProps {
  onNavigate: (path: string) => void;
}

/**
 * The homepage as one continuous native scroll narrative: origin, connection,
 * intelligence, people, experience, convergence. All scroll-linked state comes
 * from the shared director; the canvas field is mounted once at the app shell.
 */
export default function Home({ onNavigate }: HomeProps) {
  const { reduced, compact, staged } = useNexusMotion();

  return (
    <div
      className="relative w-full"
      data-motion={staged ? 'staged' : compact ? 'compact' : 'static'}
    >
      <OriginsStage staged={staged} reduced={reduced} onNavigate={onNavigate} />
      <IntelligenceScene reduced={reduced} />
      <PeopleScene reduced={reduced} onNavigate={onNavigate} />
      <ExperienceScene reduced={reduced} onNavigate={onNavigate} />
      <ConvergenceScene staged={staged} reduced={reduced} onNavigate={onNavigate} />
    </div>
  );
}
