import { useState, useEffect, useRef, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useCurrency, CURRENCIES } from '@/hooks/useCurrency';
import type { Currency } from '@/hooks/useCurrency';

type Step = 'cart' | 'checkout' | 'success';

const FEATURED_CURRENCIES: Currency[] = ['TND', 'EUR', 'USD', 'GBP', 'CHF', 'SAR', 'AED'];

// French country name → currency
const FR_COUNTRY_CURRENCY: Record<string, Currency> = {
  'Tunisie': 'TND',
  'France': 'EUR', 'Belgique': 'EUR', 'Allemagne': 'EUR', 'Italie': 'EUR',
  'Espagne': 'EUR', 'Pays-Bas': 'EUR', 'Portugal': 'EUR', 'Autriche': 'EUR',
  'Luxembourg': 'EUR', 'Irlande': 'EUR', 'Grèce': 'EUR', 'Finlande': 'EUR',
  'Suisse': 'CHF',
  'Royaume-Uni': 'GBP',
  'États-Unis': 'USD', 'Jordanie': 'USD', 'Liban': 'USD', 'Libye': 'USD', 'Égypte': 'USD',
  'Canada': 'CAD',
  'Australie': 'AUD',
  'Arabie Saoudite': 'SAR',
  'Émirats Arabes Unis': 'AED', 'Qatar': 'AED', 'Koweït': 'AED', 'Bahreïn': 'AED', 'Oman': 'AED',
  'Maroc': 'EUR', 'Algérie': 'EUR',
};

// postalLen: exact digits required (0 = optional, no standard); postalAlpha: alphanumeric code
const COUNTRY_CODES = [
  // ── Tunisie ──
  { code: '+216', flag: '🇹🇳', name: 'Tunisie', digits: 8, postalLen: 4, postalAlpha: false, postalExample: '1000' },
  // ── Pays arabes du Golfe ──
  { code: '+966', flag: '🇸🇦', name: 'Arabie Saoudite', digits: 9, postalLen: 5, postalAlpha: false, postalExample: '12345' },
  { code: '+971', flag: '🇦🇪', name: 'Émirats Arabes Unis', digits: 9, postalLen: 0, postalAlpha: false, postalExample: '' },
  { code: '+974', flag: '🇶🇦', name: 'Qatar', digits: 8, postalLen: 0, postalAlpha: false, postalExample: '' },
  { code: '+965', flag: '🇰🇼', name: 'Koweït', digits: 8, postalLen: 5, postalAlpha: false, postalExample: '13001' },
  { code: '+973', flag: '🇧🇭', name: 'Bahreïn', digits: 8, postalLen: 3, postalAlpha: false, postalExample: '101' },
  { code: '+968', flag: '🇴🇲', name: 'Oman', digits: 8, postalLen: 3, postalAlpha: false, postalExample: '100' },
  // ── Pays arabes du Levant & Afrique du Nord ──
  { code: '+962', flag: '🇯🇴', name: 'Jordanie', digits: 9, postalLen: 5, postalAlpha: false, postalExample: '11110' },
  { code: '+961', flag: '🇱🇧', name: 'Liban', digits: 8, postalLen: 0, postalAlpha: false, postalExample: '' },
  { code: '+963', flag: '🇸🇾', name: 'Syrie', digits: 9, postalLen: 0, postalAlpha: false, postalExample: '' },
  { code: '+964', flag: '🇮🇶', name: 'Irak', digits: 10, postalLen: 5, postalAlpha: false, postalExample: '10001' },
  { code: '+970', flag: '🇵🇸', name: 'Palestine', digits: 9, postalLen: 3, postalAlpha: false, postalExample: '100' },
  { code: '+20', flag: '🇪🇬', name: 'Égypte', digits: 10, postalLen: 5, postalAlpha: false, postalExample: '11311' },
  { code: '+218', flag: '🇱🇾', name: 'Libye', digits: 9, postalLen: 0, postalAlpha: false, postalExample: '' },
  { code: '+212', flag: '🇲🇦', name: 'Maroc', digits: 9, postalLen: 5, postalAlpha: false, postalExample: '20000' },
  { code: '+213', flag: '🇩🇿', name: 'Algérie', digits: 9, postalLen: 5, postalAlpha: false, postalExample: '16000' },
  { code: '+249', flag: '🇸🇩', name: 'Soudan', digits: 9, postalLen: 5, postalAlpha: false, postalExample: '11111' },
  { code: '+967', flag: '🇾🇪', name: 'Yémen', digits: 9, postalLen: 0, postalAlpha: false, postalExample: '' },
  // ── Europe de l'Ouest ──
  { code: '+33', flag: '🇫🇷', name: 'France', digits: 9, postalLen: 5, postalAlpha: false, postalExample: '75001' },
  { code: '+32', flag: '🇧🇪', name: 'Belgique', digits: 9, postalLen: 4, postalAlpha: false, postalExample: '1000' },
  { code: '+41', flag: '🇨🇭', name: 'Suisse', digits: 9, postalLen: 4, postalAlpha: false, postalExample: '1200' },
  { code: '+49', flag: '🇩🇪', name: 'Allemagne', digits: 11, postalLen: 5, postalAlpha: false, postalExample: '10115' },
  { code: '+44', flag: '🇬🇧', name: 'Royaume-Uni', digits: 10, postalLen: 7, postalAlpha: true, postalExample: 'SW1A 1AA' },
  { code: '+39', flag: '🇮🇹', name: 'Italie', digits: 10, postalLen: 5, postalAlpha: false, postalExample: '00100' },
  { code: '+34', flag: '🇪🇸', name: 'Espagne', digits: 9, postalLen: 5, postalAlpha: false, postalExample: '28001' },
  { code: '+31', flag: '🇳🇱', name: 'Pays-Bas', digits: 9, postalLen: 6, postalAlpha: true, postalExample: '1234AB' },
  { code: '+351', flag: '🇵🇹', name: 'Portugal', digits: 9, postalLen: 7, postalAlpha: true, postalExample: '1000001' },
  { code: '+43', flag: '🇦🇹', name: 'Autriche', digits: 10, postalLen: 4, postalAlpha: false, postalExample: '1010' },
  { code: '+352', flag: '🇱🇺', name: 'Luxembourg', digits: 9, postalLen: 4, postalAlpha: false, postalExample: '1234' },
  { code: '+353', flag: '🇮🇪', name: 'Irlande', digits: 9, postalLen: 7, postalAlpha: true, postalExample: 'D02YX25' },
  { code: '+30', flag: '🇬🇷', name: 'Grèce', digits: 10, postalLen: 5, postalAlpha: false, postalExample: '11521' },
  // ── Europe du Nord ──
  { code: '+46', flag: '🇸🇪', name: 'Suède', digits: 9, postalLen: 5, postalAlpha: false, postalExample: '11120' },
  { code: '+47', flag: '🇳🇴', name: 'Norvège', digits: 8, postalLen: 4, postalAlpha: false, postalExample: '0150' },
  { code: '+45', flag: '🇩🇰', name: 'Danemark', digits: 8, postalLen: 4, postalAlpha: false, postalExample: '1050' },
  { code: '+358', flag: '🇫🇮', name: 'Finlande', digits: 9, postalLen: 5, postalAlpha: false, postalExample: '00100' },
  // ── Europe de l'Est ──
  { code: '+48', flag: '🇵🇱', name: 'Pologne', digits: 9, postalLen: 5, postalAlpha: false, postalExample: '00001' },
  { code: '+420', flag: '🇨🇿', name: 'Tchéquie', digits: 9, postalLen: 5, postalAlpha: false, postalExample: '11000' },
  { code: '+36', flag: '🇭🇺', name: 'Hongrie', digits: 9, postalLen: 4, postalAlpha: false, postalExample: '1011' },
  { code: '+40', flag: '🇷🇴', name: 'Roumanie', digits: 10, postalLen: 6, postalAlpha: false, postalExample: '011111' },
  // ── Autres ──
  { code: '+1', flag: '🇺🇸', name: 'États-Unis', digits: 10, postalLen: 5, postalAlpha: false, postalExample: '90210' },
  { code: '+1', flag: '🇨🇦', name: 'Canada', digits: 10, postalLen: 6, postalAlpha: true, postalExample: 'K1A0A9' },
  { code: '+61', flag: '🇦🇺', name: 'Australie', digits: 9, postalLen: 4, postalAlpha: false, postalExample: '2000' },
];

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, totalPrice, totalCount, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [step, setStep] = useState<Step>('cart');
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'konnect' | 'paypal'>('cod');
  const [form, setForm] = useState({ name: '', email: '', street: '', city: '', postalCode: '' });
  const [postalError, setPostalError] = useState('');
  const [formError, setFormError] = useState('');

  const [postalLen, setPostalLen] = useState(4);
  const [postalAlpha, setPostalAlpha] = useState(false);
  const [postalExample, setPostalExample] = useState('1000');

  // Currency selector
  const { currency, setCurrency, currencyInfo, format: fmtCurrency } = useCurrency('TND');
  const [currencyDropOpen, setCurrencyDropOpen] = useState(false);
  const currencyDropRef = useRef<HTMLDivElement>(null);
  const formatPrice = (amountTND: number) => `${fmtCurrency(amountTND)} ${currencyInfo.symbol}`;

  // Phone country selector state
  const [countryCode, setCountryCode] = useState('+216');
  const [countryFlag, setCountryFlag] = useState('🇹🇳');
  const [countryName, setCountryName] = useState('Tunisie');
  const [countryDigits, setCountryDigits] = useState(8);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setStep('cart'), 400);
    }
  }, [isOpen]);

  useEffect(() => {
    if (step === 'success') {
      const timer = setTimeout(() => {
        closeCart();
        navigate('/');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropOpen(false);
      if (currencyDropRef.current && !currencyDropRef.current.contains(e.target as Node)) setCurrencyDropOpen(false);
    };
    if (dropOpen || currencyDropOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropOpen, currencyDropOpen]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFormError('');
  };

  const buildOrderSummary = () =>
    items.map((i) => `${i.product.name} (${i.product.volume}) x${i.quantity} = ${i.product.price * i.quantity} ${t('currency_tnd') ?? 'د.ت'}`).join(' | ');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const needsGuestInfo = !user || !token;
    if (needsGuestInfo && (!form.name || !form.street || !form.city || !phoneNumber || !form.email)) {
      setFormError(t('cart_error_required'));
      return;
    }
    if (!needsGuestInfo && (!form.street || !form.city || !phoneNumber)) {
      setFormError(t('cart_error_required'));
      return;
    }
    if (phoneNumber.replace(/\D/g, '').length !== countryDigits) {
      setFormError(`Numéro invalide — ${countryDigits} chiffres requis pour ${countryName} (${countryCode})`);
      return;
    }
    if (postalLen > 0) {
      const pc = form.postalCode.trim().replace(/\s/g, '');
      const valid = postalAlpha ? pc.length >= postalLen - 1 && pc.length <= postalLen + 1 : pc.length === postalLen && /^\d+$/.test(pc);
      if (!valid) {
        setFormError(`Code postal invalide — ${postalAlpha ? `${postalLen} caractères` : `${postalLen} chiffres`} requis pour ${countryName} (ex: ${postalExample})`);
        return;
      }
    }
    setSubmitting(true);
    try {
      const orderItems = items.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        volume: i.product.volume,
        price: i.product.price,
        quantity: i.quantity,
      }));
      const shippingAddress = {
        street: form.street,
        city: form.city,
        postalCode: form.postalCode,
        country: countryName,
      };
      if (user && token) {
        await fetch('/api/orders/authenticated', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({
            items: orderItems,
            currency: 'TND',
            shippingAddress,
            paymentMethod,
          }),
        });
      } else {
        await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: orderItems,
            guestName: form.name,
            guestEmail: form.email,
            guestPhone: `${countryCode} ${phoneNumber}`,
            currency: 'TND',
            shippingAddress,
            paymentMethod,
          }),
        });
      }
      setStep('success');
      clearCart();
    } catch {
      setFormError(t('cart_error_generic'));
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    background: '#ffffff',
    border: '1px solid rgba(0,0,0,0.1)',
    color: '#1a2617',
    fontFamily: "'Outfit', sans-serif",
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] transition-all duration-400"
        style={{
          background: isOpen ? 'rgba(10,18,8,0.55)' : 'transparent',
          pointerEvents: isOpen ? 'auto' : 'none',
          backdropFilter: isOpen ? 'blur(3px)' : 'none',
        }}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 h-full z-[70] flex flex-col transition-transform duration-400"
        style={{
          width: 'min(440px, 100vw)',
          background: '#faf8f3',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          borderLeft: '1px solid rgba(201,168,76,0.18)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(0,0,0,0.07)', background: '#1a2617' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center">
              <i className="ri-shopping-basket-2-line text-lg" style={{ color: '#c9a84c' }} />
            </div>
            <div>
              <span className="text-sm font-bold uppercase tracking-widest" style={{ color: '#ffffff', fontFamily: "'Outfit', sans-serif" }}>
                {step === 'success' ? t('cart_success_title') : step === 'checkout' ? t('cart_checkout_title') : t('cart_title')}
              </span>
              {step === 'cart' && totalCount > 0 && (
                <span className="ml-2 text-xs" style={{ color: '#c9a84c', fontFamily: "'Outfit', sans-serif" }}>
                  ({totalCount} {totalCount > 1 ? t('cart_articles') : t('cart_article')})
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Currency selector */}
            <div ref={currencyDropRef} style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setCurrencyDropOpen(v => !v)}
                className="cursor-pointer flex items-center gap-1.5"
                style={{
                  background: currencyDropOpen ? 'rgba(212,175,55,0.18)' : 'rgba(212,175,55,0.08)',
                  border: '1px solid rgba(212,175,55,0.35)',
                  borderRadius: '7px',
                  padding: '5px 9px',
                  color: '#c9a84c',
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  outline: 'none',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(212,175,55,0.18)'; }}
                onMouseLeave={e => { if (!currencyDropOpen) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(212,175,55,0.08)'; }}
              >
                <span style={{ fontSize: '0.9rem' }}>{currencyInfo.flag}</span>
                <span>{currencyInfo.code}</span>
                <i className={currencyDropOpen ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} style={{ fontSize: '12px', opacity: 0.7 }} />
              </button>

              {currencyDropOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  right: 0,
                  zIndex: 400,
                  background: '#1e2e1c',
                  border: '1px solid rgba(201,168,76,0.25)',
                  borderRadius: '10px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                  overflow: 'hidden',
                  minWidth: '160px',
                }}>
                  {FEATURED_CURRENCIES.map((code, idx) => {
                    const c = CURRENCIES[code];
                    const isActive = code === currency;
                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() => { setCurrency(code); setCurrencyDropOpen(false); }}
                        className="cursor-pointer w-full flex items-center gap-2"
                        style={{
                          padding: '9px 14px',
                          background: isActive ? 'rgba(201,168,76,0.12)' : 'transparent',
                          border: 'none',
                          borderBottom: idx < FEATURED_CURRENCIES.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                          color: isActive ? '#c9a84c' : 'rgba(255,255,255,0.78)',
                          fontFamily: "'Outfit', sans-serif",
                          fontSize: '0.75rem',
                          fontWeight: isActive ? 700 : 400,
                          textAlign: 'left',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; }}
                        onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                      >
                        <span style={{ fontSize: '0.9rem' }}>{c.flag}</span>
                        <span style={{ flex: 1 }}>{c.code}</span>
                        {c.symbol !== c.code && <span style={{ opacity: 0.4, fontSize: '0.62rem' }}>{c.symbol}</span>}
                        {isActive && <i className="ri-check-line" style={{ fontSize: '11px' }} />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              onClick={closeCart}
              className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer border-none"
              style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(201,168,76,0.2)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)'; }}
            >
              <i className="ri-close-line text-base" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">

          {/* ── STEP: CART ── */}
          {step === 'cart' && (
            <>
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 px-8 text-center">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full" style={{ background: 'rgba(201,168,76,0.1)' }}>
                    <i className="ri-shopping-basket-2-line text-2xl" style={{ color: '#c9a84c' }} />
                  </div>
                  <p className="text-base font-medium" style={{ color: '#1a2617', fontFamily: "'Cormorant Garant', serif", fontSize: '1.2rem' }}>
                    {t('cart_empty_title')}
                  </p>
                  <p className="text-sm" style={{ color: '#9aaa96', fontFamily: "'Outfit', sans-serif" }}>
                    {t('cart_empty_sub')}
                  </p>
                  <button
                    onClick={() => { closeCart(); navigate('/products'); }}
                    className="mt-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest cursor-pointer border-none transition-all duration-200 whitespace-nowrap"
                    style={{ background: '#1a2617', color: '#c9a84c', fontFamily: "'Outfit', sans-serif" }}
                  >
                    {t('cart_see_collection')}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col">
                  {/* Items */}
                  <div className="flex flex-col divide-y" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                    {items.map((item) => (
                      <div key={item.product.id} className="flex gap-4 px-6 py-5">
                        {/* Image */}
                        <div
                          className="flex-shrink-0 flex items-center justify-center rounded-xl overflow-hidden"
                          style={{ width: '72px', height: '88px', background: 'linear-gradient(160deg, #f0ede6 0%, #e8e4da 100%)' }}
                        >
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="object-contain"
                            style={{ height: '76px', width: 'auto', maxWidth: '60px' }}
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 flex flex-col gap-2 min-w-0">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider truncate" style={{ color: '#c9a84c', fontFamily: "'Outfit', sans-serif" }}>
                              {item.product.volume}
                            </p>
                            <p className="text-sm font-bold leading-snug" style={{ color: '#1a2617', fontFamily: "'Cormorant Garant', serif", fontSize: '1rem' }}>
                              {item.product.name}
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            {/* Qty controls */}
                            <div className="flex flex-col gap-1">
                              <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9aaa96', fontFamily: "'Outfit', sans-serif" }}>
                                Qté
                              </span>
                              <div className="flex items-center gap-1">
                                {/* − */}
                                <button
                                  onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                                  className="flex items-center justify-center cursor-pointer border-none transition-all duration-150"
                                  style={{ width: '26px', height: '32px', borderRadius: '7px', background: '#f0ede6', color: '#1a2617', fontSize: '1rem', fontWeight: 700, flexShrink: 0 }}
                                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(201,168,76,0.25)'; }}
                                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#f0ede6'; }}
                                >
                                  −
                                </button>

                                {/* Editable input box */}
                                <div className="relative flex items-center" style={{ border: '2px solid #c9a84c', borderRadius: '8px', background: '#fff', boxShadow: '0 1px 4px rgba(201,168,76,0.15)' }}>
                                  <input
                                    type="number"
                                    min={1}
                                    max={9999}
                                    value={item.quantity}
                                    onChange={(e) => {
                                      const v = parseInt(e.target.value, 10);
                                      if (!isNaN(v) && v >= 1 && v <= 9999) updateQuantity(item.product.id, v);
                                    }}
                                    onFocus={(e) => {
                                      e.currentTarget.select();
                                      (e.currentTarget.parentElement as HTMLElement).style.borderColor = '#a07a20';
                                      (e.currentTarget.parentElement as HTMLElement).style.background = '#fffdf5';
                                    }}
                                    onBlur={(e) => {
                                      const v = parseInt(e.target.value, 10);
                                      updateQuantity(item.product.id, (!isNaN(v) && v >= 1) ? Math.min(v, 9999) : 1);
                                      (e.currentTarget.parentElement as HTMLElement).style.borderColor = '#c9a84c';
                                      (e.currentTarget.parentElement as HTMLElement).style.background = '#fff';
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') (e.currentTarget as HTMLInputElement).blur();
                                    }}
                                    className="text-center font-bold outline-none"
                                    style={{
                                      width: '46px',
                                      height: '30px',
                                      border: 'none',
                                      background: 'transparent',
                                      color: '#1a2617',
                                      fontFamily: "'Outfit', sans-serif",
                                      fontSize: '0.9rem',
                                      cursor: 'text',
                                      paddingRight: '14px',
                                    }}
                                  />
                                  <i className="ri-pencil-line" style={{ position: 'absolute', right: '4px', top: '50%', transform: 'translateY(-50%)', color: '#c9a84c', fontSize: '0.65rem', pointerEvents: 'none' }} />
                                </div>

                                {/* + */}
                                <button
                                  onClick={() => updateQuantity(item.product.id, Math.min(9999, item.quantity + 1))}
                                  className="flex items-center justify-center cursor-pointer border-none transition-all duration-150"
                                  style={{ width: '26px', height: '32px', borderRadius: '7px', background: '#f0ede6', color: '#1a2617', fontSize: '1rem', fontWeight: 700, flexShrink: 0 }}
                                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(201,168,76,0.25)'; }}
                                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#f0ede6'; }}
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            {/* Price */}
                            <span className="text-base font-bold" style={{ color: '#1a2617', fontFamily: "'Cormorant Garant', serif" }}>
                              {formatPrice(item.product.price * item.quantity)}
                            </span>
                          </div>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full cursor-pointer border-none transition-all duration-200 self-start mt-1"
                          style={{ background: 'rgba(0,0,0,0.05)', color: '#9aaa96' }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(220,50,50,0.1)'; (e.currentTarget as HTMLButtonElement).style.color = '#c0392b'; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.05)'; (e.currentTarget as HTMLButtonElement).style.color = '#9aaa96'; }}
                        >
                          <i className="ri-delete-bin-6-line text-xs" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── STEP: CHECKOUT ── */}
          {step === 'checkout' && (
            <form
              id="fendri-order-form"
              data-readdy-form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5 px-6 py-6"
            >
              {/* Order recap */}
              <div className="rounded-xl p-4" style={{ background: 'rgba(201,168,76,0.07)', border: '1px solid rgba(201,168,76,0.2)' }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#c9a84c', fontFamily: "'Outfit', sans-serif" }}>
                  {t('cart_recap')}
                </p>
                <div className="flex flex-col gap-2">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between items-center">
                      <span className="text-xs" style={{ color: '#6b7c68', fontFamily: "'Outfit', sans-serif" }}>
                        {item.product.volume} × {item.quantity}
                      </span>
                      <span className="text-xs font-bold" style={{ color: '#1a2617', fontFamily: "'Outfit', sans-serif" }}>
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 flex justify-between items-center" style={{ borderTop: '1px solid rgba(201,168,76,0.2)' }}>
                  <span className="text-sm font-bold uppercase tracking-wider" style={{ color: '#1a2617', fontFamily: "'Outfit', sans-serif" }}>{t('cart_total')}</span>
                  <span className="text-lg font-bold" style={{ color: '#1a2617', fontFamily: "'Cormorant Garant', serif" }}>
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>

              {/* Identité : bannière si connecté, champs si invité */}
              {user ? (
                <div className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)' }}>
                  <i className="ri-user-3-line" style={{ color: '#c9a84c', fontSize: 16 }} />
                  <div>
                    <p className="text-xs font-bold" style={{ color: '#1a2617', fontFamily: "'Outfit', sans-serif" }}>{user.name}</p>
                    <p className="text-xs" style={{ color: '#6b7c68', fontFamily: "'Outfit', sans-serif" }}>{user.email}</p>
                  </div>
                </div>
              ) : (
                <>
                  {[
                    { name: 'name', label: t('cart_field_name'), type: 'text', placeholder: t('cart_placeholder_name') },
                    { name: 'email', label: t('cart_field_email'), type: 'email', placeholder: t('cart_placeholder_email') },
                  ].map((field) => (
                    <div key={field.name} className="flex flex-col gap-1.5">
                      <label htmlFor={field.name} className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#1a2617', fontFamily: "'Outfit', sans-serif" }}>
                        {field.label}
                      </label>
                      <input
                        id={field.name}
                        name={field.name}
                        type={field.type}
                        placeholder={field.placeholder}
                        value={form[field.name as keyof typeof form]}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                        style={inputStyle}
                        onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = '#c9a84c'; }}
                        onBlur={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = 'rgba(0,0,0,0.1)'; }}
                      />
                    </div>
                  ))}
                </>
              )}

              {/* Address fields: street, city, postal code */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#1a2617', fontFamily: "'Outfit', sans-serif" }}>
                  {t('cart_field_address')}
                </label>
                <input
                  name="street"
                  type="text"
                  placeholder={t('cart_placeholder_address')}
                  value={form.street}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                  style={inputStyle}
                  onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = '#c9a84c'; }}
                  onBlur={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = 'rgba(0,0,0,0.1)'; }}
                />
              </div>

              <div className="flex gap-3">
                {/* City */}
                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#1a2617', fontFamily: "'Outfit', sans-serif" }}>
                    {t('cart_field_city') ?? 'Ville'}
                  </label>
                  <input
                    name="city"
                    type="text"
                    placeholder={t('cart_placeholder_city') ?? 'Tunis'}
                    value={form.city}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                    style={inputStyle}
                    onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = '#c9a84c'; }}
                    onBlur={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = 'rgba(0,0,0,0.1)'; }}
                  />
                </div>

                {/* Postal code */}
                {postalLen > 0 && (
                  <div className="flex flex-col gap-1.5" style={{ width: '130px', flexShrink: 0 }}>
                    <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#1a2617', fontFamily: "'Outfit', sans-serif" }}>
                      {t('cart_field_postal') ?? 'Code postal'}
                    </label>
                    <input
                      name="postalCode"
                      type="text"
                      placeholder={postalExample || '—'}
                      value={form.postalCode}
                      maxLength={postalLen + 1}
                      onChange={e => {
                        const raw = postalAlpha
                          ? e.target.value.toUpperCase().slice(0, postalLen + 1)
                          : e.target.value.replace(/\D/g, '').slice(0, postalLen);
                        setForm(prev => ({ ...prev, postalCode: raw }));
                        setPostalError('');
                      }}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                      style={{
                        ...inputStyle,
                        borderColor: (() => {
                          const pc = form.postalCode.replace(/\s/g, '');
                          if (!pc) return 'rgba(0,0,0,0.1)';
                          const ok = postalAlpha
                            ? pc.length >= postalLen - 1
                            : pc.length === postalLen && /^\d+$/.test(pc);
                          return ok ? '#4a7c4e' : '#c9a84c';
                        })(),
                      }}
                      onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = '#c9a84c'; }}
                      onBlur={(e) => {
                        const pc = form.postalCode.replace(/\s/g, '');
                        const ok = postalAlpha
                          ? pc.length >= postalLen - 1
                          : pc.length === postalLen && /^\d+$/.test(pc);
                        (e.currentTarget as HTMLInputElement).style.borderColor = pc ? (ok ? '#4a7c4e' : '#e8534a') : 'rgba(0,0,0,0.1)';
                        if (pc && !ok) setPostalError(`${postalAlpha ? postalLen + ' car.' : postalLen + ' chiffres'} — ex: ${postalExample}`);
                      }}
                    />
                    <div className="flex items-center justify-between">
                      {postalError ? (
                        <p className="text-xs" style={{ color: '#e8534a', fontFamily: "'Outfit', sans-serif" }}>{postalError}</p>
                      ) : (
                        <p className="text-xs" style={{ color: '#c4c4b8', fontFamily: "'Outfit', sans-serif" }}>
                          ex: {postalExample}
                        </p>
                      )}
                      <p className="text-xs font-semibold" style={{
                        color: (() => {
                          const pc = form.postalCode.replace(/\s/g, '');
                          const ok = postalAlpha ? pc.length >= postalLen - 1 : pc.length === postalLen;
                          return pc ? (ok ? '#4a7c4e' : '#c9a84c') : '#c4c4b8';
                        })(),
                        fontFamily: "'Outfit', sans-serif",
                      }}>
                        {form.postalCode.replace(/\s/g, '').length}/{postalLen}
                        {(() => {
                          const pc = form.postalCode.replace(/\s/g, '');
                          const ok = postalAlpha ? pc.length >= postalLen - 1 : pc.length === postalLen;
                          return pc && ok ? <i className="ri-check-line ml-1" /> : null;
                        })()}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Phone with country selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#1a2617', fontFamily: "'Outfit', sans-serif" }}>
                  {t('cart_field_phone')}
                </label>
                <div className="flex gap-2" style={{ position: 'relative' }}>
                  <div ref={dropRef} style={{ position: 'relative', flexShrink: 0 }}>
                    <button
                      type="button"
                      onClick={() => setDropOpen(v => !v)}
                      className="cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                      style={{
                        height: '46px',
                        padding: '0 10px',
                        border: '1px solid rgba(0,0,0,0.1)',
                        borderRadius: '12px',
                        background: '#ffffff',
                        color: '#1a2617',
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: '0.8rem',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#c9a84c'; }}
                      onMouseLeave={e => { if (!dropOpen) (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,0,0,0.1)'; }}
                    >
                      <span style={{ fontSize: '1rem' }}>{countryFlag}</span>
                      <span style={{ color: '#c9a84c', fontWeight: 700, fontSize: '0.72rem' }}>{countryCode}</span>
                      <i className={dropOpen ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} style={{ fontSize: '13px', color: '#9ca3af' }} />
                    </button>

                    {dropOpen && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 'calc(100% + 4px)',
                          left: 0,
                          zIndex: 200,
                          width: '240px',
                          maxHeight: '210px',
                          overflowY: 'auto',
                          background: '#ffffff',
                          border: '1px solid rgba(0,0,0,0.1)',
                          borderRadius: '12px',
                          scrollbarWidth: 'thin',
                        }}
                      >
                        {COUNTRY_CODES.map((c, idx) => (
                          <button
                            key={`${c.code}-${idx}`}
                            type="button"
                            onClick={() => {
                              setCountryCode(c.code);
                              setCountryFlag(c.flag);
                              setCountryName(c.name);
                              setCountryDigits(c.digits);
                              setPhoneNumber('');
                              setPostalLen(c.postalLen);
                              setPostalAlpha(c.postalAlpha);
                              setPostalExample(c.postalExample);
                              setForm(prev => ({ ...prev, postalCode: '' }));
                              setPostalError('');
                              setDropOpen(false);
                              // Auto-switch currency to match country
                              const autoC = FR_COUNTRY_CURRENCY[c.name];
                              if (autoC) setCurrency(autoC);
                            }}
                            className="cursor-pointer w-full flex items-center gap-2.5 whitespace-nowrap"
                            style={{
                              padding: '8px 12px',
                              background: countryName === c.name ? 'rgba(201,168,76,0.08)' : 'transparent',
                              border: 'none',
                              borderBottom: idx < COUNTRY_CODES.length - 1 ? '1px solid #f3f3f0' : 'none',
                              color: '#1a2617',
                              fontFamily: "'Outfit', sans-serif",
                              fontSize: '0.75rem',
                              textAlign: 'left',
                              transition: 'background 0.15s',
                            }}
                            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(201,168,76,0.06)'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = countryName === c.name ? 'rgba(201,168,76,0.08)' : 'transparent'; }}
                          >
                            <span style={{ fontSize: '1rem', flexShrink: 0 }}>{c.flag}</span>
                            <span style={{ flex: 1 }}>{c.name}</span>
                            <span style={{ color: '#c9a84c', fontWeight: 700, fontSize: '0.7rem' }}>{c.code}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <input
                    type="tel"
                    name="phone"
                    required
                    value={phoneNumber}
                    maxLength={countryDigits}
                    onChange={e => {
                      const digits = e.target.value.replace(/\D/g, '').slice(0, countryDigits);
                      setPhoneNumber(digits);
                    }}
                    placeholder={'X'.repeat(countryDigits)}
                    className="flex-1 px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                    style={{
                      ...inputStyle,
                      minWidth: 0,
                      borderColor: phoneNumber.length > 0 && phoneNumber.length === countryDigits
                        ? '#4a7c4e'
                        : phoneNumber.length > 0
                        ? '#c9a84c'
                        : 'rgba(0,0,0,0.1)',
                    }}
                    onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = '#c9a84c'; }}
                    onBlur={(e) => {
                      (e.currentTarget as HTMLInputElement).style.borderColor =
                        phoneNumber.length === countryDigits ? '#4a7c4e' : 'rgba(0,0,0,0.1)';
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs" style={{ color: '#c4c4b8', fontFamily: "'Outfit', sans-serif" }}>
                    {countryFlag} {countryName} — {countryDigits} chiffres requis
                  </p>
                  <p className="text-xs font-semibold" style={{
                    color: phoneNumber.length === countryDigits ? '#4a7c4e' : phoneNumber.length > 0 ? '#c9a84c' : '#c4c4b8',
                    fontFamily: "'Outfit', sans-serif",
                  }}>
                    {phoneNumber.length}/{countryDigits}
                    {phoneNumber.length === countryDigits && <i className="ri-check-line ml-1" />}
                  </p>
                </div>
              </div>

              {/* Payment method selector */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#1a2617', fontFamily: "'Outfit', sans-serif" }}>
                  Mode de paiement
                </label>
                <div className="flex flex-col gap-2">
                  {/* Paiement à la livraison */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left transition-all duration-200 cursor-pointer border-none"
                    style={{
                      background: paymentMethod === 'cod' ? 'rgba(26,38,23,0.06)' : '#ffffff',
                      border: `2px solid ${paymentMethod === 'cod' ? '#1a2617' : 'rgba(0,0,0,0.1)'}`,
                    }}
                  >
                    <div className="w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0" style={{ background: paymentMethod === 'cod' ? '#1a2617' : 'rgba(0,0,0,0.06)' }}>
                      <i className="ri-truck-line text-sm" style={{ color: paymentMethod === 'cod' ? '#c9a84c' : '#9aaa96' }} />
                    </div>
                    <div>
                      <p className="text-sm font-bold" style={{ color: '#1a2617', fontFamily: "'Outfit', sans-serif" }}>
                        Paiement à la livraison
                      </p>
                      <p className="text-xs" style={{ color: '#9aaa96', fontFamily: "'Outfit', sans-serif" }}>
                        Payez en cash à la réception de votre commande
                      </p>
                    </div>
                    <div className="ml-auto flex-shrink-0">
                      <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ borderColor: paymentMethod === 'cod' ? '#1a2617' : 'rgba(0,0,0,0.2)' }}>
                        {paymentMethod === 'cod' && <div className="w-2 h-2 rounded-full" style={{ background: '#1a2617' }} />}
                      </div>
                    </div>
                  </button>

                  {/* Konnect — bientôt disponible */}
                  <button
                    type="button"
                    disabled
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left cursor-not-allowed border-none"
                    style={{ background: '#f9f9f7', border: '2px solid rgba(0,0,0,0.06)', opacity: 0.65 }}
                  >
                    <div className="w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0 overflow-hidden" style={{ background: '#1a1a2e' }}>
                      <span className="text-xs font-black tracking-tight" style={{ color: '#e94560' }}>K</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold flex items-center gap-2" style={{ color: '#1a2617', fontFamily: "'Outfit', sans-serif" }}>
                        Konnect
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(201,168,76,0.15)', color: '#c9a84c' }}>
                          Bientôt
                        </span>
                      </p>
                      <p className="text-xs" style={{ color: '#9aaa96', fontFamily: "'Outfit', sans-serif" }}>
                        Carte bancaire · e-DINAR · wallet mobile
                      </p>
                    </div>
                  </button>

                  {/* D17 mobile — bientôt disponible */}
                  <button
                    type="button"
                    disabled
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left cursor-not-allowed border-none"
                    style={{ background: '#f9f9f7', border: '2px solid rgba(0,0,0,0.06)', opacity: 0.65 }}
                  >
                    <div className="w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0" style={{ background: '#e63946' }}>
                      <i className="ri-smartphone-line text-sm" style={{ color: '#ffffff' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold flex items-center gap-2" style={{ color: '#1a2617', fontFamily: "'Outfit', sans-serif" }}>
                        D17 — Paiement mobile
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(201,168,76,0.15)', color: '#c9a84c' }}>
                          Bientôt
                        </span>
                      </p>
                      <p className="text-xs" style={{ color: '#9aaa96', fontFamily: "'Outfit', sans-serif" }}>
                        Wallet La Poste Tunisienne · paiement par téléphone
                      </p>
                    </div>
                  </button>

                  {/* PayPal — bientôt disponible */}
                  <button
                    type="button"
                    disabled
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left cursor-not-allowed border-none"
                    style={{ background: '#f9f9f7', border: '2px solid rgba(0,0,0,0.06)', opacity: 0.65 }}
                  >
                    <div className="w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0" style={{ background: '#003087' }}>
                      <span className="text-xs font-black" style={{ color: '#ffffff', letterSpacing: '-1px' }}>PP</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold flex items-center gap-2" style={{ color: '#1a2617', fontFamily: "'Outfit', sans-serif" }}>
                        PayPal
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(201,168,76,0.15)', color: '#c9a84c' }}>
                          Bientôt
                        </span>
                      </p>
                      <p className="text-xs" style={{ color: '#9aaa96', fontFamily: "'Outfit', sans-serif" }}>
                        Paiement international · mobile &amp; ordinateur
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {formError && (
                <p className="text-xs text-center" style={{ color: '#c0392b', fontFamily: "'Outfit', sans-serif" }}>
                  {formError}
                </p>
              )}
            </form>
          )}

          {/* ── STEP: SUCCESS ── */}
          {step === 'success' && (
            <div className="flex flex-col items-center justify-center h-full gap-5 px-8 text-center">
              <div
                className="w-20 h-20 flex items-center justify-center rounded-full"
                style={{ background: 'rgba(74,124,78,0.12)' }}
              >
                <i className="ri-checkbox-circle-fill text-4xl" style={{ color: '#4a7c4e' }} />
              </div>
              <div>
                <p className="text-xl font-bold mb-2" style={{ color: '#1a2617', fontFamily: "'Cormorant Garant', serif" }}>
                  {t('cart_success_msg')}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: '#6b7c68', fontFamily: "'Outfit', sans-serif" }}>
                  {t('cart_success_sub')}
                </p>
              </div>
              <p className="text-xs" style={{ color: '#9aaa96', fontFamily: "'Outfit', sans-serif" }}>
                Redirection vers l'accueil dans 3 secondes…
              </p>
              <button
                onClick={() => { closeCart(); navigate('/'); }}
                className="mt-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest cursor-pointer border-none whitespace-nowrap"
                style={{ background: '#1a2617', color: '#c9a84c', fontFamily: "'Outfit', sans-serif" }}
              >
                Retour à l'accueil
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {step === 'cart' && items.length > 0 && (
          <div className="flex-shrink-0" style={{ borderTop: '1px solid rgba(0,0,0,0.07)', background: '#ffffff' }}>
            {/* Livraison & conditions */}
            <div className="px-6 pt-4 pb-3">
              <div className="rounded-xl p-4" style={{ background: '#f8f6f1', border: '1px solid rgba(201,168,76,0.15)' }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-1.5" style={{ color: '#c9a84c', fontFamily: "'Outfit', sans-serif" }}>
                  <i className="ri-shield-check-line" />
                  {t('cart_delivery_title')}
                </p>
                <div className="flex flex-col gap-2">
                  {[
                    { icon: 'ri-truck-line', text: t('cart_delivery1') },
                    { icon: 'ri-gift-line', text: t('cart_delivery2') },
                    { icon: 'ri-phone-line', text: t('cart_delivery3') },
                    { icon: 'ri-lock-line', text: t('cart_delivery4') },
                  ].map((item) => (
                    <div key={item.text} className="flex items-start gap-2">
                      <div className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <i className={`${item.icon} text-xs`} style={{ color: '#4a7c4e' }} />
                      </div>
                      <span className="text-xs leading-relaxed" style={{ color: '#6b7c68', fontFamily: "'Outfit', sans-serif" }}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Total + CTA */}
            <div className="px-6 pb-5">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#6b7c68', fontFamily: "'Outfit', sans-serif" }}>
                  {t('cart_total')}
                </span>
                <span className="text-2xl font-bold" style={{ color: '#1a2617', fontFamily: "'Cormorant Garant', serif" }}>
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <button
                onClick={() => setStep('checkout')}
                className="w-full py-3.5 rounded-full text-sm font-bold uppercase tracking-widest cursor-pointer border-none transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap"
                style={{ background: '#1a2617', color: '#c9a84c', fontFamily: "'Outfit', sans-serif" }}
              >
                <i className="ri-secure-payment-line mr-2" />
                {t('cart_checkout_btn')}
              </button>
            </div>
          </div>
        )}

        {step === 'checkout' && (
          <div className="flex-shrink-0 px-6 py-5 flex gap-3" style={{ borderTop: '1px solid rgba(0,0,0,0.07)', background: '#ffffff' }}>
            <button
              onClick={() => setStep('cart')}
              className="flex-shrink-0 px-4 py-3 rounded-full text-xs font-bold uppercase tracking-widest cursor-pointer transition-all duration-200 whitespace-nowrap"
              style={{ background: 'rgba(0,0,0,0.06)', color: '#1a2617', border: 'none', fontFamily: "'Outfit', sans-serif" }}
            >
              <i className="ri-arrow-left-line mr-1" />
              {t('cart_back')}
            </button>
            <button
              type="submit"
              form="fendri-order-form"
              disabled={submitting}
              className="flex-1 py-3 rounded-full text-sm font-bold uppercase tracking-widest cursor-pointer border-none transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap"
              style={{ background: submitting ? '#9aaa96' : '#1a2617', color: '#c9a84c', fontFamily: "'Outfit', sans-serif" }}
            >
              {submitting ? (
                <><i className="ri-loader-4-line animate-spin mr-2" />{t('cart_sending')}</>
              ) : (
                <><i className="ri-check-line mr-2" />{t('cart_confirm')}</>
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
