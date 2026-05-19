import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { BottleModel, BottleSize, LabelStyle, PackagingOption } from '@/mocks/configurator';

interface ConfigPanelProps {
  step: number;
  models: BottleModel[];
  sizes: BottleSize[];
  labels: LabelStyle[];
  packagings: PackagingOption[];
  selectedModel: BottleModel;
  modelChosen?: boolean;
  selectedSize: BottleSize;
  sizeChosen?: boolean;
  selectedLabel: LabelStyle | null;
  selectedPackaging: PackagingOption;
  customText: string;
  formatPrice?: (amount: number) => string;
  currencySymbol?: string;
  onModelChange: (m: BottleModel) => void;
  onSizeChange: (s: BottleSize) => void;
  onLabelChange: (l: LabelStyle) => void;
  onPackagingChange: (p: PackagingOption) => void;
  onCustomTextChange: (t: string) => void;
  onValidate?: () => void;
}

export default function ConfigPanel({
  step,
  models, sizes, labels, packagings,
  selectedModel, modelChosen = true, selectedSize, sizeChosen = true, selectedLabel, selectedPackaging, customText,
  formatPrice: externalFormatPrice,
  currencySymbol: externalSymbol,
  onModelChange, onSizeChange, onLabelChange, onPackagingChange, onCustomTextChange,
  onValidate,
}: ConfigPanelProps) {
  const { t, i18n } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const isArabic = i18n.language === 'ar';

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [step]);

  const fmtNum = externalFormatPrice ?? ((n: number) => String(n));
  const symb = externalSymbol ?? 'TND';
  const displaySymbol = symb === 'TND' && isArabic ? 'د.ت' : symb;
  const formatPrice = (amount: number) => `${fmtNum(amount)} ${displaySymbol}`;

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
            const isSelected = modelChosen && selectedModel.id === m.id;
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
                      {t(m.nameKey)}
                    </span>
                  </div>
                  <div
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: '0.95rem',
                      color: 'rgba(255,255,255,0.32)',
                      lineHeight: 1.4,
                    }}
                  >
                    {t(m.descriptionKey)}
                  </div>
                </div>

                <div style={{ flexShrink: 0, textAlign: 'right' }}>
                  <div style={{ fontFamily: "'Cormorant Garant', serif", fontSize: '1.8rem', fontWeight: 700, color: '#d4af37', lineHeight: 1 }}>
                    {fmtNum(m.basePrice)}
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
              const isSelected = sizeChosen && selectedSize.id === s.id;
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
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.55rem', fontWeight: 600, color: isSelected ? '#d4af37' : 'rgba(255,255,255,0.7)', letterSpacing: '0.06em', direction: 'rtl', unicodeBidi: 'plaintext' }}>
                      {s.volumeKey ? t(s.volumeKey) : s.label.split(' ')[1] || t('config_litre')}
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
                    {s.priceAdd > 0 ? `+${formatPrice(s.priceAdd)}` : t('config_included_label')}
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
                const isSel = sizeChosen && selectedSize.id === s.id;
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
                      {s.volumeKey ? `${s.label.split(' ')[0]} ${t(s.volumeKey)}` : s.label}
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
            const isSelected = selectedLabel !== null && selectedLabel.id === l.id;
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
                    {t(l.nameKey)}
                  </div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>
                    {t(l.descriptionKey)}
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
                    {`+${formatPrice(l.priceAdd)}`}
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

      {/* ── STEP 3 — Packaging ── */}
      {step === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {packagings.map(p => {
            const isSelected = selectedPackaging.id === p.id;
            const isNone = p.id === 'none';
            return (
              <button
                key={p.id}
                onClick={() => onPackagingChange(p)}
                className="cursor-pointer text-left w-full"
                style={{
                  padding: '16px 18px',
                  borderRadius: '10px',
                  border: isSelected
                    ? `1px solid ${isNone ? 'rgba(255,255,255,0.22)' : p.accentColor + '88'}`
                    : '1px solid rgba(255,255,255,0.05)',
                  background: isSelected
                    ? (isNone ? 'rgba(255,255,255,0.04)' : `${p.accentColor}10`)
                    : 'rgba(255,255,255,0.02)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  transition: 'all 0.22s ease',
                  position: 'relative',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
                onMouseEnter={e => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = `${p.accentColor}44`;
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
                {/* Packaging mini-preview */}
                <div
                  style={{
                    width: '72px',
                    height: '96px',
                    borderRadius: '7px',
                    flexShrink: 0,
                    background: isNone ? 'rgba(255,255,255,0.04)' : `${p.bgHint}18`,
                    border: isSelected
                      ? `1px solid ${isNone ? 'rgba(255,255,255,0.18)' : p.accentColor + '66'}`
                      : '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.22s',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  {isNone ? (
                    <svg viewBox="0 0 60 90" fill="none" style={{ width: '38px', height: '58px', opacity: 0.35 }}>
                      <rect x="18" y="2" width="24" height="82" rx="5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" fill="none" strokeDasharray="4 2" />
                    </svg>
                  ) : p.id === 'coffret-tiroir' ? (
                    <img
                      src="/images/packaging/coffret-tiroir-eva.webp"
                      alt="Coffret Tiroir EVA"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                    />
                  ) : p.id === 'coffret-magnetique' ? (
                    <img
                      src="/images/packaging/coffret-magnetique.webp"
                      alt="Coffret Magnétique"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                    />
                  ) : p.id === 'tube-cylindrique' ? (
                    <svg viewBox="0 0 60 80" fill="none" style={{ width: '52px', height: '70px' }}>
                      {/* Tube body */}
                      <rect x="14" y="6" width="32" height="70" rx="16" fill="#2E2618" opacity="0.95" />
                      {/* Left shadow */}
                      <rect x="14" y="6" width="10" height="70" rx="16 0 0 16" fill="rgba(0,0,0,0.3)" />
                      {/* Right highlight */}
                      <rect x="36" y="6" width="10" height="70" rx="0 16 16 0" fill="rgba(255,255,255,0.04)" />
                      {/* Gold ring bands */}
                      <ellipse cx="30" cy="44" rx="16" ry="3" fill="none" stroke="#C9A84C" strokeWidth="1.5" opacity="0.85" />
                      <ellipse cx="30" cy="48" rx="16" ry="3" fill="none" stroke="#C9A84C" strokeWidth="0.6" opacity="0.4" />
                      {/* Top cap */}
                      <ellipse cx="30" cy="6" rx="16" ry="4" fill="#3A3020" stroke="#C9A84C" strokeWidth="0.8" />
                      {/* Bottom cap */}
                      <ellipse cx="30" cy="76" rx="16" ry="4" fill="#2E2618" stroke="#C9A84C" strokeWidth="0.8" />
                      <text x="30" y="30" textAnchor="middle" fontFamily="serif" fontSize="5" fill="#C9A84C" letterSpacing="1" opacity="0.85">FENDRI</text>
                    </svg>
                  ) : p.id === 'caisse-bois-premium' ? (
                    <svg viewBox="0 0 60 80" fill="none" style={{ width: '52px', height: '70px' }}>
                      {/* Crate body — wider for 3L */}
                      <rect x="2" y="12" width="56" height="64" rx="1" fill="#9C6430" opacity="0.9" />
                      {/* Plank lines */}
                      {[22, 32, 42, 52, 62].map(y => <line key={y} x1="2" y1={y} x2="58" y2={y} stroke="#4A2810" strokeWidth="1.2" opacity="0.5" />)}
                      {/* Plank grain */}
                      {[14, 30, 46].map(y => <line key={`g${y}`} x1="2" y1={y} x2="58" y2={y} stroke="#C48840" strokeWidth="0.4" opacity="0.12" />)}
                      {/* Metal reinforcement band */}
                      <rect x="2" y="38" width="56" height="5" fill="#1C0E06" opacity="0.3" />
                      <line x1="2" y1="38" x2="58" y2="38" stroke="#C9A84C" strokeWidth="0.7" opacity="0.4" />
                      <line x1="2" y1="43" x2="58" y2="43" stroke="#C9A84C" strokeWidth="0.7" opacity="0.4" />
                      {/* Corner brackets */}
                      <rect x="0" y="10" width="7" height="10" rx="1" fill="#2A1408" opacity="0.85" />
                      <rect x="53" y="10" width="7" height="10" rx="1" fill="#2A1408" opacity="0.85" />
                      <rect x="0" y="68" width="7" height="10" rx="1" fill="#2A1408" opacity="0.85" />
                      <rect x="53" y="68" width="7" height="10" rx="1" fill="#2A1408" opacity="0.85" />
                      {/* Engraved label */}
                      <rect x="12" y="50" width="36" height="16" rx="1" fill="rgba(0,0,0,0.15)" />
                      <text x="30" y="60" textAnchor="middle" fontFamily="serif" fontSize="5.5" fill="#3E1E08" letterSpacing="1.5" opacity="0.9">FENDRI</text>
                      <text x="30" y="63" textAnchor="middle" fontFamily="sans-serif" fontSize="3.5" fill="#5C3218" letterSpacing="0.5" opacity="0.5"> </text>
                      <text x="30" y="63" textAnchor="middle" fontFamily="sans-serif" fontSize="3.5" fill="#5C3218" letterSpacing="0.5" opacity="0.55">3L</text>
                    </svg>
                  ) : null}
                </div>

                {/* Text info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: isSelected ? (isNone ? 'rgba(255,255,255,0.7)' : p.accentColor) : 'rgba(255,255,255,0.8)',
                      transition: 'color 0.2s',
                      marginBottom: '4px',
                    }}
                  >
                    {t(p.nameKey)}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: '0.78rem',
                      color: 'rgba(255,255,255,0.35)',
                      lineHeight: 1.4,
                    }}
                  >
                    {t(p.descriptionKey)}
                  </div>
                  <div
                    style={{
                      marginTop: '8px',
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: '0.72rem',
                      color: p.priceAdd > 0 ? 'rgba(212,175,55,0.75)' : 'rgba(255,255,255,0.25)',
                      background: p.priceAdd > 0 ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.04)',
                      borderRadius: '4px',
                      padding: '2px 8px',
                      display: 'inline-block',
                    }}
                  >
                    {p.priceAdd > 0 ? `+${formatPrice(p.priceAdd)}` : t('config_included_label')}
                  </div>
                </div>

                {/* Check badge */}
                {isSelected && (
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: isNone ? 'rgba(255,255,255,0.2)' : p.accentColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <i className="ri-check-line" style={{ fontSize: '9px', color: '#1a1a0e' }} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* ── STEP 4 — Custom text ── */}
      {step === 4 && (
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
                  padding: '48px 72px 48px 26px',
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
                <span>{t('config_ok')}</span>
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
