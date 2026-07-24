import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

interface HomeProps {
  isLoaded: boolean;
  totalFrames: number;
  drawFrame: (canvas: HTMLCanvasElement | null, frameIndex: number) => void;
  onNavigate: (path: string) => void;
}

export default function Home({ isLoaded, totalFrames, drawFrame, onNavigate }: HomeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentFrameRef = useRef<number>(0);
  const targetFrameRef = useRef<number>(0);
  const animationFrameIdRef = useRef<number | null>(null);

  // Set up resize handler and render loop for the canvas on Home mount
  useEffect(() => {
    if (!isLoaded) return;

    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const width = window.innerWidth;
      const height = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      drawFrame(canvas, currentFrameRef.current);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial sizing

    // Render/update loop using requestAnimationFrame
    const updateAnimation = () => {
      if (currentFrameRef.current !== targetFrameRef.current) {
        currentFrameRef.current = targetFrameRef.current;
        drawFrame(canvasRef.current, currentFrameRef.current);
      }
      animationFrameIdRef.current = requestAnimationFrame(updateAnimation);
    };
    animationFrameIdRef.current = requestAnimationFrame(updateAnimation);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [isLoaded, drawFrame]);

  // Monitor scroll progress specific to the hero's sticky section
  useEffect(() => {
    if (!isLoaded) return;

    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;

      let progress = 0;
      if (rect.top <= 0) {
        progress = Math.max(0, Math.min(1, -rect.top / totalScrollable));
      } else {
        progress = 0;
      }

      const frameIndex = Math.min(
        totalFrames - 1,
        Math.floor(progress * totalFrames)
      );

      targetFrameRef.current = frameIndex;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial position catch

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isLoaded, totalFrames]);

  return (
    <div className="w-full bg-black text-white relative">
      {/* 1. HERO SECTION WITH BACKGROUND SCROLL-LINKED ANIMATION */}
      <div ref={containerRef} className="relative w-full h-[300vh] bg-black">
        
        {/* Sticky Full-Screen Background Canvas */}
        <div className="sticky top-0 left-0 w-full h-screen overflow-hidden bg-black flex items-center justify-center z-0">
          <canvas ref={canvasRef} className="block w-full h-full object-contain bg-black" />
          {/* Transparent dark backdrop overlay so that the text is perfectly legible */}
          <div className="absolute inset-0 bg-black/60 pointer-events-none" />
        </div>

        {/* Scrollable Overlaid Text Content */}
        <div className="absolute inset-x-0 top-0 z-10 flex flex-col items-center">
          
          {/* Segment 1: Welcome & Main taglines */}
          <div className="w-full h-screen flex flex-col justify-center px-6 md:px-16 max-w-4xl mx-auto">
            <div className="max-w-2xl flex flex-col gap-8 md:gap-12">
              <div className="flex flex-col gap-2">
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-xs font-mono tracking-[0.3em] text-cyan-500 uppercase"
                >
                  Visionary Syndicate
                </motion.span>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight uppercase font-sans"
                >
                  Potentia.<br />
                  <span className="text-neutral-400">Communitas,</span><br />
                  <span className="bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">Educatus.</span>
                </motion.h1>
              </div>

              {/* Intro text visible immediately */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-neutral-300 text-sm md:text-base leading-relaxed tracking-wide font-sans"
              >
                Nexus is the in-house technology and finance club of Amity International School, Vasundhara Sector-1. We are a collective of forward-thinking creators, developers, and finance enthusiasts. We push the boundaries of digital and economic frontiers, building robust pipelines of collective intelligence.
              </motion.p>

              {/* Animated scroll indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                className="flex items-center gap-3 text-neutral-500 text-xs tracking-[0.2em] uppercase font-mono mt-4"
              >
                <div className="w-6 h-10 rounded-full border border-neutral-800 p-1 flex justify-center">
                  <motion.div
                    animate={{ y: [0, 12, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                    className="w-1.5 h-1.5 rounded-full bg-cyan-500"
                  />
                </div>
                <span>Scroll down</span>
              </motion.div>
            </div>
          </div>

          {/* Segment 2: WE ARE NEXUS SECTION */}
          <div className="w-full h-screen flex flex-col justify-center items-center px-6 md:px-16 max-w-4xl mx-auto text-center">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[10px] font-mono tracking-[0.3em] text-neutral-400 uppercase"
            >
              Core Pillars
            </motion.span>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-extrabold tracking-tight mt-3 uppercase text-[#f8f1ea]"
            >
              We are Nexus
            </motion.h2>

            {/* Decorative Green Vertical Line and Dot */}
            <div className="w-[1px] h-16 bg-[#5af05a]/40 my-6 relative flex items-center justify-center">
              <div className="absolute w-2 h-2 rounded-full bg-[#5af05a] shadow-[0_0_12px_rgba(90,240,90,0.8)] animate-pulse" />
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-neutral-300 text-sm md:text-base leading-relaxed tracking-wide max-w-2xl font-sans"
            >
              An elite student tech-finance syndicate at Amity International School, Vasundhara Sector-1. We push the frontiers of what is possible, bringing together analytical developers, visual designers, and finance visionaries to collaborate, learn, and build high-performance solutions for modern challenges. Our alliance serves as a breeding ground for innovative leadership and technical competence.
            </motion.p>
          </div>

          {/* Segment 3: FORESEE THE UNSEEN SECTION */}
          <div className="w-full h-screen flex flex-col justify-center items-center px-6 max-w-3xl mx-auto text-center relative z-20">
            <motion.h2
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-black tracking-tight uppercase text-[#f8f1ea]"
            >
              Foresee the unseen.
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-neutral-400 text-xs uppercase tracking-[0.2em] font-mono mt-4 mb-8"
            >
              Get to know us. Connect and build together.
            </motion.p>

            {/* Vertically stacked call-to-action buttons */}
            <div className="flex flex-col gap-4 w-full max-w-xs pointer-events-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate('/about')}
                className="w-full py-4 rounded-full border border-[#5af05a] text-[#5af05a] hover:bg-[#5af05a]/10 transition-all duration-300 text-xs font-semibold uppercase tracking-[0.2em] focus:outline-none cursor-pointer"
              >
                About us
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate('/contact')}
                className="w-full py-4 rounded-full bg-[#5af05a] text-[#1b1b1b] hover:opacity-90 transition-all duration-300 text-xs font-bold uppercase tracking-[0.2em] focus:outline-none cursor-pointer"
              >
                Connect with us
              </motion.button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
