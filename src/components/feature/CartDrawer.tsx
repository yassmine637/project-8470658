import { useState, useEffect, useRef, FormEvent, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { CURRENCIES } from '@/hooks/useCurrency';
import type { Currency } from '@/hooks/useCurrency';
import { useCurrencyCtx } from '@/context/CurrencyContext';
import { getCitiesForCountry } from '@/data/cities';

function QuantityInput({
  productId,
  quantity,
  stock,
  onUpdate,
}: {
  productId: string;
  quantity: number;
  stock: number;
  onUpdate: (id: string, qty: number) => void;
}) {
  const { t } = useTranslation();
  const [raw, setRaw] = useState(String(quantity));
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!focused) setRaw(String(quantity));
  }, [quantity, focused]);

  const parsed = parseInt(raw, 10);
  const isEmpty = raw.trim() === '';
  const isOverStock = !isEmpty && !isNaN(parsed) && parsed > stock;
  const isUnderMin = !isEmpty && !isNaN(parsed) && parsed < 1;
  const isInvalid = isEmpty || isNaN(parsed) || isOverStock || isUnderMin;

  const commit = useCallback(() => {
    const v = parseInt(raw, 10);
    if (isNaN(v) || v < 1) {
      onUpdate(productId, 1);
      setRaw('1');
    } else if (v > stock) {
      onUpdate(productId, stock);
      setRaw(String(stock));
    } else {
      onUpdate(productId, v);
      setRaw(String(v));
    }
  }, [raw, stock, productId, onUpdate]);

  const borderColor = focused
    ? isOverStock ? '#e53935' : isUnderMin ? '#e53935' : '#a07a20'
    : isOverStock ? '#e5393580' : '#c9a84c';

  const bgColor = focused
    ? isOverStock ? '#fff5f5' : '#fffdf5'
    : '#fff';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          border: `2px solid ${borderColor}`,
          borderRadius: 8,
          background: bgColor,
          boxShadow: isOverStock ? '0 1px 4px rgba(229,57,53,0.15)' : '0 1px 4px rgba(201,168,76,0.15)',
          transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
        }}
      >
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          value={raw}
          onChange={(e) => {
            const val = e.target.value.replace(/[^0-9]/g, '');
            setRaw(val === '' ? '' : val);
          }}
          onFocus={(e) => {
            setFocused(true);
            e.currentTarget.select();
          }}
          onBlur={() => {
            setFocused(false);
            commit();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.currentTarget.blur();
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              const next = Math.min(stock, (parseInt(raw, 10) || 0) + 1);
              setRaw(String(next));
              onUpdate(productId, next);
            } else if (e.key === 'ArrowDown') {
              e.preventDefault();
              const next = Math.max(1, (parseInt(raw, 10) || 2) - 1);
              setRaw(String(next));
              onUpdate(productId, next);
            }
          }}
          className="text-center font-bold outline-none"
          style={{
            width: 46,
            height: 30,
            border: 'none',
            background: 'transparent',
            color: isOverStock ? '#e53935' : '#1a2617',
            fontFamily: "'Outfit', sans-serif",
            fontSize: '0.9rem',
            cursor: 'text',
            paddingRight: 14,
            transition: 'color 0.2s',
          }}
        />
        <i
          className={isOverStock ? 'ri-error-warning-line' : 'ri-pencil-line'}
          style={{
            position: 'absolute',
            right: 4,
            top: '50%',
            transform: 'translateY(-50%)',
            color: isOverStock ? '#e53935' : '#c9a84c',
            fontSize: '0.65rem',
            pointerEvents: 'none',
            transition: 'color 0.2s',
          }}
        />
      </div>

      {isOverStock && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            animation: 'fadeInDown 0.2s ease',
          }}
        >
          <i className="ri-close-circle-fill" style={{ color: '#e53935', fontSize: '0.6rem', flexShrink: 0 }} />
          <span style={{
            color: '#e53935',
            fontFamily: "'Outfit', sans-serif",
            fontSize: '0.6rem',
            fontWeight: 600,
            letterSpacing: '0.03em',
            whiteSpace: 'nowrap',
          }}>
            {t('cart_max_stock', { stock })}
          </span>
        </div>
      )}

      {!isOverStock && !isInvalid && focused && stock <= 30 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <i className="ri-error-warning-line" style={{ color: '#b8750a', fontSize: '0.6rem', flexShrink: 0 }} />
          <span style={{
            color: '#b8750a',
            fontFamily: "'Outfit', sans-serif",
            fontSize: '0.6rem',
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}>
            {t('cart_stock_remaining', { stock })}
          </span>
        </div>
      )}
    </div>
  );
}

const COUNTRY_ISO: Record<string, string> = {
  'Tunisie': 'tn', 'France': 'fr', 'Belgique': 'be', 'Suisse': 'ch', 'Allemagne': 'de',
  'Royaume-Uni': 'gb', 'Italie': 'it', 'Espagne': 'es', 'Pays-Bas': 'nl', 'Portugal': 'pt',
  'Autriche': 'at', 'Luxembourg': 'lu', 'Irlande': 'ie', 'Grèce': 'gr', 'Suède': 'se',
  'Norvège': 'no', 'Danemark': 'dk', 'Finlande': 'fi', 'Pologne': 'pl', 'Tchéquie': 'cz',
  'Hongrie': 'hu', 'Roumanie': 'ro', 'Maroc': 'ma', 'Algérie': 'dz', 'Libye': 'ly',
  'Égypte': 'eg', 'Soudan': 'sd', 'Yémen': 'ye', 'Arabie Saoudite': 'sa',
  'Émirats Arabes Unis': 'ae', 'Qatar': 'qa', 'Koweït': 'kw', 'Bahreïn': 'bh',
  'Oman': 'om', 'Jordanie': 'jo', 'Liban': 'lb', 'Syrie': 'sy', 'Irak': 'iq',
  'Palestine': 'ps', 'États-Unis': 'us', 'Canada': 'ca', 'Australie': 'au',
};

interface NominatimResult {
  place_id: number;
  display_name: string;
  address: {
    road?: string;
    house_number?: string;
    city?: string;
    town?: string;
    village?: string;
    suburb?: string;
    postcode?: string;
    neighbourhood?: string;
  };
}

function StreetAutocomplete({
  countryName,
  value,
  onChange,
  onCityChange,
  onPostalChange,
  inputStyle,
  placeholder,
}: {
  countryName: string;
  value: string;
  onChange: (street: string) => void;
  onCityChange: (city: string) => void;
  onPostalChange: (postal: string) => void;
  inputStyle: React.CSSProperties;
  placeholder: string;
}) {
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const search = useCallback((query: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (abortRef.current) abortRef.current.abort();
    if (query.trim().length < 3) { setSuggestions([]); setOpen(false); return; }

    timerRef.current = setTimeout(async () => {
      setLoading(true);
      abortRef.current = new AbortController();
      const iso = COUNTRY_ISO[countryName];
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=6&addressdetails=1${iso ? `&countrycodes=${iso}` : ''}`;
      try {
        const res = await fetch(url, {
          signal: abortRef.current.signal,
          headers: { 'Accept-Language': 'fr' },
        });
        const data: NominatimResult[] = await res.json();
        setSuggestions(data);
        setOpen(data.length > 0);
      } catch {
        // aborted or network error
      } finally {
        setLoading(false);
      }
    }, 350);
  }, [countryName]);

  const handleSelect = (result: NominatimResult) => {
    const addr = result.address;
    const road = [addr.house_number, addr.road].filter(Boolean).join(' ');
    const street = road || result.display_name.split(',')[0].trim();
    onChange(street);
    const city = addr.city || addr.town || addr.village || addr.suburb || addr.neighbourhood || '';
    if (city) onCityChange(city);
    if (addr.postcode) onPostalChange(addr.postcode.replace(/\s/g, '').slice(0, 10));
    setSuggestions([]);
    setOpen(false);
  };

  return (
    <div ref={dropRef} style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <input
          name="street"
          type="text"
          placeholder={placeholder}
          value={value}
          autoComplete="off"
          onChange={e => { onChange(e.target.value); search(e.target.value); }}
          onFocus={() => { if (suggestions.length > 0) setOpen(true); }}
          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
          style={{ ...inputStyle, paddingRight: '36px', borderColor: open ? '#c9a84c' : (value ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.1)') }}
        />
        <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
          {loading
            ? <i className="ri-loader-4-line" style={{ color: '#c9a84c', fontSize: '14px', animation: 'spin 0.8s linear infinite' }} />
            : <i className="ri-search-line" style={{ color: '#9aaa96', fontSize: '13px' }} />
          }
        </div>
      </div>

      {open && suggestions.length > 0 && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 350,
          maxHeight: '220px', overflowY: 'auto',
          background: '#ffffff', border: '1.5px solid rgba(201,168,76,0.35)',
          borderRadius: '12px', boxShadow: '0 16px 40px rgba(0,0,0,0.14)',
          scrollbarWidth: 'thin',
        }}>
          {suggestions.map((s, idx) => {
            const addr = s.address;
            const road = [addr.house_number, addr.road].filter(Boolean).join(' ');
            const city = addr.city || addr.town || addr.village || addr.suburb || '';
            const main = road || s.display_name.split(',')[0].trim();
            const sub = [city, addr.postcode].filter(Boolean).join(' · ');
            return (
              <button
                key={s.place_id}
                type="button"
                onMouseDown={e => { e.preventDefault(); handleSelect(s); }}
                className="cursor-pointer w-full flex items-start gap-2.5"
                style={{
                  padding: '10px 14px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: idx < suggestions.length - 1 ? '1px solid #f3f3f0' : 'none',
                  color: '#1a2617',
                  fontFamily: "'Outfit', sans-serif",
                  textAlign: 'left',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(201,168,76,0.05)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
              >
                <i className="ri-map-pin-2-line" style={{ color: '#c9a84c', fontSize: '13px', flexShrink: 0, marginTop: '2px' }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1a2617', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{main}</div>
                  {sub && <div style={{ fontSize: '0.68rem', color: '#9aaa96', marginTop: '1px' }}>{sub}</div>}
                </div>
              </button>
            );
          })}
          <div style={{ padding: '5px 10px', borderTop: '1px solid #f3f3f0', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
            <img src="https://nominatim.openstreetmap.org/ui/mapicons/nominatim-logo-32.png" alt="" style={{ height: '10px', opacity: 0.4 }} onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.55rem', color: '#c4c4b8' }}>© OpenStreetMap</span>
          </div>
        </div>
      )}
    </div>
  );
}

function CityCombobox({
  countryName,
  value,
  onChange,
  inputStyle,
}: {
  countryName: string;
  value: string;
  onChange: (city: string) => void;
  inputStyle: React.CSSProperties;
}) {
  const cities = getCitiesForCountry(countryName);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const dropRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setQuery(value); }, [value]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const filtered = cities.length > 0
    ? cities.filter(c => c.toLowerCase().includes(query.toLowerCase()))
    : [];

  const handleSelect = (city: string) => {
    setQuery(city);
    onChange(city);
    setOpen(false);
  };

  if (cities.length === 0) {
    return (
      <input
        name="city"
        type="text"
        placeholder="Votre ville"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
        style={inputStyle}
        onFocus={e => { (e.currentTarget as HTMLInputElement).style.borderColor = '#c9a84c'; }}
        onBlur={e => { (e.currentTarget as HTMLInputElement).style.borderColor = 'rgba(0,0,0,0.1)'; }}
      />
    );
  }

  return (
    <div ref={dropRef} style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          name="city"
          type="text"
          placeholder="Rechercher votre ville..."
          value={query}
          autoComplete="off"
          onChange={e => {
            setQuery(e.target.value);
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
          style={{ ...inputStyle, paddingRight: '36px', borderColor: open ? '#c9a84c' : (value ? '#4a7c4e' : 'rgba(0,0,0,0.1)') }}
        />
        <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
          {value && !open
            ? <i className="ri-check-line" style={{ color: '#4a7c4e', fontSize: '14px' }} />
            : <i className="ri-arrow-down-s-line" style={{ color: '#9aaa96', fontSize: '16px' }} />
          }
        </div>
      </div>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 350,
          maxHeight: '200px', overflowY: 'auto',
          background: '#ffffff', border: '1.5px solid rgba(201,168,76,0.35)',
          borderRadius: '12px', boxShadow: '0 16px 40px rgba(0,0,0,0.14)',
          scrollbarWidth: 'thin',
        }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '12px 16px', fontFamily: "'Outfit', sans-serif", fontSize: '0.78rem', color: '#9aaa96', textAlign: 'center' }}>
              Aucune ville trouvée — saisissez librement
            </div>
          ) : (
            filtered.slice(0, 60).map((city, idx) => (
              <button
                key={city}
                type="button"
                onMouseDown={e => { e.preventDefault(); handleSelect(city); }}
                className="cursor-pointer w-full flex items-center gap-2.5"
                style={{
                  padding: '9px 14px',
                  background: value === city ? 'rgba(201,168,76,0.09)' : 'transparent',
                  border: 'none',
                  borderBottom: idx < filtered.slice(0, 60).length - 1 ? '1px solid #f3f3f0' : 'none',
                  color: value === city ? '#c9a84c' : '#1a2617',
                  fontFamily: "'Outfit', sans-serif", fontSize: '0.8rem',
                  textAlign: 'left', fontWeight: value === city ? 700 : 400,
                }}
                onMouseEnter={e => { if (value !== city) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(201,168,76,0.05)'; }}
                onMouseLeave={e => { if (value !== city) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
              >
                <i className="ri-map-pin-2-line" style={{ color: '#c9a84c', fontSize: '12px', flexShrink: 0 }} />
                <span>{city}</span>
                {value === city && <i className="ri-check-line" style={{ marginLeft: 'auto', color: '#c9a84c', fontSize: '12px' }} />}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

type Step = 'cart' | 'checkout' | 'success';

const FEATURED_CURRENCIES: Currency[] = ['TND', 'EUR', 'USD', 'GBP', 'CHF', 'SAR', 'AED'];

// French country name → currency
const FR_COUNTRY_CURRENCY: Record<string, Currency> = {
  'Tunisie': 'TND',
  'France': 'EUR', 'Belgique': 'EUR', 'Allemagne': 'EUR', 'Italie': 'EUR',
  'Espagne': 'EUR', 'Pays-Bas': 'EUR', 'Portugal': 'EUR', 'Autriche': 'EUR',
  'Luxembourg': 'EUR', 'Irlande': 'EUR', 'Grèce': 'EUR', 'Finlande': 'EUR',
  'Suisse': 'CHF',
  'Royaume-Uni': 'GBP',
  'États-Unis': 'USD', 'Jordanie': 'USD', 'Liban': 'USD', 'Libye': 'USD', 'Égypte': 'USD',
  'Canada': 'CAD',
  'Australie': 'AUD',
  'Arabie Saoudite': 'SAR',
  'Émirats Arabes Unis': 'AED', 'Qatar': 'AED', 'Koweït': 'AED', 'Bahreïn': 'AED', 'Oman': 'AED',
  'Maroc': 'EUR', 'Algérie': 'EUR',
};

// Pays par défaut à sélectionner quand la devise change depuis le header
const CURRENCY_DEFAULT_COUNTRY: Partial<Record<Currency, string>> = {
  'TND': 'Tunisie',
  'EUR': 'France',
  'CHF': 'Suisse',
  'GBP': 'Royaume-Uni',
  'USD': 'États-Unis',
  'CAD': 'Canada',
  'AUD': 'Australie',
  'SAR': 'Arabie Saoudite',
  'AED': 'Émirats Arabes Unis',
};

// postalLen: exact digits required (0 = optional, no standard); postalAlpha: alphanumeric code
const COUNTRY_CODES = [
  // ── Tunisie ──
  { code: '+216', flag: '🇹🇳', name: 'Tunisie', digits: 8, postalLen: 4, postalAlpha: false, postalExample: '1000' },
  // ── Pays arabes du Golfe ──
  { code: '+966', flag: '🇸🇦', name: 'Arabie Saoudite', digits: 9, postalLen: 5, postalAlpha: false, postalExample: '12345' },
  { code: '+971', flag: '🇦🇪', name: 'Émirats Arabes Unis', digits: 9, postalLen: 0, postalAlpha: false, postalExample: '' },
  { code: '+974', flag: '🇶🇦', name: 'Qatar', digits: 8, postalLen: 0, postalAlpha: false, postalExample: '' },
  { code: '+965', flag: '🇰🇼', name: 'Koweït', digits: 8, postalLen: 5, postalAlpha: false, postalExample: '13001' },
  { code: '+973', flag: '🇧🇭', name: 'Bahreïn', digits: 8, postalLen: 3, postalAlpha: false, postalExample: '101' },
  { code: '+968', flag: '🇴🇲', name: 'Oman', digits: 8, postalLen: 3, postalAlpha: false, postalExample: '100' },
  // ── Pays arabes du Levant & Afrique du Nord ──
  { code: '+962', flag: '🇯🇴', name: 'Jordanie', digits: 9, postalLen: 5, postalAlpha: false, postalExample: '11110' },
  { code: '+961', flag: '🇱🇧', name: 'Liban', digits: 8, postalLen: 0, postalAlpha: false, postalExample: '' },
  { code: '+963', flag: '🇸🇾', name: 'Syrie', digits: 9, postalLen: 0, postalAlpha: false, postalExample: '' },
  { code: '+964', flag: '🇮🇶', name: 'Irak', digits: 10, postalLen: 5, postalAlpha: false, postalExample: '10001' },
  { code: '+970', flag: '🇵🇸', name: 'Palestine', digits: 9, postalLen: 3, postalAlpha: false, postalExample: '100' },
  { code: '+20', flag: '🇪🇬', name: 'Égypte', digits: 10, postalLen: 5, postalAlpha: false, postalExample: '11311' },
  { code: '+218', flag: '🇱🇾', name: 'Libye', digits: 9, postalLen: 0, postalAlpha: false, postalExample: '' },
  { code: '+212', flag: '🇲🇦', name: 'Maroc', digits: 9, postalLen: 5, postalAlpha: false, postalExample: '20000' },
  { code: '+213', flag: '🇩🇿', name: 'Algérie', digits: 9, postalLen: 5, postalAlpha: false, postalExample: '16000' },
  { code: '+249', flag: '🇸🇩', name: 'Soudan', digits: 9, postalLen: 5, postalAlpha: false, postalExample: '11111' },
  { code: '+967', flag: '🇾🇪', name: 'Yémen', digits: 9, postalLen: 0, postalAlpha: false, postalExample: '' },
  // ── Europe de l'Ouest ──
  { code: '+33', flag: '🇫🇷', name: 'France', digits: 9, postalLen: 5, postalAlpha: false, postalExample: '75001' },
  { code: '+32', flag: '🇧🇪', name: 'Belgique', digits: 9, postalLen: 4, postalAlpha: false, postalExample: '1000' },
  { code: '+41', flag: '🇨🇭', name: 'Suisse', digits: 9, postalLen: 4, postalAlpha: false, postalExample: '1200' },
  { code: '+49', flag: '🇩🇪', name: 'Allemagne', digits: 11, postalLen: 5, postalAlpha: false, postalExample: '10115' },
  { code: '+44', flag: '🇬🇧', name: 'Royaume-Uni', digits: 10, postalLen: 7, postalAlpha: true, postalExample: 'SW1A 1AA' },
  { code: '+39', flag: '🇮🇹', name: 'Italie', digits: 10, postalLen: 5, postalAlpha: false, postalExample: '00100' },
  { code: '+34', flag: '🇪🇸', name: 'Espagne', digits: 9, postalLen: 5, postalAlpha: false, postalExample: '28001' },
  { code: '+31', flag: '🇳🇱', name: 'Pays-Bas', digits: 9, postalLen: 6, postalAlpha: true, postalExample: '1234AB' },
  { code: '+351', flag: '🇵🇹', name: 'Portugal', digits: 9, postalLen: 7, postalAlpha: true, postalExample: '1000001' },
  { code: '+43', flag: '🇦🇹', name: 'Autriche', digits: 10, postalLen: 4, postalAlpha: false, postalExample: '1010' },
  { code: '+352', flag: '🇱🇺', name: 'Luxembourg', digits: 9, postalLen: 4, postalAlpha: false, postalExample: '1234' },
  { code: '+353', flag: '🇮🇪', name: 'Irlande', digits: 9, postalLen: 7, postalAlpha: true, postalExample: 'D02YX25' },
  { code: '+30', flag: '🇬🇷', name: 'Grèce', digits: 10, postalLen: 5, postalAlpha: false, postalExample: '11521' },
  // ── Europe du Nord ──
  { code: '+46', flag: '🇸🇪', name: 'Suède', digits: 9, postalLen: 5, postalAlpha: false, postalExample: '11120' },
  { code: '+47', flag: '🇳🇴', name: 'Norvège', digits: 8, postalLen: 4, postalAlpha: false, postalExample: '0150' },
  { code: '+45', flag: '🇩🇰', name: 'Danemark', digits: 8, postalLen: 4, postalAlpha: false, postalExample: '1050' },
  { code: '+358', flag: '🇫🇮', name: 'Finlande', digits: 9, postalLen: 5, postalAlpha: false, postalExample: '00100' },
  // ── Europe de l'Est ──
  { code: '+48', flag: '🇵🇱', name: 'Pologne', digits: 9, postalLen: 5, postalAlpha: false, postalExample: '00001' },
  { code: '+420', flag: '🇨🇿', name: 'Tchéquie', digits: 9, postalLen: 5, postalAlpha: false, postalExample: '11000' },
  { code: '+36', flag: '🇭🇺', name: 'Hongrie', digits: 9, postalLen: 4, postalAlpha: false, postalExample: '1011' },
  { code: '+40', flag: '🇷🇴', name: 'Roumanie', digits: 10, postalLen: 6, postalAlpha: false, postalExample: '011111' },
  // ── Autres ──
  { code: '+1', flag: '🇺🇸', name: 'États-Unis', digits: 10, postalLen: 5, postalAlpha: false, postalExample: '90210' },
  { code: '+1', flag: '🇨🇦', name: 'Canada', digits: 10, postalLen: 6, postalAlpha: true, postalExample: 'K1A0A9' },
  { code: '+61', flag: '🇦🇺', name: 'Australie', digits: 9, postalLen: 4, postalAlpha: false, postalExample: '2000' },
];

const ARAB_COUNTRIES = new Set([
  'Arabie Saoudite','Émirats Arabes Unis','Qatar','Koweït','Bahreïn','Oman',
  'Jordanie','Liban','Syrie','Irak','Palestine','Égypte','Libye','Maroc','Algérie','Soudan','Yémen',
]);
const EU_COUNTRIES = new Set([
  'France','Belgique','Suisse','Allemagne','Royaume-Uni','Italie','Espagne',
  'Pays-Bas','Portugal','Autriche','Luxembourg','Irlande','Grèce',
  'Suède','Norvège','Danemark','Finlande','Pologne','Tchéquie','Hongrie','Roumanie',
]);
const getShippingCostTND = (name: string): number => {
  if (name === 'Tunisie') return 7;
  if (ARAB_COUNTRIES.has(name)) return 25;
  if (EU_COUNTRIES.has(name)) return 35;
  return 50;
};

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, totalPrice, totalCount, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const PRODUCT_VOLUME_KEYS: Record<string, string> = {
    'bouteille-1l': 'product_bouteille_1l_volume',
    'bouteille-500ml': 'product_bouteille_500ml_volume',
    'bouteille-250ml': 'product_bouteille_750ml_volume',
    'bouteille-speciale': 'product_bidon_3l_volume',
  };
  const locName = (p: { name: string }) => lang === 'fr' ? p.name : t('product_name');
  const locVolume = (p: { id: string; volume: string }) =>
    lang === 'fr' ? p.volume : (PRODUCT_VOLUME_KEYS[p.id] ? t(PRODUCT_VOLUME_KEYS[p.id]) : p.volume);

  const [step, setStep] = useState<Step>('cart');
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'konnect' | 'paypal' | 'clicktopay'>('cod');
  const [form, setForm] = useState({ name: '', email: '', street: '', city: '', postalCode: '' });
  const [postalError, setPostalError] = useState('');
  const [formError, setFormError] = useState('');

  const [postalLen, setPostalLen] = useState(4);
  const [postalAlpha, setPostalAlpha] = useState(false);
  const [postalExample, setPostalExample] = useState('1000');

  // Currency selector (global context)
  const { currency, setCurrency, currencyInfo, format: fmtCurrency } = useCurrencyCtx();
  const [currencyDropOpen, setCurrencyDropOpen] = useState(false);
  const currencyDropRef = useRef<HTMLDivElement>(null);
  const formatPrice = (amountTND: number) => `${fmtCurrency(amountTND)} ${currencyInfo.symbol}`;

  // Phone country selector state
  const [countryCode, setCountryCode] = useState('+216');
  const [countryFlag, setCountryFlag] = useState('🇹🇳');
  const [countryName, setCountryName] = useState('Tunisie');
  const [countryDigits, setCountryDigits] = useState(8);
  // Ref pour éviter la boucle infinie pays→devise→pays
  const skipCurrencyEffectRef = useRef(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const [cartCountryDrop, setCartCountryDrop] = useState(false);
  const cartCountryDropRef = useRef<HTMLDivElement>(null);

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const discountRate = totalQuantity >= 100 ? 0.15 : totalQuantity >= 50 ? 0.10 : totalQuantity >= 10 ? 0.05 : 0;
  const discountAmount = totalPrice * discountRate;
  const discountedTotal = totalPrice - discountAmount;
  const nextTier = totalQuantity < 10 ? { qty: 10, pct: 5 } : totalQuantity < 50 ? { qty: 50, pct: 10 } : totalQuantity < 100 ? { qty: 100, pct: 15 } : null;
  const FREE_SHIPPING_THRESHOLD = 150;
  const baseShipping = items.length > 0 ? getShippingCostTND(countryName) : 0;
  const freeShippingTunisia = countryName === 'Tunisie' && discountedTotal >= FREE_SHIPPING_THRESHOLD;
  const shippingCostTND = freeShippingTunisia ? 0 : baseShipping;
  const grandTotalTND = discountedTotal + shippingCostTND;
  const remainingForFreeShipping = countryName === 'Tunisie' && !freeShippingTunisia && items.length > 0
    ? FREE_SHIPPING_THRESHOLD - discountedTotal
    : 0;
  const freeShippingProgress = countryName === 'Tunisie' && items.length > 0
    ? Math.min(100, (discountedTotal / FREE_SHIPPING_THRESHOLD) * 100)
    : 0;

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setStep('cart'), 400);
    }
  }, [isOpen]);

  useEffect(() => {
    if (step === 'success') {
      const timer = setTimeout(() => {
        closeCart();
        navigate('/');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropOpen(false);
      if (currencyDropRef.current && !currencyDropRef.current.contains(e.target as Node)) setCurrencyDropOpen(false);
      if (cartCountryDropRef.current && !cartCountryDropRef.current.contains(e.target as Node)) setCartCountryDrop(false);
    };
    if (dropOpen || currencyDropOpen || cartCountryDrop) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropOpen, currencyDropOpen]);

  const selectCountry = (c: typeof COUNTRY_CODES[number]) => {
    setCountryCode(c.code);
    setCountryFlag(c.flag);
    setCountryName(c.name);
    setCountryDigits(c.digits);
    setPostalLen(c.postalLen);
    setPostalAlpha(c.postalAlpha);
    setPostalExample(c.postalExample);
    setForm(prev => ({ ...prev, postalCode: '', city: '' }));
    setPostalError('');
    const autoC = FR_COUNTRY_CURRENCY[c.name];
    if (autoC) {
      // Marquer que le prochain changement de devise vient du pays, pas du header
      skipCurrencyEffectRef.current = true;
      setCurrency(autoC);
    }
  };

  // Quand la devise change depuis le header, mettre à jour le pays par défaut
  useEffect(() => {
    if (skipCurrencyEffectRef.current) {
      skipCurrencyEffectRef.current = false;
      return;
    }
    const defaultCountryName = CURRENCY_DEFAULT_COUNTRY[currency];
    if (!defaultCountryName) return;
    const countryData = COUNTRY_CODES.find(c => c.name === defaultCountryName);
    if (!countryData) return;
    setCountryCode(countryData.code);
    setCountryFlag(countryData.flag);
    setCountryName(countryData.name);
    setCountryDigits(countryData.digits);
    setPostalLen(countryData.postalLen);
    setPostalAlpha(countryData.postalAlpha);
    setPostalExample(countryData.postalExample);
    setForm(prev => ({ ...prev, postalCode: '' }));
    setPostalError('');
  }, [currency]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFormError('');
  };

  const buildOrderSummary = () =>
    items.map((i) => `${i.product.name} (${i.product.volume}) x${i.quantity} = ${i.product.price * i.quantity} ${t('currency_tnd') ?? 'د.ت'}`).join(' | ');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const needsGuestInfo = !user || !token;
    if (needsGuestInfo && (!form.name || !form.street || !form.city || !phoneNumber || !form.email)) {
      setFormError(t('cart_error_required'));
      return;
    }
    if (!needsGuestInfo && (!form.street || !form.city || !phoneNumber)) {
      setFormError(t('cart_error_required'));
      return;
    }
    if (phoneNumber.replace(/\D/g, '').length !== countryDigits) {
      setFormError(`Numéro invalide — ${countryDigits} chiffres requis pour ${countryName} (${countryCode})`);
      return;
    }
    if (postalLen > 0) {
      const pc = form.postalCode.trim().replace(/\s/g, '');
      const valid = postalAlpha ? pc.length >= postalLen - 1 && pc.length <= postalLen + 1 : pc.length === postalLen && /^\d+$/.test(pc);
      if (!valid) {
        setFormError(`Code postal invalide — ${postalAlpha ? `${postalLen} caractères` : `${postalLen} chiffres`} requis pour ${countryName} (ex: ${postalExample})`);
        return;
      }
    }
    setSubmitting(true);
    try {
      const orderItems = items.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        volume: i.product.volume,
        price: discountRate > 0 ? Math.round(i.product.price * (1 - discountRate) * 100) / 100 : i.product.price,
        quantity: i.quantity,
      }));
      const shippingAddress = {
        street: form.street,
        city: form.city,
        postalCode: form.postalCode,
        country: countryName,
      };
      const guestPhone = `${countryCode} ${phoneNumber}`;

      // ── Click to Pay (SMT) ──
      if (paymentMethod === 'clicktopay') {
        const ctpRes = await fetch('/api/checkout/clicktopay/init', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: orderItems,
            guestName: user ? user.name : form.name,
            guestEmail: user ? user.email : form.email,
            guestPhone: user ? '' : guestPhone,
            currency: 'TND',
            shippingAddress,
            shippingCost: shippingCostTND,
            discountRate,
            grandTotal: grandTotalTND,
          }),
        });
        const ctpData = await ctpRes.json();
        if (!ctpRes.ok) {
          setFormError(ctpData.message || 'Erreur Click to Pay');
          return;
        }
        clearCart();
        window.location.href = ctpData.payUrl;
        return;
      }

      let res: Response;
      if (user && token) {
        res = await fetch('/api/orders/authenticated', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({
            items: orderItems,
            currency: 'TND',
            shippingAddress,
            paymentMethod,
            shippingCost: shippingCostTND,
            discountRate,
            grandTotal: grandTotalTND,
          }),
        });
      } else {
        res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: orderItems,
            guestName: form.name,
            guestEmail: form.email,
            guestPhone,
            currency: 'TND',
            shippingAddress,
            paymentMethod,
            shippingCost: shippingCostTND,
            discountRate,
            grandTotal: grandTotalTND,
          }),
        });
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setFormError(data.message || t('cart_error_generic'));
        return;
      }
      setStep('success');
      clearCart();
    } catch {
      setFormError(t('cart_error_generic'));
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    background: '#ffffff',
    border: '1px solid rgba(0,0,0,0.1)',
    color: '#1a2617',
    fontFamily: "'Outfit', sans-serif",
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] transition-all duration-400"
        style={{
          background: isOpen ? 'rgba(10,18,8,0.55)' : 'transparent',
          pointerEvents: isOpen ? 'auto' : 'none',
          backdropFilter: isOpen ? 'blur(3px)' : 'none',
        }}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className="fixed top-0 h-full z-[70] flex flex-col transition-transform duration-400"
        style={{
          width: 'min(440px, 100vw)',
          background: '#faf8f3',
          ...(lang === 'ar'
            ? {
                left: 0,
                right: 'auto',
                borderRight: '1px solid rgba(201,168,76,0.18)',
                transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
              }
            : {
                right: 0,
                left: 'auto',
                borderLeft: '1px solid rgba(201,168,76,0.18)',
                transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
              }),
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(0,0,0,0.07)', background: '#1a2617' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center">
              <i className="ri-shopping-basket-2-line text-lg" style={{ color: '#c9a84c' }} />
            </div>
            <div>
              <span className="text-sm font-bold uppercase tracking-widest" style={{ color: '#ffffff', fontFamily: "'Outfit', sans-serif" }}>
                {step === 'success' ? t('cart_success_title') : step === 'checkout' ? t('cart_checkout_title') : t('cart_title')}
              </span>
              {step === 'cart' && totalCount > 0 && (
                <span className="ml-2 text-xs" style={{ color: '#c9a84c', fontFamily: "'Outfit', sans-serif" }}>
                  ({totalCount} {totalCount > 1 ? t('cart_articles') : t('cart_article')})
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Currency selector */}
            <div ref={currencyDropRef} style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setCurrencyDropOpen(v => !v)}
                className="cursor-pointer flex items-center gap-1.5"
                style={{
                  background: currencyDropOpen ? 'rgba(212,175,55,0.18)' : 'rgba(212,175,55,0.08)',
                  border: '1px solid rgba(212,175,55,0.35)',
                  borderRadius: '7px',
                  padding: '5px 9px',
                  color: '#c9a84c',
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  outline: 'none',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(212,175,55,0.18)'; }}
                onMouseLeave={e => { if (!currencyDropOpen) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(212,175,55,0.08)'; }}
              >
                <span style={{ fontSize: '0.9rem' }}>{currencyInfo.flag}</span>
                <span>{currencyInfo.code}</span>
                <i className={currencyDropOpen ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} style={{ fontSize: '12px', opacity: 0.7 }} />
              </button>

              {currencyDropOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  right: 0,
                  zIndex: 400,
                  background: '#1e2e1c',
                  border: '1px solid rgba(201,168,76,0.25)',
                  borderRadius: '10px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                  overflow: 'hidden',
                  minWidth: '160px',
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
                          background: isActive ? 'rgba(201,168,76,0.12)' : 'transparent',
                          border: 'none',
                          borderBottom: idx < FEATURED_CURRENCIES.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                          color: isActive ? '#c9a84c' : 'rgba(255,255,255,0.78)',
                          fontFamily: "'Outfit', sans-serif",
                          fontSize: '0.75rem',
                          fontWeight: isActive ? 700 : 400,
                          textAlign: 'left',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; }}
                        onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                      >
                        <span style={{ fontSize: '0.9rem' }}>{c.flag}</span>
                        <span style={{ flex: 1 }}>{c.code}</span>
                        {c.symbol !== c.code && <span style={{ opacity: 0.4, fontSize: '0.62rem' }}>{c.symbol}</span>}
                        {isActive && <i className="ri-check-line" style={{ fontSize: '11px' }} />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              onClick={closeCart}
              className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer border-none"
              style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(201,168,76,0.2)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)'; }}
            >
              <i className="ri-close-line text-base" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">

          {/* ── STEP: CART ── */}
          {step === 'cart' && (
            <>
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 px-8 text-center">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full" style={{ background: 'rgba(201,168,76,0.1)' }}>
                    <i className="ri-shopping-basket-2-line text-2xl" style={{ color: '#c9a84c' }} />
                  </div>
                  <p className="text-base font-medium" style={{ color: '#1a2617', fontFamily: "'Cormorant Garant', serif", fontSize: '1.2rem' }}>
                    {t('cart_empty_title')}
                  </p>
                  <p className="text-sm" style={{ color: '#9aaa96', fontFamily: "'Outfit', sans-serif" }}>
                    {t('cart_empty_sub')}
                  </p>
                  <button
                    onClick={() => { closeCart(); navigate('/products'); }}
                    className="mt-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest cursor-pointer border-none transition-all duration-200 whitespace-nowrap"
                    style={{ background: '#1a2617', color: '#c9a84c', fontFamily: "'Outfit', sans-serif" }}
                  >
                    {t('cart_see_collection')}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col">
                  {/* Items */}
                  <div className="flex flex-col divide-y" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                    {items.map((item) => (
                      <div key={item.product.id} className="flex gap-4 px-6 py-5">
                        {/* Image */}
                        <div
                          className="flex-shrink-0 flex items-center justify-center rounded-xl overflow-hidden"
                          style={{ width: '72px', height: '88px', background: 'linear-gradient(160deg, #f0ede6 0%, #e8e4da 100%)' }}
                        >
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="object-contain"
                            style={{ height: '76px', width: 'auto', maxWidth: '60px' }}
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 flex flex-col gap-2 min-w-0">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider truncate" style={{ color: '#c9a84c', fontFamily: "'Outfit', sans-serif" }}>
                              {locVolume(item.product)}
                            </p>
                            <p className="text-sm font-bold leading-snug" style={{ color: '#1a2617', fontFamily: "'Cormorant Garant', serif", fontSize: '1rem' }}>
                              {locName(item.product)}
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            {/* Qty controls */}
                            <div className="flex flex-col gap-1">
                              <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9aaa96', fontFamily: "'Outfit', sans-serif" }}>
                                {t('cart_qty')}
                              </span>
                              <div className="flex items-center gap-1">
                                {/* − */}
                                <button
                                  onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                                  className="flex items-center justify-center cursor-pointer border-none transition-all duration-150"
                                  style={{ width: '26px', height: '32px', borderRadius: '7px', background: '#f0ede6', color: '#1a2617', fontSize: '1rem', fontWeight: 700, flexShrink: 0 }}
                                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(201,168,76,0.25)'; }}
                                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#f0ede6'; }}
                                >
                                  −
                                </button>

                                <QuantityInput
                                  productId={item.product.id}
                                  quantity={item.quantity}
                                  stock={item.product.stock}
                                  onUpdate={updateQuantity}
                                />

                                {/* + */}
                                <button
                                  onClick={() => updateQuantity(item.product.id, Math.min(item.product.stock, item.quantity + 1))}
                                  className="flex items-center justify-center cursor-pointer border-none transition-all duration-150"
                                  style={{ width: '26px', height: '32px', borderRadius: '7px', background: '#f0ede6', color: '#1a2617', fontSize: '1rem', fontWeight: 700, flexShrink: 0 }}
                                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(201,168,76,0.25)'; }}
                                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#f0ede6'; }}
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            {/* Price */}
                            <span className="text-base font-bold" style={{ color: '#1a2617', fontFamily: "'Cormorant Garant', serif" }}>
                              {formatPrice(item.product.price * item.quantity)}
                            </span>
                          </div>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full cursor-pointer border-none transition-all duration-200 self-start mt-1"
                          style={{ background: 'rgba(0,0,0,0.05)', color: '#9aaa96' }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(220,50,50,0.1)'; (e.currentTarget as HTMLButtonElement).style.color = '#c0392b'; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.05)'; (e.currentTarget as HTMLButtonElement).style.color = '#9aaa96'; }}
                        >
                          <i className="ri-delete-bin-6-line text-xs" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* ── Promotions ── */}
                  <div className="px-6 pt-4 pb-2 flex flex-col gap-3" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>

                    {/* Promotions */}
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: '#1a2617', fontFamily: "'Outfit', sans-serif" }}>
                        <i className="ri-price-tag-3-line" style={{ color: '#c9a84c' }} />
                        {t('cart_promotions_title')}
                      </label>
                      <div className="flex flex-col gap-1.5">
                        {[
                          { qty: 10, pct: 5 },
                          { qty: 50, pct: 10 },
                          { qty: 100, pct: 15 },
                        ].map(tier => {
                          const activeTierQty = discountRate === 0.15 ? 100 : discountRate === 0.10 ? 50 : discountRate === 0.05 ? 10 : null;
                          const active = activeTierQty === tier.qty;
                          const passed = activeTierQty !== null && tier.qty < activeTierQty;
                          const isNext = nextTier?.qty === tier.qty;
                          return (
                            <div
                              key={tier.qty}
                              className="flex items-center gap-3 px-3 py-2 rounded-lg"
                              style={{
                                background: active ? 'rgba(74,124,78,0.07)' : passed ? 'rgba(74,124,78,0.03)' : isNext ? 'rgba(201,168,76,0.06)' : 'rgba(0,0,0,0.02)',
                                border: `1px solid ${active ? 'rgba(74,124,78,0.25)' : passed ? 'rgba(74,124,78,0.12)' : isNext ? 'rgba(201,168,76,0.2)' : 'rgba(0,0,0,0.06)'}`,
                                opacity: passed ? 0.6 : 1,
                              }}
                            >
                              <div className="w-5 h-5 flex items-center justify-center rounded-full flex-shrink-0" style={{ background: active ? '#4a7c4e' : passed ? 'rgba(74,124,78,0.3)' : isNext ? 'rgba(201,168,76,0.2)' : 'rgba(0,0,0,0.06)' }}>
                                {active || passed
                                  ? <i className="ri-check-line" style={{ fontSize: '10px', color: '#ffffff' }} />
                                  : <i className="ri-lock-line" style={{ fontSize: '9px', color: isNext ? '#c9a84c' : '#9aaa96' }} />
                                }
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.72rem', fontWeight: 600, color: active ? '#4a7c4e' : passed ? '#7aaa7e' : isNext ? '#c9a84c' : '#9aaa96' }}>
                                  {t('cart_discount_pct', { pct: tier.pct })}
                                </span>
                                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.65rem', color: '#9aaa96', marginLeft: 6 }}>
                                  {t('cart_discount_from', { qty: tier.qty })}
                                </span>
                              </div>
                              {active && (
                                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(74,124,78,0.15)', color: '#4a7c4e', fontFamily: "'Outfit', sans-serif" }}>
                                  {t('cart_discount_active')}
                                </span>
                              )}
                              {passed && (
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(74,124,78,0.08)', color: '#7aaa7e', fontFamily: "'Outfit', sans-serif" }}>
                                  {t('cart_discount_passed')}
                                </span>
                              )}
                              {isNext && !active && !passed && (
                                <span className="text-xs font-semibold" style={{ color: '#c9a84c', fontFamily: "'Outfit', sans-serif", whiteSpace: 'nowrap' }}>
                                  +{tier.qty - totalQuantity} {t(tier.qty - totalQuantity > 1 ? 'cart_unit_plural' : 'cart_unit_singular')}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>

                </div>
              )}
            </>
          )}

          {/* ── STEP: CHECKOUT ── */}
          {step === 'checkout' && (
            <form
              id="fendri-order-form"
              data-readdy-form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5 px-6 py-6"
            >
              {/* Order recap */}
              <div className="rounded-xl p-4" style={{ background: 'rgba(201,168,76,0.07)', border: '1px solid rgba(201,168,76,0.2)' }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#c9a84c', fontFamily: "'Outfit', sans-serif" }}>
                  {t('cart_recap')}
                </p>
                <div className="flex flex-col gap-2">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between items-center">
                      <span className="text-xs" style={{ color: '#6b7c68', fontFamily: "'Outfit', sans-serif" }}>
                        {locVolume(item.product)} × {item.quantity}
                      </span>
                      <span className="text-xs font-bold" style={{ color: '#1a2617', fontFamily: "'Outfit', sans-serif" }}>
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 flex flex-col gap-1.5" style={{ borderTop: '1px solid rgba(201,168,76,0.2)' }}>
                  {discountRate > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold flex items-center gap-1" style={{ color: '#4a7c4e', fontFamily: "'Outfit', sans-serif" }}>
                        <i className="ri-price-tag-3-line" />{t('cart_discount_label', { pct: Math.round(discountRate * 100) })}
                      </span>
                      <span className="text-xs font-bold" style={{ color: '#4a7c4e', fontFamily: "'Outfit', sans-serif" }}>
                        −{formatPrice(discountAmount)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-xs flex items-center gap-1" style={{ color: '#9aaa96', fontFamily: "'Outfit', sans-serif" }}>
                      <i className="ri-truck-line" />{countryFlag} {t('cart_shipping')} {countryName}
                    </span>
                    <span className="text-xs font-semibold" style={{ color: shippingCostTND === 0 ? '#4a7c4e' : '#6b7c68', fontFamily: "'Outfit', sans-serif" }}>
                      {shippingCostTND === 0 ? t('cart_shipping_free') : formatPrice(shippingCostTND)}
                    </span>
                  </div>
                  <div style={{ borderTop: '1px dashed rgba(201,168,76,0.2)' }} />
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold uppercase tracking-wider" style={{ color: '#1a2617', fontFamily: "'Outfit', sans-serif" }}>{t('cart_total_ttc')}</span>
                    <span className="text-lg font-bold" style={{ color: '#1a2617', fontFamily: "'Cormorant Garant', serif" }}>
                      {formatPrice(grandTotalTND)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Identité : bannière si connecté, champs si invité */}
              {user ? (
                <div className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)' }}>
                  <i className="ri-user-3-line" style={{ color: '#c9a84c', fontSize: 16 }} />
                  <div>
                    <p className="text-xs font-bold" style={{ color: '#1a2617', fontFamily: "'Outfit', sans-serif" }}>{user.name}</p>
                    <p className="text-xs" style={{ color: '#6b7c68', fontFamily: "'Outfit', sans-serif" }}>{user.email}</p>
                  </div>
                </div>
              ) : (
                <>
                  {[
                    { name: 'name', label: t('cart_field_name'), type: 'text', placeholder: t('cart_placeholder_name') },
                    { name: 'email', label: t('cart_field_email'), type: 'email', placeholder: t('cart_placeholder_email') },
                  ].map((field) => (
                    <div key={field.name} className="flex flex-col gap-1.5">
                      <label htmlFor={field.name} className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#1a2617', fontFamily: "'Outfit', sans-serif" }}>
                        {field.label}
                      </label>
                      <input
                        id={field.name}
                        name={field.name}
                        type={field.type}
                        placeholder={field.placeholder}
                        value={form[field.name as keyof typeof form]}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                        style={inputStyle}
                        onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = '#c9a84c'; }}
                        onBlur={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = 'rgba(0,0,0,0.1)'; }}
                      />
                    </div>
                  ))}
                </>
              )}

              {/* Pays de livraison */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#1a2617', fontFamily: "'Outfit', sans-serif" }}>
                  <i className="ri-earth-line mr-1" style={{ color: '#c9a84c' }} />
                  {t('cart_country_label')}
                </label>
                <div ref={cartCountryDropRef} style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => setCartCountryDrop(v => !v)}
                    className="cursor-pointer flex items-center gap-2.5 w-full"
                    style={{
                      padding: '11px 14px',
                      background: '#ffffff',
                      border: `1px solid ${cartCountryDrop ? '#c9a84c' : 'rgba(0,0,0,0.1)'}`,
                      borderRadius: '12px',
                      color: '#1a2617',
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: '0.82rem',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#c9a84c'; }}
                    onMouseLeave={e => { if (!cartCountryDrop) (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,0,0,0.1)'; }}
                  >
                    <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{countryFlag}</span>
                    <span style={{ flex: 1, textAlign: 'left', fontWeight: 600 }}>{countryName}</span>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '4px',
                      padding: '2px 8px', borderRadius: '20px',
                      background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.25)',
                      fontFamily: "'Outfit', sans-serif", fontSize: '0.6rem', fontWeight: 700,
                      color: '#c9a84c', letterSpacing: '0.05em', flexShrink: 0,
                    }}>
                      {currencyInfo.flag} {currencyInfo.code}
                    </span>
                    <i className={cartCountryDrop ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} style={{ fontSize: '14px', color: '#9ca3af', flexShrink: 0 }} />
                  </button>

                  {cartCountryDrop && (
                    <div style={{
                      position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
                      zIndex: 300, maxHeight: '220px', overflowY: 'auto',
                      background: '#ffffff', border: '1.5px solid rgba(201,168,76,0.25)',
                      borderRadius: '12px', boxShadow: '0 16px 40px rgba(0,0,0,0.14)',
                      scrollbarWidth: 'thin',
                    }}>
                      {COUNTRY_CODES.map((c, idx) => {
                        const isSelected = countryName === c.name;
                        const cInfo = CURRENCIES[FR_COUNTRY_CURRENCY[c.name] ?? 'TND'] ?? CURRENCIES.TND;
                        return (
                          <button
                            key={`form-${c.code}-${idx}`}
                            type="button"
                            onClick={() => { selectCountry(c); setPhoneNumber(''); setCartCountryDrop(false); }}
                            className="cursor-pointer w-full flex items-center gap-2.5"
                            style={{
                              padding: '9px 14px',
                              background: isSelected ? 'rgba(201,168,76,0.08)' : 'transparent',
                              border: 'none',
                              borderBottom: idx < COUNTRY_CODES.length - 1 ? '1px solid #f3f3f0' : 'none',
                              color: isSelected ? '#c9a84c' : '#1a2617',
                              fontFamily: "'Outfit', sans-serif", fontSize: '0.78rem',
                              textAlign: 'left', transition: 'background 0.15s',
                            }}
                            onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(201,168,76,0.05)'; }}
                            onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                          >
                            <span style={{ fontSize: '1rem', flexShrink: 0 }}>{c.flag}</span>
                            <span style={{ flex: 1, fontWeight: isSelected ? 700 : 400 }}>{c.name}</span>
                            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.6rem', fontWeight: 700, color: isSelected ? '#c9a84c' : 'rgba(201,168,76,0.6)', flexShrink: 0 }}>
                              {cInfo.code}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
                {currency !== 'TND' && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.15)' }}>
                    <i className="ri-exchange-line" style={{ color: '#c9a84c', fontSize: '10px', flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.6rem', color: '#9aaa96' }}>
                      Taux indicatif · 1 TND ≈ {currencyInfo.rate} {currencyInfo.code}
                    </span>
                  </div>
                )}
              </div>

              {/* Address fields: street, city, postal code */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#1a2617', fontFamily: "'Outfit', sans-serif" }}>
                  {t('cart_field_address')}
                </label>
                <StreetAutocomplete
                  countryName={countryName}
                  value={form.street}
                  onChange={(street) => setForm(prev => ({ ...prev, street }))}
                  onCityChange={(city) => setForm(prev => ({ ...prev, city }))}
                  onPostalChange={(postal) => setForm(prev => ({ ...prev, postalCode: postal }))}
                  inputStyle={inputStyle}
                  placeholder={t('cart_placeholder_address') ?? 'N° et nom de rue'}
                />
              </div>

              <div className="flex gap-3">
                {/* City */}
                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#1a2617', fontFamily: "'Outfit', sans-serif" }}>
                    {t('cart_field_city') ?? 'Ville'}
                  </label>
                  <CityCombobox
                    countryName={countryName}
                    value={form.city}
                    onChange={(city) => setForm(prev => ({ ...prev, city }))}
                    inputStyle={inputStyle}
                  />
                </div>

                {/* Postal code */}
                {postalLen > 0 && (
                  <div className="flex flex-col gap-1.5" style={{ width: '130px', flexShrink: 0 }}>
                    <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#1a2617', fontFamily: "'Outfit', sans-serif" }}>
                      {t('cart_field_postal') ?? 'Code postal'}
                    </label>
                    <input
                      name="postalCode"
                      type="text"
                      placeholder={postalExample || '—'}
                      value={form.postalCode}
                      maxLength={postalLen + 1}
                      onChange={e => {
                        const raw = postalAlpha
                          ? e.target.value.toUpperCase().slice(0, postalLen + 1)
                          : e.target.value.replace(/\D/g, '').slice(0, postalLen);
                        setForm(prev => ({ ...prev, postalCode: raw }));
                        setPostalError('');
                      }}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                      style={{
                        ...inputStyle,
                        borderColor: (() => {
                          const pc = form.postalCode.replace(/\s/g, '');
                          if (!pc) return 'rgba(0,0,0,0.1)';
                          const ok = postalAlpha
                            ? pc.length >= postalLen - 1
                            : pc.length === postalLen && /^\d+$/.test(pc);
                          return ok ? '#4a7c4e' : '#c9a84c';
                        })(),
                      }}
                      onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = '#c9a84c'; }}
                      onBlur={(e) => {
                        const pc = form.postalCode.replace(/\s/g, '');
                        const ok = postalAlpha
                          ? pc.length >= postalLen - 1
                          : pc.length === postalLen && /^\d+$/.test(pc);
                        (e.currentTarget as HTMLInputElement).style.borderColor = pc ? (ok ? '#4a7c4e' : '#e8534a') : 'rgba(0,0,0,0.1)';
                        if (pc && !ok) setPostalError(`${postalAlpha ? postalLen + ' car.' : postalLen + ' chiffres'} — ex: ${postalExample}`);
                      }}
                    />
                    <div className="flex items-center justify-between">
                      {postalError ? (
                        <p className="text-xs" style={{ color: '#e8534a', fontFamily: "'Outfit', sans-serif" }}>{postalError}</p>
                      ) : (
                        <p className="text-xs" style={{ color: '#c4c4b8', fontFamily: "'Outfit', sans-serif" }}>
                          ex: {postalExample}
                        </p>
                      )}
                      <p className="text-xs font-semibold" style={{
                        color: (() => {
                          const pc = form.postalCode.replace(/\s/g, '');
                          const ok = postalAlpha ? pc.length >= postalLen - 1 : pc.length === postalLen;
                          return pc ? (ok ? '#4a7c4e' : '#c9a84c') : '#c4c4b8';
                        })(),
                        fontFamily: "'Outfit', sans-serif",
                      }}>
                        {form.postalCode.replace(/\s/g, '').length}/{postalLen}
                        {(() => {
                          const pc = form.postalCode.replace(/\s/g, '');
                          const ok = postalAlpha ? pc.length >= postalLen - 1 : pc.length === postalLen;
                          return pc && ok ? <i className="ri-check-line ml-1" /> : null;
                        })()}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Phone with country selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#1a2617', fontFamily: "'Outfit', sans-serif" }}>
                  {t('cart_field_phone')}
                </label>
                <div className="flex gap-2" style={{ position: 'relative' }}>
                  <div ref={dropRef} style={{ position: 'relative', flexShrink: 0 }}>
                    <button
                      type="button"
                      onClick={() => setDropOpen(v => !v)}
                      className="cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                      style={{
                        height: '46px',
                        padding: '0 10px',
                        border: '1px solid rgba(0,0,0,0.1)',
                        borderRadius: '12px',
                        background: '#ffffff',
                        color: '#1a2617',
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: '0.8rem',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#c9a84c'; }}
                      onMouseLeave={e => { if (!dropOpen) (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,0,0,0.1)'; }}
                    >
                      <span style={{ fontSize: '1rem' }}>{countryFlag}</span>
                      <span style={{ color: '#c9a84c', fontWeight: 700, fontSize: '0.72rem' }}>{countryCode}</span>
                      <i className={dropOpen ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} style={{ fontSize: '13px', color: '#9ca3af' }} />
                    </button>

                    {dropOpen && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 'calc(100% + 4px)',
                          left: 0,
                          zIndex: 200,
                          width: '240px',
                          maxHeight: '210px',
                          overflowY: 'auto',
                          background: '#ffffff',
                          border: '1px solid rgba(0,0,0,0.1)',
                          borderRadius: '12px',
                          scrollbarWidth: 'thin',
                        }}
                      >
                        {COUNTRY_CODES.map((c, idx) => (
                          <button
                            key={`${c.code}-${idx}`}
                            type="button"
                            onClick={() => {
                              selectCountry(c);
                              setPhoneNumber('');
                              setDropOpen(false);
                            }}
                            className="cursor-pointer w-full flex items-center gap-2.5 whitespace-nowrap"
                            style={{
                              padding: '8px 12px',
                              background: countryName === c.name ? 'rgba(201,168,76,0.08)' : 'transparent',
                              border: 'none',
                              borderBottom: idx < COUNTRY_CODES.length - 1 ? '1px solid #f3f3f0' : 'none',
                              color: '#1a2617',
                              fontFamily: "'Outfit', sans-serif",
                              fontSize: '0.75rem',
                              textAlign: 'left',
                              transition: 'background 0.15s',
                            }}
                            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(201,168,76,0.06)'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = countryName === c.name ? 'rgba(201,168,76,0.08)' : 'transparent'; }}
                          >
                            <span style={{ fontSize: '1rem', flexShrink: 0 }}>{c.flag}</span>
                            <span style={{ flex: 1 }}>{c.name}</span>
                            <span style={{ color: '#c9a84c', fontWeight: 700, fontSize: '0.7rem' }}>{c.code}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <input
                    type="tel"
                    name="phone"
                    required
                    value={phoneNumber}
                    maxLength={countryDigits}
                    onChange={e => {
                      const digits = e.target.value.replace(/\D/g, '').slice(0, countryDigits);
                      setPhoneNumber(digits);
                    }}
                    placeholder={'X'.repeat(countryDigits)}
                    className="flex-1 px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                    style={{
                      ...inputStyle,
                      minWidth: 0,
                      borderColor: phoneNumber.length > 0 && phoneNumber.length === countryDigits
                        ? '#4a7c4e'
                        : phoneNumber.length > 0
                        ? '#c9a84c'
                        : 'rgba(0,0,0,0.1)',
                    }}
                    onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = '#c9a84c'; }}
                    onBlur={(e) => {
                      (e.currentTarget as HTMLInputElement).style.borderColor =
                        phoneNumber.length === countryDigits ? '#4a7c4e' : 'rgba(0,0,0,0.1)';
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs" style={{ color: '#c4c4b8', fontFamily: "'Outfit', sans-serif" }}>
                    {countryFlag} {countryName} — {countryDigits} chiffres requis
                  </p>
                  <p className="text-xs font-semibold" style={{
                    color: phoneNumber.length === countryDigits ? '#4a7c4e' : phoneNumber.length > 0 ? '#c9a84c' : '#c4c4b8',
                    fontFamily: "'Outfit', sans-serif",
                  }}>
                    {phoneNumber.length}/{countryDigits}
                    {phoneNumber.length === countryDigits && <i className="ri-check-line ml-1" />}
                  </p>
                </div>
              </div>

              {/* Payment method selector */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#1a2617', fontFamily: "'Outfit', sans-serif" }}>
                  {t('cart_payment_method')}
                </label>
                <div className="flex flex-col gap-2">
                  {/* Paiement à la livraison */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left transition-all duration-200 cursor-pointer border-none"
                    style={{
                      background: paymentMethod === 'cod' ? 'rgba(26,38,23,0.06)' : '#ffffff',
                      border: `2px solid ${paymentMethod === 'cod' ? '#1a2617' : 'rgba(0,0,0,0.1)'}`,
                    }}
                  >
                    <div className="w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0" style={{ background: paymentMethod === 'cod' ? '#1a2617' : 'rgba(0,0,0,0.06)' }}>
                      <i className="ri-truck-line text-sm" style={{ color: paymentMethod === 'cod' ? '#c9a84c' : '#9aaa96' }} />
                    </div>
                    <div>
                      <p className="text-sm font-bold" style={{ color: '#1a2617', fontFamily: "'Outfit', sans-serif" }}>
                        {t('cart_cod_title')}
                      </p>
                      <p className="text-xs" style={{ color: '#9aaa96', fontFamily: "'Outfit', sans-serif" }}>
                        {t('cart_cod_sub')}
                      </p>
                    </div>
                    <div className="ml-auto flex-shrink-0">
                      <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ borderColor: paymentMethod === 'cod' ? '#1a2617' : 'rgba(0,0,0,0.2)' }}>
                        {paymentMethod === 'cod' && <div className="w-2 h-2 rounded-full" style={{ background: '#1a2617' }} />}
                      </div>
                    </div>
                  </button>

                  {/* Konnect — bientôt disponible */}
                  <button
                    type="button"
                    disabled
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left cursor-not-allowed border-none"
                    style={{ background: '#f9f9f7', border: '2px solid rgba(0,0,0,0.06)', opacity: 0.65 }}
                  >
                    <div className="w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0 overflow-hidden" style={{ background: '#1a1a2e' }}>
                      <span className="text-xs font-black tracking-tight" style={{ color: '#e94560' }}>K</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold flex items-center gap-2" style={{ color: '#1a2617', fontFamily: "'Outfit', sans-serif" }}>
                        Konnect
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(201,168,76,0.15)', color: '#c9a84c' }}>
                          {t('cart_coming_soon')}
                        </span>
                      </p>
                      <p className="text-xs" style={{ color: '#9aaa96', fontFamily: "'Outfit', sans-serif" }}>
                        {t('cart_konnect_sub')}
                      </p>
                    </div>
                  </button>

                  {/* D17 mobile — bientôt disponible */}
                  <button
                    type="button"
                    disabled
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left cursor-not-allowed border-none"
                    style={{ background: '#f9f9f7', border: '2px solid rgba(0,0,0,0.06)', opacity: 0.65 }}
                  >
                    <div className="w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0" style={{ background: '#e63946' }}>
                      <i className="ri-smartphone-line text-sm" style={{ color: '#ffffff' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold flex items-center gap-2" style={{ color: '#1a2617', fontFamily: "'Outfit', sans-serif" }}>
                        {t('cart_d17_title')}
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(201,168,76,0.15)', color: '#c9a84c' }}>
                          {t('cart_coming_soon')}
                        </span>
                      </p>
                      <p className="text-xs" style={{ color: '#9aaa96', fontFamily: "'Outfit', sans-serif" }}>
                        {t('cart_d17_sub')}
                      </p>
                    </div>
                  </button>

                  {/* PayPal — bientôt disponible */}
                  <button
                    type="button"
                    disabled
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left cursor-not-allowed border-none"
                    style={{ background: '#f9f9f7', border: '2px solid rgba(0,0,0,0.06)', opacity: 0.65 }}
                  >
                    <div className="w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0" style={{ background: '#003087' }}>
                      <span className="text-xs font-black" style={{ color: '#ffffff', letterSpacing: '-1px' }}>PP</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold flex items-center gap-2" style={{ color: '#1a2617', fontFamily: "'Outfit', sans-serif" }}>
                        PayPal
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(201,168,76,0.15)', color: '#c9a84c' }}>
                          {t('cart_coming_soon')}
                        </span>
                      </p>
                      <p className="text-xs" style={{ color: '#9aaa96', fontFamily: "'Outfit', sans-serif" }}>
                        {t('cart_paypal_sub')}
                      </p>
                    </div>
                  </button>

                  {/* Click to Pay (SMT) */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('clicktopay')}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left transition-all duration-200 cursor-pointer border-none"
                    style={{
                      background: paymentMethod === 'clicktopay' ? 'rgba(26,38,23,0.06)' : '#ffffff',
                      border: `2px solid ${paymentMethod === 'clicktopay' ? '#1a2617' : 'rgba(0,0,0,0.1)'}`,
                    }}
                  >
                    <div
                      className="w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0"
                      style={{ background: paymentMethod === 'clicktopay' ? '#1a2617' : 'rgba(0,0,0,0.06)' }}
                    >
                      <i
                        className="ri-cursor-line text-sm"
                        style={{ color: paymentMethod === 'clicktopay' ? '#c9a84c' : '#9aaa96' }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold flex items-center gap-2" style={{ color: '#1a2617', fontFamily: "'Outfit', sans-serif" }}>
                        Click to Pay
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(255,107,0,0.1)', color: '#e05a00' }}
                        >
                          SMT
                        </span>
                      </p>
                      <p className="text-xs" style={{ color: '#9aaa96', fontFamily: "'Outfit', sans-serif" }}>
                        {t('cart_clicktopay_sub')}
                      </p>
                    </div>
                    <div className="ml-auto flex-shrink-0">
                      <div
                        className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                        style={{ borderColor: paymentMethod === 'clicktopay' ? '#1a2617' : 'rgba(0,0,0,0.2)' }}
                      >
                        {paymentMethod === 'clicktopay' && (
                          <div className="w-2 h-2 rounded-full" style={{ background: '#1a2617' }} />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Avertissement Click to Pay si sélectionné */}
                  {paymentMethod === 'clicktopay' && (
                    <div
                      className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl"
                      style={{ background: 'rgba(255,107,0,0.06)', border: '1px solid rgba(255,107,0,0.2)' }}
                    >
                      <i className="ri-information-line flex-shrink-0" style={{ color: '#e05a00', fontSize: '14px', marginTop: '1px' }} />
                      <p className="text-xs leading-relaxed" style={{ color: '#7a4a1e', fontFamily: "'Outfit', sans-serif" }}>
                        {t('cart_clicktopay_info_1')} <strong>Click to Pay SMT</strong> {t('cart_clicktopay_info_2')}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {formError && (
                <p className="text-xs text-center" style={{ color: '#c0392b', fontFamily: "'Outfit', sans-serif" }}>
                  {formError}
                </p>
              )}
            </form>
          )}

          {/* ── STEP: SUCCESS ── */}
          {step === 'success' && (
            <div className="flex flex-col items-center justify-center h-full gap-5 px-8 text-center">
              <div
                className="w-20 h-20 flex items-center justify-center rounded-full"
                style={{ background: 'rgba(74,124,78,0.12)' }}
              >
                <i className="ri-checkbox-circle-fill text-4xl" style={{ color: '#4a7c4e' }} />
              </div>
              <div>
                <p className="text-xl font-bold mb-2" style={{ color: '#1a2617', fontFamily: "'Cormorant Garant', serif" }}>
                  {t('cart_success_msg')}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: '#6b7c68', fontFamily: "'Outfit', sans-serif" }}>
                  {t('cart_success_sub')}
                </p>
              </div>
              <p className="text-xs" style={{ color: '#9aaa96', fontFamily: "'Outfit', sans-serif" }}>
                Redirection vers l'accueil dans 3 secondes…
              </p>
              <button
                onClick={() => { closeCart(); navigate('/'); }}
                className="mt-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest cursor-pointer border-none whitespace-nowrap"
                style={{ background: '#1a2617', color: '#c9a84c', fontFamily: "'Outfit', sans-serif" }}
              >
                Retour à l'accueil
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {step === 'cart' && items.length > 0 && (
          <div className="flex-shrink-0" style={{ borderTop: '1px solid rgba(0,0,0,0.07)', background: '#ffffff' }}>
            {/* Livraison & conditions */}
            <div className="px-6 pt-4 pb-3">
              <div className="rounded-xl p-4" style={{ background: '#f8f6f1', border: '1px solid rgba(201,168,76,0.15)' }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-1.5" style={{ color: '#c9a84c', fontFamily: "'Outfit', sans-serif" }}>
                  <i className="ri-shield-check-line" />
                  {t('cart_delivery_title')}
                </p>
                <div className="flex flex-col gap-2">
                  {[
                    { icon: 'ri-truck-line', text: t('cart_delivery1') },
                    { icon: 'ri-gift-line', text: t('cart_delivery2') },
                    { icon: 'ri-phone-line', text: t('cart_delivery3') },
                    { icon: 'ri-lock-line', text: t('cart_delivery4') },
                  ].map((item) => (
                    <div key={item.text} className="flex items-start gap-2">
                      <div className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <i className={`${item.icon} text-xs`} style={{ color: '#4a7c4e' }} />
                      </div>
                      <span className="text-xs leading-relaxed" style={{ color: '#6b7c68', fontFamily: "'Outfit', sans-serif" }}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Total + CTA */}
            <div className="px-6 pb-5">
              <div className="flex flex-col gap-1.5 mb-3">
                {/* Sous-total */}
                <div className="flex justify-between items-center">
                  <span className="text-xs" style={{ color: '#9aaa96', fontFamily: "'Outfit', sans-serif" }}>{t('cart_subtotal')}</span>
                  <span className="text-xs font-semibold" style={{ color: '#1a2617', fontFamily: "'Outfit', sans-serif" }}>
                    {discountRate > 0
                      ? <><s style={{ color: '#c4c4b8', marginRight: 4 }}>{formatPrice(totalPrice)}</s>{formatPrice(discountedTotal)}</>
                      : formatPrice(totalPrice)
                    }
                  </span>
                </div>
                {discountRate > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold flex items-center gap-1" style={{ color: '#4a7c4e', fontFamily: "'Outfit', sans-serif" }}>
                      <i className="ri-price-tag-3-line" />{t('cart_discount_label', { pct: Math.round(discountRate * 100) })}
                    </span>
                    <span className="text-xs font-bold" style={{ color: '#4a7c4e', fontFamily: "'Outfit', sans-serif" }}>
                      −{formatPrice(discountAmount)}
                    </span>
                  </div>
                )}
                {/* Livraison */}
                <div className="flex justify-between items-center">
                  <span className="text-xs flex items-center gap-1" style={{ color: '#9aaa96', fontFamily: "'Outfit', sans-serif" }}>
                    <i className="ri-truck-line" />
                    {t('cart_shipping')} · {countryFlag} {countryName}
                  </span>
                  <span className="text-xs font-semibold" style={{ color: shippingCostTND === 0 ? '#4a7c4e' : '#1a2617', fontFamily: "'Outfit', sans-serif" }}>
                    {shippingCostTND === 0 ? t('cart_shipping_free') : formatPrice(shippingCostTND)}
                  </span>
                </div>

                {/* Barre de progression livraison offerte (Tunisie uniquement) */}
                {countryName === 'Tunisie' && items.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      {freeShippingTunisia ? (
                        <span className="text-xs font-semibold flex items-center gap-1" style={{ color: '#4a7c4e', fontFamily: "'Outfit', sans-serif" }}>
                          <i className="ri-checkbox-circle-fill" />
                          {t('cart_free_shipping_unlocked')}
                        </span>
                      ) : (
                        <span className="text-xs" style={{ color: '#9aaa96', fontFamily: "'Outfit', sans-serif" }}>
                          {t('cart_free_shipping_remaining', { amount: formatPrice(remainingForFreeShipping) })}
                        </span>
                      )}
                    </div>
                    <div style={{ height: '4px', borderRadius: '99px', background: 'rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${freeShippingProgress}%`,
                        borderRadius: '99px',
                        background: freeShippingTunisia
                          ? 'linear-gradient(90deg, #4a7c4e, #66aa6e)'
                          : 'linear-gradient(90deg, #c9a84c, #e0bf6e)',
                        transition: 'width 0.4s ease',
                      }} />
                    </div>
                  </div>
                )}

                {/* Séparateur */}
                <div style={{ borderTop: '1px dashed rgba(0,0,0,0.08)', margin: '2px 0' }} />
                {/* Total TTC */}
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#1a2617', fontFamily: "'Outfit', sans-serif" }}>
                    {t('cart_total_ttc')}
                  </span>
                  <span className="text-2xl font-bold" style={{ color: '#1a2617', fontFamily: "'Cormorant Garant', serif" }}>
                    {formatPrice(grandTotalTND)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setStep('checkout')}
                className="w-full py-3.5 rounded-full text-sm font-bold uppercase tracking-widest cursor-pointer border-none transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap"
                style={{ background: '#1a2617', color: '#c9a84c', fontFamily: "'Outfit', sans-serif" }}
              >
                <i className="ri-secure-payment-line mr-2" />
                {t('cart_checkout_btn')}
              </button>
            </div>
          </div>
        )}

        {step === 'checkout' && (
          <div className="flex-shrink-0 px-6 py-5 flex gap-3" style={{ borderTop: '1px solid rgba(0,0,0,0.07)', background: '#ffffff' }}>
            <button
              onClick={() => setStep('cart')}
              className="flex-shrink-0 px-4 py-3 rounded-full text-xs font-bold uppercase tracking-widest cursor-pointer transition-all duration-200 whitespace-nowrap"
              style={{ background: 'rgba(0,0,0,0.06)', color: '#1a2617', border: 'none', fontFamily: "'Outfit', sans-serif" }}
            >
              <i className="ri-arrow-left-line mr-1" />
              {t('cart_back')}
            </button>
            <button
              type="submit"
              form="fendri-order-form"
              disabled={submitting}
              className="flex-1 py-3 rounded-full text-sm font-bold uppercase tracking-widest cursor-pointer border-none transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap"
              style={{ background: submitting ? '#9aaa96' : '#1a2617', color: '#c9a84c', fontFamily: "'Outfit', sans-serif" }}
            >
              {submitting ? (
                <><i className="ri-loader-4-line animate-spin mr-2" />{t('cart_sending')}</>
              ) : (
                <><i className="ri-check-line mr-2" />{t('cart_confirm')}</>
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
