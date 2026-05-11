import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '@/components/feature/Header';
import Footer from '@/components/feature/Footer';

const INCOTERMS = [
  { code: 'EXW', name: 'Ex Works', desc: 'b2b_inco_exw_desc', icon: 'ri-home-3-line' },
  { code: 'FOB', name: 'Free On Board', desc: 'b2b_inco_fob_desc', icon: 'ri-ship-line' },
  { code: 'CIF', name: 'Cost, Insurance & Freight', desc: 'b2b_inco_cif_desc', icon: 'ri-shield-line' },
  { code: 'DDP', name: 'Delivered Duty Paid', desc: 'b2b_inco_ddp_desc', icon: 'ri-map-pin-line' },
];

const VOLUME_TIERS = [
  { key: 'tier_carton', qty: '1 carton (6 btl)', discount: 0, icon: 'ri-box-3-line', color: '#9aaa96' },
  { key: 'tier_pallet_1', qty: '1 palette (48 cartons)', discount: 10, icon: 'ri-layout-grid-line', color: '#c9a84c' },
  { key: 'tier_pallet_2', qty: '2–4 palettes', discount: 15, icon: 'ri-stack-line', color: '#b8942a' },
  { key: 'tier_pallet_5', qty: '5+ palettes', discount: 20, icon: 'ri-truck-line', color: '#3a6040' },
  { key: 'tier_container', qty: 'Conteneur complet', discount: 25, icon: 'ri-ship-2-line', color: '#1a2617' },
];

const CERTIFS = [
  { label: 'Bio EU / Tunisie', icon: 'ri-leaf-line' },
  { label: 'IOC Mario Solinas', icon: 'ri-award-line' },
  { label: 'BIOL International', icon: 'ri-medal-line' },
  { label: 'SIQEV Madrid', icon: 'ri-shield-check-line' },
  { label: 'Flos Olei', icon: 'ri-star-line' },
  { label: 'EVOOLEUM TOP 100', icon: 'ri-trophy-line' },
];

interface B2BFormData {
  company: string;
  contact: string;
  email: string;
  phone: string;
  country: string;
  product: string;
  volume: string;
  incoterm: string;
  message: string;
}

const EMPTY_FORM: B2BFormData = {
  company: '', contact: '', email: '', phone: '',
  country: '', product: '', volume: '', incoterm: '', message: '',
};

export default function B2BPage() {
  const { t } = useTranslation();
  const [form, setForm] = useState<B2BFormData>(EMPTY_FORM);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/b2b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('error');
      setStatus('success');
      setForm(EMPTY_FORM);
    } catch {
      setStatus('error');
      setErrorMsg(t('b2b_form_error'));
    }
  };

  const ACCENT = '#c9a84c';
  const DARK = '#1a2617';

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '11px 14px',
    background: '#f8f6f1',
    border: '1px solid rgba(26,38,23,0.12)',
    borderRadius: 8,
    fontFamily: "'Outfit', sans-serif",
    fontSize: 13,
    color: DARK,
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "'Outfit', sans-serif",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#6b7c68',
    marginBottom: 6,
    display: 'block',
  };

  return (
    <>
      <Header />

      <div style={{ background: '#f8f6f1', minHeight: '100vh' }}>

        {/* Hero */}
        <section style={{
          background: `linear-gradient(135deg, ${DARK} 0%, #2c3a23 60%, #1a2617 100%)`,
          paddingTop: 140,
          paddingBottom: 80,
          paddingLeft: 24,
          paddingRight: 24,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: `radial-gradient(ellipse at 70% 50%, ${ACCENT}18 0%, transparent 60%)`,
          }} />
          <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 36 }}>
              <Link to="/" style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>
                {t('products_breadcrumb_home')}
              </Link>
              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem' }}>/</span>
              <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>
                {t('nav_b2b')}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
              <div>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '5px 14px', borderRadius: 40,
                  border: `1px solid ${ACCENT}40`, background: `${ACCENT}12`,
                  fontFamily: "'Outfit', sans-serif", fontSize: 10, fontWeight: 700,
                  letterSpacing: '0.2em', textTransform: 'uppercase', color: ACCENT,
                  marginBottom: 24,
                }}>
                  <i className="ri-building-line" />
                  {t('b2b_badge')}
                </span>

                <h1 style={{
                  fontFamily: "'Cormorant Garant', serif",
                  fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                  color: '#fff',
                  margin: '0 0 20px',
                  fontWeight: 600,
                  lineHeight: 1.15,
                }}>
                  {t('b2b_hero_title')}
                </h1>

                <p style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 15,
                  color: 'rgba(255,255,255,0.6)',
                  lineHeight: 1.8,
                  margin: '0 0 36px',
                }}>
                  {t('b2b_hero_sub')}
                </p>

                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                  {[
                    { icon: 'ri-global-line', label: t('b2b_stat_countries'), value: '30+' },
                    { icon: 'ri-time-line', label: t('b2b_stat_years'), value: '110+' },
                    { icon: 'ri-leaf-line', label: t('b2b_stat_trees'), value: '3000' },
                  ].map(({ icon, label, value }) => (
                    <div key={label}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <i className={icon} style={{ color: ACCENT, fontSize: 14 }} />
                        <span style={{ fontFamily: "'Cormorant Garant', serif", fontSize: 28, color: '#fff', fontWeight: 700, lineHeight: 1 }}>{value}</span>
                      </div>
                      <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifs grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {CERTIFS.map((c) => (
                  <div key={c.label} style={{
                    padding: '18px 20px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 12,
                    display: 'flex', alignItems: 'center', gap: 12,
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: `${ACCENT}18`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <i className={c.icon} style={{ color: ACCENT, fontSize: 16 }} />
                    </div>
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.3 }}>{c.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Volume Pricing */}
        <section style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: ACCENT, marginBottom: 12 }}>
              {t('b2b_pricing_label')}
            </p>
            <h2 style={{ fontFamily: "'Cormorant Garant', serif", fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', color: DARK, margin: '0 0 16px', fontWeight: 600 }}>
              {t('b2b_pricing_title')}
            </h2>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: '#6b7c68', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
              {t('b2b_pricing_sub')}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
            {VOLUME_TIERS.map((tier) => (
              <div key={tier.key} style={{
                background: '#fff',
                border: tier.discount >= 20 ? `2px solid ${ACCENT}` : '1px solid rgba(26,38,23,0.08)',
                borderRadius: 16,
                padding: '28px 20px',
                textAlign: 'center',
                position: 'relative',
                transition: 'box-shadow 0.2s',
              }}>
                {tier.discount >= 20 && (
                  <span style={{
                    position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                    background: ACCENT, color: DARK,
                    fontFamily: "'Outfit', sans-serif", fontSize: 9, fontWeight: 700,
                    letterSpacing: '0.15em', textTransform: 'uppercase',
                    padding: '4px 10px', borderRadius: 40, whiteSpace: 'nowrap',
                  }}>
                    {t('b2b_best_deal')}
                  </span>
                )}

                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: tier.color + '15',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px',
                }}>
                  <i className={tier.icon} style={{ color: tier.color, fontSize: 22 }} />
                </div>

                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: '#9aaa96', letterSpacing: '0.08em', margin: '0 0 8px', lineHeight: 1.4 }}>
                  {t(tier.key)}
                </p>

                <div style={{ fontFamily: "'Cormorant Garant', serif", fontSize: tier.discount === 0 ? 20 : 32, color: tier.discount === 0 ? '#9aaa96' : DARK, fontWeight: 700, lineHeight: 1, marginBottom: 6 }}>
                  {tier.discount === 0 ? t('b2b_tier_base') : `-${tier.discount}%`}
                </div>

                {tier.discount > 0 && (
                  <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, color: '#9aaa96', margin: 0 }}>
                    {t('b2b_tier_discount')}
                  </p>
                )}
              </div>
            ))}
          </div>

          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: '#9aaa96', textAlign: 'center', marginTop: 20, lineHeight: 1.6 }}>
            <i className="ri-information-line" style={{ marginRight: 4 }} />
            {t('b2b_pricing_note')}
          </p>
        </section>

        {/* INCOTERMS */}
        <section style={{ background: '#fff', padding: '80px 24px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: ACCENT, marginBottom: 12 }}>
                {t('b2b_inco_label')}
              </p>
              <h2 style={{ fontFamily: "'Cormorant Garant', serif", fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', color: DARK, margin: '0 0 16px', fontWeight: 600 }}>
                {t('b2b_inco_title')}
              </h2>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: '#6b7c68', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
                {t('b2b_inco_sub')}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
              {INCOTERMS.map((inc) => (
                <div key={inc.code} style={{
                  padding: '28px 28px',
                  border: '1px solid rgba(26,38,23,0.08)',
                  borderRadius: 16,
                  display: 'flex', gap: 20, alignItems: 'flex-start',
                }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: `${ACCENT}15`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <i className={inc.icon} style={{ color: ACCENT, fontSize: 22 }} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <span style={{
                        fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 800,
                        letterSpacing: '0.15em', color: ACCENT,
                        background: `${ACCENT}12`, padding: '3px 8px', borderRadius: 4,
                      }}>{inc.code}</span>
                      <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 600, color: DARK }}>{inc.name}</span>
                    </div>
                    <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: '#6b7c68', margin: 0, lineHeight: 1.65 }}>
                      {t(inc.desc)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery timelines */}
            <div style={{ marginTop: 48, padding: '32px 36px', background: '#f8f6f1', borderRadius: 16 }}>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: ACCENT, marginBottom: 20 }}>
                {t('b2b_delivery_label')}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                {[
                  { zone: t('shipping_zone_tn'), delay: '2–3 jours', icon: 'ri-road-map-line' },
                  { zone: t('shipping_zone_arab'), delay: '5–8 jours', icon: 'ri-plane-line' },
                  { zone: t('shipping_zone_eu'), delay: '7–12 jours', icon: 'ri-ship-line' },
                  { zone: t('shipping_zone_intl'), delay: '10–18 jours', icon: 'ri-earth-line' },
                ].map(({ zone, delay, icon }) => (
                  <div key={zone} style={{ textAlign: 'center' }}>
                    <i className={icon} style={{ color: ACCENT, fontSize: 24, marginBottom: 8, display: 'block' }} />
                    <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 600, color: DARK, margin: '0 0 4px' }}>{zone}</p>
                    <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: '#9aaa96', margin: 0 }}>{delay}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* B2B Contact Form */}
        <section style={{ padding: '80px 24px' }}>
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: ACCENT, marginBottom: 12 }}>
                {t('b2b_form_label')}
              </p>
              <h2 style={{ fontFamily: "'Cormorant Garant', serif", fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', color: DARK, margin: '0 0 16px', fontWeight: 600 }}>
                {t('b2b_form_title')}
              </h2>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: '#6b7c68', maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>
                {t('b2b_form_sub')}
              </p>
            </div>

            {status === 'success' ? (
              <div style={{
                padding: '48px 40px', background: '#fff', borderRadius: 20,
                border: '1px solid rgba(45,122,58,0.2)',
                textAlign: 'center',
              }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: 'rgba(45,122,58,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px',
                }}>
                  <i className="ri-check-double-line" style={{ color: '#2d7a3a', fontSize: 28 }} />
                </div>
                <h3 style={{ fontFamily: "'Cormorant Garant', serif", fontSize: 26, color: DARK, margin: '0 0 12px', fontWeight: 600 }}>
                  {t('b2b_form_success_title')}
                </h3>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: '#6b7c68', lineHeight: 1.7, margin: '0 0 28px' }}>
                  {t('b2b_form_success_sub')}
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  style={{
                    padding: '10px 28px', background: DARK, color: ACCENT,
                    border: 'none', borderRadius: 40, cursor: 'pointer',
                    fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 700,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                  }}
                >
                  {t('b2b_form_new')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{
                background: '#fff', borderRadius: 20,
                border: '1px solid rgba(26,38,23,0.08)',
                padding: '48px 48px',
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                  <div>
                    <label style={labelStyle}>{t('b2b_field_company')} *</label>
                    <input name="company" value={form.company} onChange={handleChange} required style={inputStyle} placeholder={t('b2b_field_company_ph')} />
                  </div>
                  <div>
                    <label style={labelStyle}>{t('b2b_field_contact')} *</label>
                    <input name="contact" value={form.contact} onChange={handleChange} required style={inputStyle} placeholder={t('b2b_field_contact_ph')} />
                  </div>
                  <div>
                    <label style={labelStyle}>{t('b2b_field_email')} *</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} required style={inputStyle} placeholder="contact@company.com" />
                  </div>
                  <div>
                    <label style={labelStyle}>{t('b2b_field_phone')}</label>
                    <input name="phone" value={form.phone} onChange={handleChange} style={inputStyle} placeholder="+33 6 00 00 00 00" />
                  </div>
                  <div>
                    <label style={labelStyle}>{t('b2b_field_country')} *</label>
                    <input name="country" value={form.country} onChange={handleChange} required style={inputStyle} placeholder={t('b2b_field_country_ph')} />
                  </div>
                  <div>
                    <label style={labelStyle}>{t('b2b_field_product')}</label>
                    <select name="product" value={form.product} onChange={handleChange} style={{ ...inputStyle, cursor: 'pointer' }}>
                      <option value="">{t('b2b_field_product_ph')}</option>
                      <option value="bouteille-1l">Bidon vert 1L — Bio</option>
                      <option value="bouteille-500ml">Bouteille cylindrique 500ml</option>
                      <option value="bouteille-250ml">Bouteille carrée élancée 750ml</option>
                      <option value="bouteille-speciale">Bidon métallique 3L</option>
                      <option value="all">{t('b2b_field_product_all')}</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>{t('b2b_field_volume')}</label>
                    <select name="volume" value={form.volume} onChange={handleChange} style={{ ...inputStyle, cursor: 'pointer' }}>
                      <option value="">{t('b2b_field_volume_ph')}</option>
                      <option value="1-palette">{t('tier_pallet_1')}</option>
                      <option value="2-4-palettes">{t('tier_pallet_2')}</option>
                      <option value="5+-palettes">{t('tier_pallet_5')}</option>
                      <option value="container">{t('tier_container')}</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>{t('b2b_field_incoterm')}</label>
                    <select name="incoterm" value={form.incoterm} onChange={handleChange} style={{ ...inputStyle, cursor: 'pointer' }}>
                      <option value="">{t('b2b_field_incoterm_ph')}</option>
                      {INCOTERMS.map((i) => (
                        <option key={i.code} value={i.code}>{i.code} — {i.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: 28 }}>
                  <label style={labelStyle}>{t('b2b_field_message')}</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    style={{ ...inputStyle, resize: 'vertical', minHeight: 110 }}
                    placeholder={t('b2b_field_message_ph')}
                  />
                </div>

                {status === 'error' && (
                  <div style={{
                    marginBottom: 20, padding: '12px 16px',
                    background: 'rgba(220,53,69,0.06)',
                    border: '1px solid rgba(220,53,69,0.2)',
                    borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <i className="ri-error-warning-line" style={{ color: '#dc3545', fontSize: 15 }} />
                    <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: '#dc3545', margin: 0 }}>{errorMsg}</p>
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                  <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: '#9aaa96', margin: 0, lineHeight: 1.5 }}>
                    <i className="ri-lock-line" style={{ marginRight: 4 }} />
                    {t('b2b_form_privacy')}
                  </p>
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    style={{
                      padding: '13px 36px',
                      background: status === 'loading' ? 'rgba(26,38,23,0.4)' : DARK,
                      color: ACCENT,
                      border: 'none', borderRadius: 40,
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                      cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', gap: 8,
                      transition: 'all 0.2s',
                    }}
                  >
                    {status === 'loading'
                      ? <><i className="ri-loader-4-line" style={{ animation: 'spin 1s linear infinite' }} />{t('b2b_form_sending')}</>
                      : <><i className="ri-send-plane-line" />{t('b2b_form_submit')}</>
                    }
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
