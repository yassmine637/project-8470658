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
  const [animating, setAnimating] = useState(false);
  const descRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const handleSelect = (product: Product) => {
    if (product.id === selected.id) return;
    setAnimating(true);
    setQuantity(1);
    setTimeout(() => {
      setSelected(product);
      setAnimating(false);
    }, 220);
    setTimeout(() => {
      descRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 300);
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(selected);
    }
    openCart();
  };

  const [quantity, setQuantity] = useState(1);
  const accent = selected.accentColor ?? '#c9a84c';
  const badgeStyle = selected.badge ? BADGE_STYLES[selected.badge] ?? BADGE_STYLES['Premium'] : null;

  return (
    <>
      <Header />

      {/* Page Header */}
      <section className="pt-36 pb-12 px-6 md:px-16" style={{ background: '#f8f6f1' }}>
        <div className="max-w-6xl mx-auto">
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

          <div className="flex flex-col items-center text-center gap-4">
            <h1
              className="font-bold leading-tight"
              style={{ fontFamily: "'Cormorant Garant', serif", fontSize: 'clamp(1.7rem, 3.2vw, 2.4rem)', color: '#1a2617' }}
            >
              {t('products_title')}
            </h1>
            <p
              className="max-w-md text-base leading-relaxed"
              style={{ color: '#6b7c68', fontFamily: "'Outfit', sans-serif", lineHeight: '1.8' }}
            >
              {t('products_subtitle')}
            </p>
          </div>

          <div className="mt-10 h-px w-full" style={{ background: 'linear-gradient(to right, rgba(201,168,76,0.4), transparent)' }} />
        </div>
      </section>

      {/* Bottle Selector — horizontal scroll */}
      <section className="py-10 px-6 md:px-16" style={{ background: '#f8f6f1' }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-xl font-semibold mb-8 text-center" style={{ color: '#1a2617', fontFamily: "'Cormorant Garant', serif", fontSize: '1.5rem' }}>
            Sélectionnez votre bouteille selon vos besoins
          </p>

          {/* Scrollable row */}
          <div className="flex gap-10 overflow-x-auto pb-2 justify-center" style={{ scrollbarWidth: 'none' }}>
            {products.map((product) => {
              const isActive = product.id === selected.id;
              const pAccent = product.accentColor ?? '#c9a84c';
              const pBadge = product.badge ? BADGE_STYLES[product.badge] ?? BADGE_STYLES['Premium'] : null;

              return (
                <div
                  key={product.id}
                  onClick={() => handleSelect(product)}
                  className="flex-shrink-0 flex flex-col items-center rounded-2xl cursor-pointer transition-all duration-300"
                  style={{
                    width: '260px',
                    padding: '28px 22px 22px',
                    background: 'transparent',
                    border: 'none',
                    transform: isActive ? 'translateY(-10px) scale(1.06)' : 'translateY(0) scale(1)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px) scale(1.04)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0) scale(1)';
                  }}
                >


                  {/* Image */}
                  <div
                    className="flex items-center justify-center mb-5"
                    style={{ width: '200px', height: '380px', background: 'transparent', flexShrink: 0 }}
                  >
                    <img
                      src={product.image}
                      alt={product.volume}
                      className="transition-all duration-500"
                      style={{
                        width: '200px',
                        height: '380px',
                        objectFit: 'contain',
                        filter: `drop-shadow(0 14px 32px rgba(0,0,0,0.15))`,
                        transform: isActive
                          ? `scale(${(product.imageScale ?? 1) * 1.1})`
                          : `scale(${product.imageScale ?? 1})`,
                      }}
                    />
                  </div>

                  {/* Volume */}
                  <p
                    className="text-xs font-semibold uppercase tracking-wider text-center leading-snug mb-1"
                    style={{ color: isActive ? pAccent : '#9aaa96', fontFamily: "'Outfit', sans-serif" }}
                  >
                    {product.volume}
                  </p>

                  {/* Price */}
                  <p
                    className="text-2xl font-bold mt-1"
                    style={{ fontFamily: "'Cormorant Garant', serif", color: '#1a2617' }}
                  >
                    {product.price} <span className="text-base" style={{ color: pAccent }}>{product.currency}</span>
                  </p>


                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Description panel — appears below on selection */}
      <section
        ref={descRef}
        className="px-6 md:px-16 pb-20 transition-all duration-300"
        style={{ background: '#f8f6f1', opacity: animating ? 0 : 1, transform: animating ? 'translateY(10px)' : 'translateY(0)' }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="h-px w-full mb-10" style={{ background: `linear-gradient(to right, ${accent}50, transparent)` }} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left — image large */}
            <div
              className="relative flex items-center justify-center"
              style={{
                minHeight: '480px',
                background: 'transparent',
              }}
            >

              <img
                src={selected.image}
                alt={`${selected.name} ${selected.volume}`}
                className="object-contain"
                style={{ height: '400px', maxWidth: '80%', filter: 'drop-shadow(0 12px 28px rgba(0,0,0,0.1))' }}
              />

              {/* Voir le produit button — overlay */}
              <button
                onClick={() => setVideoProduct(selected)}
                className="absolute bottom-[-44px] left-1/2 -translate-x-1/2 flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
                style={{
                  background: '#1a2617',
                  color: '#c9a84c',
                  border: '1px solid rgba(201,168,76,0.4)',
                  fontFamily: "'Outfit', sans-serif",
                  transform: 'translateX(-50%)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = '#c9a84c';
                  (e.currentTarget as HTMLButtonElement).style.color = '#1a2617';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = '#1a2617';
                  (e.currentTarget as HTMLButtonElement).style.color = '#c9a84c';
                }}
              >
                <i className="ri-play-circle-line text-base" />
                Voir le produit
              </button>
            </div>

            {/* Right — details */}
            <div className="flex flex-col gap-6 pt-4">
              <div>
                <span
                  className="text-xs font-semibold uppercase tracking-widest block mb-2"
                  style={{ color: accent, fontFamily: "'Outfit', sans-serif" }}
                >
                  {selected.volume}
                </span>
                <h2
                  className="text-3xl font-bold leading-tight mb-3"
                  style={{ fontFamily: "'Cormorant Garant', serif", color: '#1a2617' }}
                >
                  {selected.name}
                </h2>
                <div className="h-px w-10" style={{ background: `${accent}60` }} />
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold" style={{ fontFamily: "'Cormorant Garant', serif", color: '#1a2617' }}>
                  {selected.price}
                </span>
                <span className="text-lg font-semibold" style={{ color: accent, fontFamily: "'Outfit', sans-serif" }}>
                  {selected.currency}
                </span>
              </div>

              {/* Tagline */}
              <p
                className="text-base italic leading-relaxed"
                style={{ color: accent, fontFamily: "'Cormorant Garant', serif", fontSize: '1.1rem' }}
              >
                &ldquo;{selected.tagline}&rdquo;
              </p>

              {/* Description */}
              <p
                className="text-sm leading-loose"
                style={{ color: '#6b7c68', fontFamily: "'Outfit', sans-serif", lineHeight: '1.9' }}
              >
                {selected.description}
              </p>

              {/* Details */}
              <div className="flex flex-col gap-2">
                {selected.details.map((d) => (
                  <div key={d} className="flex items-start gap-2">
                    <i className="ri-checkbox-circle-fill text-sm flex-shrink-0 mt-0.5" style={{ color: accent }} />
                    <span className="text-sm" style={{ color: '#6b7c68', fontFamily: "'Outfit', sans-serif" }}>{d}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex items-center justify-center pt-2">
                <button
                  onClick={handleAddToCart}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-300 hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
                  style={{
                    background: '#1a2617',
                    color: '#c9a84c',
                    border: 'none',
                    fontFamily: "'Outfit', sans-serif",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#c9a84c'; (e.currentTarget as HTMLButtonElement).style.color = '#1a2617'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#1a2617'; (e.currentTarget as HTMLButtonElement).style.color = '#c9a84c'; }}
                >
                  <i className="ri-shopping-basket-2-line text-base" />
                  Commander
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {videoProduct && (
        <VideoModal product={videoProduct} onClose={() => setVideoProduct(null)} />
      )}

      <Footer />
    </>
  );
}
