import { useState, useRef, useEffect } from 'react';

type Country = {
  code: string;
  name: string;
  dial: string;
  flag: string;
};

const COUNTRIES: Country[] = [
  { code: 'TN', name: 'Tunisie', dial: '+216', flag: '🇹🇳' },
  { code: 'MA', name: 'Maroc', dial: '+212', flag: '🇲🇦' },
  { code: 'DZ', name: 'Algérie', dial: '+213', flag: '🇩🇿' },
  { code: 'EG', name: 'Égypte', dial: '+20', flag: '🇪🇬' },
  { code: 'SA', name: 'Arabie Saoudite', dial: '+966', flag: '🇸🇦' },
  { code: 'AE', name: 'Émirats Arabes Unis', dial: '+971', flag: '🇦🇪' },
  { code: 'QA', name: 'Qatar', dial: '+974', flag: '🇶🇦' },
  { code: 'KW', name: 'Koweït', dial: '+965', flag: '🇰🇼' },
  { code: 'JO', name: 'Jordanie', dial: '+962', flag: '🇯🇴' },
  { code: 'LB', name: 'Liban', dial: '+961', flag: '🇱🇧' },
  { code: 'LY', name: 'Libye', dial: '+218', flag: '🇱🇾' },
  { code: 'IQ', name: 'Irak', dial: '+964', flag: '🇮🇶' },
  { code: 'OM', name: 'Oman', dial: '+968', flag: '🇴🇲' },
  { code: 'YE', name: 'Yémen', dial: '+967', flag: '🇾🇪' },
  { code: 'SY', name: 'Syrie', dial: '+963', flag: '🇸🇾' },
  { code: 'PS', name: 'Palestine', dial: '+970', flag: '🇵🇸' },
  { code: 'FR', name: 'France', dial: '+33', flag: '🇫🇷' },
  { code: 'DE', name: 'Allemagne', dial: '+49', flag: '🇩🇪' },
  { code: 'GB', name: 'Royaume-Uni', dial: '+44', flag: '🇬🇧' },
  { code: 'IT', name: 'Italie', dial: '+39', flag: '🇮🇹' },
  { code: 'ES', name: 'Espagne', dial: '+34', flag: '🇪🇸' },
  { code: 'PT', name: 'Portugal', dial: '+351', flag: '🇵🇹' },
  { code: 'BE', name: 'Belgique', dial: '+32', flag: '🇧🇪' },
  { code: 'CH', name: 'Suisse', dial: '+41', flag: '🇨🇭' },
  { code: 'NL', name: 'Pays-Bas', dial: '+31', flag: '🇳🇱' },
  { code: 'AT', name: 'Autriche', dial: '+43', flag: '🇦🇹' },
  { code: 'SE', name: 'Suède', dial: '+46', flag: '🇸🇪' },
  { code: 'NO', name: 'Norvège', dial: '+47', flag: '🇳🇴' },
  { code: 'DK', name: 'Danemark', dial: '+45', flag: '🇩🇰' },
  { code: 'FI', name: 'Finlande', dial: '+358', flag: '🇫🇮' },
  { code: 'PL', name: 'Pologne', dial: '+48', flag: '🇵🇱' },
  { code: 'TR', name: 'Turquie', dial: '+90', flag: '🇹🇷' },
  { code: 'GR', name: 'Grèce', dial: '+30', flag: '🇬🇷' },
  { code: 'RO', name: 'Roumanie', dial: '+40', flag: '🇷🇴' },
];

type Props = {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
};

export default function PhoneField({ value, onChange, required }: Props) {
  const [selected, setSelected] = useState<Country>(COUNTRIES[0]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [localNumber, setLocalNumber] = useState('');
  const [focused, setFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && searchRef.current) searchRef.current.focus();
  }, [open]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filtered = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dial.includes(search) ||
      c.code.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = (c: Country) => {
    setSelected(c);
    setOpen(false);
    setSearch('');
    onChange(c.dial + localNumber);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = e.target.value.replace(/[^\d\s\-]/g, '');
    setLocalNumber(num);
    onChange(selected.dial + num);
  };

  const borderColor = focused ? '#d4af37' : '#e8e8e4';

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          borderRadius: 12,
          border: `1.5px solid ${borderColor}`,
          background: '#fafaf8',
          transition: 'border-color 0.2s',
          overflow: 'visible',
          boxSizing: 'border-box',
        }}
      >
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '10px 10px 10px 14px',
            background: 'transparent',
            border: 'none',
            borderRight: '1.5px solid #e8e8e4',
            cursor: 'pointer',
            flexShrink: 0,
            fontFamily: "'Outfit', sans-serif",
            fontSize: 13,
            color: '#1a2617',
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        >
          <span style={{ fontSize: 18, lineHeight: 1 }}>{selected.flag}</span>
          <span style={{ color: '#6b7280', fontSize: 12 }}>{selected.dial}</span>
          <span style={{ color: '#9ca3af', fontSize: 10 }}>▾</span>
        </button>

        <input
          type="tel"
          value={localNumber}
          onChange={handleNumberChange}
          placeholder="XX XXX XXX"
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1,
            border: 'none',
            background: 'transparent',
            outline: 'none',
            fontFamily: "'Outfit', sans-serif",
            fontSize: 13,
            color: '#1a2617',
            padding: '10px 14px',
            minWidth: 0,
          }}
        />
      </div>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            background: '#ffffff',
            border: '1.5px solid #e8e8e4',
            borderRadius: 12,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            zIndex: 9999,
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '8px 10px', borderBottom: '1px solid #f0f0ec' }}>
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un pays..."
              style={{
                width: '100%',
                border: '1px solid #e8e8e4',
                borderRadius: 8,
                padding: '6px 10px',
                fontSize: 12,
                fontFamily: "'Outfit', sans-serif",
                color: '#1a2617',
                background: '#fafaf8',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ maxHeight: 220, overflowY: 'auto' }}>
            {filtered.length === 0 ? (
              <div style={{ padding: '12px 14px', fontSize: 12, color: '#9ca3af', fontFamily: "'Outfit', sans-serif" }}>
                Aucun résultat
              </div>
            ) : (
              filtered.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => handleSelect(c)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    width: '100%',
                    padding: '9px 14px',
                    background: c.code === selected.code ? '#fdf8ee' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 13,
                    color: '#1a2617',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={(e) => { if (c.code !== selected.code) (e.currentTarget as HTMLButtonElement).style.background = '#f7f5f0'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = c.code === selected.code ? '#fdf8ee' : 'transparent'; }}
                >
                  <span style={{ fontSize: 18, lineHeight: 1 }}>{c.flag}</span>
                  <span style={{ flex: 1 }}>{c.name}</span>
                  <span style={{ color: '#9ca3af', fontSize: 12 }}>{c.dial}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
