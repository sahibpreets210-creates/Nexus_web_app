import { motion } from 'motion/react';

export default function About() {
  const values = [
    {
      title: 'Power',
      tag: 'Potentia',
      desc: 'Developing deep technical mastery, visual frameworks, and high-performance system architectures to challenge limits and pioneer digital engineering.',
    },
    {
      title: 'Fellowship',
      tag: 'Communitas',
      desc: 'Fostering tight-knit collaborations where top engineers, programmers, and artists synchronize to coordinate advanced web and native builds.',
    },
    {
      title: 'Growth',
      tag: 'Educatus',
      desc: 'Empowering community peers through mentorship, shared documentation of experimental libraries, and rigorous technological bootcamps.',
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#18163f] to-[#0c0a24] text-white pt-32 pb-24 px-6 relative overflow-hidden selection:bg-cyan-500/30 selection:text-white">
      {/* Visual background atmospheric mesh */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Page Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] font-mono tracking-[0.3em] text-cyan-400 uppercase font-medium"
          >
            About Us
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black tracking-tight uppercase"
          >
            The Nexus.
          </motion.h1>
          <div className="w-12 h-[2px] bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full mt-2" />
        </div>

        {/* Brand Mission & Vision Section */}
        <div className="grid md:grid-cols-2 gap-8 items-stretch mb-28">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative p-8 rounded-2xl border border-neutral-800 bg-[#0e0c2b]/80 backdrop-blur-md flex flex-col gap-4"
          >
            <div className="absolute top-4 right-4 text-xs font-mono text-cyan-400/40">Protocol I</div>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 mb-2">
              <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 className="text-lg font-bold uppercase tracking-wide">Our Mission</h4>
            <p className="text-sm text-neutral-300 leading-relaxed font-sans">
              To empower the student community at Amity International School, Vasundhara Sector-1 by providing unparalleled access to peer mentorship, resources, and hands-on opportunities in technology and finance. We bridge the gap between academic theory and advanced technical execution.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="relative p-8 rounded-2xl border border-neutral-800 bg-[#0e0c2b]/80 backdrop-blur-md flex flex-col gap-4"
          >
            <div className="absolute top-4 right-4 text-xs font-mono text-cyan-400/40">Protocol II</div>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 mb-2">
              <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h4 className="text-lg font-bold uppercase tracking-wide">Our Vision</h4>
            <p className="text-sm text-neutral-300 leading-relaxed font-sans">
              To cultivate a lasting legacy of technological innovation, financial intelligence, and collaborative capability. We strive to prepare the builders of tomorrow to actively shape and lead the autonomous digital frontier with integrity and technical mastery.
            </p>
          </motion.div>
        </div>

        {/* Values/Pillars Bento Column Layout */}
        <div className="flex flex-col gap-8">
          <div className="text-center md:text-left mb-6">
            <h3 className="text-xs uppercase tracking-[0.2em] text-neutral-400 font-mono font-medium">
              Operational Standards
            </h3>
            <h2 className="text-xl md:text-3xl font-extrabold tracking-tight uppercase mt-2">
              Our Core Architecture
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {values.map((val, idx) => (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 rounded-2xl bg-gradient-to-br from-[#121034] to-[#0c0a24] border border-neutral-800/80 hover:border-cyan-500/40 transition-all duration-300 relative group"
              >
                <div className="absolute top-6 right-6 text-[10px] font-mono text-neutral-600 group-hover:text-cyan-400 transition-colors duration-300 uppercase tracking-widest">
                  {val.tag}
                </div>
                <h4 className="text-base font-extrabold uppercase tracking-wider mb-3 text-neutral-200">
                  {val.title}
                </h4>
                <p className="text-neutral-400 text-xs leading-relaxed font-sans mt-4">
                  {val.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* "Want to know more?" CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-32 p-12 rounded-3xl bg-gradient-to-br from-[#121034] to-[#0c0a24] border border-neutral-800 text-center relative overflow-hidden flex flex-col items-center gap-6"
        >
          {/* Subtle background overlay */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none" />
          
          <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight">
            Want to know more?
          </h2>
          <p className="text-neutral-400 text-sm md:text-base leading-relaxed max-w-xl font-sans">
            Get in touch with the core syndicate or explore our full team. Let's form connections and link intelligence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full max-w-md justify-center">
            <button
              onClick={() => {
                window.history.pushState(null, '', '/team');
                window.dispatchEvent(new PopStateEvent('popstate'));
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
              className="px-8 py-4 rounded-full border border-neutral-800 hover:border-cyan-500 bg-neutral-950 hover:bg-neutral-900 transition-all duration-300 text-xs font-semibold uppercase tracking-[0.2em] focus:outline-none"
            >
              Explore Team
            </button>
            <button
              onClick={() => {
                window.history.pushState(null, '', '/contact');
                window.dispatchEvent(new PopStateEvent('popstate'));
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
              className="px-8 py-4 rounded-full bg-white text-black hover:bg-neutral-200 transition-all duration-300 text-xs font-bold uppercase tracking-[0.2em] focus:outline-none"
            >
              Contact Us
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
