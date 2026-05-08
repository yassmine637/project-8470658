import { useState, useEffect } from 'react';
import type { BottleModel, LabelStyle } from '@/mocks/configurator';
import { COMBO_IMAGES, getComboImageKey } from '@/mocks/configurator';
const cylindrique500SizeStepOverride = '/images/configurateur/cylindrique-500ml-etape.png';
const cylindrique750SizeStepOverride = '/images/configurateur/cylindrique-750ml-etape.png';
const carreeModelStepOverride = '/images/configurateur/carree-originale.png';
const bidonMetalModelStepOverride = '/images/configurateur/bidon-metal-originale.png';
const bidonVertModelStepOverride = '/images/configurateur/bidon-vert-originale.png';

interface BottleViewerProps {
  model: BottleModel;
  labelStyle: LabelStyle | null;
  customText: string;
  size: string;
  sizeId?: string;
  currentStep?: number;
}

const SIZE_SCALE: Record<string, number> = {
  '3 لتر': 1.0,
  '500 مل': 0.8,
  '750 مل': 0.88,
  '1 لتر': 0.95,
};

export default function BottleViewer({ model, labelStyle, size, sizeId, currentStep = 0 }: BottleViewerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [prevModelId, setPrevModelId] = useState(model.id);
  const [transitioning, setTransitioning] = useState(false);
  const sizeScale = SIZE_SCALE[size] ?? 0.85;
  const comboKey = sizeId && labelStyle ? getComboImageKey(model.id, sizeId, labelStyle.id) : '';
  const comboImage = comboKey && currentStep >= 2 ? COMBO_IMAGES[comboKey] : undefined;
  const sizeStepOverride = currentStep === 1 && model.id === 'cylindrique-500'
    ? (sizeId === '500ml' ? cylindrique500SizeStepOverride
      : sizeId === '750ml' ? cylindrique750SizeStepOverride
      : undefined)
    : undefined;
  const modelStepOverride = currentStep === 0
    ? (model.id === 'carree-750' ? carreeModelStepOverride
      : model.id === 'bidon-metal-3l' ? bidonMetalModelStepOverride
      : model.id === 'bidon-vert-1l' ? bidonVertModelStepOverride
      : undefined)
    : undefined;
  const bottleImage = modelStepOverride ?? sizeStepOverride ?? comboImage ?? model.sizeImages?.[size] ?? model.image;

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
          background: `radial-gradient(ellipse, ${labelStyle?.accentColor ?? '#c9a84c'}33 0%, transparent 70%)`,
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
