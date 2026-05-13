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

  if (packagingId === 'sac-cadeau') {
    if (layer === 'back') {
      return (
        <div style={style}>
          <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
            <defs>
              <linearGradient id="sacBag" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#F0D9B0" />
                <stop offset="100%" stopColor="#F5E6C8" />
              </linearGradient>
              <linearGradient id="sacSide" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#C8A97E" />
                <stop offset="100%" stopColor="#D4B98A" />
              </linearGradient>
            </defs>
            {/* Bag side face (3D depth) */}
            <path d="M210 40 L230 56 L230 240 L210 240 Z" fill="url(#sacSide)" opacity="0.6" />
            {/* Bag back body */}
            <rect x="30" y="40" width="180" height="200" rx="3" fill="url(#sacBag)" />
            {/* Subtle creases */}
            <line x1="30" y1="80" x2="210" y2="80" stroke="#C8A97E" strokeWidth="0.6" opacity="0.35" />
            <line x1="120" y1="40" x2="120" y2="240" stroke="#C8A97E" strokeWidth="0.4" opacity="0.2" />
          </svg>
        </div>
      );
    }
    return (
      <div style={style}>
        <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
          <defs>
            <linearGradient id="sacFront" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F5E6C8" />
              <stop offset="100%" stopColor="#E8D2A4" />
            </linearGradient>
          </defs>
          {/* Left rope handle */}
          <path d="M 82 42 Q 82 4 120 4 Q 158 4 158 42"
            stroke="#8B6233" strokeWidth="5.5" fill="none" strokeLinecap="round" />
          {/* Shadow under handles */}
          <path d="M 82 42 Q 82 4 120 4 Q 158 4 158 42"
            stroke="#5C3D14" strokeWidth="5.5" fill="none" strokeLinecap="round" opacity="0.15" />
          {/* Tissue paper peek */}
          <path d="M 46 44 Q 72 22 98 38 Q 120 22 142 38 Q 168 22 194 44" fill="rgba(255,255,255,0.72)" />
          <path d="M 46 44 Q 72 24 98 40 Q 120 24 142 40 Q 168 24 194 44" fill="none" stroke="#E0CCB0" strokeWidth="0.8" />
          {/* Front face of bag (covers lower bottle portion) */}
          <rect x="30" y="168" width="180" height="72" rx="0" fill="url(#sacFront)" />
          {/* Front face subtle fold */}
          <line x1="30" y1="175" x2="210" y2="175" stroke="#C8A97E" strokeWidth="0.7" opacity="0.4" />
          {/* FENDRI text on bag */}
          <text x="120" y="138" textAnchor="middle"
            fontFamily="'Cormorant Garant', Georgia, serif"
            fontSize="11" fontWeight="600"
            fill="#8B6233" letterSpacing="4" opacity="0.75">FENDRI</text>
          <line x1="82" y1="144" x2="158" y2="144" stroke="#8B6233" strokeWidth="0.6" opacity="0.45" />
          <text x="120" y="156" textAnchor="middle"
            fontFamily="'Outfit', sans-serif"
            fontSize="6" fill="#8B6233" letterSpacing="2.5" opacity="0.45">HUILE D'OLIVE</text>
          {/* Bottom of bag */}
          <rect x="30" y="228" width="180" height="12" rx="0 0 3 3" fill="#C8A97E" opacity="0.45" />
        </svg>
      </div>
    );
  }

  if (packagingId === 'coffret-kraft') {
    if (layer === 'back') {
      return (
        <div style={style}>
          <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
            <defs>
              <linearGradient id="kraftBack" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#C4873E" />
                <stop offset="100%" stopColor="#A66E2A" />
              </linearGradient>
              <linearGradient id="kraftTop" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#D49A50" />
                <stop offset="100%" stopColor="#B87D38" />
              </linearGradient>
            </defs>
            {/* Box back panel */}
            <rect x="30" y="60" width="180" height="180" rx="2" fill="url(#kraftBack)" />
            {/* Box right side (3D) */}
            <path d="M210 60 L236 38 L236 214 L210 240 Z" fill="#8B5E22" opacity="0.75" />
            {/* Top rim of box */}
            <rect x="30" y="60" width="180" height="10" rx="2 2 0 0" fill="url(#kraftTop)" />
            {/* Corrugation lines on back */}
            {[80, 100, 120, 140, 160, 180, 200, 220].map(y => (
              <line key={y} x1="30" y1={y} x2="210" y2={y} stroke="#8B5E22" strokeWidth="0.5" opacity="0.3" />
            ))}
            {/* Open back flap */}
            <path d="M30 60 Q120 20 210 60" fill="#D49A50" stroke="#B87D38" strokeWidth="0.8" />
            <path d="M30 60 Q120 30 210 60" fill="none" stroke="#A06830" strokeWidth="0.5" opacity="0.5" />
          </svg>
        </div>
      );
    }
    return (
      <div style={style}>
        <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
          <defs>
            <linearGradient id="kraftFront" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D49A50" />
              <stop offset="100%" stopColor="#B87D38" />
            </linearGradient>
          </defs>
          {/* Front flap folded outward */}
          <path d="M30 60 Q120 96 210 60 L210 86 Q120 122 30 86 Z" fill="#D49A50" stroke="#A06830" strokeWidth="0.8" />
          {/* Front box face (covers lower bottle) */}
          <rect x="30" y="160" width="180" height="80" rx="0 0 2 2" fill="url(#kraftFront)" />
          {/* Corrugation lines on front */}
          {[174, 188, 202, 216].map(y => (
            <line key={y} x1="34" y1={y} x2="206" y2={y} stroke="#8B5E22" strokeWidth="0.5" opacity="0.4" />
          ))}
          {/* Bottom edge */}
          <rect x="30" y="232" width="180" height="8" rx="0 0 2 2" fill="#8B5E22" opacity="0.5" />
          {/* Flap fold crease */}
          <line x1="30" y1="85" x2="210" y2="85" stroke="#A06830" strokeWidth="0.6" opacity="0.4" />
          {/* Stamp / label area */}
          <rect x="72" y="190" width="96" height="28" rx="2" fill="rgba(0,0,0,0.08)" />
          <text x="120" y="202" textAnchor="middle"
            fontFamily="'Cormorant Garant', Georgia, serif"
            fontSize="9" fontWeight="700"
            fill="#6B3F10" letterSpacing="3.5" opacity="0.85">FENDRI</text>
          <text x="120" y="212" textAnchor="middle"
            fontFamily="'Outfit', sans-serif"
            fontSize="5.5" fill="#6B3F10" letterSpacing="1.5" opacity="0.55">HUILE D'OLIVE BIO</text>
        </svg>
      </div>
    );
  }

  if (packagingId === 'coffret-prestige') {
    if (layer === 'back') {
      return (
        <div style={style}>
          <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
            <defs>
              <linearGradient id="prestBack" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0D0D1A" />
                <stop offset="100%" stopColor="#1A1A2E" />
              </linearGradient>
              <linearGradient id="prestSide" x1="0" y1="0" x2="1" y2="0">
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
            <rect x="28" y="55" width="184" height="185" rx="3" fill="url(#prestBack)" />
            {/* Side panel (3D) */}
            <path d="M212 55 L236 36 L236 218 L212 240 Z" fill="url(#prestSide)" />
            {/* Gold border on back */}
            <rect x="28" y="55" width="184" height="185" rx="3" fill="none" stroke="url(#goldGrad)" strokeWidth="1.5" />
            {/* Gold side edge */}
            <line x1="212" y1="55" x2="236" y2="36" stroke="#C9A84C" strokeWidth="0.8" opacity="0.6" />
            <line x1="212" y1="240" x2="236" y2="218" stroke="#C9A84C" strokeWidth="0.8" opacity="0.6" />
            {/* Top opening */}
            <rect x="28" y="55" width="184" height="12" rx="3 3 0 0" fill="#1E1E38" />
            <rect x="28" y="55" width="184" height="3" rx="2" fill="url(#goldGrad)" opacity="0.8" />
            {/* Interior velvet visible */}
            <rect x="32" y="67" width="176" height="169" fill="#1A0A28" opacity="0.5" />
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
          {/* Front box face (covers lower bottle portion) */}
          <rect x="28" y="162" width="184" height="78" rx="0 0 3 3" fill="#0D0D1A" />
          <rect x="28" y="162" width="184" height="78" rx="0 0 3 3" fill="none" stroke="url(#goldH)" strokeWidth="1.5" />
          {/* Gold ribbon vertical strip */}
          <rect x="113" y="0" width="14" height="162" fill="url(#goldV)" opacity="0.22" />
          {/* Gold ribbon on front face */}
          <rect x="113" y="162" width="14" height="78" fill="url(#goldV)" opacity="0.3" />
          {/* Gold bow at top center */}
          <path d="M120 10 Q106 0 102 14 Q98 28 120 28 Q142 28 138 14 Q134 0 120 10 Z"
            fill="url(#goldH)" opacity="0.9" />
          <circle cx="120" cy="18" r="5" fill="#d4af37" />
          <circle cx="120" cy="18" r="2.5" fill="#F0D070" />
          {/* Ribbon tails */}
          <path d="M114 28 L106 52" stroke="url(#goldV)" strokeWidth="14" strokeLinecap="round" opacity="0.22" />
          <path d="M126 28 L134 52" stroke="url(#goldV)" strokeWidth="14" strokeLinecap="round" opacity="0.22" />
          {/* FENDRI text on front */}
          <text x="120" y="196" textAnchor="middle"
            fontFamily="'Cormorant Garant', Georgia, serif"
            fontSize="11" fontWeight="600"
            fill="#d4af37" letterSpacing="4.5" opacity="0.9">FENDRI</text>
          <line x1="72" y1="202" x2="168" y2="202" stroke="#C9A84C" strokeWidth="0.7" opacity="0.5" />
          <text x="120" y="214" textAnchor="middle"
            fontFamily="'Outfit', sans-serif"
            fontSize="5.5" fill="#C9A84C" letterSpacing="2" opacity="0.6">ÉDITION PRESTIGE</text>
          {/* Bottom gold edge */}
          <rect x="28" y="233" width="184" height="3" rx="0 0 2 2" fill="url(#goldH)" opacity="0.7" />
          {/* Magnetic clasp hint */}
          <rect x="110" y="159" width="20" height="5" rx="2" fill="#C9A84C" opacity="0.6" />
        </svg>
      </div>
    );
  }

  if (packagingId === 'coffret-bois') {
    if (layer === 'back') {
      return (
        <div style={style}>
          <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
            <defs>
              <linearGradient id="woodBack" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#A8714A" />
                <stop offset="100%" stopColor="#7D4F2C" />
              </linearGradient>
              <linearGradient id="woodSide" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#5C3218" />
                <stop offset="100%" stopColor="#7D4F2C" />
              </linearGradient>
            </defs>
            {/* Box back panel */}
            <rect x="28" y="56" width="184" height="184" rx="2" fill="url(#woodBack)" />
            {/* Side panel (3D) */}
            <path d="M212 56 L236 36 L236 216 L212 240 Z" fill="url(#woodSide)" />
            {/* Wood plank lines on back */}
            {[90, 114, 138, 162, 186, 210].map(y => (
              <line key={y} x1="28" y1={y} x2="212" y2={y} stroke="#5C3218" strokeWidth="1.2" opacity="0.5" />
            ))}
            {/* Wood grain texture */}
            {[50, 80, 110, 140, 170].map(x => (
              <path key={x} d={`M${x} 56 Q${x + 8} 100 ${x + 4} 240`} stroke="#6B3F1C" strokeWidth="0.4" opacity="0.2" />
            ))}
            {/* Plank highlight */}
            {[78, 126, 174].map(y => (
              <line key={y} x1="28" y1={y} x2="212" y2={y} stroke="#C4935A" strokeWidth="0.5" opacity="0.18" />
            ))}
            {/* Corner bracket back-right */}
            <rect x="206" y="52" width="10" height="16" rx="1" fill="#3A2010" opacity="0.8" />
            <rect x="206" y="228" width="10" height="14" rx="1" fill="#3A2010" opacity="0.8" />
          </svg>
        </div>
      );
    }
    return (
      <div style={style}>
        <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
          <defs>
            <linearGradient id="woodFront" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#B87D50" />
              <stop offset="100%" stopColor="#8B5E36" />
            </linearGradient>
          </defs>
          {/* Front face (covers lower bottle) */}
          <rect x="28" y="155" width="184" height="85" rx="0 0 2 2" fill="url(#woodFront)" />
          {/* Plank lines on front face */}
          {[174, 196, 218].map(y => (
            <line key={y} x1="32" y1={y} x2="208" y2={y} stroke="#5C3218" strokeWidth="1" opacity="0.45" />
          ))}
          {/* Plank highlight */}
          {[185, 207].map(y => (
            <line key={y} x1="32" y1={y} x2="208" y2={y} stroke="#C4935A" strokeWidth="0.5" opacity="0.15" />
          ))}
          {/* Corner brackets front */}
          <rect x="24" y="150" width="10" height="16" rx="1" fill="#2A1608" opacity="0.85" />
          <rect x="206" y="150" width="10" height="16" rx="1" fill="#2A1608" opacity="0.85" />
          <rect x="24" y="230" width="10" height="14" rx="1" fill="#2A1608" opacity="0.85" />
          <rect x="206" y="230" width="10" height="14" rx="1" fill="#2A1608" opacity="0.85" />
          {/* Nail dots at corners */}
          {[[27,154],[213,154],[27,237],[213,237]].map(([x,y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="2" fill="#1A0A00" opacity="0.7" />
          ))}
          {/* Engraved label area */}
          <rect x="62" y="177" width="116" height="34" rx="2" fill="rgba(0,0,0,0.12)" />
          {/* Engraved text */}
          <text x="120" y="191" textAnchor="middle"
            fontFamily="'Cormorant Garant', Georgia, serif"
            fontSize="10" fontWeight="700"
            fill="#4A2810" letterSpacing="4" opacity="0.9">FENDRI</text>
          <line x1="78" y1="196" x2="162" y2="196" stroke="#5C3218" strokeWidth="0.6" opacity="0.55" />
          <text x="120" y="206" textAnchor="middle"
            fontFamily="'Outfit', sans-serif"
            fontSize="5.5" fill="#5C3218" letterSpacing="1.5" opacity="0.55">HUILE D'OLIVE</text>
          {/* Box top edge trim */}
          <rect x="28" y="153" width="184" height="4" rx="0" fill="#5C3218" opacity="0.6" />
          <line x1="28" y1="155" x2="212" y2="155" stroke="#C4935A" strokeWidth="0.5" opacity="0.3" />
        </svg>
      </div>
    );
  }

  return null;
}
