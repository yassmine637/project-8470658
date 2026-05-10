import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { authApi } from '@/api/auth';
import { ordersApi, type Order } from '@/api/orders';
import Header from '@/components/feature/Header';
import { Eye, EyeOff, ChevronDown } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';
import { products as allProducts } from '@/mocks/products';
import { useCurrencyCtx } from '@/context/CurrencyContext';

const STATUS_COLORS: Record<string, { bg: string; color: string; label: string }> = {
  pending:   { bg: 'rgba(201,168,76,0.12)', color: '#c9a84c', label: 'En attente' },
  paid:      { bg: 'rgba(76,160,76,0.12)',  color: '#4ca04c', label: 'Payée' },
  shipped:   { bg: 'rgba(76,120,201,0.12)', color: '#4c78c9', label: 'Expédiée' },
  delivered: { bg: 'rgba(76,160,76,0.18)',  color: '#3d9c3d', label: 'Livrée' },
  cancelled: { bg: 'rgba(200,60,60,0.12)',  color: '#c83c3c', label: 'Annulée' },
};

const COUNTRIES = [
  // Pays arabes
  'Tunisie', 'Algérie', 'Maroc', 'Libye', 'Égypte', 'Mauritanie',
  'Arabie Saoudite', 'Émirats Arabes Unis', 'Qatar', 'Koweït', 'Bahreïn', 'Oman',
  'Jordanie', 'Liban', 'Syrie', 'Irak', 'Yémen', 'Palestine', 'Soudan',
  // Pays européens
  'France', 'Belgique', 'Suisse', 'Allemagne', 'Espagne', 'Italie',
  'Portugal', 'Pays-Bas', 'Luxembourg', 'Autriche', 'Suède', 'Norvège',
  'Danemark', 'Finlande', 'Pologne', 'République Tchèque', 'Hongrie',
  'Roumanie', 'Grèce', 'Turquie', 'Royaume-Uni', 'Irlande',
  // Autres
  'Canada', 'États-Unis', 'Australie',
];

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8,
  color: '#fff',
  fontFamily: "'Outfit', sans-serif",
  fontSize: 13,
  outline: 'none',
  transition: 'border-color 0.2s',
};

export default function AccountPage() {
  const { user, isLoading, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart, openCart } = useCart();
  const { format } = useCurrencyCtx();

  const [tab, setTab] = useState<'profile' | 'orders' | 'security' | 'wishlist'>('profile');
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const [form, setForm] = useState({ name: '', phone: '', country: '' });
  const [countryOpen, setCountryOpen] = useState(false);
  const countryRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [saveError, setSaveError] = useState('');

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState('');
  const [pwError, setPwError] = useState('');

  useEffect(() => {
    if (!isLoading && !user) navigate('/auth');
  }, [user, isLoading, navigate]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) {
        setCountryOpen(false);
      }
    };
    if (countryOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [countryOpen]);

  useEffect(() => {
    if (user) setForm({ name: user.name, phone: user.phone || '', country: COUNTRIES.includes(user.country || '') ? user.country || '' : '' });
  }, [user]);

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const data = await ordersApi.myOrders();
      setOrders(data);
    } catch {
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === 'orders' && user) fetchOrders();
  }, [tab, user, fetchOrders]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg('');
    setSaveError('');
    try {
      const { user: updated } = await authApi.updateProfile({ name: form.name, phone: form.phone, country: form.country });
      updateUser(updated);
      setSaveMsg('Profil mis à jour avec succès.');
    } catch {
      setSaveError('Erreur lors de la mise à jour.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg('');
    setPwError('');
    if (pwForm.newPassword.length < 8) {
      setPwError('Le nouveau mot de passe doit faire au moins 8 caractères.');
      return;
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError('Les mots de passe ne correspondent pas.');
      return;
    }
    setPwSaving(true);
    try {
      await authApi.changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      setPwMsg('Mot de passe modifié avec succès.');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message;
      setPwError(msg || 'Erreur lors du changement de mot de passe.');
    } finally {
      setPwSaving(false);
    }
  };

  if (isLoading || !user) return null;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

  const formatPrice = (amount: number, currency: string) => {
    const symbols: Record<string, string> = { TND: 'DT', EUR: '€', USD: '$' };
    return `${amount.toFixed(2)} ${symbols[currency] || currency}`;
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0e1a0d', color: '#fff' }}>
      <Header />

      <div style={{ paddingTop: 96, paddingBottom: 64, maxWidth: 860, margin: '0 auto', padding: '96px 24px 64px' }}>

        {/* Page title */}
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, letterSpacing: '0.3em', color: '#c9a84c', textTransform: 'uppercase', marginBottom: 8 }}>
            Mon espace
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 2, marginBottom: 36, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 0, flexWrap: 'wrap' }}>
          {(['profile', 'orders', 'wishlist', 'security'] as const).map((tabKey) => (
            <button
              key={tabKey}
              onClick={() => setTab(tabKey)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '10px 20px',
                fontFamily: "'Outfit', sans-serif",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: tab === tabKey ? '#c9a84c' : 'rgba(255,255,255,0.4)',
                borderBottom: tab === tabKey ? '2px solid #c9a84c' : '2px solid transparent',
                marginBottom: -1,
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              {tabKey === 'profile' ? 'Mon Profil' : tabKey === 'orders' ? 'Mes Commandes' : tabKey === 'wishlist' ? (
                <>
                  <i className="ri-heart-line" style={{ fontSize: 13 }} />
                  Favoris
                  {wishlist.length > 0 && (
                    <span style={{ background: '#dc3545', color: '#fff', borderRadius: '50%', width: 16, height: 16, fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                      {wishlist.length}
                    </span>
                  )}
                </>
              ) : 'Sécurité'}
            </button>
          ))}
        </div>

        {/* Profile tab */}
        {tab === 'profile' && (
          <form onSubmit={handleSave}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
              <div>
                <label style={{ display: 'block', fontFamily: "'Outfit', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 8 }}>
                  Nom complet
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = 'rgba(201,168,76,0.5)')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: "'Outfit', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 8 }}>
                  Email
                </label>
                <input
                  value={user.email}
                  disabled
                  style={{ ...inputStyle, opacity: 0.35, cursor: 'not-allowed' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: "'Outfit', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 8 }}>
                  Téléphone
                </label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+216 XX XXX XXX"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = 'rgba(201,168,76,0.5)')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: "'Outfit', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 8 }}>
                  Pays
                </label>
                <div ref={countryRef} style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => setCountryOpen((v) => !v)}
                    style={{
                      ...inputStyle,
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      borderColor: countryOpen ? 'rgba(201,168,76,0.5)' : 'rgba(255,255,255,0.1)',
                      textAlign: 'left',
                    }}
                  >
                    <span style={{ color: form.country ? '#fff' : 'rgba(255,255,255,0.3)' }}>
                      {form.country || '— Sélectionner —'}
                    </span>
                    <ChevronDown size={14} style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0, transform: countryOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>
                  {countryOpen && (
                    <div style={{
                      position: 'absolute',
                      top: 'calc(100% + 4px)',
                      left: 0,
                      right: 0,
                      background: '#1a2617',
                      border: '1px solid rgba(201,168,76,0.3)',
                      borderRadius: 8,
                      zIndex: 100,
                      overflowY: 'auto',
                      maxHeight: 220,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                    }}>
                      {['', ...COUNTRIES].map((c) => (
                        <button
                          key={c || '__placeholder'}
                          type="button"
                          onClick={() => { setForm({ ...form, country: c }); setCountryOpen(false); }}
                          style={{
                            display: 'block',
                            width: '100%',
                            padding: '10px 14px',
                            background: form.country === c ? 'rgba(201,168,76,0.12)' : 'transparent',
                            border: 'none',
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                            color: c ? (form.country === c ? '#c9a84c' : '#fff') : 'rgba(255,255,255,0.3)',
                            fontFamily: "'Outfit', sans-serif",
                            fontSize: 13,
                            textAlign: 'left',
                            cursor: 'pointer',
                          }}
                          onMouseEnter={(e) => { if (form.country !== c) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)'; }}
                          onMouseLeave={(e) => { if (form.country !== c) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                        >
                          {c || '— Sélectionner —'}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {saveMsg && (
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: '#4ca04c', marginBottom: 16 }}>
                <i className="ri-check-line" style={{ marginRight: 6 }} />{saveMsg}
              </p>
            )}
            {saveError && (
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: '#c83c3c', marginBottom: 16 }}>
                <i className="ri-error-warning-line" style={{ marginRight: 6 }} />{saveError}
              </p>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  padding: '10px 28px',
                  background: '#c9a84c',
                  border: 'none',
                  borderRadius: 24,
                  color: '#1a2617',
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.7 : 1,
                  transition: 'all 0.2s',
                }}
              >
                {saving ? 'Enregistrement...' : 'Sauvegarder'}
              </button>
            </div>
          </form>
        )}

        {/* Security tab */}
        {tab === 'security' && (
          <form onSubmit={handleChangePassword} style={{ maxWidth: 480 }}>
            <div style={{
              padding: '20px 24px',
              marginBottom: 28,
              background: 'rgba(201,168,76,0.06)',
              border: '1px solid rgba(201,168,76,0.15)',
              borderRadius: 10,
            }}>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.6 }}>
                Choisissez un mot de passe fort d'au moins 8 caractères. Il ne doit pas être réutilisé ailleurs.
              </p>
            </div>

            {/* Current password */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontFamily: "'Outfit', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 8 }}>
                Mot de passe actuel
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={pwForm.currentPassword}
                  onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                  required
                  autoComplete="current-password"
                  style={{ ...inputStyle, paddingRight: 42 }}
                  onFocus={(e) => (e.target.style.borderColor = 'rgba(201,168,76,0.5)')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
                <button type="button" onClick={() => setShowCurrent((v) => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', padding: 0, display: 'flex', alignItems: 'center' }}>
                  {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* New password */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontFamily: "'Outfit', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 8 }}>
                Nouveau mot de passe
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showNew ? 'text' : 'password'}
                  value={pwForm.newPassword}
                  onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                  required
                  autoComplete="new-password"
                  placeholder="8 caractères minimum"
                  style={{ ...inputStyle, paddingRight: 42 }}
                  onFocus={(e) => (e.target.style.borderColor = 'rgba(201,168,76,0.5)')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
                <button type="button" onClick={() => setShowNew((v) => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', padding: 0, display: 'flex', alignItems: 'center' }}>
                  {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {/* Strength bar */}
              {pwForm.newPassword.length > 0 && (() => {
                const len = pwForm.newPassword.length;
                const strength = len >= 12 ? 3 : len >= 8 ? 2 : 1;
                const colors = ['#c83c3c', '#c9a84c', '#4ca04c'];
                const labels = ['Faible', 'Moyen', 'Fort'];
                return (
                  <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ display: 'flex', gap: 4, flex: 1 }}>
                      {[1, 2, 3].map((s) => (
                        <div key={s} style={{ height: 3, flex: 1, borderRadius: 2, background: s <= strength ? colors[strength - 1] : 'rgba(255,255,255,0.1)', transition: 'background 0.3s' }} />
                      ))}
                    </div>
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, color: colors[strength - 1], letterSpacing: '0.05em' }}>{labels[strength - 1]}</span>
                  </div>
                );
              })()}
            </div>

            {/* Confirm password */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontFamily: "'Outfit', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 8 }}>
                Confirmer le nouveau mot de passe
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={pwForm.confirmPassword}
                  onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                  required
                  autoComplete="new-password"
                  style={{ ...inputStyle, paddingRight: 42, borderColor: pwForm.confirmPassword && pwForm.confirmPassword !== pwForm.newPassword ? 'rgba(200,60,60,0.5)' : undefined }}
                  onFocus={(e) => (e.target.style.borderColor = 'rgba(201,168,76,0.5)')}
                  onBlur={(e) => (e.target.style.borderColor = pwForm.confirmPassword && pwForm.confirmPassword !== pwForm.newPassword ? 'rgba(200,60,60,0.5)' : 'rgba(255,255,255,0.1)')}
                />
                <button type="button" onClick={() => setShowConfirm((v) => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', padding: 0, display: 'flex', alignItems: 'center' }}>
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {pwForm.confirmPassword && pwForm.confirmPassword !== pwForm.newPassword && (
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: '#c83c3c', marginTop: 6, marginBottom: 0 }}>
                  Les mots de passe ne correspondent pas.
                </p>
              )}
            </div>

            {pwMsg && (
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: '#4ca04c', marginBottom: 16 }}>
                <i className="ri-check-line" style={{ marginRight: 6 }} />{pwMsg}
              </p>
            )}
            {pwError && (
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: '#c83c3c', marginBottom: 16 }}>
                <i className="ri-error-warning-line" style={{ marginRight: 6 }} />{pwError}
              </p>
            )}

            <button
              type="submit"
              disabled={pwSaving}
              style={{
                padding: '10px 28px',
                background: '#c9a84c',
                border: 'none',
                borderRadius: 24,
                color: '#1a2617',
                fontFamily: "'Outfit', sans-serif",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.1em',
                cursor: pwSaving ? 'not-allowed' : 'pointer',
                opacity: pwSaving ? 0.7 : 1,
                transition: 'all 0.2s',
              }}
            >
              {pwSaving ? 'Modification...' : 'Modifier le mot de passe'}
            </button>
          </form>
        )}

        {/* Wishlist tab */}
        {tab === 'wishlist' && (
          <div>
            {wishlist.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '64px 32px', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, background: 'rgba(255,255,255,0.02)' }}>
                <i className="ri-heart-line" style={{ fontSize: 40, color: 'rgba(255,255,255,0.12)', display: 'block', marginBottom: 16 }} />
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.35)', margin: '0 0 6px' }}>
                  Votre liste de souhaits est vide
                </p>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.2)', margin: 0 }}>
                  Parcourez notre collection et sauvegardez vos huiles préférées
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
                {wishlist.map((productId) => {
                  const product = allProducts.find((p) => p.id === productId);
                  if (!product) return null;
                  return (
                    <div
                      key={product.id}
                      style={{
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 12,
                        overflow: 'hidden',
                        background: 'rgba(255,255,255,0.03)',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <div style={{ background: 'linear-gradient(160deg, #1a2617 0%, #0e1a0d 100%)', padding: '20px', display: 'flex', justifyContent: 'center' }}>
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{ height: 120, width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}
                        />
                      </div>
                      <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: '#c9a84c', letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>
                          {product.volume}
                        </p>
                        <p style={{ fontFamily: "'Cormorant Garant', serif", fontSize: 17, fontWeight: 700, color: '#fff', margin: 0, lineHeight: 1.2 }}>
                          {product.name}
                        </p>
                        <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 700, color: '#c9a84c', margin: 0 }}>
                          {format(product.price)} <span style={{ fontSize: 12, fontWeight: 400, color: 'rgba(255,255,255,0.4)' }}>TND</span>
                        </p>
                        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                          <button
                            onClick={() => { addToCart(product); openCart(); }}
                            style={{
                              flex: 1, padding: '8px 0', background: '#c9a84c', border: 'none', borderRadius: 8,
                              color: '#1a2617', fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 700,
                              letterSpacing: '0.08em', cursor: 'pointer', transition: 'all 0.2s',
                            }}
                          >
                            <i className="ri-shopping-basket-2-line" style={{ marginRight: 5 }} />
                            Commander
                          </button>
                          <button
                            onClick={() => toggleWishlist(product.id)}
                            style={{
                              width: 34, height: 34, background: 'rgba(220,53,69,0.1)', border: '1px solid rgba(220,53,69,0.25)',
                              borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                              transition: 'all 0.2s', flexShrink: 0,
                            }}
                            title="Retirer des favoris"
                          >
                            <i className="ri-heart-fill" style={{ color: '#dc3545', fontSize: 14 }} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Orders tab */}
        {tab === 'orders' && (
          <div>
            {ordersLoading ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: 'rgba(255,255,255,0.3)', fontFamily: "'Outfit', sans-serif", fontSize: 13 }}>
                Chargement de vos commandes...
              </div>
            ) : orders.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '64px 32px',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 12, background: 'rgba(255,255,255,0.02)',
              }}>
                <i className="ri-shopping-bag-line" style={{ fontSize: 36, color: 'rgba(255,255,255,0.15)', display: 'block', marginBottom: 16 }} />
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.35)', margin: 0 }}>
                  Aucune commande pour le moment.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {orders.map((order) => {
                  const status = STATUS_COLORS[order.status] || { bg: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', label: order.status };
                  return (
                    <div
                      key={order._id}
                      style={{
                        border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: 12,
                        padding: '20px 24px',
                        background: 'rgba(255,255,255,0.02)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                        <div>
                          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.35)', margin: '0 0 4px', letterSpacing: '0.05em' }}>
                            Commande · {formatDate(order.createdAt)}
                          </p>
                          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.2)', margin: 0, letterSpacing: '0.03em' }}>
                            #{order._id.slice(-8).toUpperCase()}
                          </p>
                        </div>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: 20,
                          background: status.bg,
                          color: status.color,
                          fontFamily: "'Outfit', sans-serif",
                          fontSize: 11,
                          fontWeight: 600,
                          letterSpacing: '0.06em',
                        }}>
                          {status.label}
                        </span>
                      </div>

                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 14 }}>
                        {order.items.map((item, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>
                              {item.productName}
                              {item.volume && <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, marginLeft: 6 }}>· {item.volume}</span>}
                              <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, marginLeft: 6 }}>× {item.quantity}</span>
                            </span>
                            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: '#c9a84c', fontWeight: 600 }}>
                              {formatPrice(item.price * item.quantity, order.currency)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 700, color: '#fff' }}>
                          Total : {formatPrice(order.totalTTC, order.currency)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
