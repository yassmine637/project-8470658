import { motion, AnimatePresence } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video/hooks';
import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';
import { Scene4 } from './video_scenes/Scene4';
import { Scene5 } from './video_scenes/Scene5';
import { Scene6 } from './video_scenes/Scene6';

const SCENE_DURATIONS = {
  scene1: 8000,
  scene2: 12000,
  scene3: 12000,
  scene4: 16000,
  scene5: 8000,
  scene6: 4000
};

export default function VideoTemplate() {
  const { currentScene } = useVideoPlayer({ durations: SCENE_DURATIONS });

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0D1A0B] text-[#FDFBF7]" style={{ fontFamily: 'var(--font-body)' }}>
      {/* Persistent Background Layer */}
      <div className="absolute inset-0 z-0 opacity-40">
        <motion.div 
          className="absolute w-[80vw] h-[80vw] rounded-full blur-[100px]"
          style={{ background: 'radial-gradient(circle, rgba(44,74,40,0.5), transparent)' }}
          animate={{
            x: ['-20%', '30%', '-10%'],
            y: ['-10%', '20%', '-20%'],
            scale: [1, 1.2, 0.9]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div 
          className="absolute w-[60vw] h-[60vw] rounded-full blur-[120px] bottom-0 right-0"
          style={{ background: 'radial-gradient(circle, rgba(197,155,39,0.15), transparent)' }}
          animate={{
            x: ['20%', '-30%', '10%'],
            y: ['10%', '-20%', '5%'],
            scale: [0.8, 1.1, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Noise Texture */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>

      {/* Persistent Golden Accent Lines */}
      <motion.div 
        className="absolute top-10 left-10 w-[2px] bg-[#C59B27] z-10"
        animate={{
          height: currentScene === 0 ? '0vh' : ['20vh', '40vh', '60vh', '40vh', '20vh', '0vh'][currentScene],
          opacity: currentScene === 0 || currentScene === 5 ? 0 : 0.6
        }}
        transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
      />
      <motion.div 
        className="absolute bottom-10 right-10 h-[2px] bg-[#C59B27] z-10"
        animate={{
          width: currentScene === 0 ? '0vw' : ['10vw', '30vw', '50vw', '30vw', '10vw', '0vw'][currentScene],
          opacity: currentScene === 0 || currentScene === 5 ? 0 : 0.6
        }}
        transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
      />

      <AnimatePresence mode="sync">
        {currentScene === 0 && <Scene1 key="scene1" />}
        {currentScene === 1 && <Scene2 key="scene2" />}
        {currentScene === 2 && <Scene3 key="scene3" />}
        {currentScene === 3 && <Scene4 key="scene4" />}
        {currentScene === 4 && <Scene5 key="scene5" />}
        {currentScene === 5 && <Scene6 key="scene6" />}
      </AnimatePresence>
    </div>
  );
}
