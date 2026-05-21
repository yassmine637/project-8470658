import { useState, useEffect, useRef, useCallback } from 'react';
import type { BottleModel, LabelStyle, PackagingOption } from '@/mocks/configurator';
import { COMBO_IMAGES, getComboImageKey, PACKAGING_IMAGES, getPackagingImageKey } from '@/mocks/configurator';

const loadedImageCache = new Set<string>();
const cylindrique500SizeStepOverride = '/images/configurateur/cylindrique-500ml-etape.webp';
const cylindrique750SizeStepOverride = '/images/configurateur/cylindrique-750ml-etape.webp';
const cylindrique1LSizeStepOverride = '/images/configurateur/cylindrique-1l-etape.webp';
const cylindrique3LSizeStepOverride = '/images/configurateur/cylindrique-3l-etape.webp';
const carreeModelStepOverride = '/images/configurateur/carree-originale.webp';
const bidonMetalModelStepOverride = '/images/configurateur/bidon-metal-originale.webp';
const bidonVertModelStepOverride = '/images/configurateur/bidon-vert-originale.webp';

interface BottleViewerProps {
  model: BottleModel;
  labelStyle: LabelStyle | null;
  customText: string;
  size: string;
  sizeId?: string;
  sizeChosen?: boolean;
  currentStep?: number;
  packaging?: PackagingOption | null;
}

const SIZE_SCALE: Record<string, number> = {
  '3 L': 1.0,
  '500 ml': 0.8,
  '750 ml': 0.88,
  '1 L': 0.95,
};

export default function BottleViewer({ model, labelStyle, size, sizeId, sizeChosen = false, currentStep = 0, packaging }: BottleViewerProps) {
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
  const [imageKey, setImageKey] = useState(bottleImage);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevImageRef = useRef(bottleImage);
  const sizeScale = SIZE_SCALE[size] ?? 0.85;

  useEffect(() => {
    if (!loadedImageCache.has(bottleImage)) {
      setIsLoaded(false);
    }
    if (bottleImage !== prevImageRef.current) {
      prevImageRef.current = bottleImage;
      setImageKey(bottleImage);
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

  const showPackaging = !!packaging && packaging.id !== 'none' && currentStep >= 3;

  const packagingPhotoKey = showPackaging && sizeId
    ? getPackagingImageKey(packaging!.id, model.id, sizeId, labelStyle?.id)
    : '';
  const packagingPhotoKeyGeneric = showPackaging && sizeId
    ? getPackagingImageKey(packaging!.id, model.id, sizeId)
    : '';
  const packagingPhoto = packagingPhotoKey
    ? (PACKAGING_IMAGES[packagingPhotoKey] ?? PACKAGING_IMAGES[packagingPhotoKeyGeneric])
    : undefined;

  const displayImage = showPackaging && packagingPhoto ? packagingPhoto : bottleImage;
  const [packagingPhotoLoaded, setPackagingPhotoLoaded] = useState(false);

  useEffect(() => {
    if (packagingPhoto) {
      setPackagingPhotoLoaded(loadedImageCache.has(packagingPhoto));
    }
  }, [packagingPhoto]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: dy * -8, y: dx * 8 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{ perspective: '800px' }}
    >
      {/* Floor glow — animé */}
      <div
        style={{
          position: 'absolute',
          bottom: '6%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: isHovered ? '220px' : '180px',
          height: '24px',
          borderRadius: '50%',
          background: showPackaging
            ? `radial-gradient(ellipse, ${packaging!.accentColor}55 0%, transparent 70%)`
            : `radial-gradient(ellipse, ${labelStyle?.accentColor ?? '#c9a84c'}44 0%, transparent 70%)`,
          filter: 'blur(16px)',
          transition: 'background 0.5s ease, width 0.4s ease',
          pointerEvents: 'none',
          animation: 'glowPulse 3s ease-in-out infinite',
        }}
      />

      {/* Bottle container with float + tilt */}
      <div
        style={{
          opacity: transitioning ? 0 : 1,
          position: 'relative',
          width: showPackaging && packagingPhoto ? '90%' : `${sizeScale * 100}%`,
          height: showPackaging && packagingPhoto ? '90%' : `${sizeScale * 100}%`,
          zIndex: 1,
          transition: 'opacity 0.35s ease, width 0.4s ease, height 0.4s ease',
          transform: isHovered
            ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.03)`
            : 'rotateX(0deg) rotateY(0deg) scale(1)',
          transformStyle: 'preserve-3d',
          animation: 'none',
          willChange: 'transform',
        }}
      >
        <img
          key={imageKey}
          src={displayImage}
          alt={model.name}
          onLoad={() => {
            loadedImageCache.add(displayImage);
            setIsLoaded(true);
            if (packagingPhoto && displayImage === packagingPhoto) setPackagingPhotoLoaded(true);
          }}
          className="w-full h-full object-contain object-center"
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.45s ease',
            filter: (showPackaging && !packagingPhoto)
              ? 'drop-shadow(0 18px 32px rgba(0,0,0,0.35))'
              : isHovered
              ? 'drop-shadow(0 36px 56px rgba(0,0,0,0.32))'
              : 'drop-shadow(0 28px 48px rgba(0,0,0,0.22))',
            pointerEvents: 'none',
            display: 'block',
            animation: isLoaded ? 'revealBottle 0.6s cubic-bezier(0.22,1,0.36,1) both' : 'none',
          }}
          draggable={false}
        />

        {/* Shimmer skeleton */}
        {(!isLoaded || (packagingPhoto && !packagingPhotoLoaded && displayImage === packagingPhoto)) && (
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
        @keyframes floatBottle {
          0%   { transform: translateY(0px) rotate(0deg); }
          25%  { transform: translateY(-10px) rotate(0.4deg); }
          50%  { transform: translateY(-14px) rotate(0deg); }
          75%  { transform: translateY(-8px) rotate(-0.4deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.7; transform: translateX(-50%) scaleX(1); }
          50%       { opacity: 1;   transform: translateX(-50%) scaleX(1.15); }
        }
        @keyframes revealBottle {
          0%   { opacity: 0; transform: translateY(18px) scale(0.96); }
          100% { opacity: 1; transform: translateY(0px)  scale(1); }
        }
      `}</style>
    </div>
  );
}
