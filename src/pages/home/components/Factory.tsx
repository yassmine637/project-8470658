import { useTranslation } from 'react-i18next';
import { useReveal } from '@/hooks/useReveal';
import { FACTORY_IMAGES } from '@/assets/images';

export default function Factory() {
  const { t } = useTranslation();
  const { ref: imgRef, visible: imgVisible } = useReveal();
  const { ref: textRef, visible: textVisible } = useReveal();

  const PROCESS_STEPS = [
    { label: t('factory_step1_label'), desc: t('factory_step1_desc') },
    { label: t('factory_step2_label'), desc: t('factory_step2_desc') },
    { label: t('factory_step3_label'), desc: t('factory_step3_desc') },
    { label: t('factory_step4_label'), desc: t('factory_step4_desc') },
  ];

  return (
    <section id="factory" className="overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
      <div
        className="py-28 px-[5%]"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '7rem',
          alignItems: 'center',
        }}
      >
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
          <div className="absolute rounded-2xl overflow-hidden img-zoom" style={{ width: '66%', height: '64%', top: 0, right: 0, border: '3px solid #ffffff' }}>
            <img
              src={FACTORY_IMAGES.interior}
              className="w-full h-full object-cover object-top"
              alt="Usine Fendri"
            />
          </div>
          <div className="absolute rounded-2xl overflow-hidden img-zoom" style={{ width: '66%', height: '66%', bottom: 0, left: 0, border: '3px solid #ffffff' }}>
            <img
              src={FACTORY_IMAGES.production}
              className="w-full h-full object-cover object-center"
              alt="Production Fendri"
            />
          </div>
        </div>

        <div
          ref={textRef}
          style={{
            opacity: textVisible ? 1 : 0,
            transform: textVisible ? 'translateX(0)' : 'translateX(40px)',
            transition: 'opacity 0.9s cubic-bezier(0.22,1,0.36,1) 0.15s, transform 0.9s cubic-bezier(0.22,1,0.36,1) 0.15s',
            fontFamily: "'Outfit', sans-serif",
          }}
        >
          <span className="block text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#d4af37', letterSpacing: '0.25em' }}>{t('factory_label')}</span>
          <h2 className="text-2xl font-bold mb-3 leading-tight" style={{ color: '#1a2617', fontFamily: "'Cormorant Garant', serif" }}>
            {t('factory_title')}
          </h2>
          <div className="flex items-center gap-3 mb-8">
            <div style={{ width: '48px', height: '2px', background: 'linear-gradient(to right, #d4af37, transparent)' }} />
          </div>
          <p className="leading-relaxed mb-5" style={{ color: '#5a6c56', fontSize: '1.05rem', lineHeight: '1.9' }}>
            {t('factory_p1')}
          </p>
          <p className="leading-relaxed mb-8" style={{ color: '#5a6c56', fontSize: '1.05rem', lineHeight: '1.9' }}>
            {t('factory_p2')}
          </p>
          <div className="grid grid-cols-2 gap-4 mb-8">
            {PROCESS_STEPS.map((step, i) => (
              <div key={step.label} className="flex flex-col gap-2 p-4 rounded-xl" style={{ background: 'rgba(26,38,23,0.03)', border: '1px solid rgba(212,175,55,0.12)' }}>
                <span className="text-2xl font-bold leading-none" style={{ color: 'rgba(212,175,55,0.4)', fontFamily: "'Cormorant Garant', serif" }}>0{i + 1}</span>
                <p className="text-sm font-bold leading-tight" style={{ color: '#1a2617' }}>{step.label}</p>
                <p className="text-xs leading-relaxed" style={{ color: '#8a9e82' }} dangerouslySetInnerHTML={{ __html: step.desc }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
