import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import homeImg from '@assets/screenshots/home.jpg';

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 4000),
      setTimeout(() => setPhase(4), 9000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 z-20 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: '-10%', filter: 'blur(10px)' }}
      transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
    >
      <motion.div 
        className="absolute right-[5vw] w-[65vw] h-[80vh] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
        initial={{ opacity: 0, x: '20%' }}
        animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: '20%' }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="h-8 flex items-center px-4 gap-2 bg-[#E5E5E5]">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
        </div>
        <div className="relative h-[calc(100%-2rem)] overflow-hidden">
          <motion.img 
            src={homeImg} 
            className="w-full h-auto min-h-full object-cover object-top opacity-90"
            animate={{ y: ['0%', '-15%'] }}
            transition={{ duration: 15, ease: "linear" }}
          />
        </div>
      </motion.div>

      <div className="absolute left-[8vw] top-[40vh] max-w-[35vw]">
        <motion.div
          className="bg-[#2C4A28] border border-[#8FA882]/30 px-6 py-4 rounded-xl shadow-2xl overflow-hidden relative"
          initial={{ opacity: 0, clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' }}
          animate={phase >= 2 ? { opacity: 1, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' } : { opacity: 0, clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-[2.5vw] font-display text-[#FDFBF7] leading-tight flex items-center gap-4">
            <span>🌿</span> Plateforme E-Commerce Premium
          </h2>
        </motion.div>
        
        <motion.p
          className="mt-6 text-[1.5vw] text-[#8FA882] tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 1 }}
        >
          Page d'accueil immersive — Sfax, Tunisie
        </motion.p>
      </div>
    </motion.div>
  );
}
