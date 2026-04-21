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
  const [selectedSize, setSelectedSize] = useState<BottleSize>(bottleSizes[0]);
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

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        zIndex: 100,
        background: '#111',
      }}
    >
      {/* ── TOP BAR ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          height: '56px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          background: '#1a1a1a',
          flexShrink: 0,
          padding: '0 20px',
          gap: '16px',
        }}
      >
        {/* Logo / back */}
        <button
          onClick={() => navigate('/')}
          className="cursor-pointer flex items-center gap-2 whitespace-nowrap"
          style={{
            background: 'none', border: 'none',
            color: 'rgba(255,255,255,0.4)',
            fontFamily: "'Outfit', sans-serif",
            fontSize: '0.6rem', letterSpacing: '0.12em',
            textTransform: 'uppercase',
            transition: 'color 0.2s',
            flexShrink: 0,
            padding: '6px 0',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.4)'; }}
        >
          <i className="ri-arrow-left-s-line" style={{ fontSize: '16px' }} />
          <span className="hidden sm:inline">{t('config_back_home')}</span>
        </button>

        <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />

        <div style={{ flexShrink: 0 }}>
          <div style={{ fontFamily: "'Cormorant Garant', serif", fontSize: '1.05rem', fontWeight: 700, color: '#d4af37', letterSpacing: '0.18em', lineHeight: 1 }}>FENDRI</div>
        </div>

        {/* Step tabs — centered */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-0">
          {STEPS.map((step, i) => {
            const isActive = i === currentStep;
            const isDone = i < currentStep;
            return (
              <button
                key={step.id}
                onClick={() => setCurrentStep(i)}
                className="cursor-pointer flex items-center gap-2 whitespace-nowrap relative"
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive ? '2px solid #d4af37' : '2px solid transparent',
                  padding: '0 20px',
                  height: '56px',
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '0.62rem',
                  fontWeight: isActive ? 700 : 400,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: isActive ? '#d4af37' : isDone ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.28)',
                  transition: 'color 0.2s, border-color 0.2s',
                }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.75)'; }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = isDone ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.28)'; }}
              >
                {isDone
                  ? <i className="ri-check-line" style={{ fontSize: '10px', color: '#d4af37' }} />
                  : <span style={{ fontSize: '0.55rem', opacity: 0.5 }}>{i + 1}.</span>
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

        {/* Price */}
        <div style={{ flexShrink: 0, textAlign: 'right' }}>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.48rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{t('config_total') || 'Total'}</div>
          <div style={{ fontFamily: "'Cormorant Garant', serif", fontSize: '1.1rem', fontWeight: 700, color: '#d4af37', lineHeight: 1 }}>
            {totalPrice} <span style={{ fontSize: '0.65rem', fontFamily: "'Outfit', sans-serif", fontWeight: 400 }}>TND</span>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>

        {/* LEFT PANEL */}
        <div
          style={{
            width: isSummaryStep ? '0' : '340px',
            minWidth: isSummaryStep ? '0' : '340px',
            overflow: 'hidden',
            transition: 'none',
            borderRight: '1px solid rgba(255,255,255,0.06)',
            background: '#1a1a1a',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ width: '340px', height: '100%', display: 'flex', flexDirection: 'column' }}>

            {/* Section label */}
            <div
              style={{
                padding: '14px 18px 12px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                flexShrink: 0,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '28px', height: '28px',
                    borderRadius: '7px',
                    background: 'rgba(212,175,55,0.12)',
                    border: '1px solid rgba(212,175,55,0.2)',
                    color: '#d4af37',
                    fontSize: '13px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <i className={STEPS[currentStep]?.icon} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.22em', color: '#d4af37', textTransform: 'uppercase' }}>
                    {STEPS[currentStep]?.label}
                  </div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.55rem', color: 'rgba(255,255,255,0.25)', marginTop: '1px' }}>
                    {STEPS[currentStep]?.desc}
                  </div>
                </div>
              </div>
            </div>

            {/* Panel content */}
            <div style={{ flex: 1, overflow: 'hidden', padding: '14px 16px' }}>
              <ConfigPanel
                step={currentStep}
                models={bottleModels}
                sizes={bottleSizes}
                labels={labelStyles}
                selectedModel={selectedModel}
                selectedSize={selectedSize}
                selectedLabel={selectedLabel}
                customText={customText}
                onModelChange={m => {
                  setSelectedModel(m);
                  if (m.defaultSizeId) {
                    const ds = bottleSizes.find(s => s.id === m.defaultSizeId);
                    if (ds) setSelectedSize(ds);
                  }
                }}
                onSizeChange={s => setSelectedSize(s)}
                onLabelChange={l => setSelectedLabel(l)}
                onCustomTextChange={txt => setCustomText(txt)}
              />
            </div>
          </div>
        </div>

        {/* CENTER — Bottle viewer (white background) */}
        <div
          style={{
            flex: 1,
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            background: '#f7f6f3',
          }}
        >
          {/* Product title top */}
          <div
            style={{
              position: 'absolute',
              top: '24px',
              left: '0',
              right: '0',
              textAlign: 'center',
              pointerEvents: 'none',
              zIndex: 5,
            }}
          >
            <div style={{ fontFamily: "'Cormorant Garant', serif", fontSize: '1.4rem', fontWeight: 400, color: '#1a1a1a', letterSpacing: '0.08em' }}>
              {selectedModel.name}
            </div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.52rem', color: '#888', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '4px' }}>
              {selectedSize.label} · {selectedLabel.name}
            </div>
          </div>

          {/* Bottle image */}
          <div style={{ width: '100%', height: '100%', maxWidth: isSummaryStep ? '400px' : '100%' }}>
            <BottleViewer
              model={selectedModel}
              labelStyle={selectedLabel}
              customText={customText}
              size={selectedSize.label}
            />
          </div>

          {/* Model dots */}
          <div style={{ position: 'absolute', bottom: '72px', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {bottleModels.map(m => (
              <button
                key={m.id}
                onClick={() => {
                  setSelectedModel(m);
                  if (m.defaultSizeId) {
                    const ds = bottleSizes.find(s => s.id === m.defaultSizeId);
                    if (ds) setSelectedSize(ds);
                  }
                  setCurrentStep(0);
                }}
                className="cursor-pointer"
                title={m.name}
                style={{
                  width: selectedModel.id === m.id ? '28px' : '7px',
                  height: '7px',
                  borderRadius: '4px',
                  background: selectedModel.id === m.id ? '#1a1a1a' : 'rgba(0,0,0,0.18)',
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
            transition: 'none',
            borderLeft: '1px solid rgba(255,255,255,0.06)',
            background: '#1a1a1a',
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

      {/* ── BOTTOM NAV BAR ── */}
      <div
        style={{
          height: '52px',
          background: '#1a1a1a',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 0',
          flexShrink: 0,
          zIndex: 20,
        }}
      >
        <button
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="cursor-pointer flex items-center gap-2"
          style={{
            background: 'none',
            border: 'none',
            borderRight: '1px solid rgba(255,255,255,0.06)',
            height: '100%',
            padding: '0 32px',
            color: currentStep === 0 ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.55)',
            fontFamily: "'Outfit', sans-serif",
            fontSize: '0.62rem',
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => { if (currentStep > 0) (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }}
          onMouseLeave={e => { if (currentStep > 0) (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.55)'; }}
        >
          <i className="ri-arrow-left-s-line" style={{ fontSize: '16px' }} />
          {t('config_prev')}
        </button>

        {/* Center info */}
        <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.52rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', textAlign: 'center' }}>
          {currentStep + 1} / {STEPS.length}
        </div>

        <button
          onClick={handleNext}
          disabled={isSummaryStep}
          className="cursor-pointer flex items-center gap-2"
          style={{
            background: isSummaryStep ? 'none' : '#d4af37',
            border: 'none',
            borderLeft: '1px solid rgba(255,255,255,0.06)',
            height: '100%',
            padding: '0 32px',
            color: isSummaryStep ? 'rgba(255,255,255,0.15)' : '#1a1a0e',
            fontFamily: "'Outfit', sans-serif",
            fontSize: '0.62rem',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            cursor: isSummaryStep ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s, color 0.2s',
          }}
          onMouseEnter={e => { if (!isSummaryStep) (e.currentTarget as HTMLButtonElement).style.background = '#c9a52e'; }}
          onMouseLeave={e => { if (!isSummaryStep) (e.currentTarget as HTMLButtonElement).style.background = '#d4af37'; }}
        >
          {currentStep === STEPS.length - 2 ? t('config_see_recap') : t('config_next')}
          <i className="ri-arrow-right-s-line" style={{ fontSize: '16px' }} />
        </button>
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
