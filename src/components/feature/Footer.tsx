import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer
      style={{
        background: 'rgba(20,32,18,0.96)',
        backdropFilter: 'blur(20px)',
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      <div
        className="px-10 md:px-16 py-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="mt-3 pt-3 flex flex-col items-center gap-3">
          <div className="flex items-center gap-6">
            <Link
              to="/faq"
              style={{
                color: 'rgba(255,255,255,0.45)',
                textDecoration: 'none',
                fontSize: '0.65rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#c9a84c'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.45)'; }}
            >
              FAQ
            </Link>
            <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.5rem' }}>◆</span>
            <Link
              to="/products"
              style={{
                color: 'rgba(255,255,255,0.45)',
                textDecoration: 'none',
                fontSize: '0.65rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#c9a84c'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.45)'; }}
            >
              Collection
            </Link>
            <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.5rem' }}>◆</span>
            <Link
              to="/configurator"
              style={{
                color: 'rgba(255,255,255,0.45)',
                textDecoration: 'none',
                fontSize: '0.65rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#c9a84c'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.45)'; }}
            >
              Configurateur
            </Link>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.8rem' }}>
            <span>{t('footer_rights')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
