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
  const [selected, setSelected] = useState<Product | null>(null);
  const [videoProduct, setVideoProduct] = useState<Product | null>(null);
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const [galleryView, setGalleryView] = useState<'image' | 'video'>('image');
  const [quantity, setQuantity] = useState(1);

  // Animation states
  const [infoVisible, setInfoVisible] = useState(false);
  const [videoVisible, setVideoVisible] = useState(false);
  const [currentVideoSrc, setCurrentVideoSrc] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  useEffect(() => {
    const imageUrls = Array.from(new Set(products.map((product) => product.image).filter(Boolean))) as string[];
    const videoUrls = Array.from(new Set(products.map((product) => product.videoUrl).filter(Boolean))) as string[];
    const preloadImages = imageUrls.map((url) => {
      const image = new Image();
      image.decoding = 'async';
      image.src = url;
      return image;
    });
    const preloadVideos: HTMLVideoElement[] = [];
    const videoPreloadTimer = window.setTimeout(() => {
      videoUrls.forEach((url) => {
        const video = document.createElement('video');
        video.preload = 'auto';
        video.muted = true;
        video.playsInline = true;
        video.src = url;
        video.load();
        preloadVideos.push(video);
      });
    }, 1200);

    return () => {
      window.clearTimeout(videoPreloadTimer);
      preloadImages.forEach((image) => {
        image.removeAttribute('src');
      });
      preloadVideos.forEach((video) => {
        video.removeAttribute('src');
        video.load();
      });
    };
  }, []);

  useEffect(() => {
    if (galleryIndex === null) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setGalleryIndex(null);
      if (e.key === 'ArrowLeft') showPreviousGalleryItem();
      if (e.key === 'ArrowRight') showNextGalleryItem();
    };

    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [galleryIndex]);

  const openGallery = (index: number) => {
    setGalleryIndex(index);
    setGalleryView('image');
  };

  const showPreviousGalleryItem = () => {
    setGalleryIndex((current) => current === null ? current : (current - 1 + products.length) % products.length);
    setGalleryView('image');
  };

  const showNextGalleryItem = () => {
    setGalleryIndex((current) => current === null ? current : (current + 1) % products.length);
    setGalleryView('image');
  };

  const handleSelect = (product: Product) => {
    if (selected && product.id === selected.id) return;

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
    if (!selected) return;
    for (let i = 0; i < quantity; i++) addToCart(selected);
    openCart();
  };

  const handleGalleryOrder = () => {
    if (!galleryProduct) return;
    addToCart(galleryProduct);
    setGalleryIndex(null);
    openCart();
  };

  const accent = selected?.accentColor ?? '#c9a84c';
  const badgeStyle = selected?.badge ? BADGE_STYLES[selected.badge] ?? BADGE_STYLES['Premium'] : null;
  const galleryProduct = galleryIndex !== null ? products[galleryIndex] : null;
  const galleryAccent = galleryProduct?.accentColor ?? '#c9a84c';

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
            Choisissez la bouteille qui correspond à votre art de vivre
          </p>

          <div className="flex items-start justify-center gap-6 md:gap-10 flex-wrap">
            {products.map((product, index) => {
              const isActive = selected?.id === product.id;
              const hasSelection = selected !== null;
              const pAccent = product.accentColor ?? '#c9a84c';
              const pBadge = product.badge ? BADGE_STYLES[product.badge] ?? BADGE_STYLES['Premium'] : null;

              return (
                <button
                  key={product.id}
                  onClick={() => handleSelect(product)}
                  className="flex flex-col items-center relative cursor-pointer border-none bg-transparent p-0"
                  style={{ outline: 'none', width: '280px' }}
                >
                  {/* Bottle image + volume wrapper */}
                  <div className="relative flex flex-col items-center transition-all duration-500" style={{ width: '280px' }}>

                    {/* Badge — overlaid on image */}
                    {pBadge && product.badge && (
                      <span
                        className="absolute px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 z-10 whitespace-nowrap"
                        style={{
                          top: '-8px',
                          left: '-14px',
                          background: pBadge.bg,
                          color: pBadge.color,
                          fontFamily: "'Outfit', sans-serif",
                          fontSize: '0.58rem',
                          opacity: hasSelection && !isActive ? 0.5 : 1,
                        }}
                      >
                        {product.badge}
                      </span>
                    )}

                    {/* Active glow */}
                    <div
                      className="absolute inset-0 rounded-2xl transition-opacity duration-500 pointer-events-none"
                      style={{
                        background: `radial-gradient(ellipse at center bottom, ${pAccent}30 0%, transparent 70%)`,
                        opacity: isActive ? 1 : 0,
                      }}
                    />

                    <img
                      src={product.image}
                      alt={product.volume}
                      loading="eager"
                      decoding="async"
                      fetchPriority="high"
                      onClick={(e) => {
                        e.stopPropagation();
                        openGallery(index);
                      }}
                      className="transition-all duration-500"
                      style={{
                        width: 'auto',
                        height: 'auto',
                        maxWidth: '280px',
                        maxHeight: '560px',
                        objectFit: 'contain',
                        cursor: 'zoom-in',
                        display: 'block',
                        filter: isActive
                          ? `drop-shadow(0 18px 36px ${pAccent}60)`
                          : 'drop-shadow(0 10px 22px rgba(0,0,0,0.13))',
                        opacity: hasSelection && !isActive ? 0.55 : 1,
                        transform: isActive ? 'scale(1.08) translateY(-8px)' : 'scale(1)',
                        transformOrigin: 'bottom center',
                      }}
                    />

                    {/* Volume — directly below image */}
                    <p
                      className="mt-7 text-center font-semibold uppercase tracking-wider w-full"
                      style={{
                        color: isActive ? pAccent : hasSelection ? '#b0ada6' : '#6b7c68',
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: '0.78rem',
                      }}
                    >
                      {product.volume}
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
      {selected && <section
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
                minHeight: '620px',
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
                  preload="auto"
                  className="w-full h-full object-contain"
                  style={{ display: 'block', maxHeight: '680px' }}
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
      </section>}

      {/* Video Modal — full screen with audio */}
      {videoProduct && (
        <VideoModal product={videoProduct} onClose={() => setVideoProduct(null)} />
      )}

      {galleryProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10"
          style={{ background: 'rgba(10,16,10,0.88)', backdropFilter: 'blur(8px)' }}
          onClick={() => setGalleryIndex(null)}
        >
          <button
            onClick={() => setGalleryIndex(null)}
            className="absolute top-5 right-5 w-11 h-11 flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.08)', color: '#f8f6f1', border: `1px solid ${galleryAccent}45` }}
            aria-label="Fermer l'image"
          >
            <i className="ri-close-line text-xl" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              showPreviousGalleryItem();
            }}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.08)', color: galleryAccent, border: `1px solid ${galleryAccent}45` }}
            aria-label="Image précédente"
          >
            <i className="ri-arrow-left-s-line text-3xl" />
          </button>

          <div
            className="relative flex flex-col items-center justify-center w-full max-w-6xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`relative w-full rounded-3xl overflow-hidden flex ${galleryView === 'video' ? 'flex-col lg:flex-row' : 'items-center justify-center'}`}
              style={{
                minHeight: galleryView === 'video' ? 'min(86vh, 840px)' : 'min(72vh, 680px)',
                background: `radial-gradient(ellipse at center, ${galleryAccent}20 0%, rgba(248,246,241,0.08) 55%, rgba(255,255,255,0.03) 100%)`,
                border: `1px solid ${galleryAccent}35`,
                boxShadow: `0 35px 100px rgba(0,0,0,0.38), 0 0 70px ${galleryAccent}20`,
              }}
            >
              {galleryView === 'video' && galleryProduct.videoUrl ? (
                <>
                  <div className="w-full lg:w-[58%] flex items-center justify-center p-4 md:p-6">
                    <video
                      key={`${galleryProduct.id}-video`}
                      src={galleryProduct.videoUrl}
                      controls
                      autoPlay
                      playsInline
                      preload="auto"
                      className="w-full h-full"
                      style={{
                        maxHeight: '78vh',
                        objectFit: 'contain',
                        borderRadius: '22px',
                        background: '#050705',
                      }}
                    />
                  </div>
                  <div
                    className="w-full lg:w-[42%] p-6 md:p-8 flex flex-col justify-center"
                    style={{ background: 'rgba(248,246,241,0.96)', alignSelf: 'stretch' }}
                  >
                    {galleryProduct.badge && (
                      <span
                        className="self-start mb-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                        style={{
                          background: galleryAccent,
                          color: '#1a2617',
                          fontFamily: "'Outfit', sans-serif",
                          fontSize: '0.65rem',
                        }}
                      >
                        {galleryProduct.badge}
                      </span>
                    )}
                    <p
                      className="text-xs uppercase tracking-widest mb-2"
                      style={{ color: galleryAccent, fontFamily: "'Outfit', sans-serif" }}
                    >
                      {galleryProduct.volume}
                    </p>
                    <h3
                      className="font-bold leading-tight mb-3"
                      style={{ color: '#1a2617', fontFamily: "'Cormorant Garant', serif", fontSize: 'clamp(1.7rem, 3vw, 2.4rem)' }}
                    >
                      {galleryProduct.name}
                    </h3>
                    <p
                      className="italic mb-4"
                      style={{ color: galleryAccent, fontFamily: "'Cormorant Garant', serif", fontSize: '1.05rem' }}
                    >
                      &ldquo;{galleryProduct.tagline}&rdquo;
                    </p>
                    <p
                      className="text-sm leading-loose mb-5"
                      style={{ color: '#5f705c', fontFamily: "'Outfit', sans-serif" }}
                    >
                      {galleryProduct.description}
                    </p>
                    <div className="flex flex-col gap-2.5 mb-6">
                      {galleryProduct.details.slice(0, 4).map((detail) => (
                        <div key={detail} className="flex items-start gap-2.5">
                          <i className="ri-checkbox-circle-fill text-sm flex-shrink-0 mt-0.5" style={{ color: galleryAccent }} />
                          <span className="text-xs leading-relaxed" style={{ color: '#5f705c', fontFamily: "'Outfit', sans-serif" }}>
                            {detail}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div>
                        <p className="text-xs uppercase tracking-widest" style={{ color: '#8a9586', fontFamily: "'Outfit', sans-serif" }}>
                          Prix
                        </p>
                        <p className="font-bold" style={{ color: '#1a2617', fontFamily: "'Cormorant Garant', serif", fontSize: '2.2rem', lineHeight: 1 }}>
                          {galleryProduct.price} <span style={{ color: galleryAccent, fontSize: '1rem' }}>{galleryProduct.currency}</span>
                        </p>
                      </div>
                      <button
                        onClick={handleGalleryOrder}
                        className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer border-none"
                        style={{
                          background: '#1a2617',
                          color: galleryAccent,
                          fontFamily: "'Outfit', sans-serif",
                        }}
                      >
                        Commander
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <img
                  key={galleryProduct.id}
                  src={galleryProduct.image}
                  alt={galleryProduct.volume}
                  className="transition-all duration-300"
                  style={{
                    maxWidth: '86%',
                    maxHeight: '68vh',
                    objectFit: 'contain',
                    filter: `drop-shadow(0 28px 48px ${galleryAccent}55)`,
                  }}
                />
              )}
            </div>

            <div className="mt-5 text-center">
              <p
                className="text-xs uppercase tracking-widest mb-1"
                style={{ color: galleryAccent, fontFamily: "'Outfit', sans-serif" }}
              >
                {galleryProduct.volume}
              </p>
              <h3
                className="text-2xl font-bold"
                style={{ color: '#f8f6f1', fontFamily: "'Cormorant Garant', serif" }}
              >
                {galleryProduct.name}
              </h3>
              <button
                onClick={() => setGalleryView(galleryView === 'image' ? 'video' : 'image')}
                className="mt-5 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer"
                style={{
                  background: galleryView === 'image' ? galleryAccent : 'rgba(255,255,255,0.08)',
                  color: galleryView === 'image' ? '#1a2617' : galleryAccent,
                  border: `1px solid ${galleryAccent}55`,
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                {galleryView === 'image' ? 'Voir les détails' : "Retour à l'image"}
              </button>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              showNextGalleryItem();
            }}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.08)', color: galleryAccent, border: `1px solid ${galleryAccent}45` }}
            aria-label="Image suivante"
          >
            <i className="ri-arrow-right-s-line text-3xl" />
          </button>
        </div>
      )}

      <Footer />
    </>
  );
}
