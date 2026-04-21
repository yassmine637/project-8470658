import { useState, FormEvent, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useReveal } from '@/hooks/useReveal';
import { CONTACT_IMAGES } from '@/assets/images';

const COUNTRY_CODES = [
  { code: '+216', flag: '🇹🇳', name: 'Tunisia' },
  { code: '+33', flag: '🇫🇷', name: 'France' },
  { code: '+32', flag: '🇧🇪', name: 'Belgium' },
  { code: '+41', flag: '🇨🇭', name: 'Switzerland' },
  { code: '+212', flag: '🇲🇦', name: 'Morocco' },
  { code: '+213', flag: '🇩🇿', name: 'Algeria' },
  { code: '+218', flag: '🇱🇾', name: 'Libya' },
  { code: '+20', flag: '🇪🇬', name: 'Egypt' },
  { code: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
  { code: '+971', flag: '🇦🇪', name: 'UAE' },
  { code: '+974', flag: '🇶🇦', name: 'Qatar' },
  { code: '+965', flag: '🇰🇼', name: 'Kuwait' },
  { code: '+973', flag: '🇧🇭', name: 'Bahrain' },
  { code: '+968', flag: '🇴🇲', name: 'Oman' },
  { code: '+962', flag: '🇯🇴', name: 'Jordan' },
  { code: '+961', flag: '🇱🇧', name: 'Lebanon' },
  { code: '+49', flag: '🇩🇪', name: 'Germany' },
  { code: '+44', flag: '🇬🇧', name: 'United Kingdom' },
  { code: '+39', flag: '🇮🇹', name: 'Italy' },
  { code: '+34', flag: '🇪🇸', name: 'Spain' },
  { code: '+31', flag: '🇳🇱', name: 'Netherlands' },
  { code: '+1', flag: '🇺🇸', name: 'United States' },
  { code: '+1', flag: '🇨🇦', name: 'Canada' },
  { code: '+61', flag: '🇦🇺', name: 'Australia' },
  { code: '+81', flag: '🇯🇵', name: 'Japan' },
  { code: '+86', flag: '🇨🇳', name: 'China' },
  { code: '+7', flag: '🇷🇺', name: 'Russia' },
  { code: '+55', flag: '🇧🇷', name: 'Brazil' },
];

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label
        className="block text-xs font-bold uppercase tracking-wider mb-2"
        style={{ color: '#5a6e56', fontFamily: "'Outfit', sans-serif", letterSpacing: '0.1em' }}
      >
        {label} {required && <span style={{ color: '#d4af37' }}>*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200";
const inputSt = { border: '1.5px solid #e8e8e4', background: '#fafaf8', color: '#1a2617', fontFamily: "'Outfit', sans-serif" };

export default function Contact() {
  const { t } = useTranslation();
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [charCount, setCharCount] = useState(0);
  const [countryCode, setCountryCode] = useState('+216');
  const [countryFlag, setCountryFlag] = useState('🇹🇳');
  const [countryName, setCountryName] = useState('Tunisia');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dropOpen, setDropOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const { ref, visible } = useReveal();

  const INFO_ITEMS = [
    { icon: 'ri-map-pin-2-line', label: t('contact_info_location'), value: t('contact_address_value') },
    { icon: 'ri-phone-line', label: t('contact_info_phone'), value: '+216 22 044 105' },
    { icon: 'ri-mail-line', label: t('contact_info_email'), value: 'contact@domainfendri.tn' },
    { icon: 'ri-time-line', label: t('contact_info_availability'), value: t('contact_info_availability_val') },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    };
    if (dropOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropOpen]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const message = formData.get('message') as string;
    if (message && message.length > 500) return;

    formData.set('telephone', phoneNumber ? `${countryCode} ${phoneNumber}` : '');
    formData.set('pays', countryName);

    const data = new URLSearchParams();
    formData.forEach((value, key) => data.append(key, value.toString()));

    setStatus('sending');
    try {
      const res = await fetch('https://readdy.ai/api/form/d72koh1sakbatd8b3mb0', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: data.toString(),
      });
      if (res.ok) {
        setStatus('success');
        form.reset();
        setPhoneNumber('');
        setCountryCode('+216');
        setCountryFlag('🇹🇳');
        setCountryName('Tunisia');
        setCharCount(0);
        setDropOpen(false);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <section
      id="contact"
      className="relative py-28 px-4 md:px-10 overflow-hidden"
      style={{ background: '#0d1a0b' }}
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("${CONTACT_IMAGES.background}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(13,26,11,0.95) 0%, rgba(13,26,11,0.80) 50%, rgba(13,26,11,0.92) 100%)' }} />
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.04) 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }} />

      <div
        ref={ref}
        className="relative z-10 max-w-6xl mx-auto"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'opacity 0.9s ease, transform 0.9s ease',
        }}
      >
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Cormorant Garant', serif", letterSpacing: '-0.01em' }}>
            {t('contact_title')}
          </h2>
          <p className="text-2xl" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: "'Outfit', sans-serif", lineHeight: '1.8' }}>
            {t('contact_subtitle1')} <br />{t('contact_subtitle2')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
          {/* Left panel */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="relative rounded-2xl overflow-hidden" style={{ height: '200px' }}>
              <img
                src={CONTACT_IMAGES.domaine}
                alt="Domaine Fendri"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(13,26,11,0.9) 0%, rgba(13,26,11,0.2) 60%)' }} />
              <div className="absolute bottom-0 left-0 p-5">
                <p className="text-white font-bold text-lg" style={{ fontFamily: "'Cormorant Garant', serif" }}>Domaine Fendri</p>
                <p className="text-xs" style={{ color: 'rgba(212,175,55,0.8)', fontFamily: "'Outfit', sans-serif" }}>Meknessi · Tunisia · Est. 1911</p>
              </div>
              <div className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full" style={{ background: 'rgba(212,175,55,0.2)', color: '#d4af37' }}>
                <i className="ri-leaf-line text-sm" />
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(212,175,55,0.12)', background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)' }}>
              {INFO_ITEMS.map((item, idx) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 px-6 py-4"
                  style={{ borderBottom: idx < INFO_ITEMS.length - 1 ? '1px solid rgba(212,175,55,0.07)' : 'none' }}
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0" style={{ background: 'rgba(212,175,55,0.1)', color: '#d4af37', fontSize: '1rem' }}>
                    <i className={item.icon} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider font-bold mb-0.5" style={{ color: 'rgba(212,175,55,0.6)', fontFamily: "'Outfit', sans-serif" }}>{item.label}</p>
                    <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.85)', fontFamily: "'Outfit', sans-serif" }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl relative overflow-hidden flex-1" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(26,38,23,0.6) 100%)', border: '1px solid rgba(212,175,55,0.25)' }}>
              <div style={{ height: '2px', background: 'linear-gradient(to right, transparent, #d4af37, transparent)' }} />
              <div className="p-7 relative">
                <i className="ri-double-quotes-l absolute -top-1 right-5" style={{ color: 'rgba(212,175,55,0.08)', fontSize: '6rem', lineHeight: 1 }} />
                <p className="relative z-10 leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.82)', fontFamily: "'Cormorant Garant', serif", fontSize: '1.1rem', fontStyle: 'italic', lineHeight: '1.95', letterSpacing: '0.01em' }}>
                  &ldquo;{t('contact_quote')}&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-3 rounded-2xl overflow-hidden flex flex-col h-full" style={{ background: '#ffffff' }}>
            <div style={{ height: '3px', background: 'linear-gradient(to right, #1a2617, #d4af37, #1a2617)' }} />

            <div className="px-8 py-6 flex flex-col flex-1">
              <div className="mb-5">
                <h3 className="text-xl font-bold mb-1" style={{ color: '#1a2617', fontFamily: "'Cormorant Garant', serif" }}>
                  {t('contact_form_title')}
                </h3>
                <p className="text-sm" style={{ color: '#9ca3af', fontFamily: "'Outfit', sans-serif" }}>
                  {t('contact_form_required')} <span style={{ color: '#d4af37' }}>*</span>
                </p>
              </div>

              {status === 'success' && (
                <div className="mb-6 p-4 rounded-xl text-sm font-semibold flex items-center gap-3" style={{ background: 'rgba(26,38,23,0.06)', color: '#1a2617', border: '1.5px solid rgba(212,175,55,0.3)' }}>
                  <div className="w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0" style={{ background: 'rgba(212,175,55,0.15)', color: '#d4af37' }}>
                    <i className="ri-checkbox-circle-line text-lg" />
                  </div>
                  {t('contact_form_success')}
                </div>
              )}
              {status === 'error' && (
                <div className="mb-6 p-4 rounded-xl text-sm font-semibold flex items-center gap-3 bg-red-50 text-red-700" style={{ border: '1.5px solid rgba(239,68,68,0.2)' }}>
                  <i className="ri-error-warning-line text-lg" />
                  {t('contact_form_error')}
                </div>
              )}

              <form ref={formRef} id="contact-form" data-readdy-form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField label={t('contact_form_nom')} required>
                    <input
                      name="nom"
                      placeholder={t('contact_form_placeholder_nom')}
                      required
                      className={inputCls}
                      style={inputSt}
                      onFocus={(e) => { e.target.style.borderColor = '#d4af37'; e.target.style.background = '#ffffff'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#e8e8e4'; e.target.style.background = '#fafaf8'; }}
                    />
                  </FormField>
                  <FormField label={t('contact_form_prenom')} required>
                    <input
                      name="prenom"
                      placeholder={t('contact_form_placeholder_prenom')}
                      required
                      className={inputCls}
                      style={inputSt}
                      onFocus={(e) => { e.target.style.borderColor = '#d4af37'; e.target.style.background = '#ffffff'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#e8e8e4'; e.target.style.background = '#fafaf8'; }}
                    />
                  </FormField>
                </div>

                {/* Phone with country selector */}
                <FormField label={t('contact_form_phone')} required>
                  <div className="flex gap-2" style={{ position: 'relative' }}>
                    {/* Country dropdown */}
                    <div ref={dropRef} style={{ position: 'relative', flexShrink: 0 }}>
                      <button
                        type="button"
                        onClick={() => setDropOpen(v => !v)}
                        className="cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                        style={{
                          height: '40px',
                          padding: '0 10px',
                          border: '1.5px solid #e8e8e4',
                          borderRadius: '12px',
                          background: '#fafaf8',
                          color: '#1a2617',
                          fontFamily: "'Outfit', sans-serif",
                          fontSize: '0.8rem',
                          outline: 'none',
                          transition: 'border-color 0.2s',
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#d4af37'; }}
                        onMouseLeave={e => { if (!dropOpen) (e.currentTarget as HTMLButtonElement).style.borderColor = '#e8e8e4'; }}
                      >
                        <span style={{ fontSize: '1rem' }}>{countryFlag}</span>
                        <span style={{ color: '#d4af37', fontWeight: 700, fontSize: '0.72rem' }}>{countryCode}</span>
                        <i className={dropOpen ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} style={{ fontSize: '13px', color: '#9ca3af' }} />
                      </button>

                      {dropOpen && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 'calc(100% + 4px)',
                            left: 0,
                            zIndex: 100,
                            width: '240px',
                            maxHeight: '210px',
                            overflowY: 'auto',
                            background: '#ffffff',
                            border: '1.5px solid #e8e8e4',
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
                                background: countryName === c.name ? 'rgba(212,175,55,0.08)' : 'transparent',
                                border: 'none',
                                borderBottom: idx < COUNTRY_CODES.length - 1 ? '1px solid #f3f3f0' : 'none',
                                color: '#1a2617',
                                fontFamily: "'Outfit', sans-serif",
                                fontSize: '0.75rem',
                                textAlign: 'left',
                                transition: 'background 0.15s',
                              }}
                              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(212,175,55,0.06)'; }}
                              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = countryName === c.name ? 'rgba(212,175,55,0.08)' : 'transparent'; }}
                            >
                              <span style={{ fontSize: '1rem', flexShrink: 0 }}>{c.flag}</span>
                              <span style={{ flex: 1 }}>{c.name}</span>
                              <span style={{ color: '#d4af37', fontWeight: 700, fontSize: '0.7rem' }}>{c.code}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Number input */}
                    <input
                      type="tel"
                      name="telephone"
                      required
                      value={phoneNumber}
                      onChange={e => setPhoneNumber(e.target.value)}
                      placeholder={t('contact_form_placeholder_phone')}
                      className={`${inputCls} flex-1`}
                      style={{ ...inputSt, minWidth: 0 }}
                      onFocus={(e) => { e.target.style.borderColor = '#d4af37'; e.target.style.background = '#ffffff'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#e8e8e4'; e.target.style.background = '#fafaf8'; }}
                    />
                  </div>
                  <p className="text-xs mt-1" style={{ color: '#c4c4b8', fontFamily: "'Outfit', sans-serif" }}>
                    {countryFlag} {countryName}
                  </p>
                </FormField>

                <FormField label={t('contact_form_email')} required>
                  <input
                    name="email"
                    type="email"
                    placeholder={t('contact_form_placeholder_email')}
                    required
                    className={inputCls}
                    style={inputSt}
                    onFocus={(e) => { e.target.style.borderColor = '#d4af37'; e.target.style.background = '#ffffff'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#e8e8e4'; e.target.style.background = '#fafaf8'; }}
                  />
                </FormField>

                <FormField label={t('contact_form_sujet')} required>
                  <input
                    name="sujet"
                    placeholder={t('contact_form_placeholder_sujet')}
                    required
                    className={inputCls}
                    style={inputSt}
                    onFocus={(e) => { e.target.style.borderColor = '#d4af37'; e.target.style.background = '#ffffff'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#e8e8e4'; e.target.style.background = '#fafaf8'; }}
                  />
                </FormField>

                <FormField label={t('contact_form_message')} required>
                  <textarea
                    name="message"
                    rows={3}
                    maxLength={500}
                    placeholder={t('contact_form_placeholder_message')}
                    required
                    onChange={(e) => setCharCount(e.target.value.length)}
                    className={`${inputCls} w-full`}
                    style={{ ...inputSt, resize: 'none' }}
                    onFocus={(e) => { e.target.style.borderColor = '#d4af37'; e.target.style.background = '#ffffff'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#e8e8e4'; e.target.style.background = '#fafaf8'; }}
                  />
                  <div className="flex justify-end mt-1">
                    <span className="text-xs font-medium" style={{ color: charCount > 450 ? '#e57373' : '#c4c4b8', fontFamily: "'Outfit', sans-serif" }}>
                      {charCount}/500
                    </span>
                  </div>
                </FormField>

                <div className="h-px w-full" style={{ background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.25), transparent)' }} />

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full py-3 rounded-full font-bold uppercase tracking-widest text-sm transition-all duration-300 hover:-translate-y-0.5 cursor-pointer whitespace-nowrap disabled:opacity-60 flex items-center justify-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, #1a2617 0%, #2f4229 100%)',
                    color: '#d4af37',
                    border: '1px solid rgba(212,175,55,0.2)',
                    fontFamily: "'Outfit', sans-serif",
                    letterSpacing: '0.12em',
                  }}
                >
                  <i className={status === 'sending' ? 'ri-loader-4-line animate-spin' : 'ri-send-plane-fill'} />
                  {status === 'sending' ? t('contact_form_sending') : t('contact_form_submit')}
                </button>

                <p className="text-center text-xs" style={{ color: '#c4c4b8', fontFamily: "'Outfit', sans-serif" }}>
                  <i className="ri-lock-line mr-1" />
                  {t('contact_form_privacy')}
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
