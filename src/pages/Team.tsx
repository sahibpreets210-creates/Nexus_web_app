import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatarLetter: string;
  skills: string[];
}

function TeamCard({ member, idx }: { member: TeamMember; idx: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  const [isHovered, setIsHovered] = useState(false);
  const rafId = useRef<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -((y - centerY) / centerY) * 10; // max 10 deg
    const rotateY = ((x - centerX) / centerX) * 10;  // max 10 deg

    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      setTransformStyle(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025)`);
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (rafId.current) cancelAnimationFrame(rafId.current);
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const touch = e.touches[0];
    const rect = cardRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -((y - centerY) / centerY) * 8;
    const rotateY = ((x - centerX) / centerX) * 8;

    setIsHovered(true);
    setTransformStyle(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`);
  };

  const handleTouchEnd = () => {
    setIsHovered(false);
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1, duration: 0.5 }}
      className="h-full"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: transformStyle,
          transition: isHovered
            ? 'transform 0.1s ease-out, box-shadow 0.2s ease, border-color 0.2s ease'
            : 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.4s ease, border-color 0.4s ease',
          boxShadow: isHovered
            ? '0 12px 35px -8px rgba(90, 240, 90, 0.18), 0 0 15px 0 rgba(90, 240, 90, 0.1)'
            : '0 4px 20px -5px rgba(0, 0, 0, 0.5)',
          willChange: 'transform',
        }}
        className="p-8 rounded-2xl bg-[#191a22] border border-[#5af05a]/20 hover:border-[#5af05a] transition-all duration-300 flex flex-col items-center text-center group cursor-pointer relative overflow-hidden h-full"
      >
        {/* Subtle background gradient shift base */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#232259]/30 via-transparent to-transparent opacity-60 pointer-events-none rounded-2xl" />

        {/* Avatar Circle with initial */}
        <div className="relative w-20 h-20 rounded-full bg-[#191a22] flex items-center justify-center border-2 border-[#5af05a] group-hover:shadow-[0_0_15px_rgba(90,240,90,0.4)] transition-all duration-300 mb-6 z-10">
          <div className="text-xl font-bold tracking-wider text-[#5af05a]">
            {member.avatarLetter}
          </div>
          {/* Subtle ring animation */}
          <div className="absolute inset-0 rounded-full border border-[#5af05a]/0 group-hover:scale-110 group-hover:border-[#5af05a]/40 transition-all duration-500 pointer-events-none" />
        </div>

        {/* Member Name */}
        <h3 className="text-xl font-bold tracking-tight text-[#f8f1ea] group-hover:text-[#5af05a] transition-colors duration-300 z-10">
          {member.name}
        </h3>

        {/* Role */}
        <p className="text-[11px] tracking-[0.2em] text-[#5af05a] uppercase font-semibold mt-1 mb-4 z-10">
          {member.role}
        </p>

        {/* Bio */}
        {member.bio && (
          <p className="text-xs text-[#b2b2b2] leading-relaxed mb-6 z-10">
            {member.bio}
          </p>
        )}

        {/* Skills Tag list */}
        {member.skills && member.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 justify-center mt-auto z-10">
            {member.skills.map((skill) => (
              <span
                key={skill}
                className="text-[9px] text-[#b2b2b2] bg-[#1b1b1b] px-2.5 py-1 rounded border border-[#5af05a]/20"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function Team() {
  const members: TeamMember[] = [
    {
      name: 'Vinayak Shukla',
      role: 'President',
      bio: '',
      avatarLetter: 'V',
      skills: [],
    },
    {
      name: 'Anoushka Arya',
      role: 'Co-President',
      bio: '',
      avatarLetter: 'A',
      skills: [],
    },
    {
      name: 'Shatakshi Agarwal',
      role: 'Co-President',
      bio: '',
      avatarLetter: 'S',
      skills: [],
    },
    {
      name: 'Aditi Thakur',
      role: 'Secretary',
      bio: '',
      avatarLetter: 'A',
      skills: [],
    },
    {
      name: 'Sahibpreet Singh',
      role: 'Core Member',
      bio: '',
      avatarLetter: 'S',
      skills: [],
    },
    {
      name: 'Aarav Lal',
      role: 'Core Member',
      bio: '',
      avatarLetter: 'A',
      skills: [],
    },
    {
      name: 'Anav Halder',
      role: 'Core Member',
      bio: '',
      avatarLetter: 'A',
      skills: [],
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#1b1b1b] text-white pt-32 pb-24 px-6 relative overflow-hidden selection:bg-[#5af05a]/30 selection:text-white">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#232259]/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-[#5af05a]/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Page Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] tracking-[0.3em] text-[#5af05a] uppercase font-semibold"
          >
            The Core Syndicate
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight uppercase text-[#f8f1ea]"
          >
            Our Team
          </motion.h1>
          <div className="w-16 h-[2px] bg-[#5af05a] rounded-full mt-2" />
        </div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {members.map((member, idx) => (
            <TeamCard key={member.name} member={member} idx={idx} />
          ))}
        </div>

      </div>
    </div>
  );
}

