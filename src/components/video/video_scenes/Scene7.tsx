import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene7() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 3500),
      setTimeout(() => setPhase(4), 9000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const stats = [
    "4 Modèles 3D",
    "5 Étiquettes",
    "4 Emballages",
    "6 Langues ×2 (FR·AR·EN)"
  ];

  const features = [
    "✓ API REST Express + MongoDB",
    "✓ JWT Authentication",
    "✓ Dashboard Admin complet",
    "✓ i18n FR · AR · EN + RTL"
  ];

  return (
    <motion.div 
      className="absolute inset-0 z-20 flex overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
    >
      <motion.div 
        className="absolute top-[8vh] w-full text-center z-30"
        initial={{ opacity: 0, y: -20 }}
        animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-[3.5vw] font-display text-[#C59B27] drop-shadow-md">
          Stack Technique Fullstack
        </h2>
      </motion.div>

      {/* Left Half - Dark */}
      <motion.div 
        className="w-1/2 h-full bg-[#0D1A0B] flex flex-col justify-center pl-[10vw]"
        initial={{ x: '-100%' }}
        animate={phase >= 1 ? { x: 0 } : { x: '-100%' }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex flex-col gap-8 mt-20">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -30 }}
              animate={phase >= 2 ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              transition={{ duration: 0.8, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="text-[2.5vw] font-display text-[#C59B27] tracking-wider">{stat}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Right Half - Cream */}
      <motion.div 
        className="w-1/2 h-full bg-[#FDFBF7] flex flex-col justify-center pl-[5vw]"
        initial={{ x: '100%' }}
        animate={phase >= 1 ? { x: 0 } : { x: '100%' }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex flex-col gap-8 mt-20">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 30 }}
              animate={phase >= 3 ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
              transition={{ duration: 0.8, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="text-[2vw] font-semibold text-[#2C4A28]">{feature}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
