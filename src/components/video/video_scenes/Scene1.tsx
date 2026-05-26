import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 4000),
      setTimeout(() => setPhase(4), 7000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center bg-[#0D1A0B] z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="mb-8 text-[#C59B27]"
        initial={{ y: -50, opacity: 0 }}
        animate={phase >= 1 ? { y: 0, opacity: 1 } : { y: -50, opacity: 0 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2C7 2 3 6 3 11C3 16 8 22 12 22C16 22 21 16 21 11C21 6 17 2 12 2Z" />
          <path d="M12 22V12" />
        </svg>
      </motion.div>

      <div className="overflow-hidden">
        <motion.h1 
          className="text-[6vw] font-bold tracking-[0.2em] text-[#FDFBF7]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {'DOMAINE FENDRI'.split('').map((char, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ y: 100, opacity: 0 }}
              animate={phase >= 1 ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
              transition={{ duration: 0.8, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.h1>
      </div>

      <motion.p
        className="mt-6 text-[1.5vw] tracking-widest text-[#8FA882] uppercase"
        initial={{ opacity: 0, filter: 'blur(10px)' }}
        animate={phase >= 2 ? { opacity: 1, filter: 'blur(0px)' } : { opacity: 0, filter: 'blur(10px)' }}
        transition={{ duration: 1.5 }}
      >
        Digitalisation de l'Expérience Client
      </motion.p>

      <motion.div
        className="absolute top-[65%] h-[1px] bg-[#C59B27]"
        initial={{ left: '50%', width: 0, opacity: 0 }}
        animate={phase >= 3 ? { left: '15%', width: '70%', opacity: 0.5 } : { left: '50%', width: 0, opacity: 0 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
