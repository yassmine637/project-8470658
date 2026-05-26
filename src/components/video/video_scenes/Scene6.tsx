import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene6() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 3000), // exit
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
    >
      <div className="overflow-hidden mb-8">
        <motion.h1 
          className="text-[4vw] tracking-[0.2em] font-display text-transparent bg-clip-text bg-gradient-to-r from-[#C59B27] via-[#FDFBF7] to-[#C59B27] shimmer-gold"
          initial={{ y: '100%' }}
          animate={phase >= 1 ? { y: 0 } : { y: '100%' }}
          transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
        >
          DOMAINE FENDRI
        </motion.h1>
      </div>

      <motion.div 
        className="h-[2px] bg-[#C59B27] mb-8"
        initial={{ width: 0, opacity: 0 }}
        animate={phase >= 2 ? { width: '30vw', opacity: 1 } : { width: 0, opacity: 0 }}
        transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
      />

      <div className="overflow-hidden">
        <motion.p 
          className="text-[1.5vw] tracking-[0.1em] text-[#8FA882]"
          initial={{ y: -30, opacity: 0 }}
          animate={phase >= 2 ? { y: 0, opacity: 1 } : { y: -30, opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1], delay: 0.3 }}
        >
          Yessmine Hsine — ISIMS Sfax — 2025/2026
        </motion.p>
      </div>
    </motion.div>
  );
}
