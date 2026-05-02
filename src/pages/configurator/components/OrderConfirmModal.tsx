import { useTranslation } from 'react-i18next';
import type { BottleModel, BottleSize, LabelStyle } from '@/mocks/configurator';

interface OrderConfirmModalProps {
  isOpen: boolean;
  model: BottleModel;
  size: BottleSize;
  label: LabelStyle | null;
  customText: string;
  totalPrice: number;
  onClose: () => void;
}

export default function OrderConfirmModal({
  isOpen, model, size, label, customText, totalPrice, onClose,
}: OrderConfirmModalProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(5,10,5,0.88)',
        backdropFilter: 'blur(10px)',
        animation: 'fadeIn 0.3s ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'linear-gradient(160deg, #0f1a0d 0%, #0a0f08 100%)',
          border: '1px solid rgba(212,175,55,0.3)',
          borderRadius: '16px',
          padding: '40px',
          maxWidth: '480px',
          width: '90%',
          textAlign: 'center',
          animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)',
          position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: '2px', background: 'linear-gradient(to right, transparent, #d4af37, transparent)', borderRadius: '2px' }} />

        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #d4af37, #c5a028)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 8px 32px rgba(212,175,55,0.35)',
          }}
        >
          <i className="ri-check-line" style={{ color: '#1a1a0e', fontSize: '28px' }} />
        </div>

        <h3
          style={{
            fontFamily: "'Cormorant Garant', serif",
            fontSize: '1.6rem',
            fontWeight: 700,
            color: '#d4af37',
            marginBottom: '8px',
          }}
        >
          {t('confirm_title')}
        </h3>
        <p
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '0.82rem',
            color: 'rgba(255,255,255,0.5)',
            marginBottom: '28px',
            lineHeight: 1.6,
          }}
        >
          {t('confirm_desc')}<br />
          {t('confirm_desc2')}
        </p>

        <div
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(212,175,55,0.15)',
            borderRadius: '10px',
            padding: '16px 20px',
            marginBottom: '24px',
            textAlign: 'left',
          }}
        >
          {[
            [t('confirm_model'), model.name],
            [t('confirm_size'), size.label],
            [t('confirm_label'), label?.name ?? 'Sans étiquette'],
            ...(customText ? [[t('confirm_custom'), `"${customText}"`]] : []),
            [t('confirm_total'), `${totalPrice} TND`],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between items-center py-1.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>{k}</span>
              <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.72rem', color: k === t('confirm_total') ? '#d4af37' : 'rgba(255,255,255,0.8)', fontWeight: k === t('confirm_total') ? 700 : 400 }}>{v}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="cursor-pointer whitespace-nowrap"
          style={{
            background: 'linear-gradient(135deg, #d4af37 0%, #b8962a 100%)',
            color: '#1a1a0e',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 32px',
            fontFamily: "'Outfit', sans-serif",
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          {t('confirm_close')}
        </button>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
