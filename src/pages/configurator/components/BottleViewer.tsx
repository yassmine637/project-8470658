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

// ─── Canvas rotating bottle ──────────────────────────────────────────────────
function RotatingBottle({ src, accentColor }: { src: string; accentColor: string }) {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const imgRef      = useRef<HTMLImageElement | null>(null);
  const angleRef    = useRef(0);
  const velRef      = useRef(0.004);          // gentle auto-spin
  const rafRef      = useRef<number>(0);
  const dragging    = useRef(false);
  const lastX       = useRef(0);
  const [opacity, setOpacity] = useState(0);

  // Draw one frame with cylindrical projection + shading
  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const angle  = angleRef.current;
    const cosA   = Math.cos(angle);
    const abscos = Math.abs(cosA);
    const imgW   = W * abscos;
    const imgX   = (W - imgW) / 2;

    if (imgW < 0.5) return;

    if (cosA >= 0) {
      // Front face
      ctx.drawImage(img, imgX, 0, imgW, H);
    } else {
      // Back face — mirror + slightly dim
      ctx.save();
      ctx.translate(W, 0);
      ctx.scale(-1, 1);
      ctx.globalAlpha = 0.55;
      ctx.drawImage(img, W - imgX - imgW, 0, imgW, H);
      ctx.globalAlpha = 1;
      ctx.restore();
    }

    // Cylindrical shading — darker at edges, subtle highlight in centre
    const grad = ctx.createLinearGradient(imgX, 0, imgX + imgW, 0);
    grad.addColorStop(0,    'rgba(0,0,0,0.30)');
    grad.addColorStop(0.18, 'rgba(0,0,0,0.06)');
    grad.addColorStop(0.42, 'rgba(255,255,255,0.07)');
    grad.addColorStop(0.58, 'rgba(255,255,255,0.07)');
    grad.addColorStop(0.82, 'rgba(0,0,0,0.06)');
    grad.addColorStop(1,    'rgba(0,0,0,0.30)');
    ctx.fillStyle = grad;
    ctx.fillRect(imgX, 0, imgW, H);
  }, []);

  // Animation loop
  const animate = useCallback(() => {
    if (!dragging.current) {
      velRef.current += (0.004 - velRef.current) * 0.02; // ease back to auto speed
      angleRef.current += velRef.current;
    }
    drawFrame();
    rafRef.current = requestAnimationFrame(animate);
  }, [drawFrame]);

  // Load image when src changes
  useEffect(() => {
    setOpacity(0);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imgRef.current = img;
      setOpacity(1);
    };
    img.src = src;
  }, [src]);

  // Kick off animation
  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate]);

  // Keep canvas pixel dimensions in sync with CSS size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const sync = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  // Drag to spin
  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    lastX.current = e.clientX;
    velRef.current = 0;
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastX.current;
    velRef.current  = dx * 0.012;
    angleRef.current += velRef.current;
    lastX.current = e.clientX;
  };
  const onMouseUp = () => { dragging.current = false; };

  // Touch support
  const onTouchStart = (e: React.TouchEvent) => {
    dragging.current = true;
    lastX.current = e.touches[0].clientX;
    velRef.current = 0;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!dragging.current) return;
    const dx = e.touches[0].clientX - lastX.current;
    velRef.current   = dx * 0.012;
    angleRef.current += velRef.current;
    lastX.current = e.touches[0].clientX;
  };
  const onTouchEnd = () => { dragging.current = false; };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Floor glow */}
      <div style={{
        position: 'absolute', bottom: '4%', left: '50%',
        transform: 'translateX(-50%)',
        width: '160px', height: '20px', borderRadius: '50%',
        background: `radial-gradient(ellipse, ${accentColor}44 0%, transparent 70%)`,
        filter: 'blur(14px)', pointerEvents: 'none',
        animation: 'glowPulse 3s ease-in-out infinite',
      }} />

      <canvas
        ref={canvasRef}
        style={{
          width: '100%', height: '100%',
          opacity,
          transition: 'opacity 0.5s ease',
          cursor: dragging.current ? 'grabbing' : 'grab',
          display: 'block',
          filter: 'drop-shadow(0 24px 44px rgba(0,0,0,0.24))',
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      />

      <style>{`
        @keyframes glowPulse {
          0%, 100% { opacity: 0.7; transform: translateX(-50%) scaleX(1); }
          50%       { opacity: 1;   transform: translateX(-50%) scaleX(1.18); }
        }
      `}</style>
    </div>
  );
}

// ─── Main viewer ────────────────────────────────────────────────────────────
export default function BottleViewer({
  model, labelStyle, size, sizeId,
  sizeChosen = false, currentStep = 0, packaging,
}: BottleViewerProps) {
  const comboKey   = sizeId && labelStyle ? getComboImageKey(model.id, sizeId, labelStyle.id) : '';
  const comboImage = comboKey && currentStep >= 2 ? COMBO_IMAGES[comboKey] : undefined;

  const sizeStepOverride = currentStep === 1 && sizeChosen && model.id === 'cylindrique-500'
    ? (sizeId === '500ml' ? cylindrique500SizeStepOverride
      : sizeId === '750ml' ? cylindrique750SizeStepOverride
      : sizeId === '1l'    ? cylindrique1LSizeStepOverride
      : sizeId === '3l'    ? cylindrique3LSizeStepOverride
      : undefined)
    : undefined;

  const modelStepOverride = (currentStep === 0 || (currentStep === 1 && !sizeChosen))
    ? (model.id === 'carree-750'    ? carreeModelStepOverride
      : model.id === 'bidon-metal-3l' ? bidonMetalModelStepOverride
      : model.id === 'bidon-vert-1l'  ? bidonVertModelStepOverride
      : undefined)
    : undefined;

  const sizeImage   = (currentStep !== 1 || sizeChosen) ? model.sizeImages?.[size] : undefined;
  const bottleImage = modelStepOverride ?? sizeStepOverride ?? comboImage ?? sizeImage ?? model.image;
  const sizeScale   = SIZE_SCALE[size] ?? 0.85;

  const showPackaging = !!packaging && packaging.id !== 'none' && currentStep >= 3;
  const packagingPhotoKey = showPackaging && sizeId
    ? getPackagingImageKey(packaging!.id, model.id, sizeId, labelStyle?.id) : '';
  const packagingPhotoKeyGeneric = showPackaging && sizeId
    ? getPackagingImageKey(packaging!.id, model.id, sizeId) : '';
  const packagingPhoto = packagingPhotoKey
    ? (PACKAGING_IMAGES[packagingPhotoKey] ?? PACKAGING_IMAGES[packagingPhotoKeyGeneric])
    : undefined;

  const displayImage    = showPackaging && packagingPhoto ? packagingPhoto : bottleImage;
  const [isLoaded, setIsLoaded] = useState(() => loadedImageCache.has(displayImage));
  const [packagingLoaded, setPackagingLoaded] = useState(false);

  useEffect(() => {
    if (!loadedImageCache.has(displayImage)) setIsLoaded(false);
  }, [displayImage]);
  useEffect(() => {
    if (packagingPhoto) setPackagingLoaded(loadedImageCache.has(packagingPhoto));
  }, [packagingPhoto]);

  const accentColor = showPackaging
    ? (packaging?.accentColor ?? '#c9a84c')
    : (labelStyle?.accentColor ?? '#c9a84c');

  // Packaging: show static image (composite photo, already has packaging context)
  if (showPackaging && packagingPhoto) {
    return (
      <div className="relative w-full h-full flex items-center justify-center select-none">
        <div style={{ position: 'absolute', bottom: '6%', left: '50%',
          transform: 'translateX(-50%)', width: '180px', height: '24px',
          borderRadius: '50%', filter: 'blur(16px)', pointerEvents: 'none',
          background: `radial-gradient(ellipse, ${accentColor}44 0%, transparent 70%)`,
          animation: 'glowPulse 3s ease-in-out infinite',
        }} />
        <div style={{ width: '90%', height: '90%', position: 'relative' }}>
          <img
            src={displayImage}
            alt={model.name}
            onLoad={() => { loadedImageCache.add(displayImage); setIsLoaded(true); setPackagingLoaded(true); }}
            className="w-full h-full object-contain object-center"
            style={{
              opacity: isLoaded ? 1 : 0,
              transition: 'opacity 0.45s ease',
              filter: 'drop-shadow(0 28px 48px rgba(0,0,0,0.22))',
              animation: isLoaded ? 'revealBottle 0.6s cubic-bezier(0.22,1,0.36,1) both' : 'none',
              pointerEvents: 'none', display: 'block',
            }}
            draggable={false}
          />
          {(!isLoaded || !packagingLoaded) && (
            <div className="absolute inset-0" style={{
              background: 'linear-gradient(90deg,#f0f0f0 0%,#e8e8e8 50%,#f0f0f0 100%)',
              backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', borderRadius: '8px',
            }} />
          )}
        </div>
        <style>{`
          @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
          @keyframes revealBottle { 0%{opacity:0;transform:translateY(18px) scale(0.96)} 100%{opacity:1;transform:translateY(0) scale(1)} }
          @keyframes glowPulse { 0%,100%{opacity:.7;transform:translateX(-50%) scaleX(1)} 50%{opacity:1;transform:translateX(-50%) scaleX(1.15)} }
        `}</style>
      </div>
    );
  }

  // No packaging: rotating canvas bottle
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none"
      style={{ width: `${sizeScale * 100}%`, height: `${sizeScale * 100}%`, margin: 'auto' }}>
      <RotatingBottle key={bottleImage} src={bottleImage} accentColor={accentColor} />
    </div>
  );
}
