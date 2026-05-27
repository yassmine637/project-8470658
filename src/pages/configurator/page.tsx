import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { bottleModels, bottleSizes, labelStyles, packagingOptions, getPackagingsBySize } from '@/mocks/configurator';
import type { BottleModel, BottleSize, LabelStyle, PackagingOption } from '@/mocks/configurator';
import BottleViewer from './components/BottleViewer';
import ConfigPanel from './components/ConfigPanel';
import ConfigSummary from './components/ConfigSummary';
import OrderConfirmModal from './components/OrderConfirmModal';
import EstimationModal from './components/EstimationModal';
import { useCurrency, CURRENCIES } from '@/hooks/useCurrency';
import type { Currency } from '@/hooks/useCurrency';

const FEATURED_CURRENCIES: Currency[] = ['TND', 'EUR', 'USD', 'GBP', 'CHF', 'SAR', 'AED'];

export default function ConfiguratorPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedModel, setSelectedModel] = useState<BottleModel>(bottleModels[0]);
  const [modelChosen, setModelChosen] = useState(true);
  const [selectedSize, setSelectedSize] = useState<BottleSize>(bottleSizes[0]);
  const [sizeChosen, setSizeChosen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<LabelStyle | null>(null);
  const [selectedPackaging, setSelectedPackaging] = useState<PackagingOption>(packagingOptions[0]);
  const availablePackagings = getPackagingsBySize(selectedSize.id);
  const [customText, setCustomText] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [estimationOpen, setEstimationOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mobileShowViewer, setMobileShowViewer] = useState(false);
  const { currency, setCurrency, currencyInfo, format: fmtCurrency } = useCurrency('TND');
  const [currencyDropOpen, setCurrencyDropOpen] = useState(false);
  const currencyDropRef = useRef<HTMLDivElement>(null);
  const configCurrencySymbol = currencyInfo.code === 'TND' ? 'TND' : currencyInfo.symbol;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (currencyDropRef.current && !currencyDropRef.current.contains(e.target as Node)) {
        setCurrencyDropOpen(false);
      }
    };
    if (currencyDropOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [currencyDropOpen]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const STEPS = [
    { id: 'model', label: t('config_step_model'), icon: 'ri-flask-line', desc: t('config_step_desc_model') },
    { id: 'size', label: t('config_step_size'), icon: 'ri-scales-line', desc: t('config_step_desc_size') },
    { id: 'label', label: t('config_step_label'), icon: 'ri-palette-line', desc: t('config_step_desc_label') },
    { id: 'packaging', label: t('config_step_packaging'), icon: 'ri-gift-line', desc: t('config_step_desc_packaging') },
    { id: 'text', label: t('config_step_text'), icon: 'ri-quill-pen-line', desc: t('config_step_desc_text') },
    { id: 'summary', label: t('config_step_summary'), icon: 'ri-file-list-3-line', desc: t('config_step_desc_summary') },
  ];

  useEffect(() => {
    bottleModels.forEach(m => {
      const img = new Image();
      img.src = m.image;
    });
  }, []);

  const totalPrice = selectedModel.basePrice + selectedSize.priceAdd + (selectedLabel?.priceAdd ?? 0) + (selectedPackaging?.priceAdd ?? 0);
  const [stepError, setStepError] = useState<string | null>(null);

  const canProceedFrom = (step: number): boolean => {
    switch (step) {
      case 0: return modelChosen;
      case 1: return sizeChosen;
      case 2: return selectedLabel !== null;
      default: return true;
    }
  };

  const stepErrorMsg = (step: number): string => {
    switch (step) {
      case 0: return t('config_error_model') || 'Veuillez sélectionner un modèle de bouteille.';
      case 1: return t('config_error_size') || 'Veuillez sélectionner un volume.';
      case 2: return t('config_error_label') || 'Veuillez choisir une étiquette.';
      default: return '';
    }
  };

  const handleNext = () => {
    if (!canProceedFrom(currentStep)) {
      setStepError(stepErrorMsg(currentStep));
      setTimeout(() => setStepError(null), 3000);
      return;
    }
    setStepError(null);
    if (currentStep < STEPS.length - 1) setCurrentStep(s => s + 1);
  };

  const handlePrev = () => { setStepError(null); if (currentStep > 0) setCurrentStep(s => s - 1); };
  const isSummaryStep = currentStep === STEPS.length - 1;

  // Max step the user is allowed to jump to directly
  const maxAllowedStep = (() => {
    for (let i = 0; i < STEPS.length - 1; i++) {
      if (!canProceedFrom(i)) return i;
    }
    return STEPS.length - 1;
  })();

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
        zoom: 0.85,
      }}
    >
      {/* ── TOP BAR ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          height: '72px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          background: '#1a1a1a',
          flexShrink: 0,
          padding: '0 28px',
          gap: '20px',
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
          {isAr ? (
            <span style={{ fontFamily: "'Cairo', sans-serif", fontSize: '1.1rem', fontWeight: 700, color: '#d4af37', letterSpacing: '0.1em' }}>
              ضيعة فندري
            </span>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, gap: 1 }}>
              <span style={{ fontFamily: "'Cormorant Garant', serif", fontSize: '0.45rem', letterSpacing: '0.45em', color: '#c9a84c', fontWeight: 600, textTransform: 'uppercase' }}>
                {i18n.language === 'en' ? 'Estate' : 'Domaine'}
              </span>
              <span style={{ fontFamily: "'Cormorant Garant', serif", fontSize: '1.3rem', fontWeight: 700, color: '#d4af37', letterSpacing: '0.18em', lineHeight: 1 }}>
                FENDRI
              </span>
            </div>
          )}
        </div>

        {/* Step tabs — centered */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-0">
          {STEPS.map((step, i) => {
            const isActive = i === currentStep;
            const isDone = i < currentStep;
            const isLocked = i > maxAllowedStep;
            return (
              <button
                key={step.id}
                onClick={() => { if (!isLocked) { setStepError(null); setCurrentStep(i); } }}
                className="cursor-pointer flex items-center gap-2 whitespace-nowrap relative"
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive ? '2px solid #d4af37' : '2px solid transparent',
                  padding: '0 32px',
                  height: '72px',
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 700 : 400,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: isActive ? '#d4af37' : isDone ? 'rgba(255,255,255,0.55)' : isLocked ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.28)',
                  cursor: isLocked ? 'not-allowed' : 'pointer',
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

        {/* Currency selector */}
        <div ref={currencyDropRef} style={{ position: 'relative', flexShrink: 0 }}>
          <button
            type="button"
            onClick={() => setCurrencyDropOpen(v => !v)}
            className="cursor-pointer flex items-center gap-1.5"
            style={{
              background: currencyDropOpen ? 'rgba(212,175,55,0.12)' : 'rgba(212,175,55,0.06)',
              border: '1px solid rgba(212,175,55,0.28)',
              borderRadius: '7px',
              padding: '6px 10px',
              color: '#d4af37',
              fontFamily: "'Outfit', sans-serif",
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              transition: 'all 0.2s',
              outline: 'none',
            }}
          >
            <span style={{ fontSize: '0.95rem' }}>{currencyInfo.flag}</span>
            <span>{currencyInfo.code}</span>
            <i className={currencyDropOpen ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} style={{ fontSize: '13px', opacity: 0.6 }} />
          </button>

          {currencyDropOpen && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              right: 0,
              zIndex: 300,
              background: '#1a1a1a',
              border: '1px solid rgba(212,175,55,0.22)',
              borderRadius: '10px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.55)',
              overflow: 'hidden',
              minWidth: '150px',
            }}>
              {FEATURED_CURRENCIES.map((code, idx) => {
                const c = CURRENCIES[code];
                const isActive = code === currency;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => { setCurrency(code); setCurrencyDropOpen(false); }}
                    className="cursor-pointer w-full flex items-center gap-2"
                    style={{
                      padding: '9px 14px',
                      background: isActive ? 'rgba(212,175,55,0.1)' : 'transparent',
                      border: 'none',
                      borderBottom: idx < FEATURED_CURRENCIES.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                      color: isActive ? '#d4af37' : 'rgba(255,255,255,0.75)',
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: '0.75rem',
                      fontWeight: isActive ? 700 : 400,
                      textAlign: 'left',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; }}
                    onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                  >
                    <span style={{ fontSize: '0.95rem' }}>{c.flag}</span>
                    <span style={{ flex: 1 }}>{c.code}</span>
                    {c.symbol !== c.code && <span style={{ opacity: 0.4, fontSize: '0.65rem' }}>{c.symbol}</span>}
                    {isActive && <i className="ri-check-line" style={{ fontSize: '11px' }} />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>

        {/* LEFT PANEL */}
        <div
          style={{
            width: isMobile
              ? (isSummaryStep || mobileShowViewer ? '0' : '100%')
              : (isSummaryStep || !panelOpen ? '0' : '620px'),
            minWidth: isMobile
              ? (isSummaryStep || mobileShowViewer ? '0' : '100%')
              : (isSummaryStep || !panelOpen ? '0' : '620px'),
            overflow: 'hidden',
            transition: 'width 0.32s ease, min-width 0.32s ease',
            borderRight: '1px solid rgba(255,255,255,0.06)',
            background: '#1a1a1a',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ width: isMobile ? '100vw' : '620px', height: '100%', display: 'flex', flexDirection: 'column' }}>

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
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.95rem', fontWeight: 700, letterSpacing: '0.22em', color: '#d4af37', textTransform: 'uppercase' }}>
                    {STEPS[currentStep]?.label}
                  </div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.8rem', color: 'rgba(255,255,255,0.25)', marginTop: '3px' }}>
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
                packagings={availablePackagings}
                selectedModel={selectedModel}
                modelChosen={modelChosen}
                selectedSize={selectedSize}
                sizeChosen={sizeChosen}
                selectedLabel={selectedLabel}
                selectedPackaging={selectedPackaging}
                customText={customText}
                formatPrice={fmtCurrency}
                currencySymbol={configCurrencySymbol}
                onModelChange={m => {
                  setSelectedModel(m);
                  setModelChosen(true);
                  setSizeChosen(false);
                  if (m.defaultSizeId) {
                    const ds = bottleSizes.find(s => s.id === m.defaultSizeId);
                    if (ds) setSelectedSize(ds);
                  }
                }}
                onSizeChange={s => {
                  setSelectedSize(s);
                  setSizeChosen(true);
                  const compatible = getPackagingsBySize(s.id);
                  if (!compatible.find(p => p.id === selectedPackaging.id)) {
                    setSelectedPackaging(packagingOptions[0]);
                  }
                }}
                onLabelChange={l => setSelectedLabel(l)}
                onPackagingChange={p => setSelectedPackaging(p)}
                onCustomTextChange={txt => setCustomText(txt)}
                onValidate={handleNext}
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
          {/* Bottle image */}
          <div style={{ width: '100%', height: '100%' }}>
            {(!modelChosen && currentStep === 0) ? (
              <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
              }}>
                <div style={{
                  width: '80px',
                  height: '160px',
                  borderRadius: '8px 8px 6px 6px',
                  border: '2px dashed rgba(0,0,0,0.12)',
                  background: 'rgba(0,0,0,0.03)',
                }} />
                <span style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '0.7rem',
                  color: 'rgba(0,0,0,0.3)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}>
                  {currentStep === 1 ? t('config_select_size') : t('config_select_bottle')}
                </span>
              </div>
            ) : (
              <BottleViewer
                model={selectedModel}
                labelStyle={selectedLabel}
                customText={customText}
                size={selectedSize.label}
                sizeId={selectedSize.id}
                sizeChosen={sizeChosen}
                currentStep={currentStep}
                packaging={selectedPackaging}
              />
            )}
          </div>

          {/* Mobile toggle button — show panel */}
          {isMobile && mobileShowViewer && !isSummaryStep && (
            <button
              onClick={() => setMobileShowViewer(false)}
              style={{
                position: 'absolute',
                top: '12px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#1a1a1a',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '20px',
                padding: '7px 18px',
                color: '#d4af37',
                fontFamily: "'Outfit', sans-serif",
                fontSize: '0.65rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                zIndex: 10,
              }}
            >
              <i className="ri-arrow-left-s-line" />
              {t('config_step_model')}
            </button>
          )}

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
              packaging={selectedPackaging}
              customText={customText}
              totalPrice={totalPrice}
              quantity={quantity}
              onQuantityChange={setQuantity}
              formatPrice={fmtCurrency}
              currencySymbol={configCurrencySymbol}
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
        {!isSummaryStep && (
          <button
            onClick={() => isMobile ? setMobileShowViewer(v => !v) : setPanelOpen(o => !o)}
            className="cursor-pointer flex items-center gap-2"
            title={isMobile
              ? (mobileShowViewer ? t('config_mobile_back') : t('config_mobile_viewer'))
              : (panelOpen ? t('config_panel_hide') : t('config_panel_show'))}
            style={{
              background: 'none',
              border: 'none',
              borderRight: '1px solid rgba(255,255,255,0.06)',
              height: '100%',
              padding: '0 18px',
              color: '#d4af37',
              fontFamily: "'Outfit', sans-serif",
              fontSize: '0.62rem',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'color 0.2s, background 0.2s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(212,175,55,0.06)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}
          >
            <i
              className={isMobile
                ? (mobileShowViewer ? 'ri-list-check-2' : 'ri-eye-line')
                : (panelOpen ? 'ri-side-bar-line' : 'ri-side-bar-fill')}
              style={{ fontSize: '16px' }}
            />
            {isMobile && (
              <span style={{ fontSize: '0.58rem' }}>
                {mobileShowViewer ? 'Options' : 'Aperçu'}
              </span>
            )}
          </button>
        )}

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

        {/* Center info / error */}
        <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.62rem', letterSpacing: '0.1em', textAlign: 'center', transition: 'all 0.3s' }}>
          {stepError ? (
            <span style={{ color: '#e07070', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="ri-error-warning-line" style={{ fontSize: '14px' }} />
              {stepError}
            </span>
          ) : (
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>{currentStep + 1} / {STEPS.length}</span>
          )}
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
        quantity={quantity}
        currency={currency}
        onClose={() => setEstimationOpen(false)}
      />
    </div>
  );
}
