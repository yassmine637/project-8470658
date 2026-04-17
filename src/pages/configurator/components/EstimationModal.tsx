import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { BottleModel, BottleSize, LabelStyle } from '@/mocks/configurator';
import { CURRENCIES, getCurrencyForCountry } from '@/hooks/useCurrency';
import type { Currency } from '@/hooks/useCurrency';

interface EstimationModalProps {
  isOpen: boolean;
  model: BottleModel;
  size: BottleSize;
  label: LabelStyle;
  customText: string;
  totalPrice: number;
  onClose: () => void;
}

type FormStep = 'estimate' | 'contact' | 'sent';

interface CountryEntry {
  dialCode: string;
  flag: string;
  name: string;
  currency: Currency;
}

const COUNTRIES: CountryEntry[] = [
  { dialCode: '+216', flag: '🇹🇳', name: 'Tunisia', currency: 'TND' },
  { dialCode: '+33', flag: '🇫🇷', name: 'France', currency: 'EUR' },
  { dialCode: '+32', flag: '🇧🇪', name: 'Belgium', currency: 'EUR' },
  { dialCode: '+41', flag: '🇨🇭', name: 'Switzerland', currency: 'CHF' },
  { dialCode: '+212', flag: '🇲🇦', name: 'Morocco', currency: 'EUR' },
  { dialCode: '+213', flag: '🇩🇿', name: 'Algeria', currency: 'EUR' },
  { dialCode: '+218', flag: '🇱🇾', name: 'Libya', currency: 'USD' },
  { dialCode: '+20', flag: '🇪🇬', name: 'Egypt', currency: 'USD' },
  { dialCode: '+966', flag: '🇸🇦', name: 'Saudi Arabia', currency: 'SAR' },
  { dialCode: '+971', flag: '🇦🇪', name: 'UAE', currency: 'AED' },
  { dialCode: '+974', flag: '🇶🇦', name: 'Qatar', currency: 'AED' },
  { dialCode: '+965', flag: '🇰🇼', name: 'Kuwait', currency: 'AED' },
  { dialCode: '+973', flag: '🇧🇭', name: 'Bahrain', currency: 'AED' },
  { dialCode: '+968', flag: '🇴🇲', name: 'Oman', currency: 'AED' },
  { dialCode: '+962', flag: '🇯🇴', name: 'Jordan', currency: 'USD' },
  { dialCode: '+961', flag: '🇱🇧', name: 'Lebanon', currency: 'USD' },
  { dialCode: '+49', flag: '🇩🇪', name: 'Germany', currency: 'EUR' },
  { dialCode: '+44', flag: '🇬🇧', name: 'United Kingdom', currency: 'GBP' },
  { dialCode: '+39', flag: '🇮🇹', name: 'Italy', currency: 'EUR' },
  { dialCode: '+34', flag: '🇪🇸', name: 'Spain', currency: 'EUR' },
  { dialCode: '+31', flag: '🇳🇱', name: 'Netherlands', currency: 'EUR' },
  { dialCode: '+1', flag: '🇺🇸', name: 'United States', currency: 'USD' },
  { dialCode: '+1', flag: '🇨🇦', name: 'Canada', currency: 'CAD' },
  { dialCode: '+61', flag: '🇦🇺', name: 'Australia', currency: 'AUD' },
  { dialCode: '+81', flag: '🇯🇵', name: 'Japan', currency: 'JPY' },
  { dialCode: '+86', flag: '🇨🇳', name: 'China', currency: 'CNY' },
  { dialCode: '+7', flag: '🇷🇺', name: 'Russia', currency: 'RUB' },
  { dialCode: '+55', flag: '🇧🇷', name: 'Brazil', currency: 'BRL' },
];

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(212,175,55,0.2)',
  borderRadius: '7px',
  padding: '11px 14px',
  color: 'rgba(255,255,255,0.85)',
  fontFamily: "'Outfit', sans-serif",
  fontSize: '0.8rem',
  outline: 'none',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box' as const,
};

const labelStyleCSS: React.CSSProperties = {
  fontFamily: "'Outfit', sans-serif",
  fontSize: '0.6rem',
  fontWeight: 700,
  letterSpacing: '0.18em',
  color: 'rgba(212,175,55,0.6)',
  textTransform: 'uppercase' as const,
  display: 'block',
  marginBottom: '6px',
};

export default function EstimationModal({
  isOpen, model, size, label, customText, totalPrice, onClose,
}: EstimationModalProps) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [formStep, setFormStep] = useState<FormStep>('estimate');
  const [quantity] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryEntry>(COUNTRIES[0]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryDropOpen, setCountryDropOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const devisNumber = useRef(`FND-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`);
  const devisDate = useRef(new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }));

  // Currency derived from selected country
  const currencyCode = selectedCountry.currency;
  const currencyInfo = CURRENCIES[currencyCode] ?? CURRENCIES.TND;

  const formatPrice = useCallback((amountTND: number): string => {
    if (currencyInfo.code === 'TND') return `${amountTND}`;
    const converted = Math.round(amountTND * currencyInfo.rate * 100) / 100;
    return converted.toFixed(2);
  }, [currencyInfo]);

  const displaySymbol = currencyInfo.code === 'TND' ? 'TND' : currencyInfo.symbol;

  useEffect(() => {
    if (isOpen) {
      setFormStep('estimate');
      setTimeout(() => setVisible(true), 20);
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setCountryDropOpen(false);
      }
    };
    if (countryDropOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [countryDropOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const unitPrice = totalPrice;
  const subtotal = unitPrice * quantity;
  const tva = Math.round(subtotal * 0.19);
  const totalTTC = subtotal + tva;

  const fullPhone = phoneNumber ? `${selectedCountry.dialCode} ${phoneNumber}` : '';

  const lineItems = [
    { label: t('config_step_model') + ' ' + model.name, detail: t('config_base_model'), price: model.basePrice },
    { label: t('config_step_size') + ' ' + size.label, detail: size.priceAdd === 0 ? t('config_included') : t('config_supplement'), price: size.priceAdd },
    { label: t('config_label_etiquette') + ' ' + label.name, detail: label.description, price: label.priceAdd },
    ...(customText ? [{ label: t('config_personalization'), detail: `${t('config_text_label')} "${customText}"`, price: 0 }] : []),
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const configSummary = `Model: ${model.name} | Size: ${size.label} | Label: ${label.name}${customText ? ` | Text: "${customText}"` : ''} | Qty: ${quantity} | Total TTC: ${totalTTC} TND (≈ ${formatPrice(totalTTC)} ${displaySymbol})`;
    const body = new URLSearchParams({
      name,
      email,
      phone: fullPhone,
      pays: selectedCountry.name,
      currency: currencyCode,
      message: message || '',
      configuration: configSummary,
      devis_number: devisNumber.current,
      quantity: String(quantity),
      total_ht: String(subtotal),
      total_ttc: String(totalTTC),
    });
    try {
      await fetch('https://readdy.ai/api/form/d7ch914kpdh0a4advigg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
      setFormStep('sent');
    } catch {
      setFormStep('sent');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen && !visible) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(4,8,4,0.88)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.35s ease',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '760px',
          maxHeight: '90vh',
          background: 'linear-gradient(160deg, #0d1a0b 0%, #080f07 100%)',
          border: '1px solid rgba(212,175,55,0.2)',
          borderRadius: '16px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)',
          transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)',
          boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,175,55,0.08)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 28px',
            borderBottom: '1px solid rgba(212,175,55,0.1)',
            background: 'rgba(212,175,55,0.04)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <div className="flex items-center gap-3">
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="ri-file-text-line" style={{ color: '#d4af37', fontSize: '16px' }} />
            </div>
            <div>
              <div style={{ fontFamily: "'Cormorant Garant', serif", fontSize: '1.1rem', fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.04em' }}>
                {formStep === 'estimate' ? t('config_estimate_title') : formStep === 'contact' ? t('config_quote_title') : t('config_sent_title')}
              </div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.6rem', color: 'rgba(212,175,55,0.55)', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '1px' }}>
                {formStep === 'estimate' ? `${t('config_ref')} ${devisNumber.current}` : 'Fendri · Premium Olive Oil'}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer flex items-center justify-center w-8 h-8"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'rgba(255,255,255,0.4)', transition: 'all 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#d4af37'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(212,175,55,0.4)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.4)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)'; }}
          >
            <i className="ri-close-line" style={{ fontSize: '16px' }} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: 'rgba(212,175,55,0.2) transparent' }}>

          {/* ── STEP: ESTIMATE ── */}
          {formStep === 'estimate' && (
            <div style={{ padding: '28px' }}>
              <div className="flex flex-wrap gap-4 justify-between mb-6">
                <div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.58rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '4px' }}>{t('config_issued_by')}</div>
                  <div style={{ fontFamily: "'Cormorant Garant', serif", fontSize: '1.2rem', fontWeight: 700, color: '#d4af37', letterSpacing: '0.1em' }}>FENDRI</div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>Domaine Fendri · Meknessi, Sfax, Tunisia</div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)' }}>contact@fendri.tn</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.58rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '4px' }}>{t('config_estimation')}</div>
                  <div style={{ fontFamily: "'Cormorant Garant', serif", fontSize: '1rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>{devisNumber.current}</div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>{t('config_date')} {devisDate.current}</div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)' }}>{t('config_valid')}</div>
                </div>
              </div>

              <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)', marginBottom: '24px' }} />

              {/* Country selector — drives currency */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.22em', color: 'rgba(212,175,55,0.6)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  {t('config_country_selected')}
                </div>
                <div ref={dropRef} style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => setCountryDropOpen(v => !v)}
                    className="cursor-pointer flex items-center gap-3 whitespace-nowrap w-full"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: countryDropOpen ? '1px solid rgba(212,175,55,0.5)' : '1px solid rgba(212,175,55,0.2)',
                      borderRadius: '9px',
                      padding: '11px 16px',
                      color: 'rgba(255,255,255,0.85)',
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: '0.8rem',
                      transition: 'border-color 0.2s',
                      outline: 'none',
                      width: '100%',
                      textAlign: 'left',
                    }}
                  >
                    <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{selectedCountry.flag}</span>
                    <span style={{ flex: 1 }}>{selectedCountry.name}</span>
                    {/* Currency badge — auto-detected */}
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '3px 10px',
                      borderRadius: '20px',
                      background: 'rgba(212,175,55,0.12)',
                      border: '1px solid rgba(212,175,55,0.3)',
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: '0.62rem',
                      fontWeight: 700,
                      color: '#d4af37',
                      letterSpacing: '0.08em',
                      flexShrink: 0,
                    }}>
                      {currencyInfo.flag} {currencyInfo.code}
                    </span>
                    <i className={countryDropOpen ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} style={{ fontSize: '16px', color: 'rgba(255,255,255,0.35)', flexShrink: 0 }} />
                  </button>

                  {countryDropOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 6px)',
                        left: 0,
                        right: 0,
                        zIndex: 300,
                        maxHeight: '240px',
                        overflowY: 'auto',
                        background: '#0d1a0b',
                        border: '1px solid rgba(212,175,55,0.25)',
                        borderRadius: '10px',
                        scrollbarWidth: 'thin',
                        scrollbarColor: 'rgba(212,175,55,0.2) transparent',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                      }}
                    >
                      {COUNTRIES.map((c, idx) => {
                        const cInfo = CURRENCIES[c.currency] ?? CURRENCIES.TND;
                        const isSelected = selectedCountry.name === c.name;
                        return (
                          <button
                            key={`${c.dialCode}-${idx}`}
                            type="button"
                            onClick={() => { setSelectedCountry(c); setCountryDropOpen(false); }}
                            className="cursor-pointer w-full flex items-center gap-3 whitespace-nowrap"
                            style={{
                              padding: '10px 14px',
                              background: isSelected ? 'rgba(212,175,55,0.1)' : 'transparent',
                              border: 'none',
                              borderBottom: idx < COUNTRIES.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                              color: isSelected ? '#d4af37' : 'rgba(255,255,255,0.8)',
                              fontFamily: "'Outfit', sans-serif",
                              fontSize: '0.78rem',
                              textAlign: 'left',
                              transition: 'background 0.15s',
                            }}
                            onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(212,175,55,0.06)'; }}
                            onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                          >
                            <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{c.flag}</span>
                            <span style={{ flex: 1 }}>{c.name}</span>
                            {/* Currency auto-badge */}
                            <span style={{
                              fontFamily: "'Outfit', sans-serif",
                              fontSize: '0.6rem',
                              fontWeight: 700,
                              color: isSelected ? '#d4af37' : 'rgba(212,175,55,0.5)',
                              background: 'rgba(212,175,55,0.07)',
                              borderRadius: '4px',
                              padding: '2px 7px',
                              flexShrink: 0,
                            }}>
                              {cInfo.symbol !== cInfo.code ? `${cInfo.symbol} ${cInfo.code}` : cInfo.code}
                            </span>
                            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.6rem', color: 'rgba(255,255,255,0.25)', flexShrink: 0 }}>{c.dialCode}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Live currency conversion hint */}
                {currencyCode !== 'TND' && (
                  <div style={{
                    marginTop: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '7px',
                    background: 'rgba(212,175,55,0.05)',
                    border: '1px solid rgba(212,175,55,0.12)',
                  }}>
                    <i className="ri-exchange-line" style={{ color: 'rgba(212,175,55,0.5)', fontSize: '12px', flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)' }}>
                      {t('currency_rate_note')} · 1 TND ≈ {currencyInfo.rate} {currencyInfo.code}
                    </span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(212,175,55,0.1)', borderRadius: '10px' }}>
                <div style={{ width: '52px', height: '76px', flexShrink: 0, borderRadius: '6px', overflow: 'hidden', background: 'rgba(255,255,255,0.04)' }}>
                  <img src={model.image} alt={model.name} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1">
                  <div style={{ fontFamily: "'Cormorant Garant', serif", fontSize: '1.1rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>{t('config_product_name')}</div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginTop: '3px' }}>{t('config_custom_config')} · {model.name} · {size.label}</div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', marginTop: '6px', padding: '3px 8px', borderRadius: '20px', background: `${label.accentColor}18`, border: `1px solid ${label.accentColor}33` }}>
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: label.accentColor }} />
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.58rem', color: label.accentColor }}>{t('config_label_etiquette')} {label.name}</span>
                  </div>
                </div>
              </div>

              {/* Invoice table */}
              <div style={{ border: '1px solid rgba(212,175,55,0.12)', borderRadius: '10px', overflow: 'hidden', marginBottom: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '12px', padding: '10px 16px', background: 'rgba(212,175,55,0.06)', borderBottom: '1px solid rgba(212,175,55,0.1)' }}>
                  {[t('config_col_designation'), t('config_col_pu'), t('config_col_total')].map((h, hi) => (
                    <div key={h} style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.18em', color: 'rgba(212,175,55,0.6)', textTransform: 'uppercase', textAlign: hi !== 0 ? 'right' : 'left' }}>{h}</div>
                  ))}
                </div>
                {lineItems.map((item, i) => (
                  <div
                    key={i}
                    style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '12px', padding: '12px 16px', borderBottom: i < lineItems.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center' }}
                  >
                    <div>
                      <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)' }}>{item.label}</div>
                      <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.62rem', color: 'rgba(255,255,255,0.3)', marginTop: '2px', fontStyle: item.label === t('config_personalization') ? 'italic' : 'normal' }}>{item.detail}</div>
                    </div>
                    <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.72rem', color: item.price > 0 ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.25)', textAlign: 'right', fontWeight: 500 }}>
                      {item.price > 0 ? `${formatPrice(item.price)} ${displaySymbol}` : '—'}
                    </div>
                    <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.72rem', color: item.price > 0 ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.25)', textAlign: 'right', fontWeight: 500 }}>
                      {item.price > 0 ? `${formatPrice(item.price * quantity)} ${displaySymbol}` : '—'}
                    </div>
                  </div>
                ))}
                <div style={{ borderTop: '1px solid rgba(212,175,55,0.15)', background: 'rgba(212,175,55,0.03)' }}>
                  {[
                    { label: `${t('config_subtotal')} (${quantity} × ${formatPrice(unitPrice)} ${displaySymbol})`, value: `${formatPrice(subtotal)} ${displaySymbol}` },
                    { label: t('config_tva'), value: `${formatPrice(tva)} ${displaySymbol}` },
                  ].map(row => (
                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)' }}>{row.label}</span>
                      <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)' }}>{row.value}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px' }}>
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>{t('config_total_ttc')}</span>
                    <div style={{ textAlign: 'right' }}>
                      <div className="flex items-baseline gap-1.5 justify-end">
                        <span style={{ fontFamily: "'Cormorant Garant', serif", fontSize: '1.8rem', fontWeight: 700, color: '#d4af37' }}>{formatPrice(totalTTC)}</span>
                        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.75rem', color: 'rgba(212,175,55,0.7)', fontWeight: 700 }}>{displaySymbol}</span>
                      </div>
                      {currencyCode !== 'TND' && (
                        <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.55rem', color: 'rgba(255,255,255,0.2)', marginTop: '2px' }}>
                          ≈ {totalTTC} TND · {t('currency_rate_note')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div style={{ padding: '14px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '24px' }}>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.18em', color: 'rgba(212,175,55,0.5)', textTransform: 'uppercase', marginBottom: '8px' }}>{t('config_conditions_title')}</div>
                {[t('config_cond1'), t('config_cond2'), t('config_cond3'), t('config_cond4')].map((note, i) => (
                  <div key={i} className="flex items-start gap-2" style={{ marginBottom: i < 3 ? '4px' : 0 }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(212,175,55,0.4)', marginTop: '5px', flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.63rem', color: 'rgba(255,255,255,0.28)', lineHeight: 1.5 }}>{note}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 justify-end">
                <button
                  onClick={onClose}
                  className="cursor-pointer whitespace-nowrap"
                  style={{ padding: '11px 20px', borderRadius: '7px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.45)', fontFamily: "'Outfit', sans-serif", fontSize: '0.68rem', letterSpacing: '0.1em', transition: 'all 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.25)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.7)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.45)'; }}
                >
                  {t('config_back_config')}
                </button>
                <button
                  onClick={() => setFormStep('contact')}
                  className="cursor-pointer whitespace-nowrap flex items-center gap-2"
                  style={{ padding: '11px 22px', borderRadius: '7px', border: '1px solid rgba(212,175,55,0.5)', background: 'rgba(212,175,55,0.08)', color: '#d4af37', fontFamily: "'Outfit', sans-serif", fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', transition: 'all 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(212,175,55,0.15)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(212,175,55,0.8)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(212,175,55,0.08)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(212,175,55,0.5)'; }}
                >
                  <i className="ri-mail-send-line" style={{ fontSize: '13px' }} />
                  {t('config_request_quote')}
                </button>
              </div>
            </div>
          )}

          {/* ── STEP: CONTACT FORM ── */}
          {formStep === 'contact' && (
            <div style={{ padding: '28px' }}>
              <div style={{ marginBottom: '24px' }}>
                <button
                  onClick={() => setFormStep('estimate')}
                  className="cursor-pointer flex items-center gap-2 whitespace-nowrap"
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontFamily: "'Outfit', sans-serif", fontSize: '0.65rem', letterSpacing: '0.1em', padding: 0, marginBottom: '16px', transition: 'color 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#d4af37'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.4)'; }}
                >
                  <i className="ri-arrow-left-line" style={{ fontSize: '13px' }} />
                  {t('config_back_estimate')}
                </button>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
                  {t('config_contact_desc')}
                </p>
              </div>

              <div style={{ padding: '12px 16px', borderRadius: '8px', background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.12)', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.65rem', color: 'rgba(255,255,255,0.45)' }}>
                  {model.name} · {size.label} · {label.name} · {quantity} {quantity > 1 ? t('config_units') : t('config_unit')}
                </div>
                <div className="flex items-baseline gap-1">
                  <span style={{ fontFamily: "'Cormorant Garant', serif", fontSize: '1.1rem', fontWeight: 700, color: '#d4af37' }}>{formatPrice(totalTTC)}</span>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.65rem', color: 'rgba(212,175,55,0.7)', fontWeight: 600 }}>{displaySymbol} TTC</span>
                </div>
              </div>

              <form
                data-readdy-form
                onSubmit={handleSubmit}
                style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label style={labelStyleCSS}>{t('config_field_name')} *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder={t('config_placeholder_name')}
                      style={inputStyle}
                      onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(212,175,55,0.6)'; }}
                      onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(212,175,55,0.2)'; }}
                    />
                  </div>
                  <div>
                    <label style={labelStyleCSS}>{t('config_field_email')} *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder={t('config_placeholder_email')}
                      style={inputStyle}
                      onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(212,175,55,0.6)'; }}
                      onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(212,175,55,0.2)'; }}
                    />
                  </div>
                </div>

                {/* Phone with country selector (reuses the same country) */}
                <div>
                  <label style={labelStyleCSS}>{t('config_field_phone')} *</label>
                  <div className="flex gap-2">
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '0 12px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(212,175,55,0.2)',
                      borderRadius: '7px',
                      flexShrink: 0,
                      minHeight: '42px',
                    }}>
                      <span style={{ fontSize: '1rem' }}>{selectedCountry.flag}</span>
                      <span style={{ color: 'rgba(212,175,55,0.8)', fontWeight: 600, fontFamily: "'Outfit', sans-serif", fontSize: '0.8rem' }}>{selectedCountry.dialCode}</span>
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={phoneNumber}
                      onChange={e => setPhoneNumber(e.target.value)}
                      placeholder={t('config_placeholder_phone')}
                      style={{ ...inputStyle, flex: 1 }}
                      onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(212,175,55,0.6)'; }}
                      onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(212,175,55,0.2)'; }}
                    />
                  </div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.58rem', color: 'rgba(255,255,255,0.2)', marginTop: '4px' }}>
                    {t('config_country_selected')} <span style={{ color: 'rgba(212,175,55,0.5)' }}>{selectedCountry.flag} {selectedCountry.name}</span>
                    {currencyCode !== 'TND' && (
                      <span style={{ marginLeft: '6px', color: 'rgba(212,175,55,0.4)' }}>· {currencyInfo.flag} {currencyInfo.code}</span>
                    )}
                  </div>
                </div>

                <div>
                  <label style={labelStyleCSS}>{t('config_field_message')}</label>
                  <textarea
                    name="message"
                    value={message}
                    onChange={e => setMessage(e.target.value.slice(0, 500))}
                    placeholder={t('config_placeholder_message')}
                    rows={3}
                    maxLength={500}
                    style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }}
                    onFocus={e => { (e.target as HTMLTextAreaElement).style.borderColor = 'rgba(212,175,55,0.6)'; }}
                    onBlur={e => { (e.target as HTMLTextAreaElement).style.borderColor = 'rgba(212,175,55,0.2)'; }}
                  />
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.58rem', color: 'rgba(255,255,255,0.2)', textAlign: 'right', marginTop: '3px' }}>{message.length}/500</div>
                </div>

                <div className="flex flex-wrap gap-3 justify-end" style={{ marginTop: '4px' }}>
                  <button
                    type="button"
                    onClick={() => setFormStep('estimate')}
                    className="cursor-pointer whitespace-nowrap"
                    style={{ padding: '11px 20px', borderRadius: '7px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.45)', fontFamily: "'Outfit', sans-serif", fontSize: '0.68rem', letterSpacing: '0.1em', transition: 'all 0.2s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.25)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.7)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.45)'; }}
                  >
                    {t('config_cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="cursor-pointer whitespace-nowrap flex items-center gap-2"
                    style={{ padding: '11px 24px', borderRadius: '7px', border: 'none', background: submitting ? 'rgba(212,175,55,0.4)' : 'linear-gradient(135deg, #d4af37 0%, #b8962a 100%)', color: '#1a1a0e', fontFamily: "'Outfit', sans-serif", fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', transition: 'all 0.2s', boxShadow: '0 4px 20px rgba(212,175,55,0.3)' }}
                    onMouseEnter={e => { if (!submitting) { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 28px rgba(212,175,55,0.45)'; } }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 20px rgba(212,175,55,0.3)'; }}
                  >
                    {submitting ? (
                      <><i className="ri-loader-4-line" style={{ fontSize: '13px', animation: 'spin 1s linear infinite' }} /> {t('config_sending')}</>
                    ) : (
                      <><i className="ri-send-plane-line" style={{ fontSize: '13px' }} /> {t('config_send')}</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── STEP: SENT ── */}
          {formStep === 'sent' && (
            <div style={{ padding: '48px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="ri-check-line" style={{ color: '#d4af37', fontSize: '28px' }} />
              </div>
              <div>
                <div style={{ fontFamily: "'Cormorant Garant', serif", fontSize: '1.4rem', fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginBottom: '8px' }}>
                  {t('config_sent_success')}
                </div>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, maxWidth: '400px' }}>
                  {t('config_sent_desc')} <strong style={{ color: 'rgba(255,255,255,0.65)' }}>{devisNumber.current}</strong>. {t('config_sent_delay')}
                </p>
              </div>
              <div style={{ height: '1px', width: '60px', background: 'rgba(212,175,55,0.3)' }} />
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', lineHeight: 1.6 }}>
                Domaine Fendri · Meknessi, Sfax, Tunisia<br />contact@fendri.tn
              </div>
              <button
                onClick={onClose}
                className="cursor-pointer whitespace-nowrap"
                style={{ marginTop: '8px', padding: '12px 28px', borderRadius: '7px', border: '1px solid rgba(212,175,55,0.4)', background: 'rgba(212,175,55,0.08)', color: '#d4af37', fontFamily: "'Outfit', sans-serif", fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(212,175,55,0.15)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(212,175,55,0.08)'; }}
              >
                {t('config_back_config')}
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
