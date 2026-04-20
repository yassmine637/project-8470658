import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { bottleModels, bottleSizes, labelStyles } from '@/mocks/configurator';
import type { BottleModel, BottleSize, LabelStyle } from '@/mocks/configurator';
import BottleViewer from './components/BottleViewer';
import ConfigPanel from './components/ConfigPanel';
import ConfigSummary from './components/ConfigSummary';
import OrderConfirmModal from './components/OrderConfirmModal';
import EstimationModal from './components/EstimationModal';

export default function ConfiguratorPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedModel, setSelectedModel] = useState<BottleModel>(bottleModels[0]);
  const [selectedSize, setSelectedSize] = useState<BottleSize>(bottleSizes[1]);
  const [selectedLabel, setSelectedLabel] = useState<LabelStyle>(labelStyles[0]);
  const [customText, setCustomText] = useState('');
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [estimationOpen, setEstimationOpen] = useState(false);

  const STEPS = [
    { id: 'model', label: t('config_step_model'), icon: 'ri-flask-line', desc: t('config_step_desc_model') },
    { id: 'size', label: t('config_step_size'), icon: 'ri-scales-line', desc: t('config_step_desc_size') },
    { id: 'label', label: t('config_step_label'), icon: 'ri-palette-line', desc: t('config_step_desc_label') },
    { id: 'text', label: t('config_step_text'), icon: 'ri-quill-pen-line', desc: t('config_step_desc_text') },
    { id: 'summary', label: t('config_step_summary'), icon: 'ri-file-list-3-line', desc: t('config_step_desc_summary') },
  ];

  const totalPrice = selectedModel.basePrice + selectedSize.priceAdd + selectedLabel.priceAdd;
  const handleNext = () => { if (currentStep < STEPS.length - 1) setCurrentStep(s => s + 1); };
  const handlePrev = () => { if (currentStep > 0) setCurrentStep(s => s - 1); };
  const isSummaryStep = currentStep === STEPS.length - 1;
  const progress = (currentStep / (STEPS.length - 1)) * 100;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(160deg, #060d05 0%, #0a1509 40%, #050c04 100%)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        zIndex: 100,
      }}
    >
      {/* Ambient glows */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '5%', left: '3%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(90,138,74,0.04) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '700px', height: '700px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,175,55,0.025) 0%, transparent 60%)', filter: 'blur(100px)' }} />
      </div>

      {/* ── TOP BAR ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          height: '58px',
          borderBottom: '1px solid rgba(212,175,55,0.1)',
          background: 'rgba(5,10,4,0.9)',
          backdropFilter: 'blur(20px)',
          flexShrink: 0,
          padding: '0 24px',
          gap: '16px',
        }}
      >
        <button
          onClick={() => navigate('/')}
          className="cursor-pointer flex items-center gap-2 whitespace-nowrap"
          style={{
            background: 'none', border: 'none',
            color: 'rgba(255,255,255,0.35)',
            fontFamily: "'Outfit', sans-serif",
            fontSize: '0.62rem', letterSpacing: '0.14em',
            textTransform: 'uppercase',
            transition: 'color 0.2s',
            flexShrink: 0,
            padding: '6px 0',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#d4af37'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.35)'; }}
        >
          <i className="ri-arrow-left-s-line" style={{ fontSize: '15px' }} />
          <span className="hidden sm:inline">{t('config_back_home')}</span>
        </button>

        <div style={{ width: '1px', height: '28px', background: 'rgba(212,175,55,0.12)', flexShrink: 0 }} />

        <div style={{ flexShrink: 0 }}>
          <div style={{ fontFamily: "'Cormorant Garant', serif", fontSize: '1rem', fontWeight: 700, color: '#d4af37', letterSpacing: '0.18em', lineHeight: 1 }}>FENDRI</div>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.42rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.35em', textTransform: 'uppercase', marginTop: '2px' }}>{t('config_page_title')}</div>
        </div>

        <div style={{ width: '1px', height: '28px', background: 'rgba(212,175,55,0.12)', flexShrink: 0 }} />

        {/* Step nav — desktop */}
        <div className="hidden md:flex items-center flex-1 gap-1">
          {STEPS.map((step, i) => {
            const isActive = i === currentStep;
            const isDone = i < currentStep;
            return (
              <button
                key={step.id}
                onClick={() => setCurrentStep(i)}
                className="cursor-pointer flex items-center gap-2 whitespace-nowrap"
                style={{
                  background: isActive ? 'rgba(212,175,55,0.09)' : 'none',
                  border: isActive ? '1px solid rgba(212,175,55,0.22)' : '1px solid transparent',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '0.6rem',
                  fontWeight: isActive ? 700 : 400,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: isActive ? '#d4af37' : isDone ? 'rgba(212,175,55,0.5)' : 'rgba(255,255,255,0.22)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.55)'; }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = isDone ? 'rgba(212,175,55,0.5)' : 'rgba(255,255,255,0.22)'; }}
              >
                {isDone
                  ? <i className="ri-check-line" style={{ fontSize: '10px', color: '#d4af37' }} />
                  : <span style={{ fontSize: '0.52rem', opacity: 0.5 }}>{i + 1}</span>
                }
                {step.label}
              </button>
            );
          })}
        </div>

        {/* Mobile step */}
        <div className="flex md:hidden flex-1 items-center justify-center">
          <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em' }}>
            {currentStep + 1}/{STEPS.length} — <span style={{ color: '#d4af37' }}>{STEPS[currentStep].label}</span>
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: '2px', background: 'rgba(255,255,255,0.04)', flexShrink: 0, position: 'relative', zIndex: 20 }}>
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(to right, rgba(212,175,55,0.4), #d4af37)',
            transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1)',
          }}
        />
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>

        {/* LEFT PANEL */}
        <div
          style={{
            width: isSummaryStep ? '0' : '260px',
            minWidth: isSummaryStep ? '0' : '260px',
            overflow: 'hidden',
            transition: 'width 0.45s cubic-bezier(0.4,0,0.2,1), min-width 0.45s cubic-bezier(0.4,0,0.2,1)',
            borderRight: '1px solid rgba(212,175,55,0.08)',
            background: 'rgba(4,8,3,0.7)',
            backdropFilter: 'blur(24px)',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ width: '260px', height: '100%', display: 'flex', flexDirection: 'column' }}>

            {/* Step header */}
            <div
              style={{
                padding: '18px 22px 16px',
                borderBottom: '1px solid rgba(212,175,55,0.07)',
                flexShrink: 0,
                background: 'rgba(212,175,55,0.02)',
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: '34px', height: '34px',
                    borderRadius: '10px',
                    background: 'rgba(212,175,55,0.1)',
                    border: '1px solid rgba(212,175,55,0.18)',
                    color: '#d4af37',
                    fontSize: '15px',
                    flexShrink: 0,
                  }}
                >
                  <i className={STEPS[currentStep]?.icon} />
                </div>
                <div className="flex-1 min-w-0">
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.25em', color: '#d4af37', textTransform: 'uppercase' }}>
                    {t('config_step_label_prefix')} {currentStep + 1} · {STEPS[currentStep]?.label}
                  </div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.6rem', color: 'rgba(255,255,255,0.25)', marginTop: '2px' }}>
                    {STEPS[currentStep]?.desc}
                  </div>
                </div>
                <div style={{ flexShrink: 0, fontFamily: "'Outfit', sans-serif", fontSize: '0.52rem', color: 'rgba(255,255,255,0.15)', letterSpacing: '0.1em' }}>
                  {currentStep + 1}<span style={{ opacity: 0.5 }}>/{STEPS.length}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 mt-3">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      height: '2px',
                      flex: 1,
                      borderRadius: '2px',
                      background: i < currentStep
                        ? '#d4af37'
                        : i === currentStep
                          ? 'rgba(212,175,55,0.55)'
                          : 'rgba(255,255,255,0.07)',
                      transition: 'background 0.3s',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Panel content */}
            <div style={{ flex: 1, overflow: 'hidden', padding: '18px 20px' }}>
              <ConfigPanel
                step={currentStep}
                models={bottleModels}
                sizes={bottleSizes}
                labels={labelStyles}
                selectedModel={selectedModel}
                selectedSize={selectedSize}
                selectedLabel={selectedLabel}
                customText={customText}
                onModelChange={m => setSelectedModel(m)}
                onSizeChange={s => setSelectedSize(s)}
                onLabelChange={l => setSelectedLabel(l)}
                onCustomTextChange={txt => setCustomText(txt)}
              />
            </div>

            {/* Bottom nav inside panel */}
            <div
              style={{
                padding: '14px 20px',
                borderTop: '1px solid rgba(212,175,55,0.07)',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'rgba(4,8,3,0.5)',
              }}
            >
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '8px',
                  padding: '9px 16px',
                  color: currentStep === 0 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.4)',
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '0.6rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  transition: 'all 0.2s',
                  cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                  flexShrink: 0,
                }}
                onMouseEnter={e => { if (currentStep > 0) { (e.currentTarget as HTMLButtonElement).style.color = '#d4af37'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(212,175,55,0.3)'; } }}
                onMouseLeave={e => { if (currentStep > 0) { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.4)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.07)'; } }}
              >
                <i className="ri-arrow-left-s-line" style={{ fontSize: '14px' }} />
                {t('config_prev')}
              </button>

              <button
                onClick={handleNext}
                disabled={isSummaryStep}
                className="cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
                style={{
                  flex: 1,
                  background: isSummaryStep ? 'rgba(255,255,255,0.02)' : 'linear-gradient(135deg, rgba(212,175,55,0.18), rgba(212,175,55,0.09))',
                  border: isSummaryStep ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(212,175,55,0.45)',
                  borderRadius: '8px',
                  padding: '9px 16px',
                  color: isSummaryStep ? 'rgba(255,255,255,0.15)' : '#d4af37',
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '0.6rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  transition: 'all 0.2s',
                  cursor: isSummaryStep ? 'not-allowed' : 'pointer',
                }}
                onMouseEnter={e => { if (!isSummaryStep) { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(212,175,55,0.24)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(212,175,55,0.65)'; } }}
                onMouseLeave={e => { if (!isSummaryStep) { (e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(135deg, rgba(212,175,55,0.18), rgba(212,175,55,0.09))'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(212,175,55,0.45)'; } }}
              >
                {currentStep === STEPS.length - 2 ? t('config_see_recap') : t('config_next')}
                <i className="ri-arrow-right-s-line" style={{ fontSize: '14px' }} />
              </button>
            </div>
          </div>
        </div>

        {/* CENTER — Bottle viewer */}
        <div
          style={{
            flex: 1,
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              textAlign: 'center',
              pointerEvents: 'none',
              zIndex: 5,
              whiteSpace: 'nowrap',
            }}
          >
            <div style={{ fontFamily: "'Cormorant Garant', serif", fontSize: '1.3rem', fontWeight: 300, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.1em' }}>
              {selectedModel.name}
            </div>
            <div className="flex items-center justify-center gap-3 mt-1">
              <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.52rem', color: 'rgba(212,175,55,0.5)', letterSpacing: '0.22em', textTransform: 'uppercase' }}>{selectedSize.label}</span>
              <div style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'rgba(212,175,55,0.35)' }} />
              <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.52rem', color: 'rgba(212,175,55,0.5)', letterSpacing: '0.22em', textTransform: 'uppercase' }}>{selectedLabel.name}</span>
            </div>
          </div>

          <div style={{ width: '100%', height: '100%', maxWidth: isSummaryStep ? '400px' : '100%', transition: 'max-width 0.45s ease' }}>
            <BottleViewer
              model={selectedModel}
              labelStyle={selectedLabel}
              customText={customText}
              size={selectedSize.label}
            />
          </div>

          <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {bottleModels.map(m => (
              <button
                key={m.id}
                onClick={() => { setSelectedModel(m); setCurrentStep(0); }}
                className="cursor-pointer"
                title={m.name}
                style={{
                  width: selectedModel.id === m.id ? '28px' : '7px',
                  height: '7px',
                  borderRadius: '4px',
                  background: selectedModel.id === m.id ? '#d4af37' : 'rgba(255,255,255,0.14)',
                  border: 'none',
                  transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                  padding: 0,
                }}
              />
            ))}
          </div>
        </div>

        {/* RIGHT PANEL — Summary */}
        <div
          style={{
            width: isSummaryStep ? '400px' : '0',
            minWidth: isSummaryStep ? '400px' : '0',
            overflow: 'hidden',
            transition: 'width 0.45s cubic-bezier(0.4,0,0.2,1), min-width 0.45s cubic-bezier(0.4,0,0.2,1)',
            borderLeft: '1px solid rgba(212,175,55,0.08)',
            background: 'rgba(4,8,3,0.7)',
            backdropFilter: 'blur(24px)',
            flexShrink: 0,
          }}
        >
          <div style={{ width: '400px', height: '100%', overflowY: 'auto', padding: '24px', boxSizing: 'border-box', scrollbarWidth: 'thin', scrollbarColor: 'rgba(212,175,55,0.2) transparent' }}>
            <ConfigSummary
              model={selectedModel}
              size={selectedSize}
              label={selectedLabel}
              customText={customText}
              totalPrice={totalPrice}
              onOrder={() => setOrderConfirmed(true)}
              onEstimation={() => setEstimationOpen(true)}
            />
          </div>
        </div>
      </div>

      <OrderConfirmModal
        isOpen={orderConfirmed}
        model={selectedModel}
        size={selectedSize}
        label={selectedLabel}
        customText={customText}
        totalPrice={totalPrice}
        onClose={() => setOrderConfirmed(false)}
      />
      <EstimationModal
        isOpen={estimationOpen}
        model={selectedModel}
        size={selectedSize}
        label={selectedLabel}
        customText={customText}
        totalPrice={totalPrice}
        onClose={() => setEstimationOpen(false)}
      />
    </div>
  );
}
