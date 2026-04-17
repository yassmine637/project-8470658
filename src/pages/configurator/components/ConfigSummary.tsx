import { useTranslation } from 'react-i18next';
import type { BottleModel, BottleSize, LabelStyle } from '@/mocks/configurator';

interface ConfigSummaryProps {
  model: BottleModel;
  size: BottleSize;
  label: LabelStyle;
  customText: string;
  totalPrice: number;
  onOrder: () => void;
  onEstimation?: () => void;
}

export default function ConfigSummary({ model, size, label, customText, totalPrice, onOrder, onEstimation }: ConfigSummaryProps) {
  const { t } = useTranslation();

  const lineItems = [
    { label: model.name, sub: t('config_base_model'), price: model.basePrice, included: false },
    { label: size.label, sub: t('config_step_size'), price: size.priceAdd, included: size.priceAdd === 0 },
    { label: label.name, sub: t('config_step_label'), price: label.priceAdd, included: label.priceAdd === 0 },
    ...(customText ? [{ label: `"${customText}"`, sub: t('config_personalization'), price: 0, included: true }] : []),
  ];

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div>
        <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.3em', color: 'rgba(212,175,55,0.55)', textTransform: 'uppercase', marginBottom: '6px' }}>
          {t('config_summary_header')}
        </div>
        <h3 style={{ fontFamily: "'Cormorant Garant', serif", fontSize: '1.5rem', fontWeight: 600, color: 'rgba(255,255,255,0.88)', lineHeight: 1.2, margin: 0 }}>
          {t('config_summary_title')}
        </h3>
      </div>

      {/* Product preview card */}
      <div
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(212,175,55,0.14)',
          borderRadius: '14px',
          padding: '18px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 0% 50%, rgba(212,175,55,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ width: '56px', height: '82px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <img src={model.image} alt={model.name} className="w-full h-full object-contain" />
        </div>
        <div className="flex-1 min-w-0">
          <div style={{ fontFamily: "'Cormorant Garant', serif", fontSize: '1.05rem', fontWeight: 600, color: 'rgba(255,255,255,0.88)', lineHeight: 1.2 }}>
            {t('config_product_display_name')}
          </div>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.62rem', color: 'rgba(255,255,255,0.35)', marginTop: '3px' }}>
            {model.name} · {size.label}
          </div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              marginTop: '8px',
              padding: '3px 10px',
              borderRadius: '20px',
              background: `${label.accentColor}15`,
              border: `1px solid ${label.accentColor}30`,
            }}
          >
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: label.accentColor, flexShrink: 0 }} />
            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.58rem', color: label.accentColor }}>{label.name}</span>
          </div>
        </div>
      </div>

      {/* Price breakdown */}
      <div
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(212,175,55,0.1)',
          borderRadius: '14px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '12px 18px',
            borderBottom: '1px solid rgba(212,175,55,0.07)',
            background: 'rgba(212,175,55,0.03)',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.22em', color: 'rgba(212,175,55,0.5)', textTransform: 'uppercase' }}>{t('config_detail')}</span>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.22em', color: 'rgba(212,175,55,0.5)', textTransform: 'uppercase' }}>{t('config_price')}</span>
        </div>

        {lineItems.map((item, i) => (
          <div
            key={i}
            style={{
              padding: '13px 18px',
              borderBottom: i < lineItems.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div className="flex-1 min-w-0">
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.72rem', color: 'rgba(255,255,255,0.72)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.label}
              </div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.58rem', color: 'rgba(255,255,255,0.25)', marginTop: '1px' }}>
                {item.sub}
              </div>
            </div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.72rem', color: item.included ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.65)', flexShrink: 0, fontWeight: item.price > 0 ? 600 : 400 }}>
              {item.included ? '—' : `+${item.price} TND`}
            </div>
          </div>
        ))}

        <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.2), transparent)', margin: '0 18px' }} />

        <div style={{ padding: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>{t('config_total_ttc_label')}</div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.56rem', color: 'rgba(255,255,255,0.18)', marginTop: '3px' }}>{t('config_free_delivery')}</div>
          </div>
          <div className="flex items-baseline gap-1">
            <span style={{ fontFamily: "'Cormorant Garant', serif", fontSize: '2.2rem', fontWeight: 700, color: '#d4af37', lineHeight: 1 }}>{totalPrice}</span>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.7rem', color: 'rgba(212,175,55,0.55)' }}>TND</span>
          </div>
        </div>
      </div>

      {/* Estimation */}
      {onEstimation && (
        <button
          onClick={onEstimation}
          className="w-full cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
          style={{
            background: 'transparent',
            border: '1px solid rgba(212,175,55,0.28)',
            borderRadius: '10px',
            padding: '13px 20px',
            color: 'rgba(212,175,55,0.75)',
            fontFamily: "'Outfit', sans-serif",
            fontSize: '0.65rem',
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(212,175,55,0.07)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(212,175,55,0.55)'; (e.currentTarget as HTMLButtonElement).style.color = '#d4af37'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(212,175,55,0.28)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(212,175,55,0.75)'; }}
        >
          <i className="ri-file-text-line" style={{ fontSize: '14px' }} />
          {t('config_get_estimate')}
        </button>
      )}

      {/* Trust badges */}
      <div
        style={{
          padding: '16px',
          borderRadius: '12px',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: 'ri-shield-check-line', key: 'config_secure_payment' },
            { icon: 'ri-award-line', key: 'config_certified_bio' },
            { icon: 'ri-truck-line', key: 'config_worldwide_delivery' },
            { icon: 'ri-refresh-line', key: 'config_return_14' },
          ].map(b => (
            <div key={b.key} className="flex items-center gap-2">
              <i className={b.icon} style={{ color: 'rgba(212,175,55,0.38)', fontSize: '12px', flexShrink: 0 }} />
              <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.6rem', color: 'rgba(255,255,255,0.25)' }}>{t(b.key)}</span>
            </div>
          ))}
        </div>
      </div>

      <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.56rem', color: 'rgba(255,255,255,0.15)', textAlign: 'center', lineHeight: 1.7 }}>
        {t('config_cgv')}<br />{t('config_delivery_delay')}
      </p>
    </div>
  );
}
