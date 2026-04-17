import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useReveal, useCountUp } from '@/hooks/useReveal';
import VideoModal from './VideoModal';
import { ABOUT_IMAGES } from '@/assets/images';

function StatItem({ value, suffix, label, display, isYear, delay }: {
  value: number; suffix: string; label: string; display?: string; isYear?: boolean; delay: number;
}) {
  const { ref, visible } = useReveal(0.2);
  const count = useCountUp(value, isYear ? 1200 : 1600, visible);

  const formatted = display
    ? (visible ? display : '0')
    : (visible ? count.toLocaleString('fr-FR') : '0');

  return (
    <div
      ref={ref}
      className="py-10 text-center flex flex-col items-center gap-2"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      <span
        className="text-3xl font-bold"
        style={{ color: '#1a2617', fontFamily: "'Cormorant Garant', serif" }}
      >
        {formatted}{suffix}
      </span>
      <span
        className="text-xs uppercase tracking-widest"
        style={{ color: '#8a9e82', fontFamily: "'Outfit', sans-serif", letterSpacing: '0.15em' }}
      >
        {label}
      </span>
    </div>
  );
}

export default function About() {
  const { t } = useTranslation();
  const { ref: imgRef, visible: imgVisible } = useReveal();
  const { ref: textRef, visible: textVisible } = useReveal();
  const [videoOpen, setVideoOpen] = useState(false);

  const stats = [
    { value: 1911, suffix: '', label: t('about_stat_founded'), isYear: true },
    { value: 3000, suffix: '', label: t('about_stat_trees'), display: '3 000' },
    { value: 100, suffix: '+', label: t('about_stat_expertise') },
    { value: 15, suffix: '+', label: t('about_stat_countries') },
  ];

  return (
    <>
      <section
        id="about"
        className="overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f9f8f4 100%)' }}
      >
        <div
          className="py-28 px-[5%]"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '8rem',
            alignItems: 'center',
          }}
        >
          {/* Image block */}
          <div
            ref={imgRef}
            style={{
              opacity: imgVisible ? 1 : 0,
              transform: imgVisible ? 'translateX(0)' : 'translateX(-28px)',
              transition: 'opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1)',
            }}
          >
            <div className="relative">
              <div
                className="absolute -top-7 -right-2 flex flex-col items-center justify-center rounded-full z-10 float-anim"
                style={{
                  width: '88px',
                  height: '88px',
                  background: 'linear-gradient(135deg, #d4af37, #c5a028)',
                  color: '#1a2617',
                  boxShadow: '0 8px 24px rgba(212,175,55,0.35)',
                }}
              >
                <span style={{ fontFamily: "'Cormorant Garant', serif", fontSize: '0.8rem', fontWeight: 700, lineHeight: 1 }}>{t('about_founded_badge')}</span>
                <span style={{ fontFamily: "'Cormorant Garant', serif", fontSize: '1.15rem', fontWeight: 800, lineHeight: 1.3 }}>1911</span>
              </div>
              <div
                className="w-full rounded-2xl overflow-hidden img-zoom"
                style={{ height: '460px', background: '#e8e0d0' }}
              >
                <img
                  src={ABOUT_IMAGES.oliveGrove}
                  alt="Domaine Fendri olive grove"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </div>

          {/* Text block */}
          <div
            ref={textRef}
            style={{
              opacity: textVisible ? 1 : 0,
              transform: textVisible ? 'translateX(0)' : 'translateX(28px)',
              transition: 'opacity 0.9s cubic-bezier(0.22,1,0.36,1) 0.15s, transform 0.9s cubic-bezier(0.22,1,0.36,1) 0.15s',
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            <span
              className="block text-xs font-bold uppercase tracking-widest mb-4"
              style={{ color: '#d4af37', letterSpacing: '0.25em' }}
            >
              {t('about_label')}
            </span>
            <h2
              className="text-2xl font-bold mb-3 leading-tight"
              style={{ color: '#1a2617', fontFamily: "'Cormorant Garant', serif" }}
            >
              {t('about_title')}
            </h2>
            <div className="flex items-center gap-3 mb-8">
              <div style={{ width: '48px', height: '2px', background: 'linear-gradient(to right, #d4af37, transparent)' }} />
            </div>
            <p className="leading-relaxed mb-5" style={{ color: '#5a6c56', fontSize: '1.05rem', lineHeight: '1.9' }}>
              {t('about_p1')}
            </p>
            <p className="leading-relaxed mb-5" style={{ color: '#5a6c56', fontSize: '1.05rem', lineHeight: '1.9' }}>
              {t('about_p2')}
            </p>
            <p className="leading-relaxed mb-8" style={{ color: '#5a6c56', fontSize: '1.05rem', lineHeight: '1.9' }}>
              {t('about_p3')}
            </p>

            {/* CTA Video Button */}
            <button
              onClick={() => setVideoOpen(true)}
              className="cursor-pointer group flex items-center gap-4 whitespace-nowrap"
              style={{ background: 'transparent', border: 'none', padding: 0 }}
            >
              <div
                className="flex items-center justify-center w-12 h-12 rounded-full flex-shrink-0 pulse-gold"
                style={{
                  background: 'linear-gradient(135deg, #d4af37, #c5a028)',
                  boxShadow: '0 4px 20px rgba(212,175,55,0.4)',
                  transition: 'transform 0.3s ease',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.12)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)'; }}
              >
                <i className="ri-play-fill" style={{ color: '#1a2617', fontSize: '18px', marginLeft: '2px' }} />
              </div>
              <div className="text-left">
                <span
                  className="block text-sm font-semibold gold-underline"
                  style={{ color: '#1a2617', fontFamily: "'Outfit', sans-serif", letterSpacing: '0.02em' }}
                >
                  {t('about_video_title')}
                </span>
                <span
                  className="block text-xs uppercase tracking-widest mt-0.5"
                  style={{ color: '#d4af37', fontFamily: "'Outfit', sans-serif", letterSpacing: '0.18em' }}
                >
                  {t('about_video_sub')}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div
          className="grid border-t"
          style={{
            gridTemplateColumns: 'repeat(4, 1fr)',
            borderColor: 'rgba(0,0,0,0.07)',
            background: '#ffffff',
          }}
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              style={{ borderRight: i < stats.length - 1 ? '1px solid rgba(0,0,0,0.07)' : 'none' }}
            >
              <StatItem {...s} delay={i * 80} />
            </div>
          ))}
        </div>
      </section>

      <VideoModal isOpen={videoOpen} onClose={() => setVideoOpen(false)} />
    </>
  );
}
