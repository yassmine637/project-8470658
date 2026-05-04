import { Link, useLocation } from 'react-router-dom';

export default function NotFound() {
  const location = useLocation();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: '#f8f6f1' }}
    >
      <Link
        to="/"
        style={{
          fontFamily: "'Cormorant Garant', serif",
          fontSize: '1.2rem',
          fontWeight: 700,
          color: '#1a2617',
          letterSpacing: '0.2em',
          textDecoration: 'none',
          marginBottom: '3rem',
          display: 'block',
          textTransform: 'uppercase',
        }}
      >
        Domaine Fendri
      </Link>

      <div
        className="font-black select-none"
        style={{
          fontFamily: "'Cormorant Garant', serif",
          fontSize: 'clamp(6rem, 20vw, 14rem)',
          color: 'rgba(26,38,23,0.06)',
          lineHeight: 1,
          marginBottom: '-2rem',
        }}
      >
        404
      </div>

      <div style={{ position: 'relative', zIndex: 10 }}>
        <div
          className="h-px w-16 mx-auto mb-6"
          style={{ background: 'linear-gradient(to right, transparent, #c9a84c, transparent)' }}
        />
        <h1
          className="font-bold mb-3"
          style={{
            fontFamily: "'Cormorant Garant', serif",
            fontSize: 'clamp(1.4rem, 3vw, 2rem)',
            color: '#1a2617',
          }}
        >
          Page introuvable
        </h1>
        <p
          className="mb-2 text-sm"
          style={{
            fontFamily: "'Outfit', sans-serif",
            color: '#9ca3af',
            letterSpacing: '0.05em',
          }}
        >
          {location.pathname}
        </p>
        <p
          className="mb-8 text-sm leading-relaxed"
          style={{ fontFamily: "'Outfit', sans-serif", color: '#6b7c68' }}
        >
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>

        <Link
          to="/"
          className="inline-block px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm transition-all duration-300 hover:-translate-y-0.5"
          style={{
            background: 'linear-gradient(135deg, #1a2617 0%, #2f4229 100%)',
            color: '#c9a84c',
            border: '1px solid rgba(201,168,76,0.3)',
            fontFamily: "'Outfit', sans-serif",
            textDecoration: 'none',
            fontSize: '0.7rem',
          }}
        >
          ← Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
