interface PackagingOverlayProps {
  packagingId: string;
  layer: 'back' | 'front';
  visible: boolean;
}

export default function PackagingOverlay({ packagingId, layer, visible }: PackagingOverlayProps) {
  if (packagingId === 'none' || !visible) return null;

  const style: React.CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '64%',
    height: '50%',
    pointerEvents: 'none',
    zIndex: layer === 'back' ? 0 : 2,
    transition: 'opacity 0.4s ease',
    opacity: visible ? 1 : 0,
  };

  /* ── Coffret Tiroir Rigide avec insert mousse EVA ── */
  if (packagingId === 'coffret-tiroir') {
    if (layer === 'back') {
      return (
        <div style={style}>
          <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
            <defs>
              <linearGradient id="tiroirShell" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3A5240" />
                <stop offset="100%" stopColor="#263830" />
              </linearGradient>
              <linearGradient id="tiroirSide" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#1C2E22" />
                <stop offset="100%" stopColor="#2C3E30" />
              </linearGradient>
              <linearGradient id="foamGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5B8060" />
                <stop offset="100%" stopColor="#3A5240" />
              </linearGradient>
            </defs>
            {/* Outer shell — back panel */}
            <rect x="28" y="54" width="184" height="186" rx="3" fill="url(#tiroirShell)" />
            {/* Right side 3D depth */}
            <path d="M212 54 L236 36 L236 216 L212 240 Z" fill="url(#tiroirSide)" />
            {/* Top edge of outer shell */}
            <rect x="28" y="54" width="184" height="8" rx="3 3 0 0" fill="#4A6850" />
            {/* Drawer slot visible from back — inner cavity */}
            <rect x="36" y="66" width="168" height="166" rx="2" fill="#1C2A20" opacity="0.7" />
            {/* EVA foam insert back layer */}
            <rect x="42" y="72" width="156" height="154" rx="2" fill="url(#foamGrad)" opacity="0.5" />
            {/* Foam texture cells */}
            {[88, 108, 128, 148, 168, 188, 208].map(y => (
              <line key={`h${y}`} x1="42" y1={y} x2="198" y2={y} stroke="#2C3E30" strokeWidth="0.6" opacity="0.4" />
            ))}
            {[64, 84, 104, 124, 144, 164, 184].map(x => (
              <line key={`v${x}`} x1={x} y1="72" x2={x} y2="226" stroke="#2C3E30" strokeWidth="0.6" opacity="0.4" />
            ))}
            {/* Corner brackets */}
            <rect x="24" y="50" width="10" height="14" rx="1" fill="#1A2E1E" opacity="0.9" />
            <rect x="206" y="50" width="10" height="14" rx="1" fill="#1A2E1E" opacity="0.9" />
          </svg>
        </div>
      );
    }
    return (
      <div style={style}>
        <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
          <defs>
            <linearGradient id="drawerFront" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4A6850" />
              <stop offset="100%" stopColor="#2C3E30" />
            </linearGradient>
            <linearGradient id="drawerPull" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#C9A84C" />
              <stop offset="50%" stopColor="#F0D070" />
              <stop offset="100%" stopColor="#C9A84C" />
            </linearGradient>
          </defs>
          {/* Drawer front face */}
          <rect x="28" y="158" width="184" height="82" rx="0 0 3 3" fill="url(#drawerFront)" />
          {/* Drawer top edge line */}
          <line x1="28" y1="159" x2="212" y2="159" stroke="#7A9E7E" strokeWidth="1.5" opacity="0.6" />
          {/* Subtle drawer grain lines */}
          {[172, 186, 200, 214].map(y => (
            <line key={y} x1="32" y1={y} x2="208" y2={y} stroke="#1C2E22" strokeWidth="0.5" opacity="0.35" />
          ))}
          {/* Gold pull handle */}
          <rect x="100" y="190" width="40" height="7" rx="3.5" fill="url(#drawerPull)" opacity="0.9" />
          <rect x="103" y="192" width="34" height="3" rx="1.5" fill="#F0D070" opacity="0.35" />
          {/* FENDRI embossed text */}
          <text x="120" y="222" textAnchor="middle"
            fontFamily="'Cormorant Garant', Georgia, serif"
            fontSize="10" fontWeight="600"
            fill="#7A9E7E" letterSpacing="4" opacity="0.75">FENDRI</text>
          <line x1="78" y1="228" x2="162" y2="228" stroke="#7A9E7E" strokeWidth="0.6" opacity="0.4" />
          {/* Bottom edge */}
          <rect x="28" y="233" width="184" height="7" rx="0 0 3 3" fill="#1C2E22" opacity="0.7" />
        </svg>
      </div>
    );
  }

  /* ── Coffret Rigide à Fermeture Magnétique ── */
  if (packagingId === 'coffret-magnetique') {
    if (layer === 'back') {
      return (
        <div style={style}>
          <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
            <defs>
              <linearGradient id="magBack" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0D0D1A" />
                <stop offset="100%" stopColor="#1A1A2E" />
              </linearGradient>
              <linearGradient id="magSide" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#070712" />
                <stop offset="100%" stopColor="#0D0D1A" />
              </linearGradient>
              <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#C9A84C" />
                <stop offset="50%" stopColor="#F0D070" />
                <stop offset="100%" stopColor="#C9A84C" />
              </linearGradient>
            </defs>
            {/* Box back panel */}
            <rect x="28" y="55" width="184" height="185" rx="3" fill="url(#magBack)" />
            {/* Side panel (3D) */}
            <path d="M212 55 L236 36 L236 218 L212 240 Z" fill="url(#magSide)" />
            {/* Gold border on back */}
            <rect x="28" y="55" width="184" height="185" rx="3" fill="none" stroke="url(#goldGrad)" strokeWidth="1.5" />
            {/* Gold side edge */}
            <line x1="212" y1="55" x2="236" y2="36" stroke="#C9A84C" strokeWidth="0.8" opacity="0.6" />
            <line x1="212" y1="240" x2="236" y2="218" stroke="#C9A84C" strokeWidth="0.8" opacity="0.6" />
            {/* Top opening */}
            <rect x="28" y="55" width="184" height="12" rx="3 3 0 0" fill="#1E1E38" />
            <rect x="28" y="55" width="184" height="3" rx="2" fill="url(#goldGrad)" opacity="0.8" />
            {/* Interior velvet */}
            <rect x="32" y="67" width="176" height="169" fill="#100820" opacity="0.55" />
          </svg>
        </div>
      );
    }
    return (
      <div style={style}>
        <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
          <defs>
            <linearGradient id="goldV" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F0D070" />
              <stop offset="50%" stopColor="#C9A84C" />
              <stop offset="100%" stopColor="#F0D070" />
            </linearGradient>
            <linearGradient id="goldH" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#C9A84C" />
              <stop offset="50%" stopColor="#F0D070" />
              <stop offset="100%" stopColor="#C9A84C" />
            </linearGradient>
          </defs>
          {/* Front box face */}
          <rect x="28" y="160" width="184" height="80" rx="0 0 3 3" fill="#0D0D1A" />
          <rect x="28" y="160" width="184" height="80" rx="0 0 3 3" fill="none" stroke="url(#goldH)" strokeWidth="1.5" />
          {/* Thin gold line near top of front */}
          <line x1="28" y1="168" x2="212" y2="168" stroke="#C9A84C" strokeWidth="0.6" opacity="0.45" />
          {/* Magnetic clasp — center bar */}
          <rect x="104" y="157" width="32" height="6" rx="3" fill="#1E1E38" stroke="url(#goldH)" strokeWidth="1" />
          {/* Magnet dots */}
          <circle cx="114" cy="160" r="2.5" fill="#C9A84C" opacity="0.9" />
          <circle cx="126" cy="160" r="2.5" fill="#C9A84C" opacity="0.9" />
          {/* FENDRI text */}
          <text x="120" y="194" textAnchor="middle"
            fontFamily="'Cormorant Garant', Georgia, serif"
            fontSize="11" fontWeight="600"
            fill="#d4af37" letterSpacing="4.5" opacity="0.9">FENDRI</text>
          <line x1="72" y1="200" x2="168" y2="200" stroke="#C9A84C" strokeWidth="0.7" opacity="0.5" />
          <text x="120" y="212" textAnchor="middle"
            fontFamily="'Outfit', sans-serif"
            fontSize="5.5" fill="#C9A84C" letterSpacing="2" opacity="0.6">FERMETURE MAGNÉTIQUE</text>
          {/* Bottom gold edge */}
          <rect x="28" y="233" width="184" height="3" rx="0 0 2 2" fill="url(#goldH)" opacity="0.7" />
        </svg>
      </div>
    );
  }

  /* ── Tube Cylindrique Rigide Premium ── */
  if (packagingId === 'tube-cylindrique') {
    if (layer === 'back') {
      return (
        <div style={style}>
          <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
            <defs>
              <linearGradient id="tubeBody" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#1A1410" />
                <stop offset="35%" stopColor="#2E2618" />
                <stop offset="65%" stopColor="#3A3020" />
                <stop offset="100%" stopColor="#1A1410" />
              </linearGradient>
              <linearGradient id="tubeSide" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#0E0C08" />
                <stop offset="100%" stopColor="#1A1410" />
              </linearGradient>
              <linearGradient id="tubeGold" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#C9A84C" />
                <stop offset="50%" stopColor="#F0D070" />
                <stop offset="100%" stopColor="#C9A84C" />
              </linearGradient>
            </defs>
            {/* Tube body — elliptical cylinder */}
            <rect x="54" y="48" width="148" height="192" rx="74" fill="url(#tubeBody)" />
            {/* Right shadow for 3D roundness */}
            <rect x="168" y="48" width="34" height="192" rx="0 74 74 0" fill="#0A0806" opacity="0.55" />
            {/* Left highlight */}
            <rect x="54" y="48" width="28" height="192" rx="74 0 0 74" fill="rgba(255,255,255,0.04)" />
            {/* Horizontal ring lines for tube depth */}
            {[80, 110, 140, 170, 200].map(y => (
              <ellipse key={y} cx="128" cy={y} rx="74" ry="5" stroke="#C9A84C" strokeWidth="0.5" fill="none" opacity="0.12" />
            ))}
            {/* Top cap ellipse */}
            <ellipse cx="128" cy="48" rx="74" ry="10" fill="#2E2618" stroke="url(#tubeGold)" strokeWidth="1.2" />
            <ellipse cx="128" cy="48" rx="60" ry="7" fill="#1A1410" opacity="0.6" />
          </svg>
        </div>
      );
    }
    return (
      <div style={style}>
        <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
          <defs>
            <linearGradient id="tubeGoldH" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#C9A84C" />
              <stop offset="50%" stopColor="#F0D070" />
              <stop offset="100%" stopColor="#C9A84C" />
            </linearGradient>
            <linearGradient id="tubeLidFront" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3A3020" />
              <stop offset="100%" stopColor="#1A1410" />
            </linearGradient>
          </defs>
          {/* Bottom cap — front ellipse */}
          <ellipse cx="128" cy="232" rx="74" ry="10" fill="#2E2618" stroke="url(#tubeGoldH)" strokeWidth="1.2" />
          {/* Gold ring bands */}
          <ellipse cx="128" cy="166" rx="74" ry="6" fill="none" stroke="url(#tubeGoldH)" strokeWidth="2.5" opacity="0.85" />
          <ellipse cx="128" cy="174" rx="74" ry="6" fill="none" stroke="url(#tubeGoldH)" strokeWidth="1" opacity="0.45" />
          {/* FENDRI text on tube front face */}
          <text x="128" y="198" textAnchor="middle"
            fontFamily="'Cormorant Garant', Georgia, serif"
            fontSize="12" fontWeight="600"
            fill="#C9A84C" letterSpacing="4" opacity="0.9">FENDRI</text>
          <line x1="84" y1="204" x2="172" y2="204" stroke="#C9A84C" strokeWidth="0.7" opacity="0.45" />
          <text x="128" y="216" textAnchor="middle"
            fontFamily="'Outfit', sans-serif"
            fontSize="5.5" fill="#C0A882" letterSpacing="2" opacity="0.55">HUILE D'OLIVE PREMIUM</text>
          {/* Small vertical highlight stripe */}
          <rect x="88" y="160" width="5" height="68" rx="2.5" fill="rgba(255,255,255,0.06)" />
        </svg>
      </div>
    );
  }

  return null;
}
