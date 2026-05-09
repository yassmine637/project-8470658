import { useState, useEffect, useRef } from 'react';
import type { BottleModel, LabelStyle } from '@/mocks/configurator';
import { COMBO_IMAGES, getComboImageKey } from '@/mocks/configurator';

const loadedImageCache = new Set<string>();
const cylindrique500SizeStepOverride = '/images/configurateur/cylindrique-500ml-etape.png';
const cylindrique750SizeStepOverride = '/images/configurateur/cylindrique-750ml-etape.png';
const cylindrique1LSizeStepOverride = '/images/configurateur/cylindrique-1l-etape.png';
const cylindrique3LSizeStepOverride = '/images/configurateur/cylindrique-3l-etape.png';
const carreeModelStepOverride = '/images/configurateur/carree-originale.png';
const bidonMetalModelStepOverride = '/images/configurateur/bidon-metal-originale.png';
const bidonVertModelStepOverride = '/images/configurateur/bidon-vert-originale.png';

interface BottleViewerProps {
  model: BottleModel;
  labelStyle: LabelStyle | null;
  customText: string;
  size: string;
  sizeId?: string;
  sizeChosen?: boolean;
  currentStep?: number;
}

const SIZE_SCALE: Record<string, number> = {
  '3 L': 1.0,
  '500 ml': 0.8,
  '750 ml': 0.88,
  '1 L': 0.95,
};

const ROTATION_SPEED = 40;

export default function BottleViewer({ model, labelStyle, size, sizeId, sizeChosen = false, currentStep = 0 }: BottleViewerProps) {
  const comboKey = sizeId && labelStyle ? getComboImageKey(model.id, sizeId, labelStyle.id) : '';
  const comboImage = comboKey && currentStep >= 2 ? COMBO_IMAGES[comboKey] : undefined;
  const sizeStepOverride = currentStep === 1 && sizeChosen && model.id === 'cylindrique-500'
    ? (sizeId === '500ml' ? cylindrique500SizeStepOverride
      : sizeId === '750ml' ? cylindrique750SizeStepOverride
      : sizeId === '1l' ? cylindrique1LSizeStepOverride
      : sizeId === '3l' ? cylindrique3LSizeStepOverride
      : undefined)
    : undefined;
  const modelStepOverride = (currentStep === 0 || (currentStep === 1 && !sizeChosen))
    ? (model.id === 'carree-750' ? carreeModelStepOverride
      : model.id === 'bidon-metal-3l' ? bidonMetalModelStepOverride
      : model.id === 'bidon-vert-1l' ? bidonVertModelStepOverride
      : undefined)
    : undefined;
  const sizeImage = (currentStep !== 1 || sizeChosen) ? model.sizeImages?.[size] : undefined;
  const bottleImage = modelStepOverride ?? sizeStepOverride ?? comboImage ?? sizeImage ?? model.image;

  const [isLoaded, setIsLoaded] = useState(() => loadedImageCache.has(bottleImage));
  const [prevModelId, setPrevModelId] = useState(model.id);
  const [transitioning, setTransitioning] = useState(false);
  const sizeScale = SIZE_SCALE[size] ?? 0.85;

  const [angle, setAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const angleRef = useRef(0);
  const rafRef = useRef<number | undefined>(undefined);
  const lastTsRef = useRef<number | undefined>(undefined);
  const dragStartRef = useRef({ x: 0, angle: 0 });
  const touchStartRef = useRef({ x: 0, angle: 0 });

  useEffect(() => {
    if (!loadedImageCache.has(bottleImage)) {
      setIsLoaded(false);
    }
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

  useEffect(() => {
    if (isDragging || isHovered) {
      lastTsRef.current = undefined;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }
    const tick = (ts: number) => {
      if (!lastTsRef.current) lastTsRef.current = ts;
      const dt = Math.min(ts - lastTsRef.current, 50);
      lastTsRef.current = ts;
      angleRef.current = (angleRef.current + ROTATION_SPEED * dt / 1000) % 360;
      setAngle(angleRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTsRef.current = undefined;
    };
  }, [isDragging, isHovered]);

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - dragStartRef.current.x;
      angleRef.current = ((dragStartRef.current.angle + dx * 0.7) % 360 + 360) % 360;
      setAngle(angleRef.current);
    };
    const onUp = () => setIsDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isDragging]);

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setHasInteracted(true);
    dragStartRef.current = { x: e.clientX, angle: angleRef.current };
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setHasInteracted(true);
    touchStartRef.current = { x: e.touches[0].clientX, angle: angleRef.current };
  };

  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    const dx = e.touches[0].clientX - touchStartRef.current.x;
    angleRef.current = ((touchStartRef.current.angle + dx * 0.7) % 360 + 360) % 360;
    setAngle(angleRef.current);
  };

  const onTouchEnd = () => setIsDragging(false);

  const rad = (angle * Math.PI) / 180;
  const scaleX = Math.cos(rad);
  const absScaleX = Math.abs(scaleX);
  const edgeDarkening = (1 - absScaleX) * 0.32;
  const highlightX = scaleX >= 0 ? '30%' : '70%';

  const accentColor = labelStyle?.accentColor ?? '#c9a84c';

  const dotCount = 24;
  const currentDot = Math.round((angle / 360) * dotCount) % dotCount;

  return (
    <div
      className="relative w-full h-full flex items-center justify-center select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsDragging(false); }}
    >
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
          background: `radial-gradient(ellipse, ${accentColor}33 0%, transparent 70%)`,
          filter: 'blur(16px)',
          transition: 'background 0.5s ease',
          pointerEvents: 'none',
        }}
      />

      {/* Bottle container — draggable */}
      <div
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          opacity: transitioning ? 0 : 1,
          transition: 'opacity 0.35s ease',
          position: 'relative',
          width: `${sizeScale * 100}%`,
          height: `${sizeScale * 100}%`,
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          touchAction: 'none',
        }}
      >
        {/* Bottle image with scaleX perspective */}
        <img
          src={bottleImage}
          alt={model.name}
          onLoad={() => { loadedImageCache.add(bottleImage); setIsLoaded(true); }}
          draggable={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'center',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.45s ease',
            filter: `drop-shadow(0 28px 48px rgba(0,0,0,0.22))`,
            pointerEvents: 'none',
            display: 'block',
            transform: `scaleX(${scaleX})`,
          }}
        />

        {/* Curved surface shading overlay */}
        {isLoaded && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              background: `radial-gradient(ellipse at ${highlightX} 35%, transparent 38%, rgba(0,0,0,${edgeDarkening}) 100%)`,
              transition: 'background 0.05s linear',
              transform: `scaleX(${scaleX})`,
            }}
          />
        )}

        {!isLoaded && (
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, #1a1a1a 0%, #222 50%, #1a1a1a 100%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
              borderRadius: '8px',
            }}
          />
        )}
      </div>

      {/* 360° dot progress ring */}
      <div
        style={{
          position: 'absolute',
          bottom: '14px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '3px',
          opacity: 0.7,
        }}
      >
        {Array.from({ length: dotCount }).map((_, i) => {
          const dist = Math.min(Math.abs(i - currentDot), dotCount - Math.abs(i - currentDot));
          const active = dist === 0;
          const near = dist <= 1;
          return (
            <div
              key={i}
              style={{
                width: active ? '6px' : near ? '4px' : '3px',
                height: active ? '6px' : near ? '4px' : '3px',
                borderRadius: '50%',
                background: active
                  ? accentColor
                  : near
                    ? `${accentColor}88`
                    : 'rgba(255,255,255,0.12)',
                transition: 'all 0.15s ease',
                flexShrink: 0,
              }}
            />
          );
        })}
      </div>

      {/* "360°" hint badge — fades after first interaction */}
      <div
        style={{
          position: 'absolute',
          top: '14px',
          right: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          background: 'rgba(0,0,0,0.45)',
          border: `1px solid ${accentColor}44`,
          borderRadius: '20px',
          padding: '4px 10px 4px 8px',
          opacity: hasInteracted ? 0 : isHovered ? 1 : 0.75,
          transition: 'opacity 0.5s ease',
          pointerEvents: 'none',
          backdropFilter: 'blur(6px)',
        }}
      >
        <i
          className="ri-refresh-line"
          style={{
            fontSize: '11px',
            color: accentColor,
            animation: isDragging || isHovered ? 'none' : 'spin360 2s linear infinite',
          }}
        />
        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.55rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
          360°
        </span>
      </div>

      {/* Drag hint — only shown before first interaction */}
      {!hasInteracted && (
        <div
          style={{
            position: 'absolute',
            bottom: '38px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: "'Outfit', sans-serif",
            fontSize: '0.5rem',
            letterSpacing: '0.12em',
            color: 'rgba(255,255,255,0.25)',
            whiteSpace: 'nowrap',
            animation: 'fadeInUp 0.8s ease 1s both',
            pointerEvents: 'none',
          }}
        >
          ← Glisser pour tourner →
        </div>
      )}

      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        @keyframes spin360 {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateX(-50%) translateY(6px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}
