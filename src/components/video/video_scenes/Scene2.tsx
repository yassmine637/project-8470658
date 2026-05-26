import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import homeImg from '@assets/screenshots/home.jpg';

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 9000),
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
        className="absolute w-[80vw] h-[70vh] rounded-lg overflow-hidden shadow-2xl shadow-[#0D1A0B]"
        initial={{ opacity: 0, scale: 1.1, rotateX: 10, y: '20%' }}
        animate={phase >= 1 ? { opacity: 1, scale: 1, rotateX: 0, y: 0 } : { opacity: 0, scale: 1.1, rotateX: 10, y: '20%' }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.img 
          src={homeImg} 
          className="w-full h-full object-cover object-top opacity-80"
          animate={{ scale: [1.05, 1] }}
          transition={{ duration: 12, ease: "linear" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1A0B] via-transparent to-transparent opacity-80" />
      </motion.div>

      <motion.div 
        className="absolute bottom-[10vh] left-[15vw] flex items-center gap-6"
        initial={{ opacity: 0, x: -50 }}
        animate={phase >= 2 ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
        transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
      >
        <div className="w-[3px] h-[6vh] bg-[#C59B27]" />
        <h2 className="text-[3vw] font-display tracking-wide text-[#FDFBF7] drop-shadow-lg">
          Plateforme E-Commerce <span className="text-[#C59B27]">Premium</span>
        </h2>
      </motion.div>
    </motion.div>
  );
}
