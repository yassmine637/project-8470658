import { useState, useEffect, useRef, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/hooks/useCart';

type Step = 'cart' | 'checkout' | 'success';

const COUNTRY_CODES = [
  { code: '+216', flag: '🇹🇳', name: 'Tunisie' },
  { code: '+33', flag: '🇫🇷', name: 'France' },
  { code: '+32', flag: '🇧🇪', name: 'Belgique' },
  { code: '+41', flag: '🇨🇭', name: 'Suisse' },
  { code: '+212', flag: '🇲🇦', name: 'Maroc' },
  { code: '+213', flag: '🇩🇿', name: 'Algérie' },
  { code: '+218', flag: '🇱🇾', name: 'Libye' },
  { code: '+20', flag: '🇪🇬', name: 'Égypte' },
  { code: '+966', flag: '🇸🇦', name: 'Arabie Saoudite' },
  { code: '+971', flag: '🇦🇪', name: 'Émirats Arabes Unis' },
  { code: '+974', flag: '🇶🇦', name: 'Qatar' },
  { code: '+965', flag: '🇰🇼', name: 'Koweït' },
  { code: '+973', flag: '🇧🇭', name: 'Bahreïn' },
  { code: '+968', flag: '🇴🇲', name: 'Oman' },
  { code: '+962', flag: '🇯🇴', name: 'Jordanie' },
  { code: '+961', flag: '🇱🇧', name: 'Liban' },
  { code: '+49', flag: '🇩🇪', name: 'Allemagne' },
  { code: '+44', flag: '🇬🇧', name: 'Royaume-Uni' },
  { code: '+39', flag: '🇮🇹', name: 'Italie' },
  { code: '+34', flag: '🇪🇸', name: 'Espagne' },
  { code: '+31', flag: '🇳🇱', name: 'Pays-Bas' },
  { code: '+1', flag: '🇺🇸', name: 'États-Unis' },
  { code: '+1', flag: '🇨🇦', name: 'Canada' },
  { code: '+61', flag: '🇦🇺', name: 'Australie' },
  { code: '+81', flag: '🇯🇵', name: 'Japon' },
  { code: '+86', flag: '🇨🇳', name: 'Chine' },
  { code: '+7', flag: '🇷🇺', name: 'Russie' },
  { code: '+55', flag: '🇧🇷', name: 'Brésil' },
];

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, totalPrice, totalCount, clearCart } = useCart();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [step, setStep] = useState<Step>('cart');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', address: '', email: '' });
  const [formError, setFormError] = useState('');

  // Phone country selector state
  const [countryCode, setCountryCode] = useState('+216');
  const [countryFlag, setCountryFlag] = useState('🇹🇳');
  const [countryName, setCountryName] = useState('Tunisie');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setStep('cart'), 400);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    };
    if (dropOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropOpen]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFormError('');
  };

  const buildOrderSummary = () =>
    items.map((i) => `${i.product.name} (${i.product.volume}) x${i.quantity} = ${i.product.price * i.quantity} ${t('currency_tnd') ?? 'د.ت'}`).join(' | ');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name || !form.address || !phoneNumber || !form.email) {
      setFormError(t('cart_error_required'));
      return;
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
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: orderItems,
          guestName: form.name,
          guestEmail: form.email,
          guestPhone: `${countryCode} ${phoneNumber}`,
          currency: 'TND',
          shippingAddress: { address: form.address, country: countryName },
        }),
      });
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
                            <div className="flex items-center gap-1 rounded-full overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.1)' }}>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="w-7 h-7 flex items-center justify-center text-sm cursor-pointer border-none transition-colors duration-150"
                                style={{ background: 'transparent', color: '#1a2617' }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#f0ede6'; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                              >
                                <i className="ri-subtract-line" />
                              </button>
                              <span className="w-6 text-center text-sm font-bold" style={{ color: '#1a2617', fontFamily: "'Outfit', sans-serif" }}>
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="w-7 h-7 flex items-center justify-center text-sm cursor-pointer border-none transition-colors duration-150"
                                style={{ background: 'transparent', color: '#1a2617' }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#f0ede6'; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                              >
                                <i className="ri-add-line" />
                              </button>
                            </div>

                            {/* Price */}
                            <span className="text-base font-bold" style={{ color: '#1a2617', fontFamily: "'Cormorant Garant', serif" }}>
                              {item.product.price * item.quantity} <span className="text-xs font-semibold" style={{ color: '#c9a84c' }}>{t('currency_tnd') ?? 'د.ت'}</span>
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
                        {item.product.price * item.quantity} {t('currency_tnd') ?? 'د.ت'}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 flex justify-between items-center" style={{ borderTop: '1px solid rgba(201,168,76,0.2)' }}>
                  <span className="text-sm font-bold uppercase tracking-wider" style={{ color: '#1a2617', fontFamily: "'Outfit', sans-serif" }}>{t('cart_total')}</span>
                  <span className="text-lg font-bold" style={{ color: '#1a2617', fontFamily: "'Cormorant Garant', serif" }}>
                    {totalPrice} <span className="text-sm" style={{ color: '#c9a84c' }}>{t('currency_tnd') ?? 'د.ت'}</span>
                  </span>
                </div>
              </div>

              {/* Static fields: name, email, address */}
              {[
                { name: 'name', label: t('cart_field_name'), type: 'text', placeholder: t('cart_placeholder_name') },
                { name: 'email', label: t('cart_field_email'), type: 'email', placeholder: t('cart_placeholder_email') },
                { name: 'address', label: t('cart_field_address'), type: 'text', placeholder: t('cart_placeholder_address') },
              ].map((field) => (
                <div key={field.name} className="flex flex-col gap-1.5">
                  <label
                    htmlFor={field.name}
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: '#1a2617', fontFamily: "'Outfit', sans-serif" }}
                  >
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
                              setDropOpen(false);
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
                    onChange={e => setPhoneNumber(e.target.value)}
                    placeholder="XX XXX XXX"
                    className="flex-1 px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                    style={{ ...inputStyle, minWidth: 0 }}
                    onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = '#c9a84c'; }}
                    onBlur={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = 'rgba(0,0,0,0.1)'; }}
                  />
                </div>
                <p className="text-xs" style={{ color: '#c4c4b8', fontFamily: "'Outfit', sans-serif" }}>
                  {countryFlag} {countryName}
                </p>
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
              <button
                onClick={closeCart}
                className="mt-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest cursor-pointer border-none whitespace-nowrap"
                style={{ background: '#1a2617', color: '#c9a84c', fontFamily: "'Outfit', sans-serif" }}
              >
                {t('cart_close')}
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
                  {totalPrice} <span className="text-sm font-semibold" style={{ color: '#c9a84c' }}>{t('currency_tnd') ?? 'د.ت'}</span>
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
