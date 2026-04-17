import { useTranslation } from 'react-i18next';
import { useReveal } from '@/hooks/useReveal';

function ValueCard({ icon, title, desc, delay }: { icon: string; title: string; desc: string; delay: number }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className="bg-white rounded-2xl p-9 cursor-default card-lift"
      style={{
        border: '1px solid rgba(0,0,0,0.07)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.75s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.75s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
      <div
        className="w-14 h-14 flex items-center justify-center rounded-2xl mx-auto mb-6"
        style={{
          background: '#f5f2eb',
          color: '#c9a84c',
          fontSize: '1.5rem',
          transition: 'background 0.3s ease, transform 0.3s ease',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.background = 'rgba(201,168,76,0.18)';
          (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.1) rotate(-4deg)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.background = '#f5f2eb';
          (e.currentTarget as HTMLDivElement).style.transform = 'scale(1) rotate(0deg)';
        }}
      >
        <i className={icon} />
      </div>
      <h3 className="text-center text-xl font-bold mb-3" style={{ color: '#1a2617', fontFamily: "'Cormorant Garant', serif" }}>{title}</h3>
      <div className="w-8 h-px mx-auto mb-5" style={{ background: 'rgba(201,168,76,0.45)' }} />
      <p className="text-center leading-relaxed text-sm" style={{ color: '#6b7c68', fontFamily: "'Outfit', sans-serif", lineHeight: '1.85' }}>{desc}</p>
    </div>
  );
}

export default function Values() {
  const { t } = useTranslation();
  const { ref: titleRef, visible: titleVisible } = useReveal();

  const values = [
    { icon: 'ri-plant-line', title: t('values_v1_title'), desc: t('values_v1_desc') },
    { icon: 'ri-award-line', title: t('values_v2_title'), desc: t('values_v2_desc') },
    { icon: 'ri-time-line', title: t('values_v3_title'), desc: t('values_v3_desc') },
  ];

  return (
    <section id="values" className="py-24 px-[5%]" style={{ backgroundColor: '#f8f6f1' }}>
      <div
        ref={titleRef}
        className="text-center mb-14"
        style={{
          opacity: titleVisible ? 1 : 0,
          transform: titleVisible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.8s cubic-bezier(0.22,1,0.36,1), transform 0.8s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        <span className="block text-sm font-bold uppercase tracking-widest mb-4" style={{ color: '#c9a84c', letterSpacing: '0.25em', fontFamily: "'Outfit', sans-serif" }}>{t('values_label')}</span>
        <h2 className="text-3xl font-bold mb-4" style={{ color: '#1a2617', fontFamily: "'Cormorant Garant', serif" }}>{t('values_title')}</h2>
      </div>
      <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        {values.map((v, i) => <ValueCard key={v.title} {...v} delay={i * 120} />)}
      </div>
    </section>
  );
}
