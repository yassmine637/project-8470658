import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { authApi } from '@/api/auth';
import { ordersApi, type Order } from '@/api/orders';
import Header from '@/components/feature/Header';

const STATUS_COLORS: Record<string, { bg: string; color: string; label: string }> = {
  pending:   { bg: 'rgba(201,168,76,0.12)', color: '#c9a84c', label: 'En attente' },
  paid:      { bg: 'rgba(76,160,76,0.12)',  color: '#4ca04c', label: 'Payée' },
  shipped:   { bg: 'rgba(76,120,201,0.12)', color: '#4c78c9', label: 'Expédiée' },
  delivered: { bg: 'rgba(76,160,76,0.18)',  color: '#3d9c3d', label: 'Livrée' },
  cancelled: { bg: 'rgba(200,60,60,0.12)',  color: '#c83c3c', label: 'Annulée' },
};

const COUNTRIES = ['Tunisie', 'France', 'Belgique', 'Suisse', 'Canada', 'Maroc', 'Algérie', 'Autre'];

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
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState<'profile' | 'orders'>('profile');
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const [form, setForm] = useState({ name: '', phone: '', country: '' });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (!isLoading && !user) navigate('/auth');
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (user) setForm({ name: user.name, phone: user.phone || '', country: user.country || '' });
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
      await authApi.updateProfile({ name: form.name, phone: form.phone, country: form.country });
      setSaveMsg('Profil mis à jour avec succès.');
    } catch {
      setSaveError('Erreur lors de la mise à jour.');
    } finally {
      setSaving(false);
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
          <h1 style={{ fontFamily: "'Cormorant Garant', serif", fontSize: '2rem', fontWeight: 700, color: '#fff', margin: 0 }}>
            {user.name}
          </h1>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
            {user.email}
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 2, marginBottom: 36, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 0 }}>
          {(['profile', 'orders'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
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
                color: tab === t ? '#c9a84c' : 'rgba(255,255,255,0.4)',
                borderBottom: tab === t ? '2px solid #c9a84c' : '2px solid transparent',
                marginBottom: -1,
                transition: 'all 0.2s',
              }}
            >
              {t === 'profile' ? 'Mon Profil' : 'Mes Commandes'}
            </button>
          ))}
        </div>

        {/* Profile tab */}
        {tab === 'profile' && (
          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
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
                <select
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  onFocus={(e) => (e.target.style.borderColor = 'rgba(201,168,76,0.5)')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                >
                  <option value="">— Sélectionner —</option>
                  {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
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
              <button
                type="button"
                onClick={() => { logout(); navigate('/'); }}
                style={{
                  padding: '10px 20px',
                  background: 'none',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 24,
                  color: 'rgba(255,255,255,0.45)',
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <i className="ri-logout-box-r-line" style={{ marginRight: 6 }} />
                Se déconnecter
              </button>
            </div>
          </form>
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
