import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import productsImg from '@assets/screenshots/products.jpg';

export function Scene3() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 3500),
      setTimeout(() => setPhase(4), 11000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const badges = [
    { text: "🟢 NATURAL", delay: 0 },
    { text: "⭐ BEST-SELLER", delay: 0.3 },
    { text: "💎 PREMIUM", delay: 0.6 },
    { text: "👨‍👩‍👧 FAMILY SIZE", delay: 0.9 },
  ];

  return (
    <motion.div 
      className="absolute inset-0 z-20 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: '-10%', filter: 'blur(10px)' }}
      transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
    >
      <motion.div 
        className="absolute left-[5vw] w-[60vw] h-[80vh] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={phase >= 1 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="h-8 flex items-center px-4 gap-2 bg-[#E5E5E5]">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
        </div>
        <div className="relative h-[calc(100%-2rem)] overflow-hidden">
          <motion.img 
            src={productsImg} 
            className="w-full h-auto min-h-full object-cover object-top opacity-90"
            animate={{ y: ['0%', '-10%'] }}
            transition={{ duration: 15, ease: "linear" }}
          />
        </div>
      </motion.div>

      <div className="absolute right-[5vw] top-[20vh] max-w-[25vw] flex flex-col gap-6">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={phase >= 2 ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-[3.5vw] font-display text-[#FDFBF7] leading-tight">
            Notre Collection
          </h2>
          <p className="mt-2 text-[1.2vw] text-[#8FA882] tracking-wide">
            4 formats exclusifs — Chetoui bio
          </p>
        </motion.div>
        
        <div className="flex flex-col gap-4 mt-8">
          {badges.map((badge, i) => (
            <motion.div
              key={i}
              className="bg-[#C59B27]/10 border border-[#C59B27]/30 px-6 py-3 rounded-lg backdrop-blur-sm"
              initial={{ opacity: 0, x: 30 }}
              animate={phase >= 3 ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
              transition={{ duration: 0.8, delay: badge.delay, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="text-[#C59B27] font-bold tracking-widest text-[1vw] uppercase">
                {badge.text}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
