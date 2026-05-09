import { useState, useRef, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Frame {
  id: string;
  url: string;
  name: string;
}

export default function Studio360Page() {
  const [frames, setFrames] = useState<Frame[]>([]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(12);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isDraggingViewer, setIsDraggingViewer] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [draggingThumb, setDraggingThumb] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | undefined>(undefined);
  const lastTsRef = useRef<number | undefined>(undefined);
  const frameFloatRef = useRef(0);
  const dragStartRef = useRef({ x: 0, frame: 0 });

  useEffect(() => { frameFloatRef.current = currentFrame; }, [currentFrame]);

  useEffect(() => {
    if (!isPlaying || frames.length < 2) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTsRef.current = undefined;
      return;
    }
    const tick = (ts: number) => {
      if (!lastTsRef.current) lastTsRef.current = ts;
      const dt = Math.min(ts - lastTsRef.current, 50);
      lastTsRef.current = ts;
      frameFloatRef.current = (frameFloatRef.current + (playSpeed * dt / 1000)) % frames.length;
      setCurrentFrame(Math.floor(frameFloatRef.current));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTsRef.current = undefined;
    };
  }, [isPlaying, frames.length, playSpeed]);

  const addFiles = useCallback((files: FileList | File[]) => {
    const sorted = Array.from(files)
      .filter(f => f.type.startsWith('image/'))
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
    const newFrames: Frame[] = sorted.map(f => ({
      id: `${Date.now()}-${Math.random()}`,
      url: URL.createObjectURL(f),
      name: f.name,
    }));
    setFrames(prev => [...prev, ...newFrames]);
  }, []);

  const removeFrame = (id: string) => {
    setFrames(prev => {
      const next = prev.filter(f => f.id !== id);
      setCurrentFrame(c => Math.min(c, Math.max(0, next.length - 1)));
      return next;
    });
  };

  const onDropZone = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  };

  const onViewerMouseDown = (e: React.MouseEvent) => {
    if (frames.length < 2) return;
    setIsPlaying(false);
    setIsDraggingViewer(true);
    dragStartRef.current = { x: e.clientX, frame: frameFloatRef.current };
  };

  useEffect(() => {
    if (!isDraggingViewer) return;
    const onMove = (e: MouseEvent) => {
      const w = viewerRef.current?.offsetWidth ?? 600;
      const dx = e.clientX - dragStartRef.current.x;
      const delta = -(dx / w) * frames.length * 1.6;
      const nf = ((dragStartRef.current.frame + delta) % frames.length + frames.length) % frames.length;
      frameFloatRef.current = nf;
      setCurrentFrame(Math.floor(nf));
    };
    const onUp = () => setIsDraggingViewer(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isDraggingViewer, frames.length]);

  const onTouchStart = (e: React.TouchEvent) => {
    if (frames.length < 2) return;
    setIsPlaying(false);
    setIsDraggingViewer(true);
    dragStartRef.current = { x: e.touches[0].clientX, frame: frameFloatRef.current };
  };
  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    const w = viewerRef.current?.offsetWidth ?? 600;
    const dx = e.touches[0].clientX - dragStartRef.current.x;
    const delta = -(dx / w) * frames.length * 1.6;
    const nf = ((dragStartRef.current.frame + delta) % frames.length + frames.length) % frames.length;
    frameFloatRef.current = nf;
    setCurrentFrame(Math.floor(nf));
  };

  const onThumbDragStart = (i: number) => setDraggingThumb(i);
  const onThumbDragEnter = (i: number) => setDragOverIndex(i);
  const onThumbDragEnd = () => {
    if (draggingThumb !== null && dragOverIndex !== null && draggingThumb !== dragOverIndex) {
      setFrames(prev => {
        const next = [...prev];
        const [moved] = next.splice(draggingThumb, 1);
        next.splice(dragOverIndex, 0, moved);
        return next;
      });
      setCurrentFrame(dragOverIndex);
    }
    setDraggingThumb(null);
    setDragOverIndex(null);
  };

  const displayFrame = frames.length > 0 ? Math.min(Math.floor(currentFrame), frames.length - 1) : 0;
  const accentColor = '#d4af37';

  return (
    <div style={{ minHeight: '100vh', background: '#080d08', color: '#fff', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <header style={{ borderBottom: '1px solid rgba(212,175,55,0.12)', padding: '0 28px', height: '58px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <Link
            to="/"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'Outfit', sans-serif", fontSize: '0.6rem', color: 'rgba(212,175,55,0.55)', letterSpacing: '0.14em', textDecoration: 'none' }}
          >
            <i className="ri-arrow-left-line" /> RETOUR
          </Link>
          <div style={{ width: '1px', height: '18px', background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <span style={{ fontFamily: "'Cormorant Garant', serif", fontSize: '1.5rem', fontWeight: 700, color: accentColor }}>Studio 360°</span>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.55rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>VISIONNEUSE MULTI-ANGLES</span>
          </div>
        </div>
        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.58rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>
          {frames.length} photo{frames.length !== 1 ? 's' : ''} chargée{frames.length !== 1 ? 's' : ''}
        </span>
      </header>

      {/* Body */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', flex: 1, minHeight: 0 }}>

        {/* ── Left panel ── */}
        <div style={{ borderRight: '1px solid rgba(212,175,55,0.08)', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#0a0f0a' }}>

          {/* Drop zone */}
          <div style={{ padding: '18px 18px 0' }}>
            <div
              onDragOver={e => { e.preventDefault(); setIsDraggingOver(true); }}
              onDragLeave={() => setIsDraggingOver(false)}
              onDrop={onDropZone}
              onClick={() => fileInputRef.current?.click()}
              style={{
                borderRadius: '12px',
                border: `2px dashed ${isDraggingOver ? accentColor : 'rgba(212,175,55,0.22)'}`,
                background: isDraggingOver ? 'rgba(212,175,55,0.07)' : 'rgba(255,255,255,0.01)',
                padding: '22px 16px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <i className="ri-image-add-fill" style={{ fontSize: '26px', color: isDraggingOver ? accentColor : 'rgba(212,175,55,0.4)', display: 'block', marginBottom: '8px' }} />
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.68rem', color: 'rgba(255,255,255,0.55)', marginBottom: '3px' }}>
                Glissez vos photos ici
              </div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.54rem', color: 'rgba(255,255,255,0.2)' }}>
                ou cliquez · JPG · PNG · WEBP
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={e => e.target.files && addFiles(e.target.files)}
              />
            </div>
          </div>

          {/* Tips */}
          {frames.length === 0 && (
            <div style={{ padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { icon: 'ri-camera-line', text: 'Photographiez la bouteille sur fond neutre' },
                { icon: 'ri-refresh-line', text: 'Tournez de 15° en 15° (24 photos recommandées)' },
                { icon: 'ri-sort-asc', text: 'Les photos sont triées automatiquement par nom' },
                { icon: 'ri-drag-move-2-line', text: 'Glissez les miniatures pour réordonner' },
              ].map((tip, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <i className={tip.icon} style={{ fontSize: '14px', color: 'rgba(212,175,55,0.4)', marginTop: '1px', flexShrink: 0 }} />
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.6rem', color: 'rgba(255,255,255,0.25)', lineHeight: 1.6 }}>{tip.text}</span>
                </div>
              ))}
              <div style={{ marginTop: '4px', padding: '10px 12px', borderRadius: '8px', background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.1)', fontFamily: "'Outfit', sans-serif", fontSize: '0.58rem', color: 'rgba(212,175,55,0.45)', textAlign: 'center', letterSpacing: '0.05em' }}>
                Minimum 2 photos · Optimal 12–36 photos
              </div>
            </div>
          )}

          {/* Thumbnails — drag to reorder */}
          {frames.length > 0 && (
            <div
              style={{ flex: 1, overflowY: 'auto', padding: '12px 18px 12px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '7px', alignContent: 'start' }}
            >
              {frames.map((frame, i) => (
                <div
                  key={frame.id}
                  draggable
                  onDragStart={() => onThumbDragStart(i)}
                  onDragEnter={() => onThumbDragEnter(i)}
                  onDragEnd={onThumbDragEnd}
                  onDragOver={e => e.preventDefault()}
                  onClick={() => { setIsPlaying(false); setCurrentFrame(i); frameFloatRef.current = i; }}
                  style={{
                    position: 'relative',
                    borderRadius: '7px',
                    overflow: 'hidden',
                    border: i === displayFrame
                      ? `2px solid ${accentColor}`
                      : dragOverIndex === i
                        ? '2px solid rgba(212,175,55,0.4)'
                        : '2px solid rgba(255,255,255,0.05)',
                    cursor: 'grab',
                    aspectRatio: '2/3',
                    background: '#0f0f0f',
                    transition: 'border-color 0.12s, opacity 0.12s',
                    opacity: draggingThumb === i ? 0.4 : 1,
                  }}
                >
                  <img
                    src={frame.url}
                    alt={`vue ${i + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
                    draggable={false}
                  />
                  <div style={{ position: 'absolute', top: '3px', left: '3px', background: 'rgba(0,0,0,0.7)', borderRadius: '3px', padding: '1px 4px', fontFamily: "'Outfit', sans-serif", fontSize: '0.48rem', fontWeight: 700, color: i === displayFrame ? accentColor : 'rgba(255,255,255,0.4)' }}>
                    {i + 1}
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); removeFrame(frame.id); }}
                    style={{ position: 'absolute', top: '3px', right: '3px', width: '16px', height: '16px', borderRadius: '50%', background: 'rgba(200,40,40,0.85)', border: 'none', color: '#fff', fontSize: '9px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <i className="ri-close-line" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Footer actions */}
          {frames.length > 0 && (
            <div style={{ padding: '10px 18px 14px', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', gap: '8px', flexShrink: 0 }}>
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{ flex: 1, padding: '7px', borderRadius: '7px', background: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.18)', color: 'rgba(212,175,55,0.7)', fontFamily: "'Outfit', sans-serif", fontSize: '0.58rem', letterSpacing: '0.08em', cursor: 'pointer' }}
              >
                <i className="ri-add-line" style={{ marginRight: '4px' }} />Ajouter
              </button>
              <button
                onClick={() => { setFrames([]); setCurrentFrame(0); setIsPlaying(false); frameFloatRef.current = 0; }}
                style={{ flex: 1, padding: '7px', borderRadius: '7px', background: 'rgba(200,50,50,0.07)', border: '1px solid rgba(200,50,50,0.18)', color: 'rgba(200,80,80,0.7)', fontFamily: "'Outfit', sans-serif", fontSize: '0.58rem', letterSpacing: '0.08em', cursor: 'pointer' }}
              >
                <i className="ri-delete-bin-line" style={{ marginRight: '4px' }} />Effacer
              </button>
            </div>
          )}
        </div>

        {/* ── Right panel — viewer ── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#080d08', position: 'relative', overflow: 'hidden', padding: '24px' }}>

          {/* Radial ambient */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 45%, rgba(212,175,55,0.04) 0%, transparent 65%)', pointerEvents: 'none' }} />

          {frames.length < 2 ? (
            <div style={{ textAlign: 'center', zIndex: 1 }}>
              <div style={{ fontFamily: "'Cormorant Garant', serif", fontSize: '5rem', color: 'rgba(212,175,55,0.08)', lineHeight: 1, marginBottom: '16px', userSelect: 'none' }}>360°</div>
              <div style={{ fontFamily: "'Cormorant Garant', serif", fontSize: '1.4rem', color: 'rgba(212,175,55,0.25)', marginBottom: '10px' }}>Visionneuse multi-angles</div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.62rem', color: 'rgba(255,255,255,0.15)' }}>
                Importez au moins 2 photos pour activer la visionneuse
              </div>
            </div>
          ) : (
            <>
              {/* Main viewer */}
              <div
                ref={viewerRef}
                onMouseDown={onViewerMouseDown}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={() => setIsDraggingViewer(false)}
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '480px',
                  maxHeight: 'calc(100vh - 240px)',
                  aspectRatio: '2/3',
                  cursor: isDraggingViewer ? 'grabbing' : 'grab',
                  userSelect: 'none',
                  touchAction: 'none',
                  zIndex: 1,
                }}
              >
                {frames.map((frame, i) => (
                  <img
                    key={frame.id}
                    src={frame.url}
                    alt={`vue ${i + 1}`}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      opacity: i === displayFrame ? 1 : 0,
                      pointerEvents: 'none',
                      filter: 'drop-shadow(0 24px 56px rgba(0,0,0,0.6))',
                    }}
                    draggable={false}
                  />
                ))}

                {/* 360° badge */}
                <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(0,0,0,0.5)', border: `1px solid ${accentColor}33`, borderRadius: '20px', padding: '4px 10px 4px 8px', backdropFilter: 'blur(6px)', pointerEvents: 'none' }}>
                  <i className="ri-refresh-line" style={{ fontSize: '11px', color: accentColor }} />
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.55rem', color: 'rgba(255,255,255,0.65)', letterSpacing: '0.08em', fontWeight: 600 }}>360°</span>
                </div>
              </div>

              {/* Drag hint */}
              <div style={{ marginTop: '10px', fontFamily: "'Outfit', sans-serif", fontSize: '0.52rem', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.12em', zIndex: 1 }}>
                ← Glissez pour faire pivoter →
              </div>

              {/* Dot strip */}
              <div style={{ display: 'flex', gap: '5px', marginTop: '16px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '360px', zIndex: 1 }}>
                {frames.map((_, i) => (
                  <div
                    key={i}
                    onClick={() => { setIsPlaying(false); setCurrentFrame(i); frameFloatRef.current = i; }}
                    style={{
                      width: i === displayFrame ? '9px' : '5px',
                      height: i === displayFrame ? '9px' : '5px',
                      borderRadius: '50%',
                      background: i === displayFrame ? accentColor : 'rgba(255,255,255,0.12)',
                      cursor: 'pointer',
                      transition: 'all 0.12s',
                      flexShrink: 0,
                    }}
                  />
                ))}
              </div>

              {/* Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '20px', zIndex: 1 }}>
                <button
                  onClick={() => { setIsPlaying(false); setCurrentFrame(f => { const n = (f - 1 + frames.length) % frames.length; frameFloatRef.current = n; return n; }); }}
                  style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(212,175,55,0.07)', border: `1px solid rgba(212,175,55,0.2)`, color: accentColor, fontSize: '17px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <i className="ri-arrow-left-s-line" />
                </button>

                <button
                  onClick={() => setIsPlaying(p => !p)}
                  style={{ width: '50px', height: '50px', borderRadius: '50%', background: isPlaying ? accentColor : 'rgba(212,175,55,0.1)', border: `1px solid ${accentColor}55`, color: isPlaying ? '#080d08' : accentColor, fontSize: '22px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', boxShadow: isPlaying ? `0 0 20px ${accentColor}44` : 'none' }}
                >
                  <i className={isPlaying ? 'ri-pause-line' : 'ri-play-line'} />
                </button>

                <button
                  onClick={() => { setIsPlaying(false); setCurrentFrame(f => { const n = (f + 1) % frames.length; frameFloatRef.current = n; return n; }); }}
                  style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(212,175,55,0.07)', border: `1px solid rgba(212,175,55,0.2)`, color: accentColor, fontSize: '17px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <i className="ri-arrow-right-s-line" />
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '6px' }}>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.5rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em' }}>VITESSE</span>
                  <input
                    type="range"
                    min={2}
                    max={36}
                    value={playSpeed}
                    onChange={e => setPlaySpeed(Number(e.target.value))}
                    style={{ width: '80px', accentColor }}
                  />
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.52rem', color: 'rgba(212,175,55,0.55)', minWidth: '32px' }}>{playSpeed} fps</span>
                </div>
              </div>

              {/* Frame counter */}
              <div style={{ marginTop: '10px', fontFamily: "'Outfit', sans-serif", fontSize: '0.55rem', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.1em', zIndex: 1 }}>
                Vue {displayFrame + 1} / {frames.length} · {Math.round((displayFrame / frames.length) * 360)}°
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
