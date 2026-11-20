import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

const LINKS = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Team', path: '/team' },
  { name: 'Arcade', path: '/arcade' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar({ currentPath, onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile sheet whenever the route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [currentPath]);

  // Lock background scrolling while the sheet is open
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  const handleLinkClick = (event: React.MouseEvent, path: string) => {
    event.preventDefault();
    setMenuOpen(false);
    onNavigate(path);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b transition-colors duration-300 ${
        scrolled || menuOpen
          ? 'border-white/10 bg-[#121316]/85 backdrop-blur-xl'
          : 'border-transparent bg-gradient-to-b from-[#121316]/80 to-transparent'
      }`}
    >
      <div className="container-nexus flex h-[68px] items-center justify-between md:h-[76px]">
        {/* Brand */}
        <a
          href="/"
          onClick={(event) => handleLinkClick(event, '/')}
          className="flex items-center gap-3"
          aria-label="Nexus home"
        >
          <span className="brand-mark">
            <img src="/brand/nexus-logo.jpeg" alt="" />
          </span>
          <span className="hidden flex-col leading-none sm:flex">
            <span className="text-sm font-semibold uppercase tracking-[0.32em] text-[#f8f1ea]">
              Nexus
            </span>
            <span className="mt-1 text-[8px] uppercase tracking-[0.28em] text-[#7f817b]">
              Tech &amp; Finance Club
            </span>
          </span>
        </a>

        {/* Desktop navigation */}
        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          {LINKS.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <a
                key={link.path}
                href={link.path}
                onClick={(event) => handleLinkClick(event, link.path)}
                aria-current={isActive ? 'page' : undefined}
                className="nav-link"
              >
                {link.name}
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute -bottom-[2px] left-0 right-0 h-[2px] rounded-full bg-[#5af05a]"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate('/contact')}
            className="btn btn-primary hidden !min-h-[40px] !px-5 !py-2 !text-[10px] md:inline-flex"
          >
            Connect
          </button>

          {/* Mobile trigger */}
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((open) => !open)}
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/12 text-[#f8f1ea] transition-colors hover:border-[#5af05a]/60 md:hidden"
          >
            <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
            <span
              className={`absolute h-[1.5px] w-5 rounded bg-current transition-transform duration-300 ${
                menuOpen ? 'rotate-45' : '-translate-y-[4px]'
              }`}
            />
            <span
              className={`absolute h-[1.5px] w-5 rounded bg-current transition-transform duration-300 ${
                menuOpen ? '-rotate-45' : 'translate-y-[4px]'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-white/10 bg-[#121316]/97 md:hidden"
          >
            <div className="container-nexus flex flex-col gap-1 py-5">
              {LINKS.map((link, index) => {
                const isActive = currentPath === link.path;
                return (
                  <motion.a
                    key={link.path}
                    href={link.path}
                    onClick={(event) => handleLinkClick(event, link.path)}
                    aria-current={isActive ? 'page' : undefined}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex min-h-[52px] items-center justify-between rounded-xl border px-4 text-sm uppercase tracking-[0.18em] transition-colors ${
                      isActive
                        ? 'border-[#5af05a]/40 bg-[#5af05a]/10 text-[#f8f1ea]'
                        : 'border-transparent text-[#c8cac4] hover:border-white/10 hover:bg-white/5'
                    }`}
                  >
                    <span>{link.name}</span>
                    <span className="font-mono text-[10px] text-[#5af05a]">
                      0{index + 1}
                    </span>
                  </motion.a>
                );
              })}
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onNavigate('/contact');
                }}
                className="btn btn-primary mt-3 w-full"
              >
                Connect with us
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
