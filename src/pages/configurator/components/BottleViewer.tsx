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
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [isLoaded, setIsLoaded] = useState(true);
  const [prevModelId, setPrevModelId] = useState(model.id);
  const [transitioning, setTransitioning] = useState(false);
  const [showZoomHint, setShowZoomHint] = useState(false);
  const autoRotateRef = useRef(false);
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // Reset scale on model change
  useEffect(() => {
    setScale(1);
  }, [model.id]);

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

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const newScale = Math.min(1.8, Math.max(0.7, scale - e.deltaY * 0.0008));
    setScale(newScale);
    // Show zoom hint briefly
    setShowZoomHint(true);
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    hintTimerRef.current = setTimeout(() => setShowZoomHint(false), 1200);
  }, [scale]);

  // Zoom buttons
  const zoomIn = () => setScale(s => Math.min(1.8, s + 0.15));
  const zoomOut = () => setScale(s => Math.max(0.7, s - 0.15));
  const resetView = () => { setScale(1); setRotation(0); };

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
      onWheel={handleWheel}
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
          transform: `scale(${scale * perspectiveScale}) skewX(${skewAngle * 0.35}deg)`,
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

      {/* Zoom level indicator */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          opacity: showZoomHint ? 1 : 0,
          transition: 'opacity 0.3s',
          pointerEvents: 'none',
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(212,175,55,0.2)',
          borderRadius: '6px',
          padding: '6px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <i className="ri-zoom-in-line" style={{ color: '#d4af37', fontSize: '11px' }} />
        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.6rem', color: 'rgba(255,255,255,0.7)' }}>
          {Math.round(scale * 100)}%
        </span>
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
