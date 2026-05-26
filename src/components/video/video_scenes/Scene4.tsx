import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import productDetailImg from '@assets/screenshots/product_detail.jpg';

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 4000),
      setTimeout(() => setPhase(4), 13000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const labels = [
    "Description détaillée du produit",
    "Prix · Certifications · Spécifications",
    "🛒 Commander en 1 clic"
  ];

  return (
    <motion.div 
      className="absolute inset-0 z-20 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0, y: '10%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
      transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
    >
      <motion.div 
        className="absolute inset-0 z-0 bg-[#0D1A0B]/80"
        initial={{ opacity: 0 }}
        animate={phase >= 2 ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1 }}
      />

      <motion.div 
        className="absolute w-[80vw] h-[85vh] rounded-2xl overflow-hidden shadow-2xl border border-white/10 z-10"
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
            src={productDetailImg} 
            className="w-full h-auto min-h-full object-cover object-top opacity-90"
            animate={{ y: ['0%', '-5%'] }}
            transition={{ duration: 15, ease: "linear" }}
          />
        </div>
      </motion.div>

      {/* Spotlight effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-20 mix-blend-screen"
        initial={{ background: 'radial-gradient(circle at 70% 60%, rgba(255,255,255,0) 0%, rgba(0,0,0,0) 100%)' }}
        animate={phase >= 2 ? { background: 'radial-gradient(circle at 70% 60%, rgba(255,255,255,0.4) 0%, rgba(0,0,0,0.8) 40%)' } : {}}
        transition={{ duration: 1.5 }}
      />

      <div className="absolute left-[10vw] top-[30vh] z-30 flex flex-col gap-6 max-w-[30vw]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-[2.5vw] font-display text-[#C59B27] leading-tight drop-shadow-lg">
            Fiche produit — Huile d'olive 1L Bio · 28 TND
          </h2>
        </motion.div>

        <div className="flex flex-col gap-4 mt-4">
          {labels.map((label, i) => (
            <motion.div
              key={i}
              className="bg-[#2C4A28] border border-[#8FA882]/50 px-6 py-3 rounded-xl shadow-lg flex items-center gap-4"
              initial={{ opacity: 0, x: -30 }}
              animate={phase >= 3 ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              transition={{ duration: 0.8, delay: i * 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="w-2 h-2 rounded-full bg-[#C59B27]" />
              <span className="text-[#FDFBF7] text-[1.2vw] font-semibold">{label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
