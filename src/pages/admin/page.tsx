import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { adminApi } from '@/api/admin';

type Tab = 'stats' | 'orders' | 'configs' | 'messages' | 'users' | 'security';

type ShippingModal = { orderId: string; trackingNumber: string; carrier: string } | null;

const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b', paid: '#10b981', processing: '#3b82f6',
  shipped: '#8b5cf6', delivered: '#059669', cancelled: '#ef4444',
  new: '#f59e0b', reviewing: '#3b82f6', quoted: '#8b5cf6',
  accepted: '#10b981', rejected: '#ef4444',
};

export default function AdminPage() {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('stats');
  const [stats, setStats] = useState<Record<string, number> | null>(null);
  const [orders, setOrders] = useState<unknown[]>([]);
  const [configs, setConfigs] = useState<unknown[]>([]);
  const [messages, setMessages] = useState<unknown[]>([]);
  const [users, setUsers] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(false);
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwStatus, setPwStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [pwError, setPwError] = useState('');
  const [shippingModal, setShippingModal] = useState<ShippingModal>(null);

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) navigate('/auth');
  }, [isLoading, user, isAdmin, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    const load = async () => {
      setLoading(true);
      try {
        if (tab === 'stats') {
          const s = await adminApi.stats();
          setStats(s as Record<string, number>);
        } else if (tab === 'orders') {
          const { orders } = await adminApi.orders();
          setOrders(orders);
        } else if (tab === 'configs') {
          const { orders } = await adminApi.configuratorOrders();
          setConfigs(orders);
        } else if (tab === 'messages') {
          const { messages } = await adminApi.messages();
          setMessages(messages);
        } else if (tab === 'users') {
          const u = await adminApi.users();
          setUsers(u);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [tab, isAdmin]);

  if (isLoading) return null;

  const TABS: { key: Tab; label: string; icon: string }[] = [
    { key: 'stats', label: 'Tableau de bord', icon: 'ri-dashboard-line' },
    { key: 'orders', label: 'Commandes', icon: 'ri-shopping-bag-line' },
    { key: 'configs', label: 'Devis configurateur', icon: 'ri-flask-line' },
    { key: 'messages', label: 'Messages', icon: 'ri-mail-line' },
    { key: 'users', label: 'Utilisateurs', icon: 'ri-team-line' },
    { key: 'security', label: 'Sécurité', icon: 'ri-shield-keyhole-line' },
  ];

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    if (pwForm.next !== pwForm.confirm) {
      setPwError('Les nouveaux mots de passe ne correspondent pas');
      return;
    }
    if (pwForm.next.length < 8) {
      setPwError('Le nouveau mot de passe doit faire au moins 8 caractères');
      return;
    }
    setPwStatus('loading');
    try {
      const token = localStorage.getItem('fendri_token');
      const res = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setPwStatus('success');
      setPwForm({ current: '', next: '', confirm: '' });
    } catch (err: unknown) {
      setPwError(err instanceof Error ? err.message : 'Erreur');
      setPwStatus('error');
    }
  };

  const cell = 'px-4 py-3 text-left text-sm';
  const headCell = 'px-4 py-3 text-left text-xs font-bold uppercase tracking-wider';

  return (
    <div className="min-h-screen" style={{ background: '#f5f3ee' }}>
      <div style={{ background: '#1a2617', color: 'white', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: "'Cormorant Garant', serif", fontSize: '1.3rem', fontWeight: 700, color: '#d4af37' }}>
          FENDRI — Admin
        </div>
        <Link to="/" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontFamily: "'Outfit', sans-serif" }}>
          ← Retour au site
        </Link>
      </div>

      <div className="flex">
        <aside style={{ width: '220px', minHeight: 'calc(100vh - 56px)', background: '#ffffff', borderRight: '1px solid #e8e8e4', padding: '16px 0', flexShrink: 0 }}>
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="cursor-pointer w-full flex items-center gap-3 px-5 py-3 text-sm transition-all"
              style={{
                fontFamily: "'Outfit', sans-serif",
                color: tab === t.key ? '#1a2617' : '#6b7280',
                background: tab === t.key ? 'rgba(212,175,55,0.1)' : 'transparent',
                borderLeft: tab === t.key ? '3px solid #d4af37' : '3px solid transparent',
                fontWeight: tab === t.key ? 600 : 400,
              }}
            >
              <i className={t.icon} />
              {t.label}
            </button>
          ))}
        </aside>

        <main className="flex-1 p-8">
          {loading && <div style={{ color: '#9ca3af', fontFamily: "'Outfit', sans-serif" }}>Chargement...</div>}

          {!loading && tab === 'stats' && stats && (
            <div>
              <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Cormorant Garant', serif", color: '#1a2617' }}>Tableau de bord</h2>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { label: 'Commandes totales', value: stats.totalOrders, icon: 'ri-shopping-bag-line', color: '#3b82f6' },
                  { label: 'Utilisateurs', value: stats.totalUsers, icon: 'ri-team-line', color: '#8b5cf6' },
                  { label: 'Devis en attente', value: stats.pendingConfigs, icon: 'ri-flask-line', color: '#f59e0b' },
                  { label: 'Messages non lus', value: stats.unreadMessages, icon: 'ri-mail-line', color: '#ef4444' },
                  { label: 'Produits actifs', value: stats.totalProducts, icon: 'ri-leaf-line', color: '#10b981' },
                  { label: 'Revenu payé (TND)', value: `${stats.revenue} TND`, icon: 'ri-money-dollar-circle-line', color: '#d4af37' },
                ].map((s) => (
                  <div key={s.label} className="rounded-2xl p-6" style={{ background: '#ffffff', border: '1px solid #e8e8e4' }}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${s.color}18`, color: s.color }}>
                        <i className={s.icon} style={{ fontSize: '1.2rem' }} />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#9ca3af', fontFamily: "'Outfit', sans-serif" }}>{s.label}</span>
                    </div>
                    <div className="text-3xl font-bold" style={{ fontFamily: "'Cormorant Garant', serif", color: '#1a2617' }}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && tab === 'orders' && (
            <div>
              <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Cormorant Garant', serif", color: '#1a2617' }}>Commandes</h2>
              <div className="rounded-2xl overflow-hidden" style={{ background: '#ffffff', border: '1px solid #e8e8e4' }}>
                <table className="w-full">
                  <thead style={{ background: '#f9f9f7', borderBottom: '1px solid #e8e8e4' }}>
                    <tr>
                      {['ID', 'Client', 'Total TTC', 'Statut', 'Date', 'Action'].map((h) => (
                        <th key={h} className={headCell} style={{ color: '#6b7280', fontFamily: "'Outfit', sans-serif" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(orders as Record<string, unknown>[]).map((o) => (
                      <tr key={o._id as string} style={{ borderBottom: '1px solid #f3f3f0' }}>
                        <td className={cell} style={{ color: '#9ca3af', fontFamily: "'Outfit', sans-serif", fontSize: '0.75rem' }}>{(o._id as string).slice(-8)}</td>
                        <td className={cell} style={{ fontFamily: "'Outfit', sans-serif", color: '#1a2617' }}>
                          <div>{(o.guestName as string) || (o.user as Record<string, string>)?.name || 'Utilisateur'}</div>
                          <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>{(o.guestEmail as string) || (o.user as Record<string, string>)?.email || ''}</div>
                        </td>
                        <td className={cell} style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, color: '#1a2617' }}>{o.totalTTC as number} {o.currency as string}</td>
                        <td className={cell}>
                          <span className="px-2 py-1 rounded-full text-xs font-bold" style={{ background: `${STATUS_COLORS[o.status as string] || '#9ca3af'}18`, color: STATUS_COLORS[o.status as string] || '#9ca3af', fontFamily: "'Outfit', sans-serif" }}>
                            {o.status as string}
                          </span>
                        </td>
                        <td className={cell} style={{ color: '#9ca3af', fontFamily: "'Outfit', sans-serif", fontSize: '0.8rem' }}>
                          {new Date(o.createdAt as string).toLocaleDateString('fr-FR')}
                        </td>
                        <td className={cell}>
                          <select
                            value={o.status as string}
                            onChange={(e) => {
                              const newStatus = e.target.value;
                              const prevStatus = o.status as string;
                              if (newStatus === 'shipped') {
                                setShippingModal({ orderId: o._id as string, trackingNumber: '', carrier: '' });
                              } else {
                                setOrders((prev) => prev.map((x) => (x as Record<string, unknown>)._id === o._id ? { ...x, status: newStatus } : x));
                                adminApi.updateOrderStatus(o._id as string, newStatus)
                                  .catch(() => {
                                    setOrders((prev) => prev.map((x) => (x as Record<string, unknown>)._id === o._id ? { ...x, status: prevStatus } : x));
                                    alert('Erreur lors du changement de statut');
                                  });
                              }
                            }}
                            style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.78rem', padding: '4px 8px', borderRadius: '8px', border: '1.5px solid #e8e8e4', background: '#fafaf8', color: '#1a2617', cursor: 'pointer', outline: 'none' }}
                          >
                            <option value="pending">En attente</option>
                            <option value="paid">Payée</option>
                            <option value="processing">En préparation</option>
                            <option value="shipped">Expédiée 📦</option>
                            <option value="delivered">Livrée</option>
                            <option value="cancelled">Annulée</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr><td colSpan={6} className="text-center py-8" style={{ color: '#9ca3af', fontFamily: "'Outfit', sans-serif" }}>Aucune commande</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!loading && tab === 'configs' && (
            <div>
              <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Cormorant Garant', serif", color: '#1a2617' }}>Devis configurateur</h2>
              <div className="rounded-2xl overflow-hidden" style={{ background: '#ffffff', border: '1px solid #e8e8e4' }}>
                <table className="w-full">
                  <thead style={{ background: '#f9f9f7', borderBottom: '1px solid #e8e8e4' }}>
                    <tr>
                      {['Référence', 'Client', 'Email', 'Total TTC', 'Statut', 'Date'].map((h) => (
                        <th key={h} className={headCell} style={{ color: '#6b7280', fontFamily: "'Outfit', sans-serif" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(configs as Record<string, unknown>[]).map((c) => (
                      <tr key={c._id as string} style={{ borderBottom: '1px solid #f3f3f0' }}>
                        <td className={cell} style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.75rem', color: '#d4af37', fontWeight: 600 }}>{c.devisNumber as string}</td>
                        <td className={cell} style={{ fontFamily: "'Outfit', sans-serif", color: '#1a2617' }}>{c.name as string}</td>
                        <td className={cell} style={{ color: '#9ca3af', fontFamily: "'Outfit', sans-serif", fontSize: '0.8rem' }}>{c.email as string}</td>
                        <td className={cell} style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, color: '#1a2617' }}>{c.totalTTC as number} {c.currency as string}</td>
                        <td className={cell}>
                          <span className="px-2 py-1 rounded-full text-xs font-bold" style={{ background: `${STATUS_COLORS[c.status as string] || '#9ca3af'}18`, color: STATUS_COLORS[c.status as string] || '#9ca3af', fontFamily: "'Outfit', sans-serif" }}>
                            {c.status as string}
                          </span>
                        </td>
                        <td className={cell} style={{ color: '#9ca3af', fontFamily: "'Outfit', sans-serif", fontSize: '0.8rem' }}>
                          {new Date(c.createdAt as string).toLocaleDateString('fr-FR')}
                        </td>
                      </tr>
                    ))}
                    {configs.length === 0 && (
                      <tr><td colSpan={6} className="text-center py-8" style={{ color: '#9ca3af', fontFamily: "'Outfit', sans-serif" }}>Aucun devis</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!loading && tab === 'messages' && (
            <div>
              <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Cormorant Garant', serif", color: '#1a2617' }}>Messages de contact</h2>
              <div className="flex flex-col gap-3">
                {(messages as Record<string, unknown>[]).map((m) => (
                  <div key={m._id as string} className="rounded-2xl p-5" style={{ background: '#ffffff', border: `1px solid ${m.read ? '#e8e8e4' : 'rgba(212,175,55,0.3)'}` }}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-bold text-sm mb-1" style={{ color: '#1a2617', fontFamily: "'Outfit', sans-serif" }}>
                          {m.nom as string} {m.prenom as string}
                          {!m.read && <span className="ml-2 px-2 py-0.5 rounded-full text-xs" style={{ background: 'rgba(212,175,55,0.15)', color: '#d4af37' }}>Nouveau</span>}
                        </div>
                        <div className="text-xs mb-3" style={{ color: '#9ca3af', fontFamily: "'Outfit', sans-serif" }}>
                          {m.email as string} · {m.telephone as string} · {m.pays as string}
                        </div>
                        <div className="text-sm font-semibold mb-1" style={{ color: '#3a6040', fontFamily: "'Outfit', sans-serif" }}>{m.sujet as string}</div>
                        <div className="text-sm" style={{ color: '#4b5563', fontFamily: "'Outfit', sans-serif" }}>{m.message as string}</div>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <span className="text-xs" style={{ color: '#9ca3af', fontFamily: "'Outfit', sans-serif" }}>
                          {new Date(m.createdAt as string).toLocaleDateString('fr-FR')}
                        </span>
                        {!m.read && (
                          <button
                            onClick={() => adminApi.markMessageRead(m._id as string).then(() => setMessages((ms) => ms.map((x) => (x as Record<string, unknown>)._id === m._id ? { ...x, read: true } : x)))}
                            className="cursor-pointer px-3 py-1 rounded-full text-xs font-bold"
                            style={{ background: '#1a2617', color: '#d4af37', fontFamily: "'Outfit', sans-serif" }}
                          >
                            Marquer lu
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {messages.length === 0 && <div className="text-center py-8" style={{ color: '#9ca3af', fontFamily: "'Outfit', sans-serif" }}>Aucun message</div>}
              </div>
            </div>
          )}

          {!loading && tab === 'users' && (
            <div>
              <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Cormorant Garant', serif", color: '#1a2617' }}>Utilisateurs</h2>
              <div className="rounded-2xl overflow-hidden" style={{ background: '#ffffff', border: '1px solid #e8e8e4' }}>
                <table className="w-full">
                  <thead style={{ background: '#f9f9f7', borderBottom: '1px solid #e8e8e4' }}>
                    <tr>
                      {['Nom', 'Email', 'Téléphone', 'Rôle', 'Inscription'].map((h) => (
                        <th key={h} className={headCell} style={{ color: '#6b7280', fontFamily: "'Outfit', sans-serif" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(users as Record<string, unknown>[]).map((u) => (
                      <tr key={u._id as string} style={{ borderBottom: '1px solid #f3f3f0' }}>
                        <td className={cell} style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, color: '#1a2617' }}>{u.name as string}</td>
                        <td className={cell} style={{ color: '#9ca3af', fontFamily: "'Outfit', sans-serif" }}>{u.email as string}</td>
                        <td className={cell} style={{ color: '#9ca3af', fontFamily: "'Outfit', sans-serif" }}>{(u.phone as string) || '—'}</td>
                        <td className={cell}>
                          <span className="px-2 py-1 rounded-full text-xs font-bold" style={{ background: u.role === 'admin' ? 'rgba(212,175,55,0.15)' : 'rgba(59,130,246,0.1)', color: u.role === 'admin' ? '#d4af37' : '#3b82f6', fontFamily: "'Outfit', sans-serif" }}>
                            {u.role as string}
                          </span>
                        </td>
                        <td className={cell} style={{ color: '#9ca3af', fontFamily: "'Outfit', sans-serif", fontSize: '0.8rem' }}>
                          {new Date(u.createdAt as string).toLocaleDateString('fr-FR')}
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr><td colSpan={5} className="text-center py-8" style={{ color: '#9ca3af', fontFamily: "'Outfit', sans-serif" }}>Aucun utilisateur</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {!loading && tab === 'security' && (
            <div>
              <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Cormorant Garant', serif", color: '#1a2617' }}>Sécurité du compte</h2>
              <p className="text-sm mb-8" style={{ color: '#9ca3af', fontFamily: "'Outfit', sans-serif" }}>
                Connecté en tant que <strong style={{ color: '#1a2617' }}>{user?.email}</strong>
              </p>

              <div className="rounded-2xl p-8 max-w-md" style={{ background: '#ffffff', border: '1px solid #e8e8e4' }}>
                <div style={{ height: '3px', background: 'linear-gradient(to right, #1a2617, #d4af37, #1a2617)', borderRadius: 2, marginBottom: 28 }} />
                <h3 className="text-lg font-bold mb-6" style={{ fontFamily: "'Cormorant Garant', serif", color: '#1a2617' }}>
                  Changer le mot de passe
                </h3>

                {pwStatus === 'success' && (
                  <div className="mb-5 p-3 rounded-xl text-sm" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', fontFamily: "'Outfit', sans-serif" }}>
                    ✅ Mot de passe modifié avec succès !
                  </div>
                )}
                {pwError && (
                  <div className="mb-5 p-3 rounded-xl text-sm" style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', fontFamily: "'Outfit', sans-serif" }}>
                    {pwError}
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="flex flex-col gap-5">
                  {[
                    { key: 'current', label: 'Mot de passe actuel', placeholder: '••••••••' },
                    { key: 'next', label: 'Nouveau mot de passe', placeholder: 'Min. 8 caractères' },
                    { key: 'confirm', label: 'Confirmer le nouveau mot de passe', placeholder: '••••••••' },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key}>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#5a6e56', fontFamily: "'Outfit', sans-serif" }}>
                        {label}
                      </label>
                      <input
                        type="password"
                        placeholder={placeholder}
                        value={pwForm[key as keyof typeof pwForm]}
                        onChange={(e) => setPwForm((f) => ({ ...f, [key]: e.target.value }))}
                        required
                        className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                        style={{ border: '1.5px solid #e8e8e4', background: '#fafaf8', color: '#1a2617', fontFamily: "'Outfit', sans-serif" }}
                        onFocus={(e) => { e.target.style.borderColor = '#d4af37'; }}
                        onBlur={(e) => { e.target.style.borderColor = '#e8e8e4'; }}
                      />
                    </div>
                  ))}
                  <button
                    type="submit"
                    disabled={pwStatus === 'loading'}
                    className="w-full py-3 rounded-full font-bold uppercase tracking-widest text-sm transition-all duration-300 hover:-translate-y-0.5 cursor-pointer disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg, #1a2617 0%, #2f4229 100%)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.2)', fontFamily: "'Outfit', sans-serif" }}
                  >
                    {pwStatus === 'loading' ? 'Modification...' : 'Enregistrer le nouveau mot de passe'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal numéro de suivi */}
      {shippingModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '40px', maxWidth: '460px', width: '100%', boxShadow: '0 24px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ height: '3px', background: 'linear-gradient(to right, #1a2617, #d4af37, #1a2617)', borderRadius: 2, marginBottom: 28 }} />
            <p style={{ margin: '0 0 4px', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#d4af37', fontFamily: "'Outfit', sans-serif" }}>
              Expédition
            </p>
            <h3 style={{ margin: '0 0 8px', fontSize: '20px', fontFamily: "'Cormorant Garant', serif", color: '#1a2617', fontWeight: 700 }}>
              Informations de livraison
            </h3>
            <p style={{ margin: '0 0 24px', fontSize: '13px', color: '#9ca3af', fontFamily: "'Outfit', sans-serif", lineHeight: 1.6 }}>
              Ces informations seront incluses dans l'email envoyé au client.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#5a6e56', marginBottom: '6px', fontFamily: "'Outfit', sans-serif" }}>
                  Transporteur
                </label>
                <input
                  type="text"
                  placeholder="ex : Colissimo, DHL, Aramex..."
                  value={shippingModal.carrier}
                  onChange={(e) => setShippingModal((m) => m ? { ...m, carrier: e.target.value } : m)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #e8e8e4', background: '#fafaf8', color: '#1a2617', fontFamily: "'Outfit', sans-serif", fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={(e) => { e.target.style.borderColor = '#d4af37'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e8e8e4'; }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#5a6e56', marginBottom: '6px', fontFamily: "'Outfit', sans-serif" }}>
                  Numéro de suivi <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optionnel)</span>
                </label>
                <input
                  type="text"
                  placeholder="ex : 1Z999AA10123456784"
                  value={shippingModal.trackingNumber}
                  onChange={(e) => setShippingModal((m) => m ? { ...m, trackingNumber: e.target.value } : m)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #e8e8e4', background: '#fafaf8', color: '#1a2617', fontFamily: "'Outfit', sans-serif", fontSize: '14px', outline: 'none', boxSizing: 'border-box', letterSpacing: '1px' }}
                  onFocus={(e) => { e.target.style.borderColor = '#d4af37'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e8e8e4'; }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
              <button
                onClick={() => setShippingModal(null)}
                style={{ flex: 1, padding: '12px', borderRadius: '999px', border: '1.5px solid #e8e8e4', background: 'transparent', color: '#6b7280', fontFamily: "'Outfit', sans-serif", fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
              >
                Annuler
              </button>
              <button
                onClick={async () => {
                  const { orderId, trackingNumber, carrier } = shippingModal;
                  try {
                    await adminApi.updateOrderStatus(orderId, 'shipped', trackingNumber, carrier);
                    setOrders((prev) => prev.map((x) => {
                      const o = x as Record<string, unknown>;
                      return o._id === orderId ? { ...o, status: 'shipped', trackingNumber, carrier } : o;
                    }));
                    setShippingModal(null);
                  } catch {
                    alert('Erreur lors de la mise à jour');
                  }
                }}
                style={{ flex: 2, padding: '12px', borderRadius: '999px', border: 'none', background: 'linear-gradient(135deg, #1a2617 0%, #2f4229 100%)', color: '#d4af37', fontFamily: "'Outfit', sans-serif", fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer' }}
              >
                Confirmer l'expédition
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
