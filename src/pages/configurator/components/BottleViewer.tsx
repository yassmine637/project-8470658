import { useState, useEffect } from 'react';
import type { BottleModel, LabelStyle } from '@/mocks/configurator';

interface BottleViewerProps {
  model: BottleModel;
  labelStyle: LabelStyle;
  customText: string;
  size: string;
}

export default function BottleViewer({ model, labelStyle, customText, size }: BottleViewerProps) {
  const [isLoaded, setIsLoaded] = useState(true);
  const [prevModelId, setPrevModelId] = useState(model.id);
  const [transitioning, setTransitioning] = useState(false);

  // Transition on model change
  useEffect(() => {
    if (model.id !== prevModelId) {
      setTransitioning(true);
      const t = setTimeout(() => {
        setPrevModelId(model.id);
        setTransitioning(false);
      }, 400);
      return () => clearTimeout(t);
    }
  }, [model.id, prevModelId]);

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none">
      {/* Floor reflection glow */}
      <div
        style={{
          position: 'absolute',
          bottom: '8%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '200px',
          height: '30px',
          borderRadius: '50%',
          background: `radial-gradient(ellipse, ${labelStyle.accentColor}2a 0%, transparent 70%)`,
          filter: 'blur(14px)',
          transition: 'background 0.6s ease',
          pointerEvents: 'none',
        }}
      />

      {/* Bottle container */}
      <div
        style={{
          opacity: transitioning ? 0 : 1,
          transition: transitioning ? 'opacity 0.35s' : 'none',
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
      >
        {/* Bottle image */}
        <img
          src={model.image}
          alt={model.name}
          onLoad={() => setIsLoaded(true)}
          className="w-full h-full object-contain object-center"
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.5s ease',
            filter: 'drop-shadow(0 32px 56px rgba(0,0,0,0.28))',
            pointerEvents: 'none',
          }}
          draggable={false}
        />

        {/* Loading shimmer */}
        {!isLoaded && (
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0) 100%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
            }}
          />
        )}
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}
