import { useTranslation } from 'react-i18next';
import { HERO_IMAGES } from '@/assets/images';

export default function Hero() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

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

      <div className="relative z-10 flex flex-col items-center px-6 w-full max-w-5xl mx-auto">

        {/* Main title — two lines in one block */}
        <h1 className="text-white leading-tight mb-6" style={{ fontFamily: "'Cormorant Garant', serif", fontWeight: 300, textShadow: '0 6px 40px rgba(0,0,0,0.55)' }}>
          <span style={{ display: 'block', fontSize: 'clamp(2.4rem, 5.5vw, 72px)', letterSpacing: '0.02em' }}>
            {t('hero_title1')}
          </span>
          <span style={{ display: 'block', fontSize: 'clamp(3rem, 7vw, 92px)', fontStyle: 'italic', letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>
            {t('hero_title2')}
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="mb-5"
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(0.75rem, 1.4vw, 14px)',
            color: '#e8d5a0',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            fontWeight: 400,
          }}
        >
          {t('hero_subtitle')}
        </p>

        {/* Thin gold separator */}
        <div style={{ width: 60, height: 1, background: 'linear-gradient(to right, transparent, #d4af37, transparent)', marginBottom: '1.5rem' }} />

        {/* Description */}
        <p
          className="max-w-2xl mb-10"
          style={{
            fontFamily: "'Cormorant Garant', serif",
            color: 'rgba(240,228,200,0.82)',
            letterSpacing: '0.04em',
            lineHeight: '1.8',
            fontSize: 'clamp(1.05rem, 1.9vw, 22px)',
            fontWeight: 400,
            textAlign: 'center',
          }}
        >
          {t('hero_desc1')} {t('hero_desc2')}
        </p>

        {/* CTA buttons */}
        <div className="hero-cta flex flex-col sm:flex-row gap-5">
          <a
            href="/products"
            className="inline-flex items-center justify-center gap-3 uppercase tracking-widest transition-all duration-300 hover:-translate-y-1 cursor-pointer whitespace-nowrap"
            style={{
              background: 'linear-gradient(135deg, #d4af37 0%, #b8962a 100%)',
              color: '#1a1a0e',
              fontFamily: "'Outfit', sans-serif",
              letterSpacing: '0.22em',
              fontWeight: 600,
              padding: isAr ? '1.5rem 5rem' : '1.25rem 2.75rem',
              fontSize: isAr ? '1.05rem' : '0.875rem',
              minWidth: isAr ? '280px' : undefined,
            }}
          >
            {t('hero_cta_collection')}
          </a>
          <a
            href="/configurator"
            className="inline-flex items-center justify-center gap-3 uppercase tracking-widest transition-all duration-300 hover:-translate-y-1 cursor-pointer whitespace-nowrap"
            style={{
              border: '1px solid rgba(212,175,55,0.65)',
              color: '#e8d5a0',
              background: 'rgba(212,175,55,0.06)',
              fontFamily: "'Outfit', sans-serif",
              letterSpacing: '0.22em',
              fontWeight: 500,
              backdropFilter: 'blur(10px)',
              padding: isAr ? '1.5rem 5rem' : '1.25rem 2.75rem',
              fontSize: isAr ? '1.05rem' : '0.875rem',
              minWidth: isAr ? '280px' : undefined,
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
