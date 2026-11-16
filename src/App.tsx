import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react';
import { FRAMES } from './frames';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FinancialNetwork from './components/FinancialNetwork';

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

/** Frames decoded before the hero is revealed. The rest stream in behind it. */
const HERO_BOOTSTRAP_FRAMES = 8;

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const totalFrames = FRAMES.length;
  const progressPercent = Math.min(100, Math.round((loadedCount / totalFrames) * 100));

  const { scrollYProgress } = useScroll();
  const scrollProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 26, restDelta: 0.002 });

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

  // Frame preloader: reveal the site after the first frames, keep decoding the rest.
  useEffect(() => {
    let active = true;
    let settled = 0;
    const images: HTMLImageElement[] = [];

    const settle = () => {
      if (!active) return;
      settled += 1;
      setLoadedCount(settled);
      if (settled >= Math.min(HERO_BOOTSTRAP_FRAMES, totalFrames)) {
        setIsLoaded(true);
      }
    };

    FRAMES.forEach((src, idx) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = src;
      img.onload = settle;
      img.onerror = () => {
        console.warn(`[nexus] frame unavailable: ${src}`);
        settle();
      };
      images[idx] = img;
    });

    imagesRef.current = images;

    // Never trap a visitor behind a stalled network request.
    const escape = window.setTimeout(() => {
      if (active) setIsLoaded(true);
    }, 3000);

    return () => {
      active = false;
      window.clearTimeout(escape);
    };
  }, [totalFrames]);

  // Stable frame painter shared with the hero. Frames are blended on screen so
  // the circuit artwork sits over the financial network without a black plate.
  const drawFrame = useCallback((canvas: HTMLCanvasElement | null, frameIndex: number) => {
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imagesRef.current[frameIndex];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!img || !img.complete || !img.naturalWidth || !img.naturalHeight) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Cover-fit so the particle field fills any viewport without letterboxing.
    const ratio = Math.max(canvasWidth / img.naturalWidth, canvasHeight / img.naturalHeight);
    const width = img.naturalWidth * ratio;
    const height = img.naturalHeight * ratio;
    const x = (canvasWidth - width) / 2;
    const y = (canvasHeight - height) / 2;

    ctx.globalCompositeOperation = 'screen';
    ctx.drawImage(img, x, y, width, height);
    ctx.globalCompositeOperation = 'source-over';
  }, []);

  const renderPage = () => {
    switch (currentPath) {
      case '/':
        return (
          <Home
            isLoaded={isLoaded}
            totalFrames={totalFrames}
            drawFrame={drawFrame}
            onNavigate={handleNavigate}
          />
        );
      case '/about':
        return <About onNavigate={handleNavigate} />;
      case '/team':
        return <Team />;
      case '/arcade':
        return <Arcade />;
      case '/contact':
        return <Contact />;
      default:
        return (
          <Home
            isLoaded={isLoaded}
            totalFrames={totalFrames}
            drawFrame={drawFrame}
            onNavigate={handleNavigate}
          />
        );
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#121316] text-[#d9d9d9] flex flex-col selection:bg-[#5af05a]/25 selection:text-white">
      {/* Shared financial network field, mounted once for the whole app */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#121316]">
        <FinancialNetwork className="absolute inset-0 h-full w-full opacity-70" />
        <div className="absolute inset-0 grid-veil opacity-50" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#121316] via-[#121316]/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#121316] to-transparent" />
      </div>

      {/* Scroll progress */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX: scrollProgress }}
        className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-gradient-to-r from-[#5af05a] via-[#8dffb0] to-[#3bd7c4]"
      />

      {/* 1. Preloader — non-blocking after the first hero frames */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            key="nexus-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            role="status"
            aria-live="polite"
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-[#121316] px-6"
          >
            <div className="w-full max-w-xs">
              <div className="mb-8 flex items-center gap-3">
                <span className="brand-mark" aria-hidden="true">
                  <img src="/brand/nexus-logo.jpeg" alt="" />
                </span>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#f8f1ea]">Nexus</p>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[#6f716c]">Core sync</p>
                </div>
              </div>

              <div className="mb-3 flex items-end justify-between">
                <span className="text-[10px] uppercase tracking-[0.24em] text-[#a4a6a0]">
                  Loading visual core
                </span>
                <span className="font-mono text-xs text-[#5af05a]">{progressPercent}%</span>
              </div>

              <div className="h-[2px] w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#5af05a] to-[#8dffb0] transition-[width] duration-200"
                  style={{ width: `${Math.max(6, progressPercent)}%` }}
                />
              </div>

              <p className="mt-4 font-mono text-[10px] text-[#6f716c]">
                {loadedCount} / {totalFrames} sequences decoded
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Navigation */}
      <Navbar currentPath={currentPath} onNavigate={handleNavigate} />

      {/* 3. Page content */}
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

      {/* 4. Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
