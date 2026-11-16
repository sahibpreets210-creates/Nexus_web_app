interface FooterProps {
  onNavigate: (path: string) => void;
}

const LINKS = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Team', path: '/team' },
  { name: 'Arcade', path: '/arcade' },
  { name: 'Contact', path: '/contact' },
];

const SOCIALS = [
  { name: 'Instagram', url: 'https://www.instagram.com/nexusaisv1/', handle: '@nexusaisv1' },
  { name: 'Discord', url: 'https://discord.gg/nxnmD7dXg', handle: 'nexus-syndicate' },
];

export default function Footer({ onNavigate }: FooterProps) {
  const handleLinkClick = (event: React.MouseEvent, path: string) => {
    event.preventDefault();
    onNavigate(path);
  };

  return (
    <footer className="relative w-full border-t border-white/10 bg-[#0e0f11]/80 px-0 py-14 md:py-16">
      <div className="container-nexus">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <a
              href="/"
              onClick={(event) => handleLinkClick(event, '/')}
              className="inline-flex items-center gap-3"
              aria-label="Nexus home"
            >
              <span className="brand-mark">
                <img src="/brand/nexus-logo.jpeg" alt="" />
              </span>
              <span className="text-sm font-semibold uppercase tracking-[0.3em] text-[#f8f1ea]">
                Nexus
              </span>
            </a>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#a4a6a0]">
              Empowering the next generation of technologists, developers and creatives.
              Linking intelligence, forming connections.
            </p>
            <p className="mt-4 max-w-sm text-[11px] uppercase tracking-[0.18em] text-[#6f716c]">
              Amity International School, Vasundhara Sector-1
            </p>
          </div>

          {/* Sitemap */}
          <nav aria-label="Footer" className="md:col-span-3">
            <h2 className="text-[10px] uppercase tracking-[0.26em] text-[#7f817b]">Navigate</h2>
            <ul className="mt-5 flex flex-col gap-1">
              {LINKS.map((link) => (
                <li key={link.path}>
                  <a
                    href={link.path}
                    onClick={(event) => handleLinkClick(event, link.path)}
                    className="inline-flex min-h-[40px] items-center text-sm text-[#c8cac4] transition-colors hover:text-[#5af05a]"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Gateways */}
          <div className="md:col-span-4">
            <h2 className="text-[10px] uppercase tracking-[0.26em] text-[#7f817b]">Gateways</h2>
            <ul className="mt-5 flex flex-col gap-2">
              {SOCIALS.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-h-[44px] items-center justify-between gap-4 rounded-xl border border-white/10 px-4 transition-colors hover:border-[#5af05a]/40 hover:bg-[#5af05a]/[0.06]"
                  >
                    <span className="text-[11px] uppercase tracking-[0.18em] text-[#c8cac4] group-hover:text-[#f8f1ea]">
                      {social.name}
                    </span>
                    <span className="text-xs text-[#5af05a]">{social.handle}</span>
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="mailto:nexusaisv1@gmail.com"
                  className="group flex min-h-[44px] items-center justify-between gap-4 rounded-xl border border-white/10 px-4 transition-colors hover:border-[#5af05a]/40 hover:bg-[#5af05a]/[0.06]"
                >
                  <span className="text-[11px] uppercase tracking-[0.18em] text-[#c8cac4] group-hover:text-[#f8f1ea]">
                    Email
                  </span>
                  <span className="text-xs text-[#5af05a]">nexusaisv1@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="hairline my-10" />

        <div className="flex flex-col gap-3 text-[10px] uppercase tracking-[0.18em] text-[#6f716c] sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Nexus Club. All rights reserved.</span>
          <span className="font-mono tracking-[0.2em]">Potentia · Communitas · Educatus</span>
        </div>
      </div>
    </footer>
  );
}
