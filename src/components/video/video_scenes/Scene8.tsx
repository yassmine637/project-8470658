import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene8() {
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
      className="absolute inset-0 flex flex-col items-center justify-center bg-[#2C4A28] z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
    >
      <motion.div
        className="absolute top-1/4 h-[1px] bg-[#C59B27]"
        initial={{ left: '100%', width: '0vw' }}
        animate={phase >= 1 ? { left: '20%', width: '60vw' } : { left: '100%', width: '0vw' }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />

      <div className="overflow-hidden mb-6 mt-10">
        <motion.h1 
          className="text-[6vw] font-bold tracking-[0.2em] text-[#FDFBF7]"
          style={{ fontFamily: 'var(--font-display)' }}
          initial={{ y: 100, opacity: 0 }}
          animate={phase >= 1 ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          DOMAINE FENDRI
        </motion.h1>
      </div>

      <motion.div
        className="flex flex-col items-center gap-4 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={phase >= 2 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
        transition={{ duration: 1.5 }}
      >
        <p className="text-[2vw] text-[#FDFBF7] font-semibold">Yessmine Hsine</p>
        <p className="text-[1.5vw] text-[#FDFBF7]/80">ISIMS Sfax · Licence Informatique & Multimédia</p>
        <p className="text-[1.8vw] text-[#C59B27] font-display italic mt-2">2025 — 2026</p>
      </motion.div>

      <motion.div
        className="absolute bottom-10 flex flex-col items-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 1 }}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#8FA882" strokeWidth="1.5">
          <path d="M12 2C7 2 3 6 3 11C3 16 8 22 12 22C16 22 21 16 21 11C21 6 17 2 12 2Z" />
          <path d="M12 22V12" />
        </svg>
        <p className="text-[1vw] text-[#8FA882] tracking-widest uppercase">Digilab Solutions</p>
      </motion.div>

    </motion.div>
  );
}
