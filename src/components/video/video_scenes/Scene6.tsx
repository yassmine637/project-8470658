import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene6() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500), // Step 1
      setTimeout(() => setPhase(3), 3000), // Step 2
      setTimeout(() => setPhase(4), 4500), // Step 3
      setTimeout(() => setPhase(5), 6000), // Step 4
      setTimeout(() => setPhase(6), 7500), // Step 5
      setTimeout(() => setPhase(7), 9000), // Step 6
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const steps = [
    { label: "COLLECTION", id: 1 },
    { label: "VOLUME", id: 2 },
    { label: "LABEL", id: 3 },
    { label: "PACKAGING", id: 4 },
    { label: "MESSAGE", id: 5 },
    { label: "ORDER", id: 6 }
  ];

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
    >
      <motion.h2 
        className="text-[4vw] font-display text-[#FDFBF7] mb-20"
        initial={{ opacity: 0, y: -30 }}
        animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
        transition={{ duration: 1 }}
      >
        6 étapes · Personnalisation totale
      </motion.h2>

      <div className="relative flex items-center justify-center w-[80vw] mx-auto">
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-[2px] bg-white/10 z-0" />
        
        <motion.div 
          className="absolute top-1/2 -translate-y-1/2 left-0 h-[2px] bg-[#C59B27] z-0"
          initial={{ width: '0%' }}
          animate={{ width: phase >= 2 ? `${Math.min(100, (phase - 1) * 20)}%` : '0%' }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        <div className="flex justify-between w-full z-10">
          {steps.map((step, idx) => {
            const isActive = phase >= idx + 2;
            const isCurrent = phase === idx + 2;
            
            return (
              <div key={step.id} className="flex flex-col items-center relative gap-6">
                <motion.div 
                  className={`w-[4vw] h-[4vw] rounded-full flex items-center justify-center text-[1.5vw] font-bold border-2 transition-colors duration-500
                    ${isActive ? 'bg-[#2C4A28] border-[#C59B27] text-[#C59B27]' : 'bg-[#0D1A0B] border-white/20 text-white/40'}`}
                  initial={{ scale: 0.8 }}
                  animate={isCurrent ? { scale: [1, 1.2, 1], boxShadow: "0 0 20px rgba(197,155,39,0.5)" } : { scale: 1, boxShadow: "none" }}
                  transition={{ duration: 0.5 }}
                >
                  {step.id}
                </motion.div>
                
                <motion.span 
                  className={`absolute top-full mt-4 text-[1vw] tracking-widest font-semibold transition-colors duration-500 whitespace-nowrap
                    ${isActive ? 'text-[#FDFBF7]' : 'text-white/30'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  {step.label}
                </motion.span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
