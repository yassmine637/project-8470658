import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { useTranslation } from 'react-i18next';

const LANGS = [
  { code: 'fr', label: 'FR', dir: 'ltr' },
  { code: 'en', label: 'EN', dir: 'ltr' },
  { code: 'ar', label: 'ع',  dir: 'rtl' },
] as const;

type LangCode = (typeof LANGS)[number]['code'];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
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

  const navLinks = [
    { href: isHome ? '#about' : '/#about', label: t('nav_histoire') },
    { href: isHome ? '#product' : '/#product', label: t('nav_huiles') },
    { href: '/products', label: t('nav_collection'), isRoute: true },
    { href: isHome ? '#factory' : '/#factory', label: t('nav_usine') },
    { href: isHome ? '#values' : '/#values', label: t('nav_engagements') },
    { href: isHome ? '#awards' : '/#awards', label: t('nav_recompenses') },
    { href: isHome ? '#contact' : '/#contact', label: t('nav_contact') },
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
        <a href={isHome ? '#home' : '/'} style={{ textDecoration: 'none' }}>
          <span
            className="text-white font-bold tracking-widest uppercase"
            style={{ fontFamily: "'Cormorant Garant', serif", fontSize: '1.25rem', letterSpacing: '0.2em' }}
          >
            Domaine Fendri
          </span>
        </a>

        <nav className="hidden md:block">
          <ul className="flex gap-10 list-none m-0 p-0">
            {navLinks.map((link) => {
              const isActive = link.isRoute && location.pathname === link.href;
              return (
                <li key={link.href}>
                  {link.isRoute ? (
                    <Link
                      to={link.href}
                      className="relative text-sm font-medium uppercase tracking-widest transition-colors duration-300 group whitespace-nowrap"
                      style={{
                        fontFamily: currentLang === 'ar' ? "'Cairo', sans-serif" : "'Outfit', sans-serif",
                        letterSpacing: currentLang === 'ar' ? '0' : '0.13em',
                        color: isActive ? '#c9a84c' : 'rgba(255,255,255,0.75)',
                        textDecoration: 'none',
                      }}
                    >
                      {link.label}
                      <span
                        className={`absolute -bottom-1 left-0 h-px transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}
                        style={{ background: '#c9a84c' }}
                      />
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="relative text-sm font-medium uppercase tracking-widest transition-colors duration-300 group whitespace-nowrap"
                      style={{
                        fontFamily: currentLang === 'ar' ? "'Cairo', sans-serif" : "'Outfit', sans-serif",
                        letterSpacing: currentLang === 'ar' ? '0' : '0.13em',
                        color: 'rgba(255,255,255,0.75)',
                        textDecoration: 'none',
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#ffffff'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.75)'; }}
                    >
                      {link.label}
                      <span
                        className="absolute -bottom-1 left-0 h-px w-0 group-hover:w-full transition-all duration-300"
                        style={{ background: '#c9a84c' }}
                      />
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right side: Lang switcher + Cart + Mobile menu */}
        <div className="flex items-center gap-3">
          {/* Language switcher — desktop */}
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
          {navLinks.map((link, i) => (
            <li key={link.href}>
              {link.isRoute ? (
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
                <a
                  href={link.href}
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
                </a>
              )}
            </li>
          ))}
          {/* Language switcher — mobile */}
          <li style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 8, paddingBottom: 4 }}>
            <LangSwitcher mobile />
          </li>
        </ul>
      </div>
    </header>
  );
}
