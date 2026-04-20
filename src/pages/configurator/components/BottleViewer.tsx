import { useRef, useState, useCallback, useEffect } from 'react';
import type { BottleModel, LabelStyle } from '@/mocks/configurator';

interface BottleViewerProps {
  model: BottleModel;
  labelStyle: LabelStyle;
  customText: string;
  size: string;
}

export default function BottleViewer({ model, labelStyle, customText, size }: BottleViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [lastX, setLastX] = useState(0);
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

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setLastX(e.clientX);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    const delta = e.clientX - lastX;
    setRotation(r => r + delta * 0.55);
    setLastX(e.clientX);
  }, [isDragging, lastX]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true);
    setLastX(e.touches[0].clientX);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    const delta = e.touches[0].clientX - lastX;
    setRotation(r => r + delta * 0.55);
    setLastX(e.touches[0].clientX);
  }, [isDragging, lastX]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Pseudo-3D perspective
  const normalizedRot = ((rotation % 360) + 360) % 360;
  const skewAngle = Math.sin((normalizedRot * Math.PI) / 180) * 7;
  const perspectiveScale = 1 - Math.abs(Math.cos((normalizedRot * Math.PI) / 180)) * 0.07;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center select-none"
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
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
          transform: `scale(${perspectiveScale}) skewX(${skewAngle * 0.35}deg)`,
          transition: isDragging ? 'none' : 'transform 0.06s linear',
          opacity: transitioning ? 0 : 1,
          transitionProperty: transitioning ? 'opacity' : 'transform',
          transitionDuration: transitioning ? '0.35s' : '0.06s',
          position: 'relative',
          width: '100%',
          height: '100%',
          willChange: 'transform',
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
