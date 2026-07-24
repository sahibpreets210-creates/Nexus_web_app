interface FooterProps {
  onNavigate: (path: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
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
    <footer className="w-full bg-black border-t border-neutral-900 px-6 py-12 md:py-20 relative overflow-hidden">
      {/* Decorative radial gradient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-10 relative z-10">
        {/* Left Side: Brand and short description */}
        <div className="flex flex-col gap-4">
          <a
            href="/"
            onClick={(e) => handleLinkClick(e, '/')}
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="relative w-7 h-7 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full text-cyan-500/80 group-hover:text-cyan-400 transition-colors duration-300" viewBox="0 0 100 100">
                <polygon
                  points="50,5 95,25 95,75 50,95 5,75 5,25"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinejoin="round"
                />
              </svg>
              <svg className="w-4.5 h-4.5 text-white group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 1 0 0-8c-2 0-4 1.33-6 4Z" />
              </svg>
            </div>
            <span className="text-xs font-bold tracking-[0.3em] text-white font-sans uppercase group-hover:text-cyan-400 transition-colors duration-300">
              Nexus
            </span>
          </a>
          <p className="text-neutral-500 text-xs tracking-wide max-w-sm font-sans mt-1">
            Empowering the next generation of technologists, developers, and creatives. Linking intelligence, forming connections.
          </p>
        </div>

        {/* Middle/Right Side: Navigation Links & Cookie Notice */}
        <div className="flex flex-col md:items-end gap-6">
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {links.map((link) => (
              <a
                key={link.path}
                href={link.path}
                onClick={(e) => handleLinkClick(e, link.path)}
                className="text-[11px] uppercase tracking-[0.15em] text-neutral-400 hover:text-cyan-400 transition-colors duration-300 font-medium"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="text-[10px] text-neutral-600 font-sans tracking-wider md:text-right flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-6 border-t border-neutral-900 md:border-none pt-4 md:pt-0">
            <span>© 2026 Nexus Club. All rights reserved.</span>
            <div className="flex gap-4">
              <span className="hover:text-neutral-400 transition-colors duration-300 cursor-pointer">
                Privacy Notice
              </span>
              <span className="hover:text-neutral-400 transition-colors duration-300 cursor-pointer">
                Cookie Settings
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
