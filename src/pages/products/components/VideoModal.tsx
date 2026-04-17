import { useEffect, useRef } from 'react';
import { Product } from '@/mocks/products';

interface VideoModalProps {
  product: Product;
  onClose: () => void;
}

export default function VideoModal({ product, onClose }: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const accent = product.accentColor ?? '#c9a84c';

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      style={{ background: 'rgba(10,16,10,0.85)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-2xl overflow-hidden"
        style={{ background: '#0d1a0d', border: `1px solid ${accent}40` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${accent}25` }}>
          <div>
            <p className="text-xs uppercase tracking-widest mb-0.5" style={{ color: accent, fontFamily: "'Outfit', sans-serif" }}>
              {product.volume}
            </p>
            <h3 className="text-lg font-bold" style={{ fontFamily: "'Cormorant Garant', serif", color: '#f5f0e8' }}>
              {product.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.07)', color: '#f5f0e8', border: 'none' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = `${accent}30`; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.07)'; }}
          >
            <i className="ri-close-line text-lg" />
          </button>
        </div>

        {/* Video */}
        <div className="relative" style={{ background: '#000', aspectRatio: '16/9' }}>
          {product.videoUrl ? (
            <video
              ref={videoRef}
              src={product.videoUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
              style={{ display: 'block' }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4" style={{ minHeight: '360px' }}>
              <div
                className="w-16 h-16 flex items-center justify-center rounded-full"
                style={{ background: `${accent}20`, border: `1px solid ${accent}40` }}
              >
                <i className="ri-film-line text-2xl" style={{ color: accent }} />
              </div>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: "'Outfit', sans-serif" }}>
                Vidéo bientôt disponible
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex items-center gap-3" style={{ borderTop: `1px solid ${accent}20` }}>
          <i className="ri-information-line text-sm flex-shrink-0" style={{ color: accent }} />
          <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: "'Outfit', sans-serif" }}>
            Découvrez chaque détail de cette bouteille — forme, finition, étiquette et contenance.
          </p>
        </div>
      </div>
    </div>
  );
}
