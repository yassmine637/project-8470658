import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import productsImg from '@assets/screenshots/products.jpg';

export function Scene3() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 9000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 z-20 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0, x: '10%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, y: '-10%', filter: 'blur(10px)' }}
      transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
    >
      <motion.div 
        className="absolute w-[85vw] h-[75vh] rounded-lg overflow-hidden shadow-2xl shadow-[#0D1A0B]"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={phase >= 1 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.img 
          src={productsImg} 
          className="w-full h-full object-cover object-center opacity-80"
          animate={{ scale: [1, 1.05] }}
          transition={{ duration: 12, ease: "linear" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D1A0B]/90 via-[#0D1A0B]/30 to-transparent" />
      </motion.div>

      <motion.div 
        className="absolute left-[12vw] top-[30vh] flex flex-col items-start gap-4 max-w-[40vw]"
        initial={{ opacity: 0, y: 30 }}
        animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
      >
        <div className="px-4 py-2 border border-[#C59B27]/50 rounded-full bg-[#0D1A0B]/50 backdrop-blur-sm">
          <span className="text-[#C59B27] text-[1vw] tracking-[0.2em] uppercase">Découverte</span>
        </div>
        <h2 className="text-[3.5vw] font-display text-[#FDFBF7] leading-tight">
          Collection — <br/>
          <span className="text-[#8FA882] italic">4 Formats Exclusifs</span>
        </h2>
      </motion.div>
    </motion.div>
  );
}
