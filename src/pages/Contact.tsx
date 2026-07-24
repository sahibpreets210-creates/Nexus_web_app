import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const socials = [
    { name: 'Instagram', url: 'https://instagram.com', handle: '@nexus.club' },
    { name: 'Discord', url: 'https://discord.com', handle: 'nexus-syndicate' },
    { name: 'GitHub', url: 'https://github.com', handle: 'nexus-creates' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);

    // Simulate cybernetic form transmission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: '', email: '', organization: '', message: '' });
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#18163f] to-[#0c0a24] text-white pt-32 pb-24 px-6 relative overflow-hidden selection:bg-cyan-500/30 selection:text-white">
      {/* Background gradients for perfect high-tech feel */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[500px] h-[500px] bg-cyan-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Page Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] font-mono tracking-[0.3em] text-cyan-400 uppercase font-medium"
          >
            Establish Contact
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black tracking-tight uppercase"
          >
            Connect With Us
          </motion.h1>
          <div className="w-12 h-[2px] bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full mt-2" />
        </div>

        {/* Dual-column section */}
        <div className="grid md:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Social Links */}
          <div className="md:col-span-5 flex flex-col gap-8 md:pr-6">
            <div className="flex flex-col gap-4">
              <h3 className="text-xs uppercase tracking-[0.2em] text-cyan-400 font-mono font-semibold">
                Network Gateways
              </h3>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight uppercase">
                Find us online
              </h2>
              <p className="text-neutral-400 text-sm leading-relaxed font-sans">
                Access our active gateways. We share updates, code fragments, and announcements across our certified channels.
              </p>
            </div>

            {/* Social Cards */}
            <div className="flex flex-col gap-4">
              {socials.map((soc) => (
                <a
                  key={soc.name}
                  href={soc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-5 rounded-xl bg-[#0e0c2b]/60 border border-neutral-800/80 hover:border-cyan-500/40 hover:bg-[#121034] transition-all duration-300 flex items-center justify-between group focus:outline-none"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest group-hover:text-white transition-colors duration-300">
                      {soc.name}
                    </span>
                    <span className="text-xs font-semibold text-cyan-400 tracking-wide font-sans mt-0.5">
                      {soc.handle}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-neutral-950 flex items-center justify-center border border-neutral-800 group-hover:border-cyan-500/30 group-hover:bg-neutral-900 transition-all duration-300">
                    <svg className="w-3.5 h-3.5 text-neutral-500 group-hover:text-cyan-400 transition-colors duration-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="md:col-span-7 p-8 rounded-2xl bg-gradient-to-br from-[#121034] to-[#0c0a24] border border-neutral-800/80 relative">
            
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-6"
                >
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-bold uppercase tracking-wider">Send a transmission</h3>
                    <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                      All fields marked with * are required to open a routing signal.
                    </p>
                  </div>

                  {/* Name field */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
                      Your Name *
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Jean Doe"
                      className="w-full px-4 py-3 bg-[#0a091d] border border-neutral-800 rounded-xl focus:border-cyan-500/50 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500/10 placeholder-neutral-600 transition-all duration-300 text-white font-sans"
                    />
                  </div>

                  {/* Email field */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
                      Email Address *
                    </label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. jean@example.com"
                      className="w-full px-4 py-3 bg-[#0a091d] border border-neutral-800 rounded-xl focus:border-cyan-500/50 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500/10 placeholder-neutral-600 transition-all duration-300 text-white font-sans"
                    />
                  </div>

                  {/* Organization field */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
                      Organization (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      placeholder="e.g. Acme Corp"
                      className="w-full px-4 py-3 bg-[#0a091d] border border-neutral-800 rounded-xl focus:border-cyan-500/50 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500/10 placeholder-neutral-600 transition-all duration-300 text-white font-sans"
                    />
                  </div>

                  {/* Message field */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
                      Transmission Payload *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Input your communication contents..."
                      className="w-full px-4 py-3 bg-[#0a091d] border border-neutral-800 rounded-xl focus:border-cyan-500/50 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500/10 placeholder-neutral-600 transition-all duration-300 text-white font-sans resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 mt-2 rounded-full bg-white text-black hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-500 transition-all duration-300 text-xs font-bold uppercase tracking-[0.2em] focus:outline-none flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-neutral-500" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <span>Routing Signal...</span>
                      </>
                    ) : (
                      <span>Open Connection</span>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center py-12 px-4 gap-6"
                >
                  <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/30">
                    <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-bold uppercase tracking-wider">Transmission Routed</h3>
                    <p className="text-xs text-neutral-400 font-sans max-w-sm leading-relaxed mx-auto">
                      Connection established. Our operator core has received your payload. We will dispatch a response packet promptly.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="px-6 py-2.5 rounded-full border border-neutral-800 hover:border-cyan-500 bg-neutral-950 text-[10px] font-semibold uppercase tracking-[0.2em] transition-all duration-300 focus:outline-none mt-4"
                  >
                    Send Another Payload
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>

      </div>
    </div>
  );
}
