import { useTranslation } from 'react-i18next';
import { useReveal } from '@/hooks/useReveal';

function FeaturedItem({ icon, title, years, desc, delay }: { icon: string; title: string; years: string; desc: string; delay: number }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className="flex gap-6 py-7 border-b last:border-b-0"
      style={{
        borderColor: 'rgba(255,255,255,0.07)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      <div className="w-10 h-10 flex items-center justify-center rounded-lg flex-shrink-0 mt-0.5" style={{ background: 'rgba(201,168,76,0.1)', color: '#c9a84c', fontSize: '1.1rem' }}>
        <i className={icon} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-baseline gap-3 mb-2">
          <h4 className="font-semibold" style={{ color: '#ede0b8', fontFamily: "'Cormorant Garant', serif", fontSize: '1.15rem' }}>{title}</h4>
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(201,168,76,0.65)', fontFamily: "'Outfit', sans-serif" }}>{years}</span>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.42)', fontFamily: "'Outfit', sans-serif" }}>{desc}</p>
      </div>
    </div>
  );
}

export default function Awards() {
  const { t } = useTranslation();
  const { ref: titleRef, visible: titleVisible } = useReveal();
  const { ref: medalsRef, visible: medalsVisible } = useReveal();

  const featured = [
    { icon: 'ri-trophy-line', title: t('awards_a1_title'), years: t('awards_a1_years'), desc: t('awards_a1_desc') },
    { icon: 'ri-book-open-line', title: t('awards_a2_title'), years: t('awards_a2_years'), desc: t('awards_a2_desc') },
    { icon: 'ri-global-line', title: t('awards_a3_title'), years: t('awards_a3_years'), desc: t('awards_a3_desc') },
  ];

  const medals = [
    { label: t('awards_m1') },
    { label: t('awards_m2') },
    { label: t('awards_m3') },
    { label: t('awards_m4') },
    { label: t('awards_m5') },
    { label: t('awards_m6') },
  ];

  return (
    <section id="awards" className="relative py-24 px-[5%] overflow-hidden" style={{ backgroundColor: '#1a2617' }}>
      <div
        ref={titleRef}
        className="relative z-10 text-center mx-auto mb-16"
        style={{ opacity: titleVisible ? 1 : 0, transform: titleVisible ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.7s ease, transform 0.7s ease' }}
      >
        <span className="block text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'rgba(201,168,76,0.7)', letterSpacing: '0.25em', fontFamily: "'Outfit', sans-serif" }}>{t('awards_label')}</span>
        <h2 className="text-3xl font-bold" style={{ color: '#ffffff', fontFamily: "'Cormorant Garant', serif", lineHeight: '1.15' }}>{t('awards_title')}</h2>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20 max-w-6xl mx-auto">
        <div className="lg:col-span-3">
          {featured.map((a, i) => (
            <FeaturedItem key={a.title} {...a} delay={i * 120} />
          ))}
        </div>
        <div
          ref={medalsRef}
          className="lg:col-span-2 flex flex-col gap-2 self-start lg:pt-2"
          style={{ opacity: medalsVisible ? 1 : 0, transform: medalsVisible ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s' }}
        >
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: "'Outfit', sans-serif", letterSpacing: '0.2em' }}>{t('awards_other')}</p>
          {medals.map((m, i) => (
            <div key={i} className="flex items-start gap-3 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2" style={{ background: '#c9a84c' }} />
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Outfit', sans-serif" }}>{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
