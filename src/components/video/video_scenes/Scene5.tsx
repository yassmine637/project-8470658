import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import faqImg from '@assets/screenshots/faq.jpg';

export function Scene5() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 6000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 z-20 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
    >
      <motion.div 
        className="absolute right-[5vw] w-[60vw] h-[80vh] rounded-lg overflow-hidden shadow-2xl shadow-[#0D1A0B]"
        initial={{ opacity: 0, x: 50 }}
        animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.img 
          src={faqImg} 
          className="w-full h-full object-cover object-top opacity-70"
          animate={{ y: ['0%', '-5%'] }}
          transition={{ duration: 8, ease: "linear" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D1A0B] via-transparent to-transparent" />
      </motion.div>

      <motion.div 
        className="absolute left-[10vw] flex flex-col gap-8 max-w-[35vw]"
        initial={{ opacity: 0, x: -30 }}
        animate={phase >= 2 ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
        transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
      >
        <h2 className="text-[3vw] font-display text-[#FDFBF7] leading-tight">
          Support <br/>
          <span className="text-[#C59B27]">International</span>
        </h2>
        
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4 border-l-2 border-[#8FA882] pl-4">
            <span className="text-[1.2vw] tracking-widest text-[#FDFBF7]/80">TRILINGUE</span>
            <span className="text-[1.5vw] font-semibold text-[#FDFBF7]">FR · AR · EN</span>
          </div>
          <div className="flex items-center gap-4 border-l-2 border-[#C59B27] pl-4">
            <span className="text-[1.2vw] tracking-widest text-[#FDFBF7]/80">INTERFACE</span>
            <span className="text-[1.5vw] font-semibold text-[#FDFBF7]">Support RTL complet</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
