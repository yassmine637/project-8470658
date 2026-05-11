import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '@/components/feature/Header';
import Footer from '@/components/feature/Footer';
import { products, getStockStatus, STOCK_DISPLAY } from '@/mocks/products';
import { useCart } from '@/hooks/useCart';
import { useCurrencyCtx } from '@/context/CurrencyContext';
import { useWishlist } from '@/hooks/useWishlist';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { addToCart, openCart } = useCart();
  const { format } = useCurrencyCtx();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'certs' | 'awards'>('specs');
  const [added, setAdded] = useState(false);

  const product = products.find((p) => p.id === slug);

  useEffect(() => { window.scrollTo({ top: 0 }); }, [slug]);

  if (!product) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8f6f1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <p style={{ fontFamily: "'Outfit', sans-serif", color: '#1a2617' }}>Produit introuvable.</p>
        <button onClick={() => navigate('/products')} style={{ padding: '10px 24px', background: '#1a2617', color: '#c9a84c', border: 'none', borderRadius: 40, cursor: 'pointer', fontFamily: "'Outfit', sans-serif", fontSize: 13 }}>
          ← {t('products_back')}
        </button>
      </div>
    );
  }

  const accent = product.accentColor ?? '#c9a84c';
  const stockStatus = getStockStatus(product.stock);
  const stockDisplay = STOCK_DISPLAY[stockStatus];
  const isOutOfStock = stockStatus === 'out_of_stock';
  const isArabic = i18n.language === 'ar';

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    openCart();
  };

  const SPEC_LABELS: Record<string, string> = {
    acidity: t('spec_acidity'),
    polyphenols: t('spec_polyphenols'),
    harvestDate: t('spec_harvest'),
    cultivar: t('spec_cultivar'),
    origin: t('spec_origin'),
    extraction: t('spec_extraction'),
    packaging: t('spec_packaging'),
  };

  const TABS = [
    { key: 'specs', label: t('detail_tab_specs'), icon: 'ri-test-tube-line' },
    { key: 'certs', label: t('detail_tab_certs'), icon: 'ri-medal-line' },
    { key: 'awards', label: t('detail_tab_awards'), icon: 'ri-trophy-line' },
  ] as const;

  return (
    <>
      <Header />

      <div style={{ background: '#f8f6f1', minHeight: '100vh' }}>

        {/* Breadcrumb */}
        <div style={{ paddingTop: 112, paddingBottom: 0, maxWidth: 1200, margin: '0 auto', padding: '112px 24px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
            <Link to="/" style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9aaa96', textDecoration: 'none' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#1a2617'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#9aaa96'; }}
            >{t('products_breadcrumb_home')}</Link>
            <span style={{ color: '#c9c9c0', fontSize: '0.7rem' }}>/</span>
            <Link to="/products" style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9aaa96', textDecoration: 'none' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#1a2617'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#9aaa96'; }}
            >{t('products_breadcrumb_collection')}</Link>
            <span style={{ color: '#c9c9c0', fontSize: '0.7rem' }}>/</span>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#1a2617' }}>{product.volume}</span>
          </div>
        </div>

        {/* Hero */}
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 80px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 64, alignItems: 'start' }}>

            {/* Left — Image */}
            <div style={{ position: 'sticky', top: 120 }}>
              <div style={{
                background: '#fff',
                borderRadius: 24,
                padding: '48px 32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 560,
                boxShadow: `0 24px 80px rgba(0,0,0,0.08), 0 0 0 1px ${accent}15`,
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: `radial-gradient(ellipse at center bottom, ${accent}18 0%, transparent 65%)`,
                  pointerEvents: 'none',
                }} />

                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  style={{
                    position: 'absolute', top: 20, right: 20,
                    width: 40, height: 40, borderRadius: '50%',
                    background: isWishlisted(product.id) ? 'rgba(220,53,69,0.1)' : 'rgba(0,0,0,0.05)',
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s', zIndex: 1,
                  }}
                  title={t(isWishlisted(product.id) ? 'wishlist_remove' : 'wishlist_add')}
                >
                  <i className={isWishlisted(product.id) ? 'ri-heart-fill' : 'ri-heart-line'}
                    style={{ fontSize: 18, color: isWishlisted(product.id) ? '#dc3545' : '#9aaa96' }} />
                </button>

                <img
                  src={product.image}
                  alt={product.volume}
                  style={{
                    maxHeight: 480,
                    maxWidth: '100%',
                    objectFit: 'contain',
                    filter: `drop-shadow(0 20px 48px ${accent}50)`,
                    transform: 'scaleY(1.1)',
                  }}
                />
              </div>

              {/* Navigation between products */}
              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                {products.filter(p => p.id !== product.id).map(p => (
                  <Link
                    key={p.id}
                    to={`/products/${p.id}`}
                    style={{
                      flex: 1,
                      background: '#fff',
                      border: '1px solid rgba(0,0,0,0.06)',
                      borderRadius: 12,
                      padding: '10px 8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 6,
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = (p.accentColor ?? '#c9a84c') + '60'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(0,0,0,0.06)'; }}
                  >
                    <img src={p.image} alt={p.volume} style={{ height: 48, objectFit: 'contain' }} />
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 9, color: '#9aaa96', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>
                      {p.volume.split('—')[0].trim()}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Right — Info */}
            <div style={{ paddingTop: 8 }}>
              {/* Badge */}
              {product.badge && (
                <span style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: 40,
                  background: accent + '18',
                  border: `1px solid ${accent}40`,
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: accent,
                  marginBottom: 16,
                }}>
                  {product.badge}
                </span>
              )}

              {/* Volume */}
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, letterSpacing: '0.25em', textTransform: 'uppercase', color: accent, marginBottom: 8, fontWeight: 600 }}>
                {product.volume}
              </p>

              {/* Name */}
              <h1 style={{ fontFamily: "'Cormorant Garant', serif", fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', color: '#1a2617', margin: '0 0 12px', fontWeight: 600, lineHeight: 1.15 }}>
                {isArabic ? t('product_name') : product.name}
              </h1>

              {/* Tagline */}
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: '#6b7c68', lineHeight: 1.7, margin: '0 0 28px', fontStyle: 'italic' }}>
                {product.tagline}
              </p>

              {/* Price */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
                <span style={{ fontFamily: "'Cormorant Garant', serif", fontSize: 38, color: '#1a2617', fontWeight: 700, lineHeight: 1 }}>
                  {format(product.price)}
                </span>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: '#9aaa96', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {t('currency_rate_note')}
                </span>
              </div>

              {/* Stock */}
              <div style={{ marginBottom: 28 }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '4px 10px', borderRadius: 40,
                  background: stockDisplay.bg,
                }}>
                  <i className={stockDisplay.icon} style={{ fontSize: 11, color: stockDisplay.color }} />
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: stockDisplay.color }}>
                    {stockStatus === 'low_stock' ? t('cart_stock_remaining', { stock: product.stock }) : stockStatus === 'out_of_stock' ? t('product_out_of_stock') : t('product_in_stock')}
                  </span>
                </span>
              </div>

              {/* Qty + Add to cart */}
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 32 }}>
                {/* Quantity */}
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(26,38,23,0.15)', borderRadius: 40, overflow: 'hidden' }}>
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    style={{ width: 40, height: 44, background: 'none', border: 'none', cursor: 'pointer', color: '#1a2617', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >−</button>
                  <span style={{ width: 36, textAlign: 'center', fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 600, color: '#1a2617' }}>{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.stock || 99, q + 1))}
                    style={{ width: 40, height: 44, background: 'none', border: 'none', cursor: 'pointer', color: '#1a2617', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >+</button>
                </div>

                {/* Add to cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  style={{
                    flex: 1, height: 44,
                    background: isOutOfStock ? 'rgba(26,38,23,0.1)' : '#1a2617',
                    color: isOutOfStock ? '#9aaa96' : '#c9a84c',
                    border: 'none', borderRadius: 40,
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                    cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}
                >
                  <i className={added ? 'ri-check-line' : 'ri-shopping-bag-line'} />
                  {isOutOfStock ? t('product_out_of_stock_btn') : added ? t('detail_added') : t('card_add_cart')}
                </button>

                {/* B2B link */}
                <Link
                  to="/b2b"
                  style={{
                    height: 44, padding: '0 16px',
                    background: 'transparent',
                    border: `1px solid ${accent}50`,
                    borderRadius: 40,
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: accent,
                    textDecoration: 'none',
                    display: 'flex', alignItems: 'center', gap: 6,
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = accent + '15'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}
                >
                  <i className="ri-building-line" />
                  {t('detail_b2b_btn')}
                </Link>
              </div>

              {/* Trust badges */}
              <div style={{ display: 'flex', gap: 16, marginBottom: 40, flexWrap: 'wrap' }}>
                {[
                  { icon: 'ri-leaf-line', label: t('config_certified_bio') },
                  { icon: 'ri-shield-check-line', label: t('detail_trust_quality') },
                  { icon: 'ri-earth-line', label: t('config_worldwide_delivery') },
                  { icon: 'ri-snowflake-line', label: t('detail_trust_cold') },
                ].map(({ icon, label }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <i className={icon} style={{ color: accent, fontSize: 14 }} />
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: '#6b7c68' }}>{label}</span>
                  </div>
                ))}
              </div>

              {/* Tabs */}
              <div style={{ borderTop: '1px solid rgba(26,38,23,0.08)', paddingTop: 28 }}>
                <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: '1px solid rgba(26,38,23,0.08)' }}>
                  {TABS.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      style={{
                        padding: '10px 18px',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === tab.key ? `2px solid ${accent}` : '2px solid transparent',
                        cursor: 'pointer',
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: 11, fontWeight: 700,
                        letterSpacing: '0.12em', textTransform: 'uppercase',
                        color: activeTab === tab.key ? '#1a2617' : '#9aaa96',
                        marginBottom: -1,
                        display: 'flex', alignItems: 'center', gap: 6,
                        transition: 'all 0.2s',
                      }}
                    >
                      <i className={tab.icon} />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Specs tab */}
                {activeTab === 'specs' && product.specs && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {Object.entries(product.specs).map(([key, value], i) => (
                      <div key={key} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '12px 0',
                        borderBottom: i < Object.keys(product.specs!).length - 1 ? '1px solid rgba(26,38,23,0.06)' : 'none',
                      }}>
                        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: '#9aaa96', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                          {SPEC_LABELS[key] ?? key}
                        </span>
                        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: '#1a2617', fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Certifications tab */}
                {activeTab === 'certs' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {(product.certifications ?? []).map((cert) => (
                      <div key={cert.name} style={{
                        padding: '16px 20px',
                        background: '#fff',
                        borderRadius: 12,
                        border: '1px solid rgba(26,38,23,0.08)',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                          <div style={{
                            width: 40, height: 40, borderRadius: '50%',
                            background: accent + '15',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                          }}>
                            <i className="ri-medal-line" style={{ color: accent, fontSize: 18 }} />
                          </div>
                          <div>
                            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 700, color: '#1a2617', margin: '0 0 3px' }}>
                              {cert.name}
                            </p>
                            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: '#9aaa96', margin: 0 }}>
                              {cert.body} · {cert.year}
                            </p>
                          </div>
                        </div>
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: 6,
                          padding: '6px 12px',
                          background: accent + '12',
                          borderRadius: 40,
                          fontSize: 10,
                          fontFamily: "'Outfit', sans-serif",
                          fontWeight: 700,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          color: accent,
                          whiteSpace: 'nowrap',
                        }}>
                          <i className="ri-verified-badge-line" />
                          {t('detail_cert_verified')}
                        </div>
                      </div>
                    ))}
                    <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: '#9aaa96', marginTop: 8, lineHeight: 1.6 }}>
                      <i className="ri-information-line" style={{ marginRight: 4 }} />
                      {t('detail_cert_contact')}
                      {' '}
                      <a href="mailto:contact@domainefendri.com" style={{ color: accent, textDecoration: 'none' }}>contact@domainefendri.com</a>
                    </p>
                  </div>
                )}

                {/* Awards tab */}
                {activeTab === 'awards' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {(product.awards ?? product.details).map((award, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'flex-start', gap: 12,
                        padding: '14px 16px',
                        background: '#fff',
                        borderRadius: 10,
                        border: '1px solid rgba(26,38,23,0.06)',
                      }}>
                        <i className="ri-trophy-line" style={{ color: accent, fontSize: 16, marginTop: 1, flexShrink: 0 }} />
                        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: '#1a2617', lineHeight: 1.5 }}>
                          {award}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div style={{ marginTop: 36, padding: '28px 24px', background: '#fff', borderRadius: 16, border: '1px solid rgba(26,38,23,0.06)' }}>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: accent, marginBottom: 12 }}>
                  {t('detail_description')}
                </p>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: '#4a5a46', lineHeight: 1.85, margin: 0 }}>
                  {product.description}
                </p>
              </div>

              {/* B2B CTA */}
              <div style={{
                marginTop: 24,
                padding: '20px 24px',
                background: `linear-gradient(135deg, #1a2617 0%, #2c3a23 100%)`,
                borderRadius: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
              }}>
                <div>
                  <p style={{ fontFamily: "'Cormorant Garant', serif", fontSize: 17, color: '#fff', margin: '0 0 4px', fontWeight: 600 }}>
                    {t('detail_b2b_cta_title')}
                  </p>
                  <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                    {t('detail_b2b_cta_sub')}
                  </p>
                </div>
                <Link
                  to="/b2b"
                  style={{
                    padding: '10px 20px',
                    background: '#c9a84c',
                    color: '#1a2617',
                    borderRadius: 40,
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}
                >
                  <i className="ri-building-line" />
                  {t('detail_b2b_btn')}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
