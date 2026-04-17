import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '@/components/feature/Header';
import Footer from '@/components/feature/Footer';
import BackButton from '@/components/base/BackButton';
import VideoModal from './components/VideoModal';
import { products, Product } from '@/mocks/products';
import { useCart } from '@/hooks/useCart';

const BADGE_STYLES: Record<string, { bg: string; color: string }> = {
  'Bio & Naturel':   { bg: '#3a6040', color: '#e8f5e9' },
  'Best-seller':     { bg: '#c9a84c', color: '#1a2617' },
  'Premium':         { bg: '#1a2617', color: '#c9a84c' },
  'Format Familial': { bg: '#7b5e3a', color: '#fdf3e3' },
};

export default function ProductsPage() {
  const { t } = useTranslation();
  const { addToCart, openCart } = useCart();
  const [selected, setSelected] = useState<Product>(products[0]);
  const [videoProduct, setVideoProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Animation states
  const [infoVisible, setInfoVisible] = useState(true);
  const [videoVisible, setVideoVisible] = useState(true);
  const [currentVideoSrc, setCurrentVideoSrc] = useState(products[0].videoUrl ?? '');
  const videoRef = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  const handleSelect = (product: Product) => {
    if (product.id === selected.id) return;

    // Fade out info + video
    setInfoVisible(false);
    setVideoVisible(false);

    setTimeout(() => {
      setSelected(product);
      setCurrentVideoSrc(product.videoUrl ?? '');
      setQuantity(1);
    }, 280);

    setTimeout(() => {
      setVideoVisible(true);
      setInfoVisible(true);
      // Scroll stage into view smoothly
      stageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 380);
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(selected);
    openCart();
  };

  const accent = selected.accentColor ?? '#c9a84c';
  const badgeStyle = selected.badge ? BADGE_STYLES[selected.badge] ?? BADGE_STYLES['Premium'] : null;

  return (
    <>
      <Header />

      {/* ── Page Header ─────────────────────────────────────── */}
      <section className="pt-36 pb-10 px-6 md:px-16" style={{ background: '#f8f6f1' }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <BackButton label={t('products_back')} to="/" />
          </div>
          <div className="flex items-center gap-2 mb-8">
            <Link
              to="/"
              className="text-xs uppercase tracking-widest transition-colors duration-200"
              style={{ color: '#9aaa96', fontFamily: "'Outfit', sans-serif", textDecoration: 'none' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#1a2617'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#9aaa96'; }}
            >
              {t('products_breadcrumb_home')}
            </Link>
            <span style={{ color: '#c9c9c0', fontSize: '0.7rem' }}>/</span>
            <span className="text-xs uppercase tracking-widest" style={{ color: '#1a2617', fontFamily: "'Outfit', sans-serif" }}>
              {t('products_breadcrumb_collection')}
            </span>
          </div>

          <div className="flex flex-col items-center text-center gap-3">
            <h1
              className="font-bold leading-tight"
              style={{ fontFamily: "'Cormorant Garant', serif", fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', color: '#1a2617' }}
            >
              {t('products_title')}
            </h1>
            <p
              className="max-w-lg text-sm leading-relaxed"
              style={{ color: '#6b7c68', fontFamily: "'Outfit', sans-serif", lineHeight: '1.85' }}
            >
              {t('products_subtitle')}
            </p>
          </div>

          <div className="mt-8 h-px w-full" style={{ background: 'linear-gradient(to right, rgba(201,168,76,0.4), transparent)' }} />
        </div>
      </section>

      {/* ── Bottle Lineup ───────────────────────────────────── */}
      <section className="py-10 px-4 md:px-10" style={{ background: '#f8f6f1' }}>
        <div className="max-w-7xl mx-auto">
          <p
            className="text-center mb-10 text-sm uppercase tracking-widest"
            style={{ color: '#9aaa96', fontFamily: "'Outfit', sans-serif" }}
          >
            Sélectionnez une bouteille pour découvrir son animation
          </p>

          <div className="flex items-end justify-center gap-4 md:gap-8 flex-wrap">
            {products.map((product) => {
              const isActive = product.id === selected.id;
              const pAccent = product.accentColor ?? '#c9a84c';
              const pBadge = product.badge ? BADGE_STYLES[product.badge] ?? BADGE_STYLES['Premium'] : null;

              return (
                <button
                  key={product.id}
                  onClick={() => handleSelect(product)}
                  className="flex flex-col items-center relative cursor-pointer border-none bg-transparent p-0"
                  style={{ outline: 'none' }}
                >
                  {/* Badge */}
                  {pBadge && product.badge && (
                    <span
                      className="mb-2 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider transition-opacity duration-300"
                      style={{
                        background: pBadge.bg,
                        color: pBadge.color,
                        fontFamily: "'Outfit', sans-serif",
                        opacity: isActive ? 1 : 0.45,
                        fontSize: '0.6rem',
                      }}
                    >
                      {product.badge}
                    </span>
                  )}

                  {/* Bottle image container */}
                  <div
                    className="relative flex items-end justify-center transition-all duration-500"
                    style={{
                      width: isActive ? '160px' : '110px',
                      height: isActive ? '340px' : '240px',
                    }}
                  >
                    {/* Active glow ring */}
                    {isActive && (
                      <div
                        className="absolute inset-0 rounded-2xl"
                        style={{
                          background: `radial-gradient(ellipse at center bottom, ${pAccent}25 0%, transparent 70%)`,
                          transition: 'opacity 0.4s ease',
                        }}
                      />
                    )}

                    <img
                      src={product.image}
                      alt={product.volume}
                      className="transition-all duration-500"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        filter: isActive
                          ? `drop-shadow(0 18px 36px ${pAccent}50)`
                          : 'drop-shadow(0 8px 18px rgba(0,0,0,0.12)) grayscale(0.1)',
                        opacity: isActive ? 1 : 0.6,
                        transform: `scale(${isActive ? (product.imageScale ?? 1) * 1.05 : product.imageScale ?? 1})`,
                        transformOrigin: 'bottom center',
                      }}
                    />
                  </div>

                  {/* Volume label */}
                  <div className="mt-4 text-center transition-all duration-300">
                    <p
                      className="text-xs font-semibold uppercase tracking-wider leading-snug"
                      style={{
                        color: isActive ? pAccent : '#c0bdb4',
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: '0.6rem',
                        maxWidth: '130px',
                      }}
                    >
                      {product.volume}
                    </p>
                    <p
                      className="text-lg font-bold mt-1 transition-all duration-300"
                      style={{
                        fontFamily: "'Cormorant Garant', serif",
                        color: isActive ? '#1a2617' : '#c0bdb4',
                      }}
                    >
                      {product.price} <span className="text-sm" style={{ color: isActive ? pAccent : '#d0cdc6' }}>{product.currency}</span>
                    </p>
                  </div>

                  {/* Active indicator dot */}
                  <div
                    className="mt-3 w-1.5 h-1.5 rounded-full transition-all duration-300"
                    style={{ background: isActive ? pAccent : 'transparent' }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Cinematic Stage — Video + Info ──────────────────── */}
      <section
        ref={stageRef}
        className="px-4 md:px-10 pb-24"
        style={{ background: '#f0ede6' }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Separator */}
          <div
            className="h-px mb-12"
            style={{ background: `linear-gradient(to right, transparent, ${accent}60, transparent)` }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden"
            style={{ boxShadow: `0 32px 80px rgba(0,0,0,0.12), 0 0 0 1px ${accent}20` }}
          >
            {/* Left — Video player */}
            <div
              className="relative flex items-center justify-center overflow-hidden"
              style={{
                background: '#0d1a0d',
                minHeight: '460px',
                opacity: videoVisible ? 1 : 0,
                transition: 'opacity 0.3s ease',
              }}
            >
              {/* Subtle ambient glow behind video */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at center, ${accent}18 0%, transparent 70%)` }}
              />

              {currentVideoSrc ? (
                <video
                  key={currentVideoSrc}
                  ref={videoRef}
                  src={currentVideoSrc}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                  style={{ display: 'block', maxHeight: '520px' }}
                />
              ) : (
                <div className="flex flex-col items-center gap-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  <i className="ri-film-line text-5xl" />
                  <p className="text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>Vidéo bientôt disponible</p>
                </div>
              )}

              {/* Video overlay label */}
              <div
                className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
              >
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ background: accent }}
                />
                <span className="text-xs uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: "'Outfit', sans-serif", fontSize: '0.6rem' }}>
                  Animation produit
                </span>
              </div>

              {/* Full video button */}
              {currentVideoSrc && (
                <button
                  onClick={() => setVideoProduct(selected)}
                  className="absolute bottom-5 right-5 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer"
                  style={{
                    background: 'rgba(0,0,0,0.6)',
                    color: accent,
                    border: `1px solid ${accent}50`,
                    fontFamily: "'Outfit', sans-serif",
                    backdropFilter: 'blur(8px)',
                    fontSize: '0.6rem',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = accent;
                    (e.currentTarget as HTMLButtonElement).style.color = '#1a2617';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.6)';
                    (e.currentTarget as HTMLButtonElement).style.color = accent;
                  }}
                >
                  <i className="ri-fullscreen-line text-sm" />
                  Voir en plein écran
                </button>
              )}
            </div>

            {/* Right — Product info */}
            <div
              className="flex flex-col justify-center p-8 md:p-12"
              style={{
                background: '#ffffff',
                opacity: infoVisible ? 1 : 0,
                transform: infoVisible ? 'translateX(0)' : 'translateX(20px)',
                transition: 'opacity 0.35s ease, transform 0.35s ease',
              }}
            >
              {/* Badge */}
              {badgeStyle && selected.badge && (
                <span
                  className="self-start mb-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                  style={{ background: badgeStyle.bg, color: badgeStyle.color, fontFamily: "'Outfit', sans-serif", fontSize: '0.65rem' }}
                >
                  {selected.badge}
                </span>
              )}

              {/* Volume */}
              <span
                className="text-xs font-semibold uppercase tracking-widest block mb-2"
                style={{ color: accent, fontFamily: "'Outfit', sans-serif" }}
              >
                {selected.volume}
              </span>

              {/* Name */}
              <h2
                className="font-bold leading-tight mb-3"
                style={{ fontFamily: "'Cormorant Garant', serif", fontSize: 'clamp(1.6rem, 2.5vw, 2.1rem)', color: '#1a2617' }}
              >
                {selected.name}
              </h2>

              <div className="h-px w-10 mb-5" style={{ background: `${accent}70` }} />

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-5">
                <span
                  className="font-bold"
                  style={{ fontFamily: "'Cormorant Garant', serif", fontSize: '3rem', color: '#1a2617', lineHeight: 1 }}
                >
                  {selected.price}
                </span>
                <span className="text-base font-semibold" style={{ color: accent, fontFamily: "'Outfit', sans-serif" }}>
                  {selected.currency}
                </span>
              </div>

              {/* Tagline */}
              <p
                className="italic leading-relaxed mb-5"
                style={{ color: accent, fontFamily: "'Cormorant Garant', serif", fontSize: '1.05rem' }}
              >
                &ldquo;{selected.tagline}&rdquo;
              </p>

              {/* Description */}
              <p
                className="text-sm leading-loose mb-6"
                style={{ color: '#6b7c68', fontFamily: "'Outfit', sans-serif", lineHeight: '1.9' }}
              >
                {selected.description}
              </p>

              {/* Details */}
              <div className="flex flex-col gap-2.5 mb-8">
                {selected.details.map((d) => (
                  <div key={d} className="flex items-start gap-2.5">
                    <i
                      className="ri-checkbox-circle-fill text-sm flex-shrink-0 mt-0.5"
                      style={{ color: accent }}
                    />
                    <span className="text-xs leading-relaxed" style={{ color: '#6b7c68', fontFamily: "'Outfit', sans-serif" }}>
                      {d}
                    </span>
                  </div>
                ))}
              </div>

              {/* Quantity + CTA */}
              <div className="flex items-center gap-4 flex-wrap">
                {/* Quantity */}
                <div
                  className="flex items-center rounded-full overflow-hidden"
                  style={{ border: `1px solid ${accent}40`, background: '#f8f6f1' }}
                >
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-9 h-9 flex items-center justify-center text-sm font-bold transition-colors duration-200 cursor-pointer border-none"
                    style={{ color: '#1a2617', background: 'transparent' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = `${accent}20`; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                  >
                    −
                  </button>
                  <span
                    className="w-8 text-center text-sm font-semibold"
                    style={{ color: '#1a2617', fontFamily: "'Outfit', sans-serif" }}
                  >
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-9 h-9 flex items-center justify-center text-sm font-bold transition-colors duration-200 cursor-pointer border-none"
                    style={{ color: '#1a2617', background: 'transparent' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = `${accent}20`; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                  >
                    +
                  </button>
                </div>

                {/* Add to cart */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-300 hover:-translate-y-0.5 cursor-pointer border-none whitespace-nowrap"
                  style={{
                    background: '#1a2617',
                    color: accent,
                    fontFamily: "'Outfit', sans-serif",
                    minWidth: '170px',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = accent;
                    (e.currentTarget as HTMLButtonElement).style.color = '#1a2617';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = '#1a2617';
                    (e.currentTarget as HTMLButtonElement).style.color = accent;
                  }}
                >
                  <i className="ri-shopping-basket-2-line text-base" />
                  Commander
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal — full screen with audio */}
      {videoProduct && (
        <VideoModal product={videoProduct} onClose={() => setVideoProduct(null)} />
      )}

      <Footer />
    </>
  );
}
