import { useTranslation } from 'react-i18next';
import { useReveal } from '@/hooks/useReveal';
import { PRODUCT_SECTION_IMAGES } from '@/assets/images';

export default function Product() {
  const { t, i18n } = useTranslation();
  const { ref: imgRef, visible: imgVisible } = useReveal();
  const { ref: textRef, visible: textVisible } = useReveal();
  const productFeat1 = i18n.language === 'ar' ? `100% ${t('product_feat1_label')}` : t('product_feat1_label');

  const FEATURES = [
    { icon: 'ri-leaf-line', label: productFeat1, desc: t('product_feat1_desc') },
    { icon: 'ri-temp-cold-line', label: t('product_feat2_label'), desc: t('product_feat2_desc') },
    { icon: 'ri-award-line', label: t('product_feat3_label'), desc: t('product_feat3_desc') },
    { icon: 'ri-ship-2-line', label: t('product_feat4_label'), desc: t('product_feat4_desc') },
  ];

  return (
    <section
      id="product"
      className="overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #f9f8f4 0%, #f2efe8 100%)' }}
    >
      <div
        className="py-28 px-[5%]"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          alignItems: 'center',
          gap: '6rem',
        }}
      >
        {/* Images */}
        <div
          ref={imgRef}
          className="relative"
          style={{
            height: '580px',
            opacity: imgVisible ? 1 : 0,
            transform: imgVisible ? 'translateX(0)' : 'translateX(-40px)',
            transition: 'opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          <div
            className="absolute rounded-2xl overflow-hidden img-zoom"
            style={{ width: '63%', height: '66%', border: '3px solid #ffffff', zIndex: 2, top: 0, left: 0 }}
          >
            <img
              src={PRODUCT_SECTION_IMAGES.bottles1}
              alt="Huile d'olive Fendri"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div
            className="absolute rounded-2xl overflow-hidden img-zoom"
            style={{ width: '63%', height: '63%', bottom: 0, right: '-8%', border: '3px solid #ffffff', zIndex: 1 }}
          >
            <img
              src={PRODUCT_SECTION_IMAGES.bottles2}
              alt="Collection Domaine Fendri"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>

        {/* Text */}
        <div
          ref={textRef}
          style={{
            opacity: textVisible ? 1 : 0,
            transform: textVisible ? 'translateX(0)' : 'translateX(40px)',
            transition: 'opacity 0.9s cubic-bezier(0.22,1,0.36,1) 0.15s, transform 0.9s cubic-bezier(0.22,1,0.36,1) 0.15s',
            fontFamily: "'Outfit', sans-serif",
          }}
        >
          <span className="block text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#d4af37', letterSpacing: '0.25em' }}>
            {t('product_label')}
          </span>
          <h2 className="text-2xl font-bold mb-3 leading-tight" style={{ color: '#1a2617', fontFamily: "'Cormorant Garant', serif" }}>
            {t('product_title')}
          </h2>
          <div className="flex items-center gap-3 mb-8">
            <div style={{ width: '48px', height: '2px', background: 'linear-gradient(to right, #d4af37, transparent)' }} />
          </div>
          <p className="leading-relaxed mb-5" style={{ color: '#5a6c56', fontSize: '1.05rem', lineHeight: '1.9' }}>
            {t('product_p1')}
          </p>
          <p className="leading-relaxed mb-5" style={{ color: '#5a6c56', fontSize: '1.05rem', lineHeight: '1.9' }}>
            {t('product_p2')}
          </p>
          <p className="leading-relaxed mb-8" style={{ color: '#5a6c56', fontSize: '1.05rem', lineHeight: '1.9' }}>
            {t('product_p3')}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            {FEATURES.map((f) => (
              <div
                key={f.label}
                className="flex flex-col gap-2 p-4 rounded-xl"
                style={{ background: 'rgba(26,38,23,0.03)', border: '1px solid rgba(212,175,55,0.12)' }}
              >
                <div className="w-8 h-8 flex items-center justify-center" style={{ color: 'rgba(212,175,55,0.8)', fontSize: '1.4rem' }}>
                  <i className={f.icon} />
                </div>
                <p className="text-sm font-bold leading-tight" style={{ color: '#1a2617', fontFamily: "'Outfit', sans-serif" }}>
                  {f.label}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: '#8a9e82', fontFamily: "'Outfit', sans-serif" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
