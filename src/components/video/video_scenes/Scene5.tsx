import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import configuratorImg from '@assets/screenshots/configurator_step1.jpg';

export function Scene5() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 4000),
      setTimeout(() => setPhase(4), 15000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const steps = ["COLLECTION", "VOLUME", "LABEL", "PACKAGING", "MESSAGE", "ORDER"];

  return (
    <motion.div 
      className="absolute inset-0 z-20 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
    >
      <motion.div 
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0, y: 50 }}
        animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="w-[85vw] h-[85vh] rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative">
          <div className="h-8 flex items-center px-4 gap-2 bg-[#1A1A1A]">
            <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
          </div>
          <motion.img 
            src={configuratorImg} 
            className="w-full h-[calc(100%-2rem)] object-cover object-top opacity-90"
          />
        </div>
      </motion.div>

      <motion.div 
        className="absolute top-[8vh] left-[50%] -translate-x-1/2 flex flex-col items-center gap-4 z-30"
        initial={{ opacity: 0, y: -20 }}
        animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-[4vw] font-display text-[#C59B27] drop-shadow-xl text-center">
          Configurateur Interactif
        </h2>
        
        <div className="flex items-center gap-8 bg-[#0D1A0B]/80 px-8 py-4 rounded-full border border-[#C59B27]/30 backdrop-blur-md">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className={`text-[1vw] font-bold tracking-widest ${i === 0 ? 'text-[#C59B27]' : 'text-white/40'}`}>
                {step}
              </span>
              {i < steps.length - 1 && <div className="w-4 h-[1px] bg-white/20" />}
            </div>
          ))}
          
          <motion.div 
            className="absolute left-8 w-2 h-2 rounded-full bg-[#C59B27] shadow-[0_0_10px_#C59B27]"
            animate={phase >= 3 ? { x: ['0vw', '10vw', '20vw', '30vw', '40vw', '50vw'] } : {}}
            transition={{ duration: 10, times: [0, 0.2, 0.4, 0.6, 0.8, 1], ease: "easeInOut" }}
            style={{ display: phase >= 3 ? 'block' : 'none' }}
          />
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-[10vh] left-[15vw] z-30 bg-[#2C4A28]/90 p-8 rounded-2xl border border-[#8FA882]/50 backdrop-blur-md max-w-[30vw]"
        initial={{ opacity: 0, x: -30 }}
        animate={phase >= 3 ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
        transition={{ duration: 1.2 }}
      >
        <h3 className="text-[#C59B27] text-[1.2vw] tracking-widest uppercase mb-4">Étape 1 — Choisir le modèle de flacon</h3>
        <p className="text-[#FDFBF7] text-[1.8vw] font-display leading-snug">
          Cylindrique · Slim Square · Metal Can · Bio Can
        </p>
      </motion.div>

    </motion.div>
  );
}
