import { useEffect, useRef } from 'react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoModal({ isOpen, onClose }: VideoModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(10, 10, 10, 0.92)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'all' : 'none',
        transition: 'opacity 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Cinema frame */}
      <div
        style={{
          position: 'relative',
          width: '90vw',
          maxWidth: '960px',
          transform: isOpen ? 'scale(1) translateY(0)' : 'scale(0.92) translateY(24px)',
          transition: 'transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,175,55,0.15)',
        }}
      >
        {/* Gold top bar — cinema feel */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(to right, transparent, #d4af37, #c5a028, transparent)',
            zIndex: 10,
          }}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="cursor-pointer"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 20,
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.6)',
            border: '1px solid rgba(212,175,55,0.4)',
            color: '#d4af37',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            transition: 'background 0.2s, border-color 0.2s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(212,175,55,0.2)';
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#d4af37';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.6)';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(212,175,55,0.4)';
          }}
          aria-label="Fermer la vidéo"
        >
          <i className="ri-close-line" />
        </button>

        {/* Video container — 16:9 */}
        <div style={{ position: 'relative', paddingBottom: '56.25%', background: '#0a0a0a' }}>
          {isOpen && (
            <video
              src="https://storage.readdy-site.link/project_files/87cc5f02-5407-43de-a578-ad5a1f36c09a/fda50e29-ad49-4190-8f91-d56bcb4a04a2_video.mp4?v=25bdd4bd5a80ff00f03621c219107374"
              title="L'histoire de Domaine Fendri"
              controls
              autoPlay
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                border: 'none',
                background: '#0a0a0a',
              }}
            />
          )}
        </div>

        {/* Caption bar */}
        <div
          style={{
            background: '#0d0d0d',
            padding: '14px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            borderTop: '1px solid rgba(212,175,55,0.12)',
          }}
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #d4af37, #c5a028)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <i className="ri-play-fill" style={{ color: '#1a2617', fontSize: '12px' }} />
          </div>
          <div>
            <p style={{ color: '#d4af37', fontFamily: "'Cormorant Garant', serif", fontSize: '0.95rem', fontWeight: 600, margin: 0 }}>
              L&apos;histoire de Domaine Fendri
            </p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: "'Outfit', sans-serif", fontSize: '0.72rem', margin: 0, letterSpacing: '0.08em' }}>
              DEPUIS 1911 · MEKNESSI, SFAX
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
