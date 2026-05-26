import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import configuratorImg from '@assets/screenshots/configurator.jpg';

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2000), // Steps start appearing
      setTimeout(() => setPhase(4), 13000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 z-20 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0, y: '10%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
      transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
    >
      <motion.div 
        className="absolute w-[90vw] h-[80vh] rounded-lg overflow-hidden shadow-2xl shadow-[#0D1A0B] border border-[#2C4A28]/30"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={phase >= 1 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.img 
          src={configuratorImg} 
          className="w-full h-full object-cover object-center opacity-90"
          animate={{ scale: [1, 1.05] }}
          transition={{ duration: 16, ease: "linear" }}
        />
        <div className="absolute inset-0 bg-[#0D1A0B]/40" />
      </motion.div>

      <motion.div 
        className="absolute top-[8vh] w-full text-center flex flex-col items-center gap-2"
        initial={{ opacity: 0, y: -20 }}
        animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
      >
        <h2 className="text-[3vw] font-display text-[#FDFBF7]">
          Configurateur 3D Interactif
        </h2>
        <div className="h-[1px] w-[20vw] bg-[#C59B27]/50" />
        <p className="text-[#C59B27] tracking-[0.3em] uppercase text-[1.2vw]">6 Étapes de Personnalisation</p>
      </motion.div>

      {/* Floating steps indicators */}
      <div className="absolute bottom-[15vh] flex gap-4">
        {[1, 2, 3, 4, 5, 6].map((step, i) => (
          <motion.div
            key={step}
            className="w-[3.5vw] h-[3.5vw] rounded-full flex items-center justify-center border border-[#C59B27] bg-[#0D1A0B]/80 backdrop-blur-md text-[#FDFBF7] text-[1.5vw] font-display"
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={phase >= 3 ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: i * 0.2 }}
          >
            {step}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
