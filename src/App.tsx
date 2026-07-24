import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FRAMES } from './frames';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Team from './pages/Team';
import Contact from './pages/Contact';

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const totalFrames = FRAMES.length;
  const progressPercent = Math.min(100, Math.round((loadedCount / totalFrames) * 100));

  // Listen to browser popstate to make path-based routing robust
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (path: string) => {
    window.history.pushState(null, '', path);
    setCurrentPath(path);
    // Instant scroll to top on route change to match standard multi-page feeling
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  // Preloader of frames (Global, done only once for performance)
  useEffect(() => {
    let active = true;
    let loaded = 0;
    const images: HTMLImageElement[] = [];

    FRAMES.forEach((src, idx) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        if (!active) return;
        loaded++;
        setLoadedCount(loaded);
        if (loaded === totalFrames) {
          setIsLoaded(true);
        }
      };
      img.onerror = () => {
        if (!active) return;
        console.error(`Failed to load frame: ${src}`);
        loaded++;
        setLoadedCount(loaded);
        if (loaded === totalFrames) {
          setIsLoaded(true);
        }
      };
      images[idx] = img;
    });

    imagesRef.current = images;

    return () => {
      active = false;
    };
  }, [totalFrames]);

  // Shared frame drawer utility
  const drawFrame = (canvas: HTMLCanvasElement | null, frameIndex: number) => {
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imagesRef.current[frameIndex];
    if (!img || !img.complete) return;

    // Clear with solid black matching user's specification
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;

    // Contain formula fit inside current viewport
    const ratio = Math.min(canvasWidth / imgWidth, canvasHeight / imgHeight);
    const x = (canvasWidth - imgWidth * ratio) / 2;
    const y = (canvasHeight - imgHeight * ratio) / 2;
    const width = imgWidth * ratio;
    const height = imgHeight * ratio;

    ctx.drawImage(img, x, y, width, height);
  };

  // Router switch rendering with perfect exit/entrance transitions
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
        return <About />;
      case '/team':
        return <Team />;
      case '/contact':
        return <Contact />;
      default:
        // Graceful fallback to Home if path is unrecognized
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
    <div className="relative w-full bg-black min-h-screen text-white flex flex-col font-sans selection:bg-cyan-500/30 selection:text-white">
      
      {/* 1. Global Holographic Preloader */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            key="global-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
          >
            <div className="relative flex flex-col items-center max-w-xs w-full px-6">
              
              {/* Futuristic spinner rings */}
              <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border-t border-r border-neutral-800 border-t-cyan-500 border-r-cyan-400"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                  className="absolute inset-2 rounded-full border-b border-l border-neutral-900 border-b-cyan-600/50 border-l-cyan-500/50"
                />
                <span className="text-lg font-mono text-cyan-400 font-semibold tracking-wider">
                  {progressPercent}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-[1px] bg-neutral-900 rounded-full overflow-hidden mb-4 relative">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-cyan-300"
                  style={{ width: `${progressPercent}%` }}
                  transition={{ ease: 'easeOut', duration: 0.1 }}
                />
              </div>

              <div className="flex flex-col items-center gap-1.5 text-center">
                <span className="text-[10px] text-neutral-500 uppercase tracking-[0.25em] font-medium">
                  Loading Nexus Core Frames
                </span>
                <span className="text-[9px] text-neutral-600 font-mono">
                  {loadedCount} of {totalFrames} sequences synchronized
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Top Navigation Bar */}
      <Navbar currentPath={currentPath} onNavigate={handleNavigate} />

      {/* 3. Main Page Content Section */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPath}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 4. Common footer section */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
