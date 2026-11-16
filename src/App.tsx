import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useSpring } from 'motion/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FinancialNetwork from './components/FinancialNetwork';
import NexusField from './components/NexusField';
import { director } from './animation/director';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Team from './pages/Team';
import Contact from './pages/Contact';
import Arcade from './pages/Arcade';

const ROUTE_TITLES: Record<string, string> = {
  '/': 'Nexus — Technology & Finance Club',
  '/about': 'About — Nexus',
  '/team': 'Team — Nexus',
  '/arcade': 'Nexus Arcade — Market Dash',
  '/contact': 'Contact — Nexus',
};

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const isHome = currentPath === '/';

  // One progress value for the whole document, fed by the shared director.
  const scrollProgress = useSpring(director.pageProgress, {
    stiffness: 120,
    damping: 26,
    restDelta: 0.002,
  });

  // Keep the single scroll director running for the app-wide progress bar even
  // when the homepage scenes are not mounted. It still pauses when the tab is
  // hidden.
  useEffect(() => director.subscribe(() => undefined), []);

  // Listen to browser popstate so back/forward navigation stays correct
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Keep the document title in sync with the active route
  useEffect(() => {
    document.title = ROUTE_TITLES[currentPath] ?? ROUTE_TITLES['/'];
  }, [currentPath]);

  const handleNavigate = useCallback((path: string) => {
    if (path === window.location.pathname) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    window.history.pushState(null, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  const renderPage = () => {
    switch (currentPath) {
      case '/':
        return <Home onNavigate={handleNavigate} />;
      case '/about':
        return <About onNavigate={handleNavigate} />;
      case '/team':
        return <Team />;
      case '/arcade':
        return <Arcade />;
      case '/contact':
        return <Contact />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="relative min-h-screen w-full text-[#d9d9d9] flex flex-col selection:bg-[#5af05a]/25 selection:text-white">
      {/* Homepage: the shared six-scene network field. Other routes keep the
          quieter ambient financial network. */}
      {isHome ? (
        <NexusField />
      ) : (
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#121316]">
          <FinancialNetwork className="absolute inset-0 h-full w-full opacity-70" />
          <div className="absolute inset-0 grid-veil opacity-50" />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#121316] via-[#121316]/70 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#121316] to-transparent" />
        </div>
      )}

      {/* Scroll progress */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX: scrollProgress }}
        className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-gradient-to-r from-[#5af05a] via-[#8dffb0] to-[#3bd7c4]"
      />

      {/* 1. Navigation */}
      <Navbar currentPath={currentPath} onNavigate={handleNavigate} />

      {/* 2. Page content */}
      <main id="main" className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPath}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.32, ease: 'easeInOut' }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
