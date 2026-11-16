import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Reveal from '../components/Reveal';

const SOCIALS = [
  { name: 'Instagram', url: 'https://www.instagram.com/nexusaisv1/', handle: '@nexusaisv1' },
  { name: 'Discord', url: 'https://discord.gg/nxnmD7dXg', handle: 'nexus-syndicate' },
];

const EMAIL = 'nexusaisv1@gmail.com';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    message: '',
  });
  const [prepared, setPrepared] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    const subject = encodeURIComponent(`Nexus Contact from ${formData.name}`);
    let body = `Name: ${formData.name}\nEmail: ${formData.email}\n`;
    if (formData.organization) {
      body += `Organization: ${formData.organization}\n`;
    }
    body += `\nMessage:\n${formData.message}`;

    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${encodeURIComponent(body)}`;
    setPrepared(true);
  };

  const update = (key: keyof typeof formData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((previous) => ({ ...previous, [key]: event.target.value }));
  };

  return (
    <div className="page-top w-full pb-24">
      <div className="container-nexus">
        <header className="mx-auto max-w-3xl text-center">
          <p className="eyebrow justify-center">Establish Contact</p>
          <h1 className="display mt-5 text-[clamp(2rem,5.8vw,3.6rem)]">Connect With Us</h1>
          <div className="mx-auto mt-6 h-[2px] w-16 rounded-full bg-gradient-to-r from-[#5af05a] to-[#3bd7c4]" />
          <p className="lead mx-auto mt-6 max-w-xl text-sm sm:text-base">
            Open a channel with the Nexus core. We read every message that reaches our
            gateways.
          </p>
        </header>

        <div className="mt-14 grid items-start gap-8 md:grid-cols-12">
          {/* Gateways */}
          <div className="md:col-span-5">
            <h2 className="text-[10px] uppercase tracking-[0.26em] text-[#7f817b]">
              Network Gateways
            </h2>
            <p className="mt-4 text-2xl font-semibold tracking-tight text-[#f8f1ea]">
              Find us online
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#a4a6a0]">
              Access our active gateways. We share updates, code fragments, and announcements
              across our certified channels.
            </p>

            <ul className="mt-7 flex flex-col gap-3">
              {SOCIALS.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-h-[68px] items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-5 transition-colors hover:border-[#5af05a]/45 hover:bg-[#5af05a]/[0.05]"
                  >
                    <span className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase tracking-[0.22em] text-[#7f817b]">
                        {social.name}
                      </span>
                      <span className="text-sm text-[#5af05a]">{social.handle}</span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-[#a4a6a0] transition-colors group-hover:border-[#5af05a]/40 group-hover:text-[#5af05a]"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </span>
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${EMAIL}`}
                  className="group flex min-h-[68px] items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-5 transition-colors hover:border-[#5af05a]/45 hover:bg-[#5af05a]/[0.05]"
                >
                  <span className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-[0.22em] text-[#7f817b]">
                      Email
                    </span>
                    <span className="text-sm text-[#5af05a]">{EMAIL}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-[#a4a6a0] transition-colors group-hover:border-[#5af05a]/40 group-hover:text-[#5af05a]"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l9 6 9-6M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1z" />
                    </svg>
                  </span>
                </a>
              </li>
            </ul>
          </div>

          {/* Form */}
          <div className="md:col-span-7">
            <div className="panel p-6 sm:p-8">
              <div className="panel-sheen" />
              <AnimatePresence mode="wait">
                {!prepared ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -8 }}
                    onSubmit={handleSubmit}
                    className="relative flex flex-col gap-5"
                  >
                    <div>
                      <h2 className="text-lg font-semibold uppercase tracking-[0.1em] text-[#f8f1ea]">
                        Send a transmission
                      </h2>
                      <p className="mt-2 text-xs leading-relaxed text-[#a4a6a0]">
                        Fields marked with * are required. Submitting opens your email client
                        with the message prepared.
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="flex flex-col gap-2">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#a4a6a0]">
                          Your Name *
                        </span>
                        <input
                          required
                          type="text"
                          value={formData.name}
                          onChange={update('name')}
                          placeholder="e.g. Jean Doe"
                          autoComplete="name"
                          className="field"
                        />
                      </label>
                      <label className="flex flex-col gap-2">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#a4a6a0]">
                          Email Address *
                        </span>
                        <input
                          required
                          type="email"
                          value={formData.email}
                          onChange={update('email')}
                          placeholder="e.g. jean@example.com"
                          autoComplete="email"
                          className="field"
                        />
                      </label>
                    </div>

                    <label className="flex flex-col gap-2">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#a4a6a0]">
                        Organization (Optional)
                      </span>
                      <input
                        type="text"
                        value={formData.organization}
                        onChange={update('organization')}
                        placeholder="e.g. Acme Corp"
                        autoComplete="organization"
                        className="field"
                      />
                    </label>

                    <label className="flex flex-col gap-2">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#a4a6a0]">
                        Transmission Payload *
                      </span>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={update('message')}
                        placeholder="Input your communication contents..."
                        className="field resize-y"
                      />
                    </label>

                    <button type="submit" className="btn btn-primary mt-1 w-full">
                      Open connection
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="prepared"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative flex flex-col items-center gap-5 py-10 text-center"
                  >
                    <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[#5af05a]/30 bg-[#5af05a]/10 text-[#5af05a]">
                      <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l9 6 9-6M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1z" />
                      </svg>
                    </span>
                    <div>
                      <h2 className="text-lg font-semibold uppercase tracking-[0.1em] text-[#f8f1ea]">
                        Message prepared
                      </h2>
                      <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-[#a4a6a0]">
                        Your email client should open with the message ready to send. If it
                        did not, reach us directly at{' '}
                        <a href={`mailto:${EMAIL}`} className="text-[#5af05a] underline underline-offset-4">
                          {EMAIL}
                        </a>
                        .
                      </p>
                    </div>
                    <div className="flex w-full max-w-xs flex-col gap-3">
                      <a
                        href={`mailto:${EMAIL}?subject=${encodeURIComponent(
                          `Nexus Contact from ${formData.name || 'a visitor'}`
                        )}`}
                        className="btn btn-primary w-full"
                      >
                        Open email app
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          setPrepared(false);
                          setFormData({ name: '', email: '', organization: '', message: '' });
                        }}
                        className="btn btn-quiet w-full"
                      >
                        Compose another
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <Reveal>
          <div className="mt-14 grid gap-4 sm:grid-cols-3">
            {[
              { label: 'Based at', value: 'Amity International School' },
              { label: 'Campus', value: 'Vasundhara Sector-1' },
              { label: 'Focus', value: 'Technology · Finance' },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-white/10 bg-white/[0.02] px-5 py-4">
                <p className="text-[9px] uppercase tracking-[0.22em] text-[#6f716c]">{item.label}</p>
                <p className="mt-2 text-sm text-[#d9d9d9]">{item.value}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
