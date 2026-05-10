import { useTranslation } from 'react-i18next';
import { HERO_IMAGES } from '@/assets/images';

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-center items-center text-center overflow-hidden"
      style={{
        background: `url('${HERO_IMAGES.background}') center/cover no-repeat fixed`,
        color: '#ffffff',
      }}
    >
      <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(10,22,8,0.46) 0%, rgba(15,26,12,0.32) 50%, rgba(10,22,8,0.50) 100%)' }} />
      <div className="absolute inset-x-0 top-0 h-36" style={{ background: 'linear-gradient(to bottom, rgba(8,18,6,0.65) 0%, transparent 100%)', zIndex: 1 }} />

      <div className="relative z-10 flex flex-col items-center px-6 w-full max-w-4xl mx-auto">
        {/* Badge */}
        <div
          className="hero-badge flex items-center gap-3 mb-8 px-6 py-2.5 uppercase"
          style={{
            fontSize: '0.6rem',
            border: '1px solid rgba(212,175,55,0.5)',
            background: 'rgba(212,175,55,0.08)',
            color: '#e8d5a0',
            fontFamily: "'Outfit', sans-serif",
            letterSpacing: '0.28em',
            backdropFilter: 'blur(12px)',
          }}
        >
          <span style={{ display: 'inline-block', width: 18, height: 1, background: 'rgba(212,175,55,0.7)' }} />
          {t('hero_badge')}
          <span style={{ display: 'inline-block', width: 18, height: 1, background: 'rgba(212,175,55,0.7)' }} />
        </div>

        {/* Title line 1 */}
        <h1
          className="hero-title-1 font-light text-white mb-2 leading-none"
          style={{
            fontFamily: "'Cormorant Garant', serif",
            fontSize: 'clamp(2.4rem, 5.5vw, 72px)',
            textShadow: '0 6px 40px rgba(0,0,0,0.55)',
            letterSpacing: '0.02em',
            fontWeight: 300,
          }}
        >
          {t('hero_title1')}
        </h1>

        {/* Title line 2 */}
        <h1
          className="hero-title-2 font-light text-white mb-5 leading-none"
          style={{
            fontFamily: "'Cormorant Garant', serif",
            fontSize: 'clamp(2.9rem, 6.5vw, 86px)',
            textShadow: '0 6px 40px rgba(0,0,0,0.55)',
            letterSpacing: '0.02em',
            fontStyle: 'italic',
            fontWeight: 300,
          }}
        >
          {t('hero_title2')}
        </h1>

        {/* Divider */}
        <div className="hero-divider flex items-center gap-4 mb-6">
          <span style={{ display: 'inline-block', width: 48, height: 1, background: 'linear-gradient(to right, transparent, #d4af37)' }} />
          <i className="ri-seedling-line" style={{ color: '#d4af37', fontSize: 13 }} />
          <span style={{ display: 'inline-block', width: 48, height: 1, background: 'linear-gradient(to left, transparent, #d4af37)' }} />
        </div>

        {/* Subtitle */}
        <h2
          className="hero-subtitle font-normal mb-8"
          style={{
            fontFamily: "'Cormorant Garant', serif",
            fontSize: 'clamp(1.05rem, 2.4vw, 22px)',
            color: '#e8d5a0',
            textShadow: '0 2px 14px rgba(0,0,0,0.4)',
            letterSpacing: '0.18em',
            fontStyle: 'italic',
            fontWeight: 400,
          }}
        >
          {t('hero_subtitle')}
        </h2>

        {/* Description */}
        <p
          className="hero-desc max-w-2xl mb-11"
          style={{
            fontFamily: "'Cormorant Garant', serif",
            color: 'rgba(240,228,200,0.82)',
            letterSpacing: '0.04em',
            lineHeight: '2',
            fontSize: 'clamp(0.95rem, 1.6vw, 18px)',
            fontWeight: 400,
          }}
        >
          <span style={{ whiteSpace: 'nowrap' }}>{t('hero_desc1')}</span><br />
          {t('hero_desc2')}
        </p>

        {/* CTA buttons */}
        <div className="hero-cta flex flex-col sm:flex-row gap-5">
          <a
            href="/products"
            className="inline-flex items-center justify-center gap-3 px-10 py-4 text-xs uppercase tracking-widest transition-all duration-300 hover:-translate-y-1 cursor-pointer whitespace-nowrap"
            style={{
              background: 'linear-gradient(135deg, #d4af37 0%, #b8962a 100%)',
              color: '#1a1a0e',
              fontFamily: "'Outfit', sans-serif",
              letterSpacing: '0.22em',
              fontWeight: 600,
            }}
          >
            {t('hero_cta_collection')}
          </a>
          <a
            href="/configurator"
            className="inline-flex items-center justify-center gap-3 px-10 py-4 text-xs uppercase tracking-widest transition-all duration-300 hover:-translate-y-1 cursor-pointer whitespace-nowrap"
            style={{
              border: '1px solid rgba(212,175,55,0.65)',
              color: '#e8d5a0',
              background: 'rgba(212,175,55,0.06)',
              fontFamily: "'Outfit', sans-serif",
              letterSpacing: '0.22em',
              fontWeight: 500,
              backdropFilter: 'blur(10px)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(212,175,55,0.14)';
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(212,175,55,0.9)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(212,175,55,0.06)';
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(212,175,55,0.65)';
            }}
          >
            {t('hero_cta_configurator')}
          </a>
        </div>
      </div>


    </section>
  );
}
