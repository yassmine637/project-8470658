import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 6000), // Start exit
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
      transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
    >
      {/* Olive Branch SVG Motif */}
      <motion.svg 
        width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
        className="mb-8 opacity-80"
        initial={{ opacity: 0, y: 20 }}
        animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
      >
        <path d="M12 22C12 22 5 18 5 12C5 6 12 2 12 2C12 2 19 6 19 12C19 18 12 22 12 22Z" stroke="#C59B27" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 22V12" stroke="#C59B27" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 16C12 16 9 14.5 9 12" stroke="#C59B27" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 8C12 8 15 9.5 15 12" stroke="#C59B27" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
      </motion.svg>

      <div className="overflow-hidden">
        <motion.h1 
          className="text-[6vw] tracking-[0.2em] font-display text-transparent bg-clip-text bg-gradient-to-r from-[#C59B27] via-[#FDFBF7] to-[#C59B27] shimmer-gold"
          initial={{ y: '100%' }}
          animate={phase >= 1 ? { y: 0 } : { y: '100%' }}
          transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
        >
          DOMAINE FENDRI
        </motion.h1>
      </div>

      <motion.div 
        className="h-[1px] bg-[#C59B27] mt-6 mb-6"
        initial={{ width: 0, opacity: 0 }}
        animate={phase >= 2 ? { width: '40vw', opacity: 0.6 } : { width: 0, opacity: 0 }}
        transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
      />

      <motion.p 
        className="text-[1.8vw] tracking-[0.1em] text-[#8FA882] font-light"
        initial={{ opacity: 0, y: 20, filter: 'blur(5px)' }}
        animate={phase >= 2 ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 20, filter: 'blur(5px)' }}
        transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1], delay: 0.2 }}
      >
        Digitalisation de l'Expérience Client
      </motion.p>
    </motion.div>
  );
}
