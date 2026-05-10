import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '@/components/feature/Header';
import Footer from '@/components/feature/Footer';
import BackButton from '@/components/base/BackButton';
import VideoModal from './components/VideoModal';
import { Product, getStockStatus, STOCK_DISPLAY } from '@/mocks/products';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useCurrencyCtx } from '@/context/CurrencyContext';
import { useWishlist } from '@/hooks/useWishlist';

const ARAB_COUNTRIES_SET = new Set([
  'Arabie Saoudite','Émirats Arabes Unis','Qatar','Koweït','Bahreïn','Oman',
  'Jordanie','Liban','Syrie','Irak','Palestine','Égypte','Libye','Maroc','Algérie','Soudan','Yémen','Tunisie',
]);
const EU_COUNTRIES_SET = new Set([
  'France','Belgique','Suisse','Allemagne','Royaume-Uni','Italie','Espagne',
  'Pays-Bas','Portugal','Autriche','Luxembourg','Irlande','Grèce',
  'Suède','Norvège','Danemark','Finlande','Pologne','Tchéquie','Hongrie','Roumanie',
]);
function getShippingTND(country: string): number {
  if (country === 'Tunisie') return 7;
  if (ARAB_COUNTRIES_SET.has(country)) return 25;
  if (EU_COUNTRIES_SET.has(country)) return 35;
  return 50;
}

const PRODUCT_TRANSLATION_PREFIXES: Record<string, string> = {
  'bouteille-1l': 'product_bouteille_1l',
  'bouteille-500ml': 'product_bouteille_500ml',
  'bouteille-250ml': 'product_bouteille_750ml',
  'bouteille-speciale': 'product_bidon_3l',
};

const PRODUCT_VOLUME_KEYS: Record<string, string> = {
  'bouteille-1l': 'product_bouteille_1l_volume',
  'bouteille-500ml': 'product_bouteille_500ml_volume',
  'bouteille-250ml': 'product_bouteille_750ml_volume',
  'bouteille-speciale': 'product_bidon_3l_volume',
};

const BADGE_STYLES: Record<string, { bg: string; color: string }> = {
  'Bio & Naturel':   { bg: '#3a6040', color: '#e8f5e9' },
  'Best-seller':     { bg: '#c9a84c', color: '#1a2617' },
  'Premium':         { bg: '#1a2617', color: '#c9a84c' },
  'Format Familial': { bg: '#7b5e3a', color: '#fdf3e3' },
};

const BADGE_TRANSLATION_KEYS: Record<string, string> = {
  'Bio & Naturel':   'badge_bio',
  'Best-seller':     'badge_bestseller',
  'Premium':         'badge_premium',
  'Format Familial': 'badge_family',
};

export default function ProductsPage() {
  const { t, i18n } = useTranslation();
  const { addToCart, openCart } = useCart();
  const { format: fmtCurrency, currencyInfo } = useCurrencyCtx();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { products } = useProducts();
  const [shippingOpen, setShippingOpen] = useState(false);
  const [shippingCountry, setShippingCountry] = useState('Tunisie');
  const SHIPPING_ZONES = [
    { label: t('shipping_zone_tn'), country: 'Tunisie', cost: 7 },
    { label: t('shipping_zone_arab'), country: 'Arabie Saoudite', cost: 25 },
    { label: t('shipping_zone_eu'), country: 'France', cost: 35 },
    { label: t('shipping_zone_intl'), country: 'Canada', cost: 50 },
  ];
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
  const isArabic = i18n.language === 'ar';
  const formatPrice = (amount: number) => (isArabic ? `${amount} د.ت` : `${amount} TND`);
  const formatVolume = (productId: string, fallback: string) => PRODUCT_VOLUME_KEYS[productId] ? t(PRODUCT_VOLUME_KEYS[productId]) : fallback;
  const formatProductName = () => t('product_name');

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
              className="text-sm leading-relaxed whitespace-nowrap"
              style={{ color: '#6b7c68', fontFamily: "'Outfit', sans-serif", lineHeight: '1.85' }}
            >
              {t('products_subtitle')}
            </p>
          </div>

          <div className="mt-8 h-px w-full" style={{ background: 'linear-gradient(to right, rgba(201,168,76,0.4), transparent)' }} />
        </div>
      </section>

      {/* ── Bottle Lineup ───────────────────────────────────── */}
      <section className="pt-10 pb-32 px-4 md:px-10" style={{ background: '#f8f6f1' }}>
        <div className="max-w-7xl mx-auto">
          <p
            className="text-center -mt-4 mb-32 text-lg uppercase tracking-widest"
            style={{ color: '#000000', fontFamily: "'Outfit', sans-serif" }}
          >
            {t('products_lineup_subtitle')}
          </p>

          <div className="flex items-start justify-center gap-16 flex-nowrap">
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
                  style={{ outline: 'none', width: '300px' }}
                >
                  {/* Bottle image + volume wrapper */}
                  <div className="group/bottle relative flex flex-col items-center transition-all duration-500" style={{ width: '300px' }}>

                    {/* Badge — overlaid on image */}
                    {pBadge && product.badge && (
                      <span
                        className="absolute px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 z-10 whitespace-nowrap"
                        style={{
                          top: '-44px',
                          left: '-14px',
                          background: pBadge.bg,
                          color: pBadge.color,
                          fontFamily: "'Outfit', sans-serif",
                          fontSize: '0.58rem',
                          opacity: hasSelection && !isActive ? 0.5 : 1,
                        }}
                      >
                        {BADGE_TRANSLATION_KEYS[product.badge] ? t(BADGE_TRANSLATION_KEYS[product.badge]) : product.badge}
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
                        maxWidth: '300px',
                        maxHeight: '620px',
                        objectFit: 'contain',
                        cursor: 'pointer',
                        display: 'block',
                        filter: isActive
                          ? `drop-shadow(0 18px 36px ${pAccent}60)`
                          : 'drop-shadow(0 10px 22px rgba(0,0,0,0.13))',
                        opacity: hasSelection && !isActive ? 0.55 : 1,
                        transform: isActive ? 'scaleY(1.12) scale(1.08) translateY(-8px)' : 'scaleY(1.12)',
                        transformOrigin: 'bottom center',
                      }}
                    />

                    {/* Hover hint */}
                    <div
                      className="absolute bottom-8 flex items-center gap-1.5 px-3 py-1.5 rounded-full opacity-0 group-hover/bottle:opacity-100 transition-all duration-300 pointer-events-none"
                      style={{
                        background: 'rgba(26,38,23,0.75)',
                        backdropFilter: 'blur(6px)',
                        left: '50%',
                        transform: 'translateX(-50%)',
                      }}
                    >
                      <i className="ri-hand-coin-line text-xs" style={{ color: '#c9a84c' }} />
                      <span className="text-xs whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.9)', fontFamily: "'Outfit', sans-serif", fontSize: '0.6rem', letterSpacing: '0.1em' }}>
                        Cliquer pour sélectionner
                      </span>
                    </div>

                    {/* Volume — directly below image */}
                    <p
                      className="mt-7 text-center font-semibold uppercase tracking-wider w-full"
                      style={{
                        color: isActive ? pAccent : hasSelection ? '#b0ada6' : '#6b7c68',
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: '0.78rem',
                      }}
                    >
                      {PRODUCT_VOLUME_KEYS[product.id] ? t(PRODUCT_VOLUME_KEYS[product.id]) : product.volume}
                    </p>

                    {/* Stock badge */}
                    {(() => {
                      const status = getStockStatus(product.stock);
                      const s = STOCK_DISPLAY[status];
                      return (
                        <span
                          className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
                          style={{
                            background: s.bg,
                            opacity: hasSelection && !isActive ? 0.5 : 1,
                            transition: 'opacity 0.3s',
                          }}
                        >
                          <i className={`${s.icon}`} style={{ color: s.color, fontSize: '0.6rem' }} />
                          <span style={{ color: s.color, fontFamily: "'Outfit', sans-serif", fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                            {status === 'low_stock' ? t('cart_stock_remaining', { stock: product.stock }) : status === 'out_of_stock' ? t('product_out_of_stock') : t('product_in_stock')}
                          </span>
                        </span>
                      );
                    })()}
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
                  <p className="text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>{t('card_video_soon')}</p>
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
                  {t('card_video_label')}
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
                  {t('card_fullscreen')}
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
                  {BADGE_TRANSLATION_KEYS[selected.badge] ? t(BADGE_TRANSLATION_KEYS[selected.badge]) : selected.badge}
                </span>
              )}

              {/* Volume */}
              <span
                className="text-xs font-semibold uppercase tracking-widest block mb-2"
                style={{ color: accent, fontFamily: "'Outfit', sans-serif" }}
              >
                {isArabic ? formatVolume(selected.id, selected.volume) : selected.volume}
              </span>

              {/* Name */}
              <h2
                className="font-bold leading-tight mb-3"
                style={{ fontFamily: "'Cormorant Garant', serif", fontSize: 'clamp(1.6rem, 2.5vw, 2.1rem)', color: '#1a2617' }}
              >
                {isArabic ? formatProductName() : t('product_name')}
              </h2>

              <div className="h-px w-10 mb-5" style={{ background: `${accent}70` }} />

              {/* Price + Stock */}
              <div className="flex items-end gap-4 mb-5 flex-wrap">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-baseline gap-2">
                    <span
                      className="font-bold"
                      style={{ fontFamily: "'Cormorant Garant', serif", fontSize: '3rem', color: '#1a2617', lineHeight: 1 }}
                    >
                      {fmtCurrency(selected.price)}
                    </span>
                    <span className="text-base font-semibold" style={{ color: accent, fontFamily: "'Outfit', sans-serif" }}>
                      {currencyInfo.symbol}
                    </span>
                  </div>
                  {currencyInfo.code !== 'TND' && (
                    <span className="text-xs" style={{ color: '#9aaa96', fontFamily: "'Outfit', sans-serif" }}>
                      ≈ {selected.price} TND
                    </span>
                  )}
                </div>

                {/* Stock indicator */}
                {(() => {
                  const status = getStockStatus(selected.stock);
                  const s = STOCK_DISPLAY[status];
                  return (
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-1"
                      style={{ background: s.bg, border: `1px solid ${s.color}30` }}
                    >
                      <i className={s.icon} style={{ color: s.color, fontSize: '0.75rem' }} />
                      <span style={{ color: s.color, fontFamily: "'Outfit', sans-serif", fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        {status === 'low_stock' ? t('cart_stock_remaining', { stock: selected.stock }) : status === 'out_of_stock' ? t('product_out_of_stock') : t('product_in_stock')}
                      </span>
                    </span>
                  );
                })()}
              </div>

              {/* Tagline */}
              <p
                className="italic leading-relaxed mb-5"
                style={{ color: accent, fontFamily: "'Cormorant Garant', serif", fontSize: '1.05rem' }}
              >
                &ldquo;{PRODUCT_TRANSLATION_PREFIXES[selected.id] ? t(`${PRODUCT_TRANSLATION_PREFIXES[selected.id]}_tagline`) : selected.tagline}&rdquo;
              </p>

              {/* Description */}
              <p
                className="text-sm leading-loose mb-6"
                style={{ color: '#6b7c68', fontFamily: "'Outfit', sans-serif", lineHeight: '1.9' }}
              >
                {PRODUCT_TRANSLATION_PREFIXES[selected.id] ? t(`${PRODUCT_TRANSLATION_PREFIXES[selected.id]}_description`) : selected.description}
              </p>

              {/* Details */}
              <div className="flex flex-col gap-2.5 mb-8">
                {((PRODUCT_TRANSLATION_PREFIXES[selected.id] ? (t(`${PRODUCT_TRANSLATION_PREFIXES[selected.id]}_details`, { returnObjects: true }) as string[]) : selected.details)).map((d) => (
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
                <div className="flex flex-col gap-1.5">
                  <span
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: '#1a2617', fontFamily: "'Outfit', sans-serif", letterSpacing: '0.18em' }}
                  >
                    Quantité
                  </span>
                  <div className="flex items-stretch gap-0" style={{ height: '44px' }}>
                    {/* − */}
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="flex items-center justify-center font-bold text-lg cursor-pointer transition-all duration-150 border-none"
                      style={{
                        width: '44px',
                        background: '#f0ede6',
                        color: '#1a2617',
                        borderRadius: '10px 0 0 10px',
                        border: `1.5px solid rgba(0,0,0,0.15)`,
                        borderRight: 'none',
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = `${accent}25`; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#f0ede6'; }}
                    >
                      −
                    </button>

                    {/* Input */}
                    <div className="relative flex items-center" style={{ background: '#fff', border: `1.5px solid ${accent}`, borderLeft: 'none', borderRight: 'none' }}>
                      <input
                        type="number"
                        min={1}
                        max={selected.stock}
                        value={quantity}
                        onChange={(e) => {
                          const v = parseInt(e.target.value, 10);
                          if (!isNaN(v) && v >= 1 && v <= selected.stock) setQuantity(v);
                        }}
                        onFocus={(e) => {
                          e.currentTarget.select();
                          (e.currentTarget.parentElement as HTMLElement).style.background = `${accent}12`;
                        }}
                        onBlur={(e) => {
                          (e.currentTarget.parentElement as HTMLElement).style.background = '#fff';
                          const v = parseInt(e.currentTarget.value, 10);
                          if (!v || v < 1) setQuantity(1);
                          else if (v > selected.stock) setQuantity(selected.stock);
                        }}
                        className="text-center font-bold outline-none transition-all duration-150"
                        style={{
                          width: '52px',
                          height: '100%',
                          background: 'transparent',
                          color: '#1a2617',
                          fontFamily: "'Outfit', sans-serif",
                          fontSize: '1.1rem',
                          border: 'none',
                          cursor: 'text',
                        }}
                      />
                      <i
                        className="ri-pencil-line pointer-events-none"
                        style={{ position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)', color: accent, fontSize: '0.75rem', opacity: 0.8 }}
                      />
                    </div>

                    {/* + */}
                    <button
                      onClick={() => setQuantity(q => Math.min(selected.stock, q + 1))}
                      className="flex items-center justify-center font-bold text-lg cursor-pointer transition-all duration-150 border-none"
                      style={{
                        width: '44px',
                        background: '#f0ede6',
                        color: '#1a2617',
                        borderRadius: '0 10px 10px 0',
                        border: `1.5px solid rgba(0,0,0,0.15)`,
                        borderLeft: 'none',
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = `${accent}25`; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#f0ede6'; }}
                    >
                      +
                    </button>
                  </div>
                  <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.6rem', color: '#9aaa96' }}>
                    {t('product_stock_hint', { max: selected.stock })}
                  </p>
                </div>

                {/* Add to cart */}
                {(() => {
                  const isOutOfStock = getStockStatus(selected.stock) === 'out_of_stock';
                  return (
                    <button
                      onClick={isOutOfStock ? undefined : handleAddToCart}
                      disabled={isOutOfStock}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-bold uppercase tracking-widest border-none whitespace-nowrap"
                      style={{
                        background: isOutOfStock ? '#e8e4da' : '#1a2617',
                        color: isOutOfStock ? '#b0ada6' : accent,
                        fontFamily: "'Outfit', sans-serif",
                        minWidth: '170px',
                        cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                        transition: 'all 0.3s',
                      }}
                      onMouseEnter={(e) => {
                        if (!isOutOfStock) {
                          (e.currentTarget as HTMLButtonElement).style.background = accent;
                          (e.currentTarget as HTMLButtonElement).style.color = '#1a2617';
                          (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isOutOfStock) {
                          (e.currentTarget as HTMLButtonElement).style.background = '#1a2617';
                          (e.currentTarget as HTMLButtonElement).style.color = accent;
                          (e.currentTarget as HTMLButtonElement).style.transform = 'none';
                        }
                      }}
                    >
                      <i className={isOutOfStock ? 'ri-close-circle-line text-base' : 'ri-shopping-basket-2-line text-base'} />
                      {isOutOfStock ? t('product_out_of_stock_btn') : t('card_order')}
                    </button>
                  );
                })()}

                {/* Wishlist button */}
                <button
                  onClick={() => selected && toggleWishlist(selected.id)}
                  className="flex items-center justify-center w-12 h-12 rounded-full border-none cursor-pointer transition-all duration-200 flex-shrink-0"
                  style={{
                    background: selected && isWishlisted(selected.id) ? 'rgba(220,53,69,0.1)' : '#f0ede6',
                    border: `1.5px solid ${selected && isWishlisted(selected.id) ? 'rgba(220,53,69,0.3)' : 'rgba(0,0,0,0.1)'}`,
                  }}
                  title={t(selected && isWishlisted(selected.id) ? 'wishlist_remove' : 'wishlist_add')}
                >
                  <i
                    className={selected && isWishlisted(selected.id) ? 'ri-heart-fill' : 'ri-heart-line'}
                    style={{ fontSize: '1.1rem', color: selected && isWishlisted(selected.id) ? '#dc3545' : '#9aaa96' }}
                  />
                </button>
              </div>

              {/* Shipping estimator */}
              <div style={{ marginTop: 20 }}>
                <button
                  onClick={() => setShippingOpen(v => !v)}
                  className="flex items-center gap-2 cursor-pointer border-none bg-transparent"
                  style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.72rem', color: accent, fontWeight: 600, letterSpacing: '0.08em', padding: 0 }}
                >
                  <i className="ri-truck-line" style={{ fontSize: '1rem' }} />
                  {t('shipping_estimator')}
                  <i className={`ri-arrow-${shippingOpen ? 'up' : 'down'}-s-line`} style={{ fontSize: '0.8rem', opacity: 0.6 }} />
                </button>

                {shippingOpen && (
                  <div
                    style={{
                      marginTop: 12,
                      padding: '14px 16px',
                      background: '#f8f6f1',
                      borderRadius: 10,
                      border: '1px solid rgba(0,0,0,0.07)',
                    }}
                  >
                    <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.62rem', color: '#9aaa96', marginBottom: 10, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      {t('shipping_estimate_title')}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {SHIPPING_ZONES.map((zone) => {
                        const isSel = shippingCountry === zone.country;
                        const isTN = zone.country === 'Tunisie';
                        const displayCost = fmtCurrency(zone.cost);
                        return (
                          <button
                            key={zone.country}
                            onClick={() => setShippingCountry(zone.country)}
                            className="flex items-center justify-between cursor-pointer border-none transition-all duration-150"
                            style={{
                              padding: '8px 12px',
                              borderRadius: 8,
                              background: isSel ? `${accent}14` : 'rgba(0,0,0,0.02)',
                              border: `1.5px solid ${isSel ? accent + '40' : 'transparent'}`,
                              fontFamily: "'Outfit', sans-serif",
                            }}
                          >
                            <span style={{ fontSize: '0.75rem', color: '#1a2617', fontWeight: isSel ? 600 : 400 }}>{zone.label}</span>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isTN && zone.cost === 7 ? '#4a7c4e' : '#1a2617' }}>
                              {displayCost} {currencyInfo.symbol}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.62rem', color: '#4a7c4e', marginTop: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <i className="ri-gift-line" />
                      {t('shipping_free_from')}
                    </p>
                  </div>
                )}
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
                        {BADGE_TRANSLATION_KEYS[galleryProduct.badge] ? t(BADGE_TRANSLATION_KEYS[galleryProduct.badge]) : galleryProduct.badge}
                      </span>
                    )}
                    <p
                      className="text-xs uppercase tracking-widest mb-2"
                      style={{ color: galleryAccent, fontFamily: "'Outfit', sans-serif" }}
                    >
                      {PRODUCT_VOLUME_KEYS[galleryProduct.id] ? t(PRODUCT_VOLUME_KEYS[galleryProduct.id]) : galleryProduct.volume}
                    </p>
                    <h3
                      className="font-bold leading-tight mb-3"
                      style={{ color: '#1a2617', fontFamily: "'Cormorant Garant', serif", fontSize: 'clamp(1.7rem, 3vw, 2.4rem)' }}
                    >
                      {t('product_name')}
                    </h3>
                    <p
                      className="italic mb-4"
                      style={{ color: galleryAccent, fontFamily: "'Cormorant Garant', serif", fontSize: '1.05rem' }}
                    >
                      &ldquo;{PRODUCT_TRANSLATION_PREFIXES[galleryProduct.id] ? t(`${PRODUCT_TRANSLATION_PREFIXES[galleryProduct.id]}_tagline`) : galleryProduct.tagline}&rdquo;
                    </p>
                    <p
                      className="text-sm leading-loose mb-5"
                      style={{ color: '#5f705c', fontFamily: "'Outfit', sans-serif" }}
                    >
                      {PRODUCT_TRANSLATION_PREFIXES[galleryProduct.id] ? t(`${PRODUCT_TRANSLATION_PREFIXES[galleryProduct.id]}_description`) : galleryProduct.description}
                    </p>
                    <div className="flex flex-col gap-2.5 mb-6">
                      {((PRODUCT_TRANSLATION_PREFIXES[galleryProduct.id] ? (t(`${PRODUCT_TRANSLATION_PREFIXES[galleryProduct.id]}_details`, { returnObjects: true }) as string[]) : galleryProduct.details)).slice(0, 4).map((detail) => (
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
                          {t('config_price')}
                        </p>
                        <p className="font-bold" style={{ color: '#1a2617', fontFamily: "'Cormorant Garant', serif", fontSize: '2.2rem', lineHeight: 1 }}>
                          {fmtCurrency(galleryProduct.price)} <span style={{ color: galleryAccent, fontSize: '1rem' }}>{currencyInfo.symbol}</span>
                        </p>
                        {currencyInfo.code !== 'TND' && (
                          <p className="text-xs mt-0.5" style={{ color: '#9aaa96', fontFamily: "'Outfit', sans-serif" }}>
                            ≈ {galleryProduct.price} TND
                          </p>
                        )}
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
                        {t('card_order')}
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
                {isArabic ? formatVolume(galleryProduct.id, galleryProduct.volume) : galleryProduct.volume}
              </p>
              <h3
                className="text-2xl font-bold"
                style={{ color: '#f8f6f1', fontFamily: "'Cormorant Garant', serif" }}
              >
                {isArabic ? formatProductName() : t('product_name')}
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
                {galleryView === 'image' ? t('card_details') : t('card_back_image')}
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
