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
        <div
          className="mt-3 pt-3 flex items-center justify-center text-sm"
          style={{ color: 'rgba(255,255,255,0.9)' }}
        >
          <span>{t('footer_rights')}</span>
        </div>
      </div>
    </footer>
  );
}
