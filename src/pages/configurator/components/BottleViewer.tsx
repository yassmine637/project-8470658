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

// Position and dimensions of the label zone per bottle model
// top/left are percentages relative to the rendered image box
const MODEL_LABEL_CONFIG: Record<string, {
  top: string;
  left: string;
  width: string;
  height: string;
  borderRadius: string;
}> = {
  'cylindrique-500': { top: '37%', left: '50%', width: '13%', height: '26%', borderRadius: '3px' },
  'carree-750':      { top: '35%', left: '50%', width: '18%', height: '25%', borderRadius: '3px' },
  'bidon-metal-3l':  { top: '33%', left: '50%', width: '22%', height: '24%', borderRadius: '4px' },
  'bidon-vert-1l':   { top: '35%', left: '50%', width: '18%', height: '24%', borderRadius: '3px' },
};

const DEFAULT_LABEL_CONFIG = { top: '36%', left: '50%', width: '15%', height: '25%', borderRadius: '3px' };

export default function BottleViewer({ model, labelStyle, customText, size }: BottleViewerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [prevModelId, setPrevModelId] = useState(model.id);
  const [transitioning, setTransitioning] = useState(false);
  const sizeScale = SIZE_SCALE[size] ?? 0.85;
  const labelCfg = MODEL_LABEL_CONFIG[model.id] ?? DEFAULT_LABEL_CONFIG;

  useEffect(() => {
    setIsLoaded(false);
  }, [model.id]);

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

  const isDark = labelStyle.bgColor === '#1a1a0e';
  const textColor = isDark ? 'rgba(255,255,255,0.85)' : labelStyle.accentColor;

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

      {/* Bottle + label container */}
      <div
        style={{
          opacity: transitioning ? 0 : 1,
          transition: 'opacity 0.35s ease',
          position: 'relative',
          width: `${sizeScale * 100}%`,
          height: `${sizeScale * 100}%`,
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
            transition: 'opacity 0.45s ease',
            filter: 'drop-shadow(0 28px 48px rgba(0,0,0,0.22))',
            pointerEvents: 'none',
            display: 'block',
          }}
          draggable={false}
        />

        {/* Label overlay — appears once image is loaded */}
        {isLoaded && (
          <div
            style={{
              position: 'absolute',
              top: labelCfg.top,
              left: labelCfg.left,
              transform: 'translateX(-50%)',
              width: labelCfg.width,
              height: labelCfg.height,
              background: labelStyle.bgColor,
              border: `1.5px solid ${labelStyle.borderColor}`,
              borderRadius: labelCfg.borderRadius,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              padding: '6px 8px',
              boxSizing: 'border-box',
              boxShadow: `0 2px 12px rgba(0,0,0,0.18), inset 0 0 0 1px ${labelStyle.accentColor}22`,
              transition: 'background 0.4s ease, border-color 0.4s ease',
              overflow: 'hidden',
              pointerEvents: 'none',
            }}
          >
            {/* Inner shimmer line */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: `linear-gradient(to right, transparent, ${labelStyle.accentColor}55, transparent)` }} />

            <div style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '0.32rem',
              fontWeight: 700,
              letterSpacing: '0.3em',
              color: labelStyle.accentColor,
              textTransform: 'uppercase',
              opacity: 0.75,
            }}>
              Domaine
            </div>

            <div style={{
              fontFamily: "'Cormorant Garant', serif",
              fontSize: '1rem',
              fontWeight: 700,
              color: textColor,
              letterSpacing: '0.12em',
              lineHeight: 1,
            }}>
              FENDRI
            </div>

            <div style={{ width: '55%', height: '0.5px', background: labelStyle.accentColor, opacity: 0.5 }} />

            <div style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '0.3rem',
              color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(80,80,80,0.7)',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}>
              Extra Vierge · Tunisie
            </div>

            {customText ? (
              <div style={{
                fontFamily: "'Cormorant Garant', serif",
                fontSize: '0.42rem',
                fontStyle: 'italic',
                color: labelStyle.accentColor,
                letterSpacing: '0.06em',
                marginTop: '2px',
                maxWidth: '90%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {customText}
              </div>
            ) : null}

            {/* Bottom shimmer line */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px', background: `linear-gradient(to right, transparent, ${labelStyle.accentColor}55, transparent)` }} />
          </div>
        )}

        {/* Loading shimmer */}
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
