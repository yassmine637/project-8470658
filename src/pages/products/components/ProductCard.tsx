import { useTranslation } from 'react-i18next';
import { Product } from '@/mocks/products';
import { useCart } from '@/hooks/useCart';
import { useCurrencyCtx } from '@/context/CurrencyContext';
import { useWishlist } from '@/hooks/useWishlist';

interface ProductCardProps {
  product: Product;
  index: number;
}

const BADGE_STYLES: Record<string, { bg: string; color: string }> = {
  'Bio & Naturel':   { bg: '#3a6040', color: '#e8f5e9' },
  'Best-seller':     { bg: '#c9a84c', color: '#1a2617' },
  'Premium':         { bg: '#1a2617', color: '#c9a84c' },
  'Format Familial': { bg: '#7b5e3a', color: '#fdf3e3' },
};

const ACCENT_COLORS: string[] = ['#4a7c4e', '#c9a84c', '#b8942a', '#8b6914'];

export default function ProductCard({ product, index }: ProductCardProps) {
  const { t, i18n } = useTranslation();
  const { addToCart, openCart } = useCart();
  const { format, currencyInfo } = useCurrencyCtx();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const badgeStyle = product.badge ? BADGE_STYLES[product.badge] ?? BADGE_STYLES['Premium'] : null;
  const accent = ACCENT_COLORS[index % ACCENT_COLORS.length];
  const isArabic = i18n.language === 'ar';
  const wishlisted = isWishlisted(product.id);
  const volume = isArabic ? t({
    'Bidon vert 1L — Bio': 'product_bouteille_1l_volume',
    'Bouteille cylindrique 500ml': 'product_bouteille_500ml_volume',
    'Bouteille carrée élancée 750ml': 'product_bouteille_750ml_volume',
    'Bidon métallique 3L': 'product_bidon_3l_volume',
  }[product.volume] ?? '') : product.volume;
  const productName = isArabic ? t('product_name') : product.name;

  return (
    <div
        className="group relative flex flex-col rounded-2xl cursor-pointer transition-all duration-400 hover:-translate-y-1"
        style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.07)' }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = `${accent}50`; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(0,0,0,0.07)'; }}
        onClick={() => { addToCart(product); openCart(); }}
      >

        {product.badge && badgeStyle && (
          <div
            className="absolute -top-3 left-4 z-10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
            style={{ background: badgeStyle.bg, color: badgeStyle.color, fontFamily: "'Outfit', sans-serif", letterSpacing: '0.08em' }}
          >
            {product.badge}
          </div>
        )}

        {/* Wishlist button */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer border-none"
          style={{
            background: wishlisted ? 'rgba(220,53,69,0.1)' : 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(4px)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
          title={t(wishlisted ? 'wishlist_remove' : 'wishlist_add')}
        >
          <i
            className={wishlisted ? 'ri-heart-fill' : 'ri-heart-line'}
            style={{ fontSize: '0.95rem', color: wishlisted ? '#dc3545' : '#9aaa96', transition: 'color 0.2s' }}
          />
        </button>

        <div
          className="relative flex items-center justify-center rounded-t-2xl overflow-hidden"
          style={{ height: '300px', background: `linear-gradient(160deg, #f8f6f1 0%, ${accent}0d 100%)` }}
        >
          <img
            src={product.image}
            alt={`${product.name} ${product.volume}`}
            className="object-contain transition-transform duration-500 group-hover:scale-105"
            style={{ height: '240px', width: 'auto', maxWidth: '180px', filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.09))' }}
          />
        </div>

        <div style={{ height: '1px', background: `linear-gradient(to right, ${accent}60, transparent)` }} />

        <div className="flex flex-col gap-3 px-6 pt-8 pb-6 flex-1 rounded-b-2xl overflow-hidden">
          <span className="text-sm font-semibold uppercase tracking-widest" style={{ color: accent, fontFamily: "'Outfit', sans-serif" }}>
            {volume}
          </span>

          <h3 className="text-2xl font-bold leading-snug" style={{ fontFamily: "'Cormorant Garant', serif", color: '#1a2617' }}>
            {productName}
          </h3>

          <p className="text-base leading-relaxed" style={{ color: '#6b7c68', fontFamily: "'Outfit', sans-serif", lineHeight: '1.75' }}>
            {product.tagline}
          </p>

          <div className="flex flex-col gap-1.5 mt-1">
            {product.details.slice(0, 2).map((d) => (
              <div key={d} className="flex items-center gap-2">
                <i className="ri-checkbox-circle-fill text-sm flex-shrink-0" style={{ color: accent }} />
                <span className="text-sm" style={{ color: '#6b7c68', fontFamily: "'Outfit', sans-serif" }}>{d}</span>
              </div>
            ))}
          </div>

          <div className="h-px w-full mt-2" style={{ background: 'rgba(0,0,0,0.06)' }} />

          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold" style={{ fontFamily: "'Cormorant Garant', serif", color: '#1a2617' }}>
                  {format(product.price)}
                </span>
                <span className="text-base font-semibold ml-1" style={{ color: accent, fontFamily: "'Outfit', sans-serif" }}>
                  {currencyInfo.symbol}
                </span>
              </div>
              {currencyInfo.code !== 'TND' && (
                <span className="text-xs" style={{ color: '#9aaa96', fontFamily: "'Outfit', sans-serif" }}>
                  ≈ {product.price} TND
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); addToCart(product); openCart(); }}
                className="flex items-center justify-center w-9 h-9 rounded-full text-sm transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
                style={{ background: '#1a2617', color: '#c9a84c', border: 'none', flexShrink: 0 }}
                title={t('card_details')}
              >
                <i className="ri-shopping-basket-2-line" />
              </button>
            </div>
          </div>
        </div>
    </div>
  );
}
