import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { adminApi } from '@/api/admin';
import { useTranslation } from 'react-i18next';

type Tab = 'stats' | 'orders' | 'configs' | 'messages' | 'users' | 'stocks' | 'security';

type ShippingModal = { orderId: string; trackingNumber: string; carrier: string } | null;
type OrderModal = Record<string, unknown> | null;
type MessageModal = Record<string, unknown> | null;

const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b', paid: '#10b981', processing: '#3b82f6',
  shipped: '#8b5cf6', delivered: '#059669', cancelled: '#ef4444',
  new: '#f59e0b', reviewing: '#3b82f6', quoted: '#8b5cf6',
  accepted: '#10b981', rejected: '#ef4444',
};

function StatusDropdown({
  value,
  onChange,
  statuses = [],
}: {
  value: string;
  onChange: (v: string) => void;
  statuses?: { value: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);

  const current = statuses.find((s) => s.value === value);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + 4, left: r.left, width: r.width });
    }
    setOpen((o) => !o);
  };

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const timer = setTimeout(() => window.addEventListener('click', close), 0);
    return () => { clearTimeout(timer); window.removeEventListener('click', close); };
  }, [open]);

  const handleSelect = (e: React.MouseEvent, newValue: string) => {
    e.stopPropagation();
    onChange(newValue);
    setOpen(false);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        ref={btnRef}
        onClick={handleToggle}
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: '0.78rem',
          padding: '5px 10px',
          borderRadius: '8px',
          border: '1.5px solid #e8e8e4',
          background: '#fafaf8',
          color: '#1a2617',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          whiteSpace: 'nowrap',
          minWidth: '130px',
          justifyContent: 'space-between',
        }}
      >
        <span>{current?.label ?? value}</span>
        <span style={{ fontSize: '0.6rem', opacity: 0.5 }}>▼</span>
      </button>

      {open && (
        <div
          style={{
            position: 'fixed',
            top: pos.top,
            left: pos.left,
            minWidth: Math.max(pos.width, 160),
            background: '#ffffff',
            border: '1.5px solid #e8e8e4',
            borderRadius: '10px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            zIndex: 9999,
            overflow: 'hidden',
          }}
        >
          {statuses.map((s) => (
            <button
              key={s.value}
              onClick={(e) => handleSelect(e, s.value)}
              style={{
                display: 'block',
                width: '100%',
                padding: '9px 14px',
                textAlign: 'left',
                fontFamily: "'Outfit', sans-serif",
                fontSize: '0.8rem',
                color: s.value === value ? '#d4af37' : '#1a2617',
                background: s.value === value ? 'rgba(212,175,55,0.08)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontWeight: s.value === value ? 600 : 400,
              }}
              onMouseEnter={(e) => { if (s.value !== value) (e.currentTarget as HTMLElement).style.background = '#f9f9f7'; }}
              onMouseLeave={(e) => { if (s.value !== value) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const { t } = useTranslation();
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('stats');
  const [stats, setStats] = useState<Record<string, number> | null>(null);
  const [orders, setOrders] = useState<unknown[]>([]);
  const [configs, setConfigs] = useState<unknown[]>([]);
  const [messages, setMessages] = useState<unknown[]>([]);
  const [users, setUsers] = useState<unknown[]>([]);
  const [adminProducts, setAdminProducts] = useState<unknown[]>([]);
  const [stockEdits, setStockEdits] = useState<Record<string, string>>({});
  const [stockSaving, setStockSaving] = useState<Record<string, boolean>>({});
  const [stockErrors, setStockErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwStatus, setPwStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [pwError, setPwError] = useState('');
  const [shippingModal, setShippingModal] = useState<ShippingModal>(null);
  const [orderModal, setOrderModal] = useState<OrderModal>(null);
  const [messageModal, setMessageModal] = useState<MessageModal>(null);

  const ORDER_STATUSES = [
    { value: 'pending', label: t('admin_status_pending') },
    { value: 'paid', label: t('admin_status_paid') },
    { value: 'processing', label: t('admin_status_processing') },
    { value: 'shipped', label: t('admin_status_shipped') },
    { value: 'delivered', label: t('admin_status_delivered') },
    { value: 'cancelled', label: t('admin_status_cancelled') },
  ];

  const CONFIGURATOR_STATUSES = [
    { value: 'new', label: t('admin_cstatus_new') },
    { value: 'reviewing', label: t('admin_cstatus_reviewing') },
    { value: 'quoted', label: t('admin_cstatus_quoted') },
    { value: 'accepted', label: t('admin_cstatus_accepted') },
    { value: 'rejected', label: t('admin_cstatus_rejected') },
  ];

  const TABS: { key: Tab; label: string; icon: string }[] = [
    { key: 'stats', label: t('admin_tab_stats'), icon: 'ri-dashboard-line' },
    { key: 'orders', label: t('admin_tab_orders'), icon: 'ri-shopping-bag-line' },
    { key: 'configs', label: t('admin_tab_configs'), icon: 'ri-flask-line' },
    { key: 'messages', label: t('admin_tab_messages'), icon: 'ri-mail-line' },
    { key: 'users', label: t('admin_tab_users'), icon: 'ri-team-line' },
    { key: 'stocks', label: t('admin_tab_stocks'), icon: 'ri-stack-line' },
    { key: 'security', label: t('admin_tab_security'), icon: 'ri-shield-keyhole-line' },
  ];

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
        } else if (tab === 'stocks') {
          const p = await adminApi.products();
          setAdminProducts(p);
          const edits: Record<string, string> = {};
          p.forEach((prod) => { edits[prod._id] = String(prod.stock); });
          setStockEdits(edits);
          setStockErrors({});
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

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    if (pwForm.next !== pwForm.confirm) {
      setPwError(t('admin_security_pw_mismatch'));
      return;
    }
    if (pwForm.next.length < 8) {
      setPwError(t('admin_security_pw_tooshort'));
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
      setPwError(err instanceof Error ? err.message : t('admin_status_error'));
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
          {t('admin_back_site')}
        </Link>
      </div>

      <div className="flex">
        <aside style={{ width: '220px', minHeight: 'calc(100vh - 56px)', background: '#ffffff', borderRight: '1px solid #e8e8e4', padding: '16px 0', flexShrink: 0 }}>
          {TABS.map((tb) => (
            <button
              key={tb.key}
              onClick={() => setTab(tb.key)}
              className="cursor-pointer w-full flex items-center gap-3 px-5 py-3 text-sm transition-all"
              style={{
                fontFamily: "'Outfit', sans-serif",
                color: tab === tb.key ? '#1a2617' : '#6b7280',
                background: tab === tb.key ? 'rgba(212,175,55,0.1)' : 'transparent',
                borderLeft: tab === tb.key ? '3px solid #d4af37' : '3px solid transparent',
                fontWeight: tab === tb.key ? 600 : 400,
              }}
            >
              <i className={tb.icon} />
              {tb.label}
            </button>
          ))}
        </aside>

        <main className="flex-1 p-8">
          {loading && <div style={{ color: '#9ca3af', fontFamily: "'Outfit', sans-serif" }}>{t('admin_loading')}</div>}

          {!loading && tab === 'stats' && stats && (
            <div>
              <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Cormorant Garant', serif", color: '#1a2617' }}>{t('admin_tab_stats')}</h2>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { label: t('admin_stat_orders'), value: stats.totalOrders, icon: 'ri-shopping-bag-line', color: '#3b82f6' },
                  { label: t('admin_stat_users'), value: stats.totalUsers, icon: 'ri-team-line', color: '#8b5cf6' },
                  { label: t('admin_stat_pending_quotes'), value: stats.pendingConfigs, icon: 'ri-flask-line', color: '#f59e0b' },
                  { label: t('admin_stat_products'), value: stats.totalProducts, icon: 'ri-leaf-line', color: '#10b981' },
                  { label: t('admin_stat_revenue'), value: `${stats.revenue} TND`, icon: 'ri-money-dollar-circle-line', color: '#d4af37' },
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
              <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Cormorant Garant', serif", color: '#1a2617' }}>{t('admin_orders_title')}</h2>
              <div className="rounded-2xl overflow-hidden" style={{ background: '#ffffff', border: '1px solid #e8e8e4' }}>
                <table className="w-full">
                  <thead style={{ background: '#f9f9f7', borderBottom: '1px solid #e8e8e4' }}>
                    <tr>
                      {[t('admin_col_id'), t('admin_col_client'), t('admin_col_total_ttc'), t('admin_col_status'), t('admin_col_date'), t('admin_col_detail'), t('admin_col_action')].map((h) => (
                        <th key={h} className={headCell} style={{ color: '#6b7280', fontFamily: "'Outfit', sans-serif" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(orders as Record<string, unknown>[]).map((o) => (
                      <tr key={o._id as string} style={{ borderBottom: '1px solid #f3f3f0' }}>
                        <td className={cell} style={{ color: '#9ca3af', fontFamily: "'Outfit', sans-serif", fontSize: '0.75rem' }}>{(o._id as string).slice(-8)}</td>
                        <td className={cell} style={{ fontFamily: "'Outfit', sans-serif", color: '#1a2617' }}>
                          <div>{(o.guestName as string) || (o.user as Record<string, string>)?.name || t('admin_user_fallback')}</div>
                          <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>{(o.guestEmail as string) || (o.user as Record<string, string>)?.email || ''}</div>
                        </td>
                        <td className={cell} style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, color: '#1a2617' }}>{o.totalTTC as number} {o.currency as string}</td>
                        <td className={cell}>
                          <span className="px-2 py-1 rounded-full text-xs font-bold" style={{ background: `${STATUS_COLORS[o.status as string] || '#9ca3af'}18`, color: STATUS_COLORS[o.status as string] || '#9ca3af', fontFamily: "'Outfit', sans-serif" }}>
                            {ORDER_STATUSES.find(s => s.value === (o.status as string))?.label ?? o.status as string}
                          </span>
                        </td>
                        <td className={cell} style={{ color: '#9ca3af', fontFamily: "'Outfit', sans-serif", fontSize: '0.8rem' }}>
                          {new Date(o.createdAt as string).toLocaleDateString()}
                        </td>
                        <td className={cell}>
                          <button
                            onClick={() => setOrderModal(o as Record<string, unknown>)}
                            style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.75rem', padding: '5px 12px', borderRadius: '8px', border: '1.5px solid #e8e8e4', background: '#fafaf8', color: '#1a2617', cursor: 'pointer', whiteSpace: 'nowrap' }}
                          >
                            {t('admin_see_detail')}
                          </button>
                        </td>
                        <td className={cell}>
                          <StatusDropdown
                            value={o.status as string}
                            statuses={ORDER_STATUSES}
                            onChange={(newStatus) => {
                              const prevStatus = o.status as string;
                              if (newStatus === 'shipped') {
                                setShippingModal({ orderId: o._id as string, trackingNumber: '', carrier: '' });
                              } else {
                                setOrders((prev) => prev.map((x) => (x as Record<string, unknown>)._id === o._id ? { ...x, status: newStatus } : x));
                                adminApi.updateOrderStatus(o._id as string, newStatus)
                                  .catch(() => {
                                    setOrders((prev) => prev.map((x) => (x as Record<string, unknown>)._id === o._id ? { ...x, status: prevStatus } : x));
                                    alert(t('admin_status_error'));
                                  });
                              }
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr><td colSpan={7} className="text-center py-8" style={{ color: '#9ca3af', fontFamily: "'Outfit', sans-serif" }}>{t('admin_no_orders')}</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!loading && tab === 'configs' && (
            <div>
              <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Cormorant Garant', serif", color: '#1a2617' }}>{t('admin_configs_title')}</h2>
              <div className="rounded-2xl overflow-hidden" style={{ background: '#ffffff', border: '1px solid #e8e8e4' }}>
                <table className="w-full">
                  <thead style={{ background: '#f9f9f7', borderBottom: '1px solid #e8e8e4' }}>
                    <tr>
                      {[t('admin_col_ref'), t('admin_col_client'), t('admin_col_email'), t('admin_col_total_ttc'), t('admin_col_status'), t('admin_col_date'), t('admin_col_action')].map((h) => (
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
                            {CONFIGURATOR_STATUSES.find(s => s.value === (c.status as string))?.label ?? c.status as string}
                          </span>
                        </td>
                        <td className={cell} style={{ color: '#9ca3af', fontFamily: "'Outfit', sans-serif", fontSize: '0.8rem' }}>
                          {new Date(c.createdAt as string).toLocaleDateString()}
                        </td>
                        <td className={cell}>
                          <StatusDropdown
                            value={c.status as string}
                            statuses={CONFIGURATOR_STATUSES}
                            onChange={(newStatus) => {
                              const prevStatus = c.status as string;
                              setConfigs((prev) => prev.map((x) => (x as Record<string, unknown>)._id === c._id ? { ...x, status: newStatus } : x));
                              adminApi.updateConfigStatus(c._id as string, newStatus)
                                .catch(() => {
                                  setConfigs((prev) => prev.map((x) => (x as Record<string, unknown>)._id === c._id ? { ...x, status: prevStatus } : x));
                                  alert(t('admin_status_error'));
                                });
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                    {configs.length === 0 && (
                      <tr><td colSpan={7} className="text-center py-8" style={{ color: '#9ca3af', fontFamily: "'Outfit', sans-serif" }}>{t('admin_no_configs')}</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!loading && tab === 'messages' && (
            <div>
              <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Cormorant Garant', serif", color: '#1a2617' }}>{t('admin_messages_title')}</h2>
              <div className="flex flex-col gap-3">
                {(messages as Record<string, unknown>[]).map((m) => (
                  <div key={m._id as string} className="rounded-2xl p-5" style={{ background: '#ffffff', border: '1px solid #e8e8e4' }}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm mb-1" style={{ color: '#1a2617', fontFamily: "'Outfit', sans-serif" }}>
                          {m.nom as string} {m.prenom as string}
                        </div>
                        <div className="text-xs mb-2" style={{ color: '#9ca3af', fontFamily: "'Outfit', sans-serif" }}>
                          {m.email as string} · {m.telephone as string} · {m.pays as string}
                        </div>
                        <div className="text-sm font-semibold" style={{ color: '#3a6040', fontFamily: "'Outfit', sans-serif" }}>{m.sujet as string}</div>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <span className="text-xs" style={{ color: '#9ca3af', fontFamily: "'Outfit', sans-serif" }}>
                          {new Date(m.createdAt as string).toLocaleDateString()}
                        </span>
                        <button
                          onClick={() => setMessageModal(m as Record<string, unknown>)}
                          style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.75rem', padding: '5px 12px', borderRadius: '8px', border: '1.5px solid #e8e8e4', background: '#fafaf8', color: '#1a2617', cursor: 'pointer', whiteSpace: 'nowrap' }}
                        >
                          {t('admin_see_detail')}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {messages.length === 0 && <div className="text-center py-8" style={{ color: '#9ca3af', fontFamily: "'Outfit', sans-serif" }}>{t('admin_no_messages')}</div>}
              </div>
            </div>
          )}

          {!loading && tab === 'users' && (
            <div>
              <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Cormorant Garant', serif", color: '#1a2617' }}>{t('admin_users_title')}</h2>
              <div className="rounded-2xl overflow-hidden" style={{ background: '#ffffff', border: '1px solid #e8e8e4' }}>
                <table className="w-full">
                  <thead style={{ background: '#f9f9f7', borderBottom: '1px solid #e8e8e4' }}>
                    <tr>
                      {[t('admin_col_name'), t('admin_col_email'), t('admin_col_phone'), t('admin_col_role'), t('admin_col_signup')].map((h) => (
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
                          {new Date(u.createdAt as string).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr><td colSpan={5} className="text-center py-8" style={{ color: '#9ca3af', fontFamily: "'Outfit', sans-serif" }}>{t('admin_no_users')}</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!loading && tab === 'stocks' && (
            <div>
              <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Cormorant Garant', serif", color: '#1a2617' }}>{t('admin_stocks_title')}</h2>
              <p className="text-sm mb-6" style={{ color: '#9ca3af', fontFamily: "'Outfit', sans-serif" }}>
                {t('admin_stocks_subtitle')}
              </p>
              <div className="flex flex-col gap-4">
                {(adminProducts as { _id: string; name: string; volume: string; stock: number; badge?: string; accentColor?: string }[]).map((p) => {
                  const val = stockEdits[p._id] ?? String(p.stock);
                  const parsed = parseInt(val, 10);
                  const isInvalid = isNaN(parsed) || parsed < 0 || !Number.isInteger(parsed);
                  const isSaving = stockSaving[p._id];
                  const errMsg = stockErrors[p._id];
                  const stockLevel = parsed <= 5 ? 'critical' : parsed <= 20 ? 'low' : 'ok';
                  const levelColor = stockLevel === 'critical' ? '#ef4444' : stockLevel === 'low' ? '#f59e0b' : '#10b981';

                  return (
                    <div key={p._id} className="rounded-2xl p-6" style={{ background: '#ffffff', border: '1px solid #e8e8e4' }}>
                      <div className="flex items-center justify-between gap-6 flex-wrap">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${p.accentColor || '#c9a84c'}18` }}>
                            <i className="ri-flask-line" style={{ color: p.accentColor || '#c9a84c', fontSize: '1.1rem' }} />
                          </div>
                          <div>
                            <div className="font-bold text-sm" style={{ color: '#1a2617', fontFamily: "'Outfit', sans-serif" }}>{p.volume}</div>
                            <div className="text-xs mt-0.5" style={{ color: '#9ca3af', fontFamily: "'Outfit', sans-serif" }}>
                              {p.badge && <span className="mr-2">{p.badge}</span>}
                              {t('admin_stock_current')}
                              <span className="ml-1 font-bold" style={{ color: levelColor }}>{p.stock} {p.stock !== 1 ? t('admin_stock_units') : t('admin_stock_unit')}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div>
                            <input
                              type="number"
                              min={0}
                              value={val}
                              onChange={(e) => {
                                setStockEdits((s) => ({ ...s, [p._id]: e.target.value }));
                                setStockErrors((s) => ({ ...s, [p._id]: '' }));
                              }}
                              style={{
                                width: '90px',
                                padding: '8px 12px',
                                borderRadius: '10px',
                                border: `1.5px solid ${isInvalid ? '#ef4444' : '#e8e8e4'}`,
                                background: '#fafaf8',
                                color: '#1a2617',
                                fontFamily: "'Outfit', sans-serif",
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                outline: 'none',
                                textAlign: 'center',
                              }}
                              onFocus={(e) => { e.target.style.borderColor = isInvalid ? '#ef4444' : '#d4af37'; }}
                              onBlur={(e) => { e.target.style.borderColor = isInvalid ? '#ef4444' : '#e8e8e4'; }}
                            />
                          </div>
                          <button
                            disabled={isSaving || isInvalid || parsed === p.stock}
                            onClick={async () => {
                              setStockSaving((s) => ({ ...s, [p._id]: true }));
                              setStockErrors((s) => ({ ...s, [p._id]: '' }));
                              try {
                                const updated = await adminApi.updateStock(p._id, parsed);
                                setAdminProducts((prev) => prev.map((x) => {
                                  const prod = x as { _id: string; stock: number };
                                  return prod._id === p._id ? { ...prod, stock: updated.stock } : prod;
                                }));
                                setStockEdits((s) => ({ ...s, [p._id]: String(updated.stock) }));
                              } catch (err: unknown) {
                                setStockErrors((s) => ({ ...s, [p._id]: err instanceof Error ? err.message : t('admin_status_error') }));
                              } finally {
                                setStockSaving((s) => ({ ...s, [p._id]: false }));
                              }
                            }}
                            style={{
                              padding: '8px 20px',
                              borderRadius: '999px',
                              border: 'none',
                              background: isSaving || isInvalid || parsed === p.stock
                                ? '#e8e8e4'
                                : 'linear-gradient(135deg, #1a2617 0%, #2f4229 100%)',
                              color: isSaving || isInvalid || parsed === p.stock ? '#9ca3af' : '#d4af37',
                              fontFamily: "'Outfit', sans-serif",
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              letterSpacing: '1px',
                              cursor: isSaving || isInvalid || parsed === p.stock ? 'not-allowed' : 'pointer',
                              transition: 'all 0.2s',
                            }}
                          >
                            {isSaving ? t('admin_stock_saving') : t('admin_stock_save')}
                          </button>
                          <div
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            title={stockLevel === 'critical' ? t('admin_stock_critical') : stockLevel === 'low' ? t('admin_stock_low') : 'OK'}
                            style={{ background: levelColor, boxShadow: `0 0 6px ${levelColor}60` }}
                          />
                        </div>
                      </div>
                      {errMsg && (
                        <div className="mt-3 text-xs px-3 py-2 rounded-lg" style={{ background: '#fef2f2', color: '#ef4444', fontFamily: "'Outfit', sans-serif" }}>
                          {errMsg}
                        </div>
                      )}
                    </div>
                  );
                })}
                {adminProducts.length === 0 && (
                  <div className="text-center py-8" style={{ color: '#9ca3af', fontFamily: "'Outfit', sans-serif" }}>{t('admin_no_products')}</div>
                )}
              </div>
            </div>
          )}

          {!loading && tab === 'security' && (
            <div>
              <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Cormorant Garant', serif", color: '#1a2617' }}>{t('admin_security_title')}</h2>
              <p className="text-sm mb-8" style={{ color: '#9ca3af', fontFamily: "'Outfit', sans-serif" }}>
                {t('admin_security_logged_as')} <strong style={{ color: '#1a2617' }}>{user?.email}</strong>
              </p>

              <div className="rounded-2xl p-8 max-w-md" style={{ background: '#ffffff', border: '1px solid #e8e8e4' }}>
                <div style={{ height: '3px', background: 'linear-gradient(to right, #1a2617, #d4af37, #1a2617)', borderRadius: 2, marginBottom: 28 }} />
                <h3 className="text-lg font-bold mb-6" style={{ fontFamily: "'Cormorant Garant', serif", color: '#1a2617' }}>
                  {t('admin_security_change_pw')}
                </h3>

                {pwStatus === 'success' && (
                  <div className="mb-5 p-3 rounded-xl text-sm" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', fontFamily: "'Outfit', sans-serif" }}>
                    {t('admin_security_pw_success')}
                  </div>
                )}
                {pwError && (
                  <div className="mb-5 p-3 rounded-xl text-sm" style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', fontFamily: "'Outfit', sans-serif" }}>
                    {pwError}
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="flex flex-col gap-5">
                  {[
                    { key: 'current', label: t('admin_security_current_pw'), placeholder: '••••••••' },
                    { key: 'next', label: t('admin_security_new_pw'), placeholder: t('admin_security_min8') },
                    { key: 'confirm', label: t('admin_security_confirm_pw'), placeholder: '••••••••' },
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
                    {pwStatus === 'loading' ? t('admin_security_saving') : t('admin_security_save_btn')}
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal détail commande */}
      {orderModal && (
        <div onClick={() => setOrderModal(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: '#ffffff', borderRadius: '16px', padding: '36px', maxWidth: '580px', width: '100%', boxShadow: '0 24px 60px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ height: '3px', background: 'linear-gradient(to right, #1a2617, #d4af37, #1a2617)', borderRadius: 2, marginBottom: 24 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <p style={{ margin: '0 0 2px', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: '#d4af37', fontFamily: "'Outfit', sans-serif" }}>{t('admin_modal_order_label')}</p>
                <h3 style={{ margin: 0, fontSize: '18px', fontFamily: "'Cormorant Garant', serif", color: '#1a2617', fontWeight: 700 }}>
                  #{(orderModal._id as string).slice(-10).toUpperCase()}
                </h3>
              </div>
              <span style={{ padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, background: `${STATUS_COLORS[orderModal.status as string] || '#9ca3af'}18`, color: STATUS_COLORS[orderModal.status as string] || '#9ca3af', fontFamily: "'Outfit', sans-serif" }}>
                {ORDER_STATUSES.find(s => s.value === orderModal.status)?.label ?? orderModal.status as string}
              </span>
            </div>

            <div style={{ background: '#f9f9f7', borderRadius: '10px', padding: '14px 16px', marginBottom: '14px' }}>
              <p style={{ margin: '0 0 8px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#9ca3af', fontFamily: "'Outfit', sans-serif" }}>{t('admin_modal_client')}</p>
              <p style={{ margin: '0 0 3px', fontSize: '14px', fontWeight: 600, color: '#1a2617', fontFamily: "'Outfit', sans-serif" }}>
                {(orderModal.guestName as string) || ((orderModal.user as Record<string, string>)?.name) || t('admin_user_fallback')}
              </p>
              <p style={{ margin: '0 0 2px', fontSize: '13px', color: '#6b7280', fontFamily: "'Outfit', sans-serif" }}>
                {(orderModal.guestEmail as string) || ((orderModal.user as Record<string, string>)?.email) || '—'}
              </p>
              {orderModal.guestPhone && <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', fontFamily: "'Outfit', sans-serif" }}>{orderModal.guestPhone as string}</p>}
            </div>

            {orderModal.shippingAddress && (
              <div style={{ background: '#f9f9f7', borderRadius: '10px', padding: '14px 16px', marginBottom: '14px' }}>
                <p style={{ margin: '0 0 8px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#9ca3af', fontFamily: "'Outfit', sans-serif" }}>{t('admin_modal_shipping_address')}</p>
                {(() => { const a = orderModal.shippingAddress as Record<string, string>; return (
                  <p style={{ margin: 0, fontSize: '13px', color: '#1a2617', fontFamily: "'Outfit', sans-serif", lineHeight: 1.7 }}>
                    {a.street && <>{a.street}<br /></>}{a.postalCode && <>{a.postalCode} </>}{a.city && <>{a.city}<br /></>}{a.country}
                  </p>
                ); })()}
              </div>
            )}

            {Array.isArray(orderModal.items) && (orderModal.items as Record<string, unknown>[]).length > 0 && (
              <div style={{ marginBottom: '14px' }}>
                <p style={{ margin: '0 0 8px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#9ca3af', fontFamily: "'Outfit', sans-serif" }}>{t('admin_modal_items')}</p>
                <div style={{ border: '1px solid #e8e8e4', borderRadius: '10px', overflow: 'hidden' }}>
                  {(orderModal.items as Record<string, unknown>[]).map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderBottom: i < (orderModal.items as unknown[]).length - 1 ? '1px solid #f3f3f0' : 'none', fontFamily: "'Outfit', sans-serif" }}>
                      <span style={{ fontSize: '13px', color: '#1a2617' }}>{item.productName as string} <span style={{ color: '#9ca3af' }}>× {item.quantity as number}</span></span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#1a2617' }}>{((item.price as number) * (item.quantity as number)).toFixed(2)} {orderModal.currency as string}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ background: '#f9f9f7', borderRadius: '10px', padding: '14px 16px', marginBottom: '14px' }}>
              <p style={{ margin: '0 0 8px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#9ca3af', fontFamily: "'Outfit', sans-serif" }}>{t('admin_modal_financial')}</p>
              {[
                { label: t('admin_modal_total_ht'), value: `${orderModal.totalHT} ${orderModal.currency}` },
                { label: t('admin_modal_tva', { pct: orderModal.tva }), value: `${((orderModal.totalTTC as number) - (orderModal.totalHT as number)).toFixed(2)} ${orderModal.currency}` },
                { label: t('admin_modal_total_ttc'), value: `${orderModal.totalTTC} ${orderModal.currency}`, bold: true },
                { label: t('admin_modal_payment_method'), value: orderModal.paymentMethod as string },
              ].map(({ label, value, bold }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontFamily: "'Outfit', sans-serif", fontSize: '13px' }}>
                  <span style={{ color: '#6b7280' }}>{label}</span>
                  <span style={{ color: '#1a2617', fontWeight: bold ? 700 : 500 }}>{value}</span>
                </div>
              ))}
            </div>

            {(orderModal.trackingNumber || orderModal.carrier) && (
              <div style={{ background: '#f0f7f1', borderRadius: '10px', padding: '14px 16px', marginBottom: '14px' }}>
                <p style={{ margin: '0 0 8px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#3a6040', fontFamily: "'Outfit', sans-serif" }}>{t('admin_modal_tracking')}</p>
                {orderModal.carrier && <p style={{ margin: '0 0 3px', fontSize: '13px', color: '#1a2617', fontFamily: "'Outfit', sans-serif" }}>{t('admin_modal_carrier')} <strong>{orderModal.carrier as string}</strong></p>}
                {orderModal.trackingNumber && <p style={{ margin: 0, fontSize: '13px', color: '#1a2617', fontFamily: "'Outfit', sans-serif" }}>{t('admin_modal_tracking_num')} <strong style={{ letterSpacing: '1px' }}>{orderModal.trackingNumber as string}</strong></p>}
              </div>
            )}

            <p style={{ margin: '0 0 20px', fontSize: '12px', color: '#9ca3af', fontFamily: "'Outfit', sans-serif" }}>
              {t('admin_modal_created')} {new Date(orderModal.createdAt as string).toLocaleDateString()}
            </p>
            <button onClick={() => setOrderModal(null)} style={{ width: '100%', padding: '12px', borderRadius: '999px', border: '1.5px solid #e8e8e4', background: 'transparent', color: '#6b7280', fontFamily: "'Outfit', sans-serif", fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
              {t('admin_modal_close')}
            </button>
          </div>
        </div>
      )}

      {/* Modal détail message */}
      {messageModal && (
        <div onClick={() => setMessageModal(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: '#ffffff', borderRadius: '16px', padding: '36px', maxWidth: '520px', width: '100%', boxShadow: '0 24px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ height: '3px', background: 'linear-gradient(to right, #1a2617, #d4af37, #1a2617)', borderRadius: 2, marginBottom: 24 }} />
            <p style={{ margin: '0 0 2px', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: '#d4af37', fontFamily: "'Outfit', sans-serif" }}>{t('admin_msg_label')}</p>
            <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontFamily: "'Cormorant Garant', serif", color: '#1a2617', fontWeight: 700 }}>
              {messageModal.nom as string} {messageModal.prenom as string}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
              {[
                { label: t('admin_msg_email'), value: messageModal.email as string },
                { label: t('admin_msg_phone'), value: (messageModal.telephone as string) || '—' },
                { label: t('admin_msg_country'), value: (messageModal.pays as string) || '—' },
                { label: t('admin_msg_date'), value: new Date(messageModal.createdAt as string).toLocaleDateString() },
              ].map(({ label, value }) => (
                <div key={label} style={{ background: '#f9f9f7', borderRadius: '8px', padding: '10px 12px' }}>
                  <p style={{ margin: '0 0 2px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#9ca3af', fontFamily: "'Outfit', sans-serif" }}>{label}</p>
                  <p style={{ margin: 0, fontSize: '13px', color: '#1a2617', fontFamily: "'Outfit', sans-serif", wordBreak: 'break-all' }}>{value}</p>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: '16px' }}>
              <p style={{ margin: '0 0 6px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#9ca3af', fontFamily: "'Outfit', sans-serif" }}>{t('admin_msg_subject')}</p>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#3a6040', fontFamily: "'Outfit', sans-serif" }}>{messageModal.sujet as string}</p>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <p style={{ margin: '0 0 6px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#9ca3af', fontFamily: "'Outfit', sans-serif" }}>{t('admin_msg_message')}</p>
              <p style={{ margin: 0, fontSize: '14px', color: '#4b5563', fontFamily: "'Outfit', sans-serif", lineHeight: 1.7, whiteSpace: 'pre-wrap', background: '#f9f9f7', borderRadius: '10px', padding: '14px 16px' }}>{messageModal.message as string}</p>
            </div>
            <button onClick={() => setMessageModal(null)} style={{ width: '100%', padding: '12px', borderRadius: '999px', border: '1.5px solid #e8e8e4', background: 'transparent', color: '#6b7280', fontFamily: "'Outfit', sans-serif", fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
              {t('admin_modal_close')}
            </button>
          </div>
        </div>
      )}

      {/* Modal numéro de suivi */}
      {shippingModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '40px', maxWidth: '460px', width: '100%', boxShadow: '0 24px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ height: '3px', background: 'linear-gradient(to right, #1a2617, #d4af37, #1a2617)', borderRadius: 2, marginBottom: 28 }} />
            <p style={{ margin: '0 0 4px', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#d4af37', fontFamily: "'Outfit', sans-serif" }}>
              {t('admin_ship_label')}
            </p>
            <h3 style={{ margin: '0 0 8px', fontSize: '20px', fontFamily: "'Cormorant Garant', serif", color: '#1a2617', fontWeight: 700 }}>
              {t('admin_ship_title')}
            </h3>
            <p style={{ margin: '0 0 24px', fontSize: '13px', color: '#9ca3af', fontFamily: "'Outfit', sans-serif", lineHeight: 1.6 }}>
              {t('admin_ship_desc')}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#5a6e56', marginBottom: '6px', fontFamily: "'Outfit', sans-serif" }}>
                  {t('admin_ship_carrier')}
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
                  {t('admin_ship_tracking')} <span style={{ color: '#9ca3af', fontWeight: 400 }}>{t('admin_ship_optional')}</span>
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
                {t('admin_ship_cancel')}
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
                    alert(t('admin_ship_error'));
                  }
                }}
                style={{ flex: 2, padding: '12px', borderRadius: '999px', border: 'none', background: 'linear-gradient(135deg, #1a2617 0%, #2f4229 100%)', color: '#d4af37', fontFamily: "'Outfit', sans-serif", fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer' }}
              >
                {t('admin_ship_confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
