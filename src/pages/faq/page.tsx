import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '@/components/feature/Header';
import Footer from '@/components/feature/Footer';

const GOLD = '#c9a84c';
const GREEN = '#1a2617';
const CREAM = '#f7f5f0';
const MUTED = '#7a8c77';
const TEXT = '#2a3527';

interface FaqItem { q: string; a: string; }
interface FaqCategory { id: string; label: string; items: FaqItem[]; }

export default function FaqPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('produit');
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const isAr = i18n.language === 'ar';

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const FAQ_DATA: FaqCategory[] = [
    {
      id: 'produit',
      label: t('faq_cat_produit'),
      items: [
        { q: t('faq_produit_q1'), a: t('faq_produit_a1') },
        { q: t('faq_produit_q2'), a: t('faq_produit_a2') },
        { q: t('faq_produit_q3'), a: t('faq_produit_a3') },
        { q: t('faq_produit_q4'), a: t('faq_produit_a4') },
      ],
    },
    {
      id: 'livraison',
      label: t('faq_cat_livraison'),
      items: [
        { q: t('faq_livraison_q1'), a: t('faq_livraison_a1') },
        { q: t('faq_livraison_q2'), a: t('faq_livraison_a2') },
        { q: t('faq_livraison_q3'), a: t('faq_livraison_a3') },
      ],
    },
    {
      id: 'configurateur',
      label: t('faq_cat_configurateur'),
      items: [
        { q: t('faq_configurateur_q1'), a: t('faq_configurateur_a1') },
        { q: t('faq_configurateur_q2'), a: t('faq_configurateur_a2') },
        { q: t('faq_configurateur_q3'), a: t('faq_configurateur_a3') },
      ],
    },
    {
      id: 'paiement',
      label: t('faq_cat_paiement'),
      items: [
        { q: t('faq_paiement_q1'), a: t('faq_paiement_a1') },
        { q: t('faq_paiement_q2'), a: t('faq_paiement_a2') },
        { q: t('faq_paiement_q3'), a: t('faq_paiement_a3') },
      ],
    },
    {
      id: 'retours',
      label: t('faq_cat_retours'),
      items: [
        { q: t('faq_retours_q1'), a: t('faq_retours_a1') },
        { q: t('faq_retours_q2'), a: t('faq_retours_a2') },
        { q: t('faq_retours_q3'), a: t('faq_retours_a3') },
      ],
    },
    {
      id: 'maison',
      label: t('faq_cat_maison'),
      items: [
        { q: t('faq_maison_q1'), a: t('faq_maison_a1') },
        { q: t('faq_maison_q2'), a: t('faq_maison_a2') },
        { q: t('faq_maison_q3'), a: t('faq_maison_a3') },
      ],
    },
  ];

  const category = FAQ_DATA.find((c) => c.id === activeCategory)!;
  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div style={{ background: CREAM, minHeight: '100vh', fontFamily: "'Outfit', sans-serif", display: 'flex', flexDirection: 'column' }} dir={isAr ? 'rtl' : 'ltr'}>
      <Header />

      {/* ── Page header ── */}
      <div style={{
        background: CREAM,
        borderBottom: `1px solid rgba(26,38,23,0.08)`,
        paddingTop: '100px',
        paddingBottom: '40px',
      }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: isMobile ? '0 20px' : '0 40px' }}>
          <Link
            to="/"
            style={{
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              color: MUTED,
              textDecoration: 'none',
              textTransform: 'uppercase',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '28px',
            }}
          >
            {t('faq_back')}
          </Link>

          <div>
            <p style={{
              fontSize: '0.6rem',
              letterSpacing: '0.3em',
              color: GOLD,
              textTransform: 'uppercase',
              marginBottom: '10px',
              fontWeight: 500,
            }}>
              {t('faq_label')}
            </p>
            <h1 style={{
              fontFamily: "'Cormorant Garant', serif",
              fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
              color: GREEN,
              fontWeight: 500,
              margin: '0 0 12px',
              lineHeight: 1.15,
              letterSpacing: '-0.01em',
            }}>
              {t('faq_title')}
            </h1>
            <p style={{
              fontSize: '1rem',
              color: MUTED,
              lineHeight: 1.7,
              margin: 0,
            }}>
              {t('faq_subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* ── Category tabs ── */}
      <div style={{
        background: CREAM,
        borderBottom: `1px solid rgba(26,38,23,0.08)`,
        position: 'sticky',
        top: 64,
        zIndex: 30,
      }}>
        <div style={{
          maxWidth: '960px',
          margin: '0 auto',
          padding: isMobile ? '0 16px' : '0 40px',
          display: 'flex',
          gap: 0,
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}>
          {FAQ_DATA.map((cat) => {
            const active = cat.id === activeCategory;
            return (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setOpenIndex(null); }}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: active ? `2px solid ${GOLD}` : '2px solid transparent',
                  padding: '14px 18px 12px',
                  cursor: 'pointer',
                  color: active ? GREEN : MUTED,
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '0.7rem',
                  fontWeight: active ? 600 : 400,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLButtonElement).style.color = TEXT; }}
                onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLButtonElement).style.color = MUTED; }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── FAQ content ── */}
      <div style={{ flex: 1, maxWidth: '960px', width: '100%', margin: '0 auto', padding: isMobile ? '32px 20px 80px' : '56px 40px 100px', display: isMobile ? 'block' : 'grid', gridTemplateColumns: isMobile ? '1fr' : '200px 1fr', gap: '64px' }}>

        {/* Sidebar — hidden on mobile since category is shown in sticky tabs */}
        {!isMobile && (
          <div style={{ paddingTop: '8px' }}>
            <p style={{
              fontSize: '0.6rem',
              letterSpacing: '0.2em',
              color: GOLD,
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}>
              {t('faq_sidebar_label')}
            </p>
            <p style={{
              fontFamily: "'Cormorant Garant', serif",
              fontSize: '1.4rem',
              color: GREEN,
              fontWeight: 500,
              marginBottom: '16px',
              lineHeight: 1.2,
            }}>
              {category.label}
            </p>
            <div style={{ width: '24px', height: '1.5px', background: GOLD }} />
          </div>
        )}

        {/* Accordion */}
        <div>
          {category.items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                style={{
                  borderTop: `1px solid rgba(26,38,23,0.1)`,
                  ...(i === category.items.length - 1 ? { borderBottom: '1px solid rgba(26,38,23,0.1)' } : {}),
                }}
              >
                <button
                  onClick={() => toggle(i)}
                  style={{
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '24px 0',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '20px',
                    textAlign: isAr ? 'right' : 'left',
                  }}
                >
                  <span style={{
                    fontFamily: "'Cormorant Garant', serif",
                    fontSize: 'clamp(1rem, 2vw, 1.15rem)',
                    color: isOpen ? GREEN : TEXT,
                    fontWeight: isOpen ? 600 : 400,
                    lineHeight: 1.45,
                    transition: 'color 0.2s',
                    flex: 1,
                  }}>
                    {item.q}
                  </span>
                  <span style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    border: `1px solid ${isOpen ? GOLD : 'rgba(26,38,23,0.18)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '3px',
                    transition: 'all 0.25s ease',
                    background: isOpen ? GOLD : 'transparent',
                    color: isOpen ? GREEN : MUTED,
                    fontSize: '14px',
                    fontWeight: 300,
                    lineHeight: 1,
                  }}>
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                <div style={{
                  maxHeight: isOpen ? '400px' : '0',
                  overflow: 'hidden',
                  transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                }}>
                  <p style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '0.875rem',
                    color: MUTED,
                    lineHeight: 1.85,
                    margin: '0 0 28px',
                    letterSpacing: '0.01em',
                    borderLeft: isAr ? 'none' : `2px solid ${GOLD}`,
                    borderRight: isAr ? `2px solid ${GOLD}` : 'none',
                    paddingLeft: isAr ? 0 : '16px',
                    paddingRight: isAr ? '16px' : 0,
                  }}>
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Contact nudge */}
          <div style={{
            marginTop: '48px',
            padding: '28px 32px',
            border: `1px solid rgba(201,168,76,0.3)`,
            borderRadius: '2px',
            background: 'rgba(201,168,76,0.04)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
            flexWrap: 'wrap',
          }}>
            <div>
              <p style={{
                fontFamily: "'Cormorant Garant', serif",
                fontSize: '1.1rem',
                color: GREEN,
                fontWeight: 500,
                marginBottom: '4px',
              }}>
                {t('faq_no_answer')}
              </p>
              <p style={{ fontSize: '0.8rem', color: MUTED, margin: 0 }}>
                {t('faq_team_response')}
              </p>
            </div>
            <button
              onClick={() => {
                navigate('/');
                setTimeout(() => {
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }, 150);
              }}
              className="cursor-pointer"
              style={{
                display: 'inline-block',
                padding: '10px 28px',
                background: GREEN,
                color: CREAM,
                fontFamily: "'Outfit', sans-serif",
                fontSize: '0.65rem',
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                border: 'none',
                transition: 'background 0.2s',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#0f1409'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = GREEN; }}
            >
              {t('faq_write_us')}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
