import { useState, useEffect } from 'react';
import type { BottleModel, LabelStyle } from '@/mocks/configurator';

interface BottleViewerProps {
  model: BottleModel;
  labelStyle: LabelStyle;
  customText: string;
  size: string;
}

const SIZE_SCALE: Record<string, number> = {
  '250 ml': 0.6,
  '500 ml': 0.8,
  '750 ml': 0.72,
  '1 L': 0.95,
};

export default function BottleViewer({ model, labelStyle, size }: BottleViewerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [prevModelId, setPrevModelId] = useState(model.id);
  const [transitioning, setTransitioning] = useState(false);
  const sizeScale = SIZE_SCALE[size] ?? 0.85;
  const bottleImage = model.sizeImages?.[size] ?? model.image;

  useEffect(() => {
    setIsLoaded(false);
  }, [bottleImage]);

  useEffect(() => {
    if (model.id !== prevModelId) {
      setTransitioning(true);
      const t = setTimeout(() => {
        setPrevModelId(model.id);
        setTransitioning(false);
      }, 350);
      return () => clearTimeout(t);
    }
  }, [model.id, prevModelId]);

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none">
      {/* Floor glow */}
      <div
        style={{
          position: 'absolute',
          bottom: '6%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '180px',
          height: '24px',
          borderRadius: '50%',
          background: `radial-gradient(ellipse, ${labelStyle.accentColor}33 0%, transparent 70%)`,
          filter: 'blur(16px)',
          transition: 'background 0.5s ease',
          pointerEvents: 'none',
        }}
      />

      {/* Bottle container */}
      <div
        style={{
          opacity: transitioning ? 0 : 1,
          transition: 'opacity 0.35s ease',
          position: 'relative',
          width: `${sizeScale * 100}%`,
          height: `${sizeScale * 100}%`,
        }}
      >
        <img
          src={bottleImage}
          alt={model.name}
          onLoad={() => setIsLoaded(true)}
          className="w-full h-full object-contain object-center"
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.45s ease',
            filter: 'drop-shadow(0 28px 48px rgba(0,0,0,0.22))',
            pointerEvents: 'none',
            display: 'block',
          }}
          draggable={false}
        />

        {!isLoaded && (
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, #f0f0f0 0%, #e8e8e8 50%, #f0f0f0 100%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
              borderRadius: '8px',
            }}
          />
        )}
      </div>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
      `}</style>
    </div>
  );
}
