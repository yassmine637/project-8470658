import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { BottleModel, BottleSize, LabelStyle } from '@/mocks/configurator';

interface ConfigPanelProps {
  step: number;
  models: BottleModel[];
  sizes: BottleSize[];
  labels: LabelStyle[];
  selectedModel: BottleModel;
  selectedSize: BottleSize;
  selectedLabel: LabelStyle;
  customText: string;
  onModelChange: (m: BottleModel) => void;
  onSizeChange: (s: BottleSize) => void;
  onLabelChange: (l: LabelStyle) => void;
  onCustomTextChange: (t: string) => void;
  onValidate?: () => void;
}

export default function ConfigPanel({
  step,
  models, sizes, labels,
  selectedModel, selectedSize, selectedLabel, customText,
  onModelChange, onSizeChange, onLabelChange, onCustomTextChange,
  onValidate,
}: ConfigPanelProps) {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [step]);

  const displaySymbol = 'TND';

  return (
    <div
      ref={scrollRef}
      style={{
        height: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(212,175,55,0.15) transparent',
      }}
    >

      {/* ── STEP 0 — Bottle model ── */}
      {step === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {models.map((m, idx) => {
            const isSelected = selectedModel.id === m.id;
            return (
              <button
                key={m.id}
                onClick={() => onModelChange(m)}
                className="cursor-pointer text-left w-full"
                style={{
                  background: isSelected
                    ? 'linear-gradient(135deg, rgba(212,175,55,0.1), rgba(212,175,55,0.04))'
                    : 'rgba(255,255,255,0.02)',
                  border: isSelected
                    ? '1px solid rgba(212,175,55,0.5)'
                    : '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.22s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
                onMouseEnter={e => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(212,175,55,0.22)';
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.05)';
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.02)';
                  }
                }}
              >
                {isSelected && (
                  <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 0% 50%, rgba(212,175,55,0.07) 0%, transparent 65%)', pointerEvents: 'none' }} />
                )}

                <div
                  style={{
                    width: '88px',
                    height: '124px',
                    flexShrink: 0,
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: 'rgba(255,255,255,0.03)',
                    border: isSelected ? '1px solid rgba(212,175,55,0.3)' : '1px solid rgba(255,255,255,0.05)',
                    transition: 'border-color 0.2s',
                  }}
                >
                  <img src={m.image} alt={m.name} className="w-full h-full object-contain" />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                    <span
                      style={{
                        fontFamily: "'Cormorant Garant', serif",
                        fontSize: '1.65rem',
                        fontWeight: 600,
                        color: isSelected ? '#d4af37' : 'rgba(255,255,255,0.85)',
                        transition: 'color 0.2s',
                        lineHeight: 1.1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {m.name.replace(/\s*\d+\s*(ml|L)\b/gi, '').trim()}
                    </span>
                  </div>
                  <div
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: '0.95rem',
                      color: 'rgba(255,255,255,0.32)',
                      lineHeight: 1.4,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {m.description}
                  </div>
                </div>

                <div style={{ flexShrink: 0, textAlign: 'right' }}>
                  <div style={{ fontFamily: "'Cormorant Garant', serif", fontSize: '1.8rem', fontWeight: 700, color: '#d4af37', lineHeight: 1 }}>
                    {m.basePrice} TND
                  </div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.75rem', color: 'rgba(212,175,55,0.45)', letterSpacing: '0.1em', marginTop: '4px' }}>{displaySymbol}</div>
                </div>

                {isSelected && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      background: '#d4af37',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <i className="ri-check-line" style={{ fontSize: '8px', color: '#1a1a0e' }} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* ── STEP 1 — Volume ── */}
      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
            {sizes.map(s => {
              const isSelected = selectedSize.id === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => onSizeChange(s)}
                  className="cursor-pointer"
                  style={{
                    padding: '26px 14px',
                    borderRadius: '10px',
                    border: isSelected ? '1px solid rgba(212,175,55,0.55)' : '1px solid rgba(255,255,255,0.05)',
                    background: isSelected
                      ? 'linear-gradient(135deg, rgba(212,175,55,0.1), rgba(212,175,55,0.04))'
                      : 'rgba(255,255,255,0.02)',
                    textAlign: 'center',
                    transition: 'all 0.22s ease',
                    position: 'relative',
                    boxSizing: 'border-box',
                  }}
                  onMouseEnter={e => {
                    if (!isSelected) {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(212,175,55,0.22)';
                      (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isSelected) {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.05)';
                      (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.02)';
                    }
                  }}
                >
                  {isSelected && (
                    <div style={{ position: 'absolute', top: '7px', right: '7px', width: '14px', height: '14px', borderRadius: '50%', background: '#d4af37', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className="ri-check-line" style={{ fontSize: '7px', color: '#1a1a0e' }} />
                    </div>
                  )}
                  <div style={{ fontFamily: "'Cormorant Garant', serif", fontSize: '2.2rem', fontWeight: 700, color: isSelected ? '#d4af37' : 'rgba(255,255,255,0.7)', transition: 'color 0.2s', lineHeight: 1, display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '4px' }}>
                    <span>{s.label.split(' ')[0]}</span>
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.55rem', fontWeight: 600, color: isSelected ? '#d4af37' : 'rgba(255,255,255,0.7)', letterSpacing: '0.06em' }}>
                      {s.label.split(' ')[1] || t('config_litre')}
                    </span>
                  </div>
                  <div
                    style={{
                      marginTop: '8px',
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: '0.55rem',
                      color: s.priceAdd > 0 ? 'rgba(212,175,55,0.6)' : 'rgba(255,255,255,0.18)',
                      background: s.priceAdd > 0 ? 'rgba(212,175,55,0.07)' : 'rgba(255,255,255,0.03)',
                      borderRadius: '4px',
                      padding: '2px 6px',
                      display: 'inline-block',
                    }}
                  >
                    {s.priceAdd > 0 ? `+${s.priceAdd} TND` : t('config_included_label')}
                  </div>
                </button>
              );
            })}
          </div>

          <div
            style={{
              padding: '14px 16px',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(212,175,55,0.07)',
            }}
          >
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.5rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '12px' }}>
              {t('config_volume_comparison')}
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px', justifyContent: 'center' }}>
              {sizes.map(s => {
                const heights: Record<string, number> = { '500ml': 42, '750ml': 64, '1l': 88, '3l': 130 };
                const h = heights[s.id] || 64;
                const isSel = selectedSize.id === s.id;
                return (
                  <div key={s.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '34px',
                        height: `${h}px`,
                        borderRadius: '4px 4px 3px 3px',
                        background: isSel ? 'rgba(212,175,55,0.55)' : 'rgba(255,255,255,0.07)',
                        border: isSel ? '1px solid rgba(212,175,55,0.65)' : '1px solid rgba(255,255,255,0.05)',
                        transition: 'all 0.3s',
                      }}
                    />
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.78rem', color: isSel ? '#d4af37' : 'rgba(255,255,255,0.35)', transition: 'color 0.3s', letterSpacing: '0.04em' }}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 2 — Label ── */}
      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {labels.map(l => {
            const isSelected = selectedLabel.id === l.id;
            return (
              <button
                key={l.id}
                onClick={() => onLabelChange(l)}
                className="cursor-pointer text-left w-full"
                style={{
                  padding: '18px 20px',
                  borderRadius: '10px',
                  border: isSelected ? `1px solid ${l.accentColor}77` : '1px solid rgba(255,255,255,0.05)',
                  background: isSelected ? `${l.accentColor}0c` : 'rgba(255,255,255,0.02)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.22s ease',
                  position: 'relative',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
                onMouseEnter={e => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = `${l.accentColor}33`;
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.05)';
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.02)';
                  }
                }}
              >
                <div
                  style={{
                    width: '96px',
                    height: '136px',
                    borderRadius: '6px',
                    background: l.bgColor,
                    border: isSelected ? `1.5px solid ${l.accentColor}` : `1.5px solid ${l.borderColor}55`,
                    flexShrink: 0,
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px',
                    boxSizing: 'border-box',
                  }}
                >
                  {l.image ? (
                    <img
                      src={l.image}
                      alt={l.name}
                      style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3px', padding: '6px', boxSizing: 'border-box' }}>
                      <div style={{ fontFamily: "'Cormorant Garant', serif", fontSize: '0.6rem', fontWeight: 700, color: l.accentColor, letterSpacing: '0.08em', textTransform: 'uppercase' }}>FENDRI</div>
                      <div style={{ width: '65%', height: '1px', background: l.accentColor, opacity: 0.55 }} />
                      <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.42rem', color: l.bgColor === '#0e0e0e' ? 'rgba(255,255,255,0.4)' : '#5a6c56', letterSpacing: '0.04em' }}>EXTRA VIERGE</div>
                    </div>
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.05rem', fontWeight: 600, color: isSelected ? '#d4af37' : 'rgba(255,255,255,0.85)', transition: 'color 0.2s', marginBottom: '5px' }}>
                    {l.name}
                  </div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>
                    {l.description}
                  </div>
                  <div
                    style={{
                      marginTop: '8px',
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: '0.72rem',
                      color: 'rgba(212,175,55,0.7)',
                      background: 'rgba(212,175,55,0.08)',
                      borderRadius: '4px',
                      padding: '2px 6px',
                      display: 'inline-block',
                    }}
                  >
                    {`+${l.priceAdd} TND`}
                  </div>
                </div>

                {isSelected && (
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: l.accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <i className="ri-check-line" style={{ fontSize: '9px', color: l.bgColor === '#1a1a0e' ? '#1a1a0e' : '#fff' }} />
                  </div>
                )}
              </button>
            );
          })}

        </div>
      )}

      {/* ── STEP 3 — Custom text ── */}
      {step === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <div>
            <label style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.22em', color: 'rgba(212,175,55,0.6)', textTransform: 'uppercase', display: 'block', marginBottom: '22px' }}>
              {t('config_custom_text_label')}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={customText}
                onChange={e => onCustomTextChange(e.target.value.slice(0, 32))}
                maxLength={32}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(212,175,55,0.22)',
                  borderRadius: '9px',
                  padding: '32px 64px 32px 22px',
                  color: 'rgba(255,255,255,0.85)',
                  fontFamily: "'Cormorant Garant', serif",
                  fontSize: '2rem',
                  fontStyle: 'italic',
                  outline: 'none',
                  transition: 'border-color 0.2s, background 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(212,175,55,0.55)'; (e.target as HTMLInputElement).style.background = 'rgba(255,255,255,0.05)'; }}
                onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(212,175,55,0.22)'; (e.target as HTMLInputElement).style.background = 'rgba(255,255,255,0.03)'; }}
              />
              <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', fontFamily: "'Outfit', sans-serif", fontSize: '0.85rem', color: customText.length > 28 ? 'rgba(212,175,55,0.8)' : 'rgba(255,255,255,0.3)' }}>
                {customText.length}/32
              </span>
            </div>

            {onValidate && (
              <button
                onClick={onValidate}
                style={{
                  marginTop: '12px',
                  width: '100%',
                  padding: '14px 20px',
                  borderRadius: '9px',
                  border: '1px solid rgba(212,175,55,0.55)',
                  background: 'linear-gradient(135deg, rgba(212,175,55,0.18), rgba(212,175,55,0.06))',
                  color: '#d4af37',
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '1rem',
                  fontWeight: 600,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.22s ease',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(135deg, rgba(212,175,55,0.3), rgba(212,175,55,0.12))';
                  (e.currentTarget as HTMLButtonElement).style.color = '#f0cf5a';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(135deg, rgba(212,175,55,0.18), rgba(212,175,55,0.06))';
                  (e.currentTarget as HTMLButtonElement).style.color = '#d4af37';
                }}
              >
                <i className="ri-check-line" style={{ fontSize: '18px' }} />
                <span>OK</span>
              </button>
            )}
          </div>

          <div
            style={{
              padding: '10px 12px',
              borderRadius: '8px',
              background: 'rgba(212,175,55,0.03)',
              border: '1px solid rgba(212,175,55,0.08)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
            }}
          >
            <i className="ri-information-line" style={{ color: 'rgba(212,175,55,0.45)', fontSize: '16px', marginTop: '2px', flexShrink: 0 }} />
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, margin: 0 }}>
              {t('config_optional_note')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
