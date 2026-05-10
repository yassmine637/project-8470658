import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { authApi } from '@/api/auth';
import { useTranslation } from 'react-i18next';
import { useCurrencyCtx } from '@/context/CurrencyContext';
import { CURRENCIES } from '@/hooks/useCurrency';

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
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const currencyMenuRef = useRef<HTMLDivElement>(null);
  const { currency, setCurrency, currencyInfo } = useCurrencyCtx();
  const location  = useLocation();
  const navigate  = useNavigate();
  const isHome    = location.pathname === '/';
  const showCart  = ['/products', '/configurator', '/checkout'].some(
    (p) => location.pathname === p || location.pathname.startsWith(p + '/')
  );
  const { totalCount, openCart } = useCart();
  const { t, i18n } = useTranslation();
  const { user, isAdmin, logout } = useAuth();

  const currentLang: LangCode =
    (LANGS.find((l) => l.code === i18n.language)?.code) ?? 'fr';

  const switchLang = (code: LangCode) => {
    i18n.changeLanguage(code);
    const lang = LANGS.find((l) => l.code === code)!;
    document.documentElement.dir = lang.dir;
    document.documentElement.lang = code;
    document.body.style.fontFamily = code === 'ar' ? "'Cairo', sans-serif" : '';
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
    document.body.style.fontFamily = currentLang === 'ar' ? "'Cairo', sans-serif" : '';
  }, [currentLang]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
      if (currencyMenuRef.current && !currencyMenuRef.current.contains(e.target as Node)) {
        setCurrencyMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const handleAnchorNav = (sectionId: string) => {
    if (menuOpen) setMenuOpen(false);
    if (isHome) {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/', { state: { scrollTo: sectionId } });
    }
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/', { state: { loggedOut: true } });
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) return;
    try {
      await authApi.deleteAccount();
      logout();
      setUserMenuOpen(false);
      navigate('/');
    } catch {
      alert('Erreur lors de la suppression du compte. Veuillez réessayer.');
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

  const CurrencySwitcher = () => (
    <div ref={currencyMenuRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setCurrencyMenuOpen(!currencyMenuOpen)}
        style={{
          display: 'flex', alignItems: 'center', gap: 5,
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'rgba(255,255,255,0.65)', fontFamily: "'Outfit', sans-serif",
          fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
          padding: '4px 2px', transition: 'color 0.2s',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.65)'; }}
        aria-label="Changer la devise"
      >
        <span style={{ fontSize: 13 }}>{currencyInfo.flag}</span>
        <span>{currencyInfo.code}</span>
        <i className="ri-arrow-down-s-line" style={{ fontSize: 10, opacity: 0.6, marginLeft: -3 }} />
      </button>

      {currencyMenuOpen && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', right: 0,
          background: 'rgba(14,24,12,0.97)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 8, overflow: 'hidden', backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)', minWidth: 150, zIndex: 100,
          maxHeight: 300, overflowY: 'auto',
        }}>
          {Object.values(CURRENCIES).map((c) => {
            const active = currency === c.code;
            return (
              <button
                key={c.code}
                onClick={() => { setCurrency(c.code); setCurrencyMenuOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                  padding: '8px 14px', background: active ? 'rgba(201,168,76,0.1)' : 'none',
                  border: 'none', borderBottom: '1px solid rgba(255,255,255,0.04)',
                  cursor: 'pointer', color: active ? '#c9a84c' : 'rgba(255,255,255,0.65)',
                  fontFamily: "'Outfit', sans-serif", fontSize: 12,
                  fontWeight: active ? 600 : 400, textAlign: 'left',
                  transition: 'all 0.15s', whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; }}
                onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}
              >
                <span style={{ fontSize: 14, flexShrink: 0 }}>{c.flag}</span>
                <span style={{ flex: 1 }}>{c.code}</span>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>{c.symbol}</span>
                {active && <i className="ri-check-line" style={{ marginLeft: 4, fontSize: 11, color: '#c9a84c', flexShrink: 0 }} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );

  const LangSwitcher = ({ mobile = false }: { mobile?: boolean }) => (
    <div ref={mobile ? undefined : langMenuRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setLangMenuOpen(!langMenuOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'rgba(255,255,255,0.65)',
          fontFamily: "'Outfit', sans-serif",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.1em',
          padding: '4px 2px',
          transition: 'color 0.2s',
          ...(mobile ? { margin: '4px 40px' } : {}),
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.65)'; }}
        aria-label="Changer la langue"
      >
        <i className="ri-global-line" style={{ fontSize: 13 }} />
        <span>{currentLang.toUpperCase()}</span>
        <i className="ri-arrow-down-s-line" style={{ fontSize: 10, opacity: 0.6, marginLeft: -3 }} />
      </button>

      {langMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: mobile ? 'auto' : 0,
            left: mobile ? 0 : 'auto',
            background: 'rgba(14,24,12,0.97)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8,
            overflow: 'hidden',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            minWidth: 100,
            zIndex: 100,
          }}
        >
          {LANGS.map(({ code, label }) => {
            const active = currentLang === code;
            const langName = code === 'fr' ? 'Français' : code === 'en' ? 'English' : 'العربية';
            return (
              <button
                key={code}
                onClick={() => { switchLang(code); setLangMenuOpen(false); if (mobile) setMenuOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  width: '100%',
                  padding: '8px 14px',
                  background: active ? 'rgba(201,168,76,0.1)' : 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: active ? '#c9a84c' : 'rgba(255,255,255,0.65)',
                  fontFamily: code === 'ar' ? "'Cairo', sans-serif" : "'Outfit', sans-serif",
                  fontSize: 12,
                  fontWeight: active ? 600 : 400,
                  letterSpacing: code === 'ar' ? 0 : '0.05em',
                  textAlign: 'left',
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; }}
                onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}
              >
                <span style={{ fontSize: 11, fontWeight: 700, opacity: 0.5, minWidth: 22, fontFamily: "'Outfit', sans-serif", letterSpacing: '0.08em' }}>
                  {code.toUpperCase()}
                </span>
                {langName}
                {active && <i className="ri-check-line" style={{ marginLeft: 'auto', fontSize: 11, color: '#c9a84c' }} />}
              </button>
            );
          })}
        </div>
      )}
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
        {/* Logo */}
        <Link
          to="/"
          style={{ textDecoration: 'none' }}
          onClick={() => { if (isHome) window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        >
          {i18n.language === 'ar' ? (
            <span
              className="text-white font-bold tracking-widest uppercase"
              style={{ fontFamily: "'Cairo', sans-serif", fontSize: '1.1rem', letterSpacing: '0.1em' }}
            >
              ضيعة فندري
            </span>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, gap: 1 }}>
              <span
                style={{
                  fontFamily: "'Cormorant Garant', serif",
                  fontSize: '0.45rem',
                  letterSpacing: '0.45em',
                  color: '#c9a84c',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
              >
                {i18n.language === 'en' ? 'Estate' : 'Domaine'}
              </span>
              <span
                style={{
                  fontFamily: "'Cormorant Garant', serif",
                  fontSize: '1rem',
                  letterSpacing: '0.28em',
                  color: '#ffffff',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  marginTop: 1,
                }}
              >
                Fendri
              </span>
            </div>
          )}
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
                      className="relative font-medium uppercase tracking-widest transition-colors duration-300 group whitespace-nowrap"
                      style={{ ...linkStyle, fontSize: '0.65rem', color: isActive ? '#c9a84c' : 'rgba(255,255,255,0.75)' }}
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
                      className="relative font-medium uppercase tracking-widest transition-colors duration-300 group whitespace-nowrap"
                      style={{ ...linkStyle, fontSize: '0.65rem' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#ffffff'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.75)'; }}
                    >
                      {link.label}
                      <span className="absolute -bottom-1 left-0 h-px w-0 group-hover:w-full transition-all duration-300" style={{ background: '#c9a84c' }} />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3">
            <CurrencySwitcher />
            <LangSwitcher />
          </div>

          {/* Auth buttons — desktop */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              /* User dropdown */
              <div ref={userMenuRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 7,
                    background: 'rgba(201,168,76,0.15)',
                    border: '1px solid rgba(201,168,76,0.4)',
                    borderRadius: 20,
                    padding: '5px 13px 5px 9px',
                    cursor: 'pointer',
                    color: '#c9a84c',
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    transition: 'all 0.2s',
                  }}
                >
                  <i className="ri-user-3-line" style={{ fontSize: 14 }} />
                  {user.name.split(' ')[0]}
                  <i className={`ri-arrow-${userMenuOpen ? 'up' : 'down'}-s-line`} style={{ fontSize: 12, opacity: 0.7 }} />
                </button>

                {userMenuOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      background: 'rgba(20,32,18,0.98)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 10,
                      padding: '6px 0',
                      minWidth: 160,
                      backdropFilter: 'blur(20px)',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                    }}
                  >
                    <div style={{ padding: '8px 16px 10px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                      <div style={{ color: '#fff', fontSize: 13, fontWeight: 600, fontFamily: "'Outfit', sans-serif" }}>{user.name}</div>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: "'Outfit', sans-serif", marginTop: 2 }}>{user.email}</div>
                    </div>
                    {!isAdmin && (
                      <Link
                        to="/account"
                        onClick={() => setUserMenuOpen(false)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          padding: '9px 16px', textDecoration: 'none',
                          color: 'rgba(255,255,255,0.7)', fontSize: 12, fontFamily: "'Outfit', sans-serif",
                          fontWeight: 500, letterSpacing: '0.05em',
                        }}
                      >
                        <i className="ri-user-settings-line" />
                        {t('auth_my_account')}
                      </Link>
                    )}
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          padding: '9px 16px', textDecoration: 'none',
                          color: '#c9a84c', fontSize: 12, fontFamily: "'Outfit', sans-serif",
                          fontWeight: 600, letterSpacing: '0.05em',
                        }}
                      >
                        <i className="ri-dashboard-line" />
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                        padding: '9px 16px', background: 'none', border: 'none', cursor: 'pointer',
                        color: 'rgba(255,255,255,0.6)', fontSize: 12, fontFamily: "'Outfit', sans-serif",
                        letterSpacing: '0.05em', textAlign: 'left',
                      }}
                    >
                      <i className="ri-logout-box-r-line" />
                      Se déconnecter
                    </button>
                    <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '2px 0' }} />
                    <button
                      onClick={handleDeleteAccount}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                        padding: '9px 16px', background: 'none', border: 'none', cursor: 'pointer',
                        color: 'rgba(200,60,60,0.75)', fontSize: 12, fontFamily: "'Outfit', sans-serif",
                        letterSpacing: '0.05em', textAlign: 'left',
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#c83c3c'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(200,60,60,0.75)'; }}
                    >
                      <i className="ri-delete-bin-6-line" />
                      Supprimer le compte
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth?mode=register"
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  color: '#1a2617',
                  textDecoration: 'none',
                  padding: '5px 14px',
                  borderRadius: 20,
                  background: '#c9a84c',
                  border: '1px solid #c9a84c',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = '#b8942a'; el.style.borderColor = '#b8942a'; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = '#c9a84c'; el.style.borderColor = '#c9a84c'; }}
              >
                {t('auth_signup')}
              </Link>
            )}
          </div>

          {/* Cart icon — only on shopping pages */}
          {showCart && (
            <button
              onClick={openCart}
              className="relative flex items-center justify-center w-9 h-9 rounded-full cursor-pointer border-none transition-all duration-200"
              style={{ background: 'rgba(255,255,255,0.1)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(201,168,76,0.25)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.1)'; }}
              aria-label="Ouvrir le panier"
            >
              <i className="ri-shopping-basket-2-line text-base" style={{ color: '#ffffff' }} />
              {totalCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 flex items-center justify-center text-xs font-bold rounded-full"
                  style={{
                    width: '18px', height: '18px',
                    background: '#c9a84c', color: '#1a2617',
                    fontFamily: "'Outfit', sans-serif", fontSize: '0.6rem', lineHeight: 1,
                  }}
                >
                  {totalCount > 9 ? '9+' : totalCount}
                </span>
              )}
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white text-xl cursor-pointer bg-transparent border-none p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Ouvrir le menu"
          >
            <i className={menuOpen ? 'ri-close-line' : 'ri-menu-line'} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300"
        style={{
          maxHeight: menuOpen ? '480px' : '0',
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
                      textAlign: currentLang === 'ar' ? 'right' : 'left',
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
                    className="block w-full uppercase tracking-widest transition-colors duration-200"
                    style={{
                      fontFamily: currentLang === 'ar' ? "'Cairo', sans-serif" : "'Outfit', sans-serif",
                      letterSpacing: currentLang === 'ar' ? 0 : '0.13em',
                      textAlign: currentLang === 'ar' ? 'right' : 'left',
                      padding: '12px 40px',
                      fontSize: '0.875rem',
                      fontWeight: 500,
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

          {/* Mobile auth */}
          <li style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '12px 40px', display: 'flex', gap: 10 }}>
            {user ? (
              <div style={{ width: '100%' }}>
                <div style={{ color: '#c9a84c', fontSize: 13, fontWeight: 600, fontFamily: "'Outfit', sans-serif", marginBottom: 8 }}>
                  <i className="ri-user-3-line" style={{ marginRight: 6 }} />{user.name}
                </div>
                {!isAdmin && (
                  <Link to="/account" onClick={() => setMenuOpen(false)} style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: 12, textDecoration: 'none', fontFamily: "'Outfit', sans-serif", marginBottom: 6 }}>
                    <i className="ri-user-settings-line" style={{ marginRight: 6 }} />Mon compte
                  </Link>
                )}
                {isAdmin && (
                  <Link to="/admin" onClick={() => setMenuOpen(false)} style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: 12, textDecoration: 'none', fontFamily: "'Outfit', sans-serif", marginBottom: 6 }}>
                    <i className="ri-dashboard-line" style={{ marginRight: 6 }} />Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  style={{ display: 'block', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', fontSize: 12, fontFamily: "'Outfit', sans-serif", padding: 0, marginBottom: 8 }}
                >
                  <i className="ri-logout-box-r-line" style={{ marginRight: 6 }} />{t('auth_logout')}
                </button>
                <button
                  onClick={() => { handleDeleteAccount(); setMenuOpen(false); }}
                  style={{ display: 'block', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(200,60,60,0.75)', fontSize: 12, fontFamily: "'Outfit', sans-serif", padding: 0 }}
                >
                  <i className="ri-delete-bin-6-line" style={{ marginRight: 6 }} />{t('auth_delete_account')}
                </button>
              </div>
            ) : (
              <Link
                to="/auth?mode=register"
                onClick={() => setMenuOpen(false)}
                style={{
                  flex: 1, textAlign: 'center', textDecoration: 'none',
                  padding: '8px 0', borderRadius: 20,
                  background: '#c9a84c',
                  border: '1px solid #c9a84c',
                  color: '#1a2617',
                  fontSize: 12, fontWeight: 600,
                  fontFamily: "'Outfit', sans-serif", letterSpacing: '0.08em',
                }}
              >
                {t('auth_signup')}
              </Link>
            )}
          </li>

          <li style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 8, paddingBottom: 4 }}>
            <LangSwitcher mobile />
          </li>
        </ul>
      </div>
    </header>
  );
}
