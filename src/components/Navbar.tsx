import { motion } from 'motion/react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export default function Navbar({ currentPath, onNavigate }: NavbarProps) {
  const links = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Team', path: '/team' },
    { name: 'Contact us', path: '/contact' },
  ];

  const handleLinkClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    onNavigate(path);
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-40 bg-black/40 backdrop-blur-md border-b border-neutral-900/50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Sleek SVG Logo */}
        <a
          href="/"
          onClick={(e) => handleLinkClick(e, '/')}
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="relative w-8 h-8 flex items-center justify-center">
            {/* Outer animated hexagon outline */}
            <svg className="absolute inset-0 w-full h-full text-cyan-500/80 group-hover:text-cyan-400 transition-colors duration-300" viewBox="0 0 100 100">
              <polygon
                points="50,5 95,25 95,75 50,95 5,75 5,25"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinejoin="round"
              />
            </svg>
            {/* Inner infinity core */}
            <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 1 0 0-8c-2 0-4 1.33-6 4Z" />
            </svg>
          </div>
          <span className="text-sm font-bold tracking-[0.3em] text-white font-sans uppercase group-hover:text-cyan-400 transition-colors duration-300">
            Nexus
          </span>
        </a>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <a
                key={link.path}
                href={link.path}
                onClick={(e) => handleLinkClick(e, link.path)}
                className={`text-xs uppercase tracking-[0.2em] transition-all duration-300 relative py-1 ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-cyan-500"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Connect Action CTA */}
        <div>
          <button
            onClick={() => onNavigate('/contact')}
            className="relative px-5 py-2 overflow-hidden rounded-full border border-neutral-800 hover:border-cyan-500/50 bg-neutral-950/50 hover:bg-neutral-900 group transition-all duration-300 focus:outline-none"
          >
            <span className="relative z-10 text-xs font-semibold uppercase tracking-[0.15em] text-neutral-300 group-hover:text-white transition-colors duration-300">
              Connect
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </button>
        </div>
      </div>
    </motion.header>
  );
}
