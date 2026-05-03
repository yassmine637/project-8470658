import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { useTranslation } from 'react-i18next';

const LANGS = [
  { code: 'fr', label: 'FR', dir: 'ltr' },
  { code: 'en', label: 'EN', dir: 'ltr' },
  { code: 'ar', label: 'ع',  dir: 'rtl' },
] as const;

type LangCode = (typeof LANGS)[number]['code'];

type NavLink =
  | { type: 'anchor'; sectionId: string; label: string }
  | { type: 'route';  href: string;      label: string };

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const { totalCount, openCart } = useCart();
  const { t, i18n } = useTranslation();

  const currentLang: LangCode =
    (LANGS.find((l) => l.code === i18n.language)?.code) ?? 'fr';

  const switchLang = (code: LangCode) => {
    i18n.changeLanguage(code);
    const lang = LANGS.find((l) => l.code === code)!;
    document.documentElement.dir = lang.dir;
    document.documentElement.lang = code;
    if (code === 'ar') {
      document.body.style.fontFamily = "'Cairo', sans-serif";
    } else {
      document.body.style.fontFamily = '';
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const lang = LANGS.find((l) => l.code === currentLang);
    if (!lang) return;
    document.documentElement.dir = lang.dir;
    document.documentElement.lang = currentLang;
    if (currentLang === 'ar') {
      document.body.style.fontFamily = "'Cairo', sans-serif";
    } else {
      document.body.style.fontFamily = '';
    }
  }, [currentLang]);

  // Smooth anchor navigation — works from any page
  const handleAnchorNav = (sectionId: string) => {
    if (menuOpen) setMenuOpen(false);
    if (isHome) {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/', { state: { scrollTo: sectionId } });
    }
  };

  const navLinks: NavLink[] = [
    { type: 'anchor', sectionId: 'about',   label: t('nav_histoire') },
    { type: 'anchor', sectionId: 'product', label: t('nav_huiles') },
    { type: 'route',  href: '/products',    label: t('nav_collection') },
    { type: 'anchor', sectionId: 'factory', label: t('nav_usine') },
    { type: 'anchor', sectionId: 'values',  label: t('nav_engagements') },
    { type: 'anchor', sectionId: 'awards',  label: t('nav_recompenses') },
    { type: 'anchor', sectionId: 'contact', label: t('nav_contact') },
  ];

  const LangSwitcher = ({ mobile = false }: { mobile?: boolean }) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        background: 'rgba(255,255,255,0.08)',
        borderRadius: 20,
        padding: '3px 4px',
        ...(mobile ? { margin: '8px 40px' } : {}),
      }}
    >
      {LANGS.map(({ code, label }) => {
        const active = currentLang === code;
        return (
          <button
            key={code}
            onClick={() => { switchLang(code); if (mobile) setMenuOpen(false); }}
            style={{
              background: active ? '#c9a84c' : 'transparent',
              color: active ? '#1a2617' : 'rgba(255,255,255,0.6)',
              border: 'none',
              borderRadius: 16,
              padding: code === 'ar' ? '3px 9px 3px 9px' : '3px 8px',
              fontSize: code === 'ar' ? 15 : 11,
              fontWeight: active ? 700 : 500,
              fontFamily: code === 'ar' ? "'Cairo', sans-serif" : "'Outfit', sans-serif",
              letterSpacing: code === 'ar' ? 0 : '0.06em',
              cursor: 'pointer',
              transition: 'all 0.2s',
              lineHeight: 1.5,
              minWidth: 28,
              textAlign: 'center',
            }}
            aria-label={code === 'fr' ? 'Français' : code === 'en' ? 'English' : 'العربية'}
            aria-pressed={active}
          >
            {label}
          </button>
        );
      })}
    </div>
  );

  const linkStyle = {
    fontFamily: currentLang === 'ar' ? "'Cairo', sans-serif" : "'Outfit', sans-serif",
    letterSpacing: currentLang === 'ar' ? '0' : '0.13em',
    color: 'rgba(255,255,255,0.75)',
    textDecoration: 'none',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
  } as const;

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 transition-all duration-500"
      style={{
        background: scrolled ? 'rgba(20,32,18,0.96)' : 'rgba(10,18,8,0.18)',
        backdropFilter: scrolled ? 'blur(20px)' : 'blur(4px)',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : 'none',
      }}
    >
      <div
        className="flex items-center justify-between px-10 md:px-16"
        style={{ height: scrolled ? '60px' : '72px', transition: 'height 0.4s ease' }}
      >
        {/* Logo — React Router link, no reload */}
        <Link
          to="/"
          style={{ textDecoration: 'none' }}
          onClick={() => { if (isHome) window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        >
          <span
            className="text-white font-bold tracking-widest uppercase"
            style={{ fontFamily: "'Cormorant Garant', serif", fontSize: '1.25rem', letterSpacing: '0.2em' }}
          >
            {i18n.language === 'ar' ? 'ضيعة فندري' : 'Domaine Fendri'}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:block">
          <ul className="flex gap-10 list-none m-0 p-0">
            {navLinks.map((link) => {
              const key = link.type === 'route' ? link.href : link.sectionId;
              const isActive = link.type === 'route' && location.pathname === link.href;

              return (
                <li key={key}>
                  {link.type === 'route' ? (
                    <Link
                      to={link.href}
                      className="relative text-sm font-medium uppercase tracking-widest transition-colors duration-300 group whitespace-nowrap"
                      style={{
                        ...linkStyle,
                        color: isActive ? '#c9a84c' : 'rgba(255,255,255,0.75)',
                      }}
                    >
                      {link.label}
                      <span
                        className={`absolute -bottom-1 left-0 h-px transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}
                        style={{ background: '#c9a84c' }}
                      />
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleAnchorNav(link.sectionId)}
                      className="relative text-sm font-medium uppercase tracking-widest transition-colors duration-300 group whitespace-nowrap"
                      style={linkStyle}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#ffffff'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.75)'; }}
                    >
                      {link.label}
                      <span
                        className="absolute -bottom-1 left-0 h-px w-0 group-hover:w-full transition-all duration-300"
                        style={{ background: '#c9a84c' }}
                      />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right side: Lang switcher + Cart + Mobile menu */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex">
            <LangSwitcher />
          </div>

          {/* Cart icon */}
          <button
            onClick={openCart}
            className="relative flex items-center justify-center w-9 h-9 rounded-full cursor-pointer border-none transition-all duration-200"
            style={{ background: 'rgba(255,255,255,0.1)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(201,168,76,0.25)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.1)'; }}
            aria-label="Open cart"
          >
            <i className="ri-shopping-basket-2-line text-base" style={{ color: '#ffffff' }} />
            {totalCount > 0 && (
              <span
                className="absolute -top-1 -right-1 flex items-center justify-center text-xs font-bold rounded-full"
                style={{
                  width: '18px',
                  height: '18px',
                  background: '#c9a84c',
                  color: '#1a2617',
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '0.6rem',
                  lineHeight: 1,
                }}
              >
                {totalCount > 9 ? '9+' : totalCount}
              </span>
            )}
          </button>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white text-xl cursor-pointer bg-transparent border-none p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <i className={menuOpen ? 'ri-close-line' : 'ri-menu-line'} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300"
        style={{
          maxHeight: menuOpen ? '380px' : '0',
          background: 'rgba(20,32,18,0.98)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <ul className="flex flex-col list-none m-0 py-2">
          {navLinks.map((link, i) => {
            const key = link.type === 'route' ? link.href : link.sectionId;
            return (
              <li key={key}>
                {link.type === 'route' ? (
                  <Link
                    to={link.href}
                    className="block px-10 py-3 text-sm font-medium uppercase tracking-widest transition-colors duration-200"
                    style={{
                      fontFamily: currentLang === 'ar' ? "'Cairo', sans-serif" : "'Outfit', sans-serif",
                      letterSpacing: currentLang === 'ar' ? 0 : '0.13em',
                      color: 'rgba(255,255,255,0.7)',
                      borderBottom: i < navLinks.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                      textDecoration: 'none',
                    }}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <button
                    onClick={() => handleAnchorNav(link.sectionId)}
                    className="block w-full text-left px-10 py-3 text-sm font-medium uppercase tracking-widest transition-colors duration-200"
                    style={{
                      fontFamily: currentLang === 'ar' ? "'Cairo', sans-serif" : "'Outfit', sans-serif",
                      letterSpacing: currentLang === 'ar' ? 0 : '0.13em',
                      color: 'rgba(255,255,255,0.7)',
                      borderBottom: i < navLinks.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {link.label}
                  </button>
                )}
              </li>
            );
          })}
          <li style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 8, paddingBottom: 4 }}>
            <LangSwitcher mobile />
          </li>
        </ul>
      </div>
    </header>
  );
}
