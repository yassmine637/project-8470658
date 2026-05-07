import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { authApi } from '@/api/auth';
import { Eye, EyeOff } from 'lucide-react';

type Mode = 'login' | 'register' | 'forgot' | 'reset';

export default function AuthPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialMode: Mode = (() => {
    const m = searchParams.get('mode');
    if (m === 'register') return 'register';
    if (m === 'reset' && searchParams.get('token')) return 'reset';
    return 'login';
  })();

  const [mode, setMode] = useState<Mode>(initialMode);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const [forgotEmail, setForgotEmail] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [resetConfirm, setResetConfirm] = useState('');
  const [showReset, setShowReset] = useState(false);

  const resetToken = searchParams.get('token') || '';
  const resetEmail = searchParams.get('email') || '';

  const switchMode = (m: Mode) => {
    setMode(m);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
        navigate('/');
      } else if (mode === 'register') {
        await register({ name: form.name, email: form.email, password: form.password, phone: form.phone });
        navigate('/', { state: { welcome: true, name: form.name } });
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await authApi.forgotPassword({ email: forgotEmail });
      setSuccess(res.message);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (resetPassword.length < 8) {
      setError('Le mot de passe doit faire au moins 8 caractères.');
      return;
    }
    if (resetPassword !== resetConfirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.resetPassword({ token: resetToken, email: resetEmail, newPassword: resetPassword });
      setSuccess(res.message);
      setTimeout(() => navigate('/auth'), 2500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lien invalide ou expiré.');
    } finally {
      setLoading(false);
    }
  };

  const inputBase: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 12,
    border: '1.5px solid #e8e8e4',
    background: '#fafaf8',
    color: '#1a2617',
    fontFamily: "'Outfit', sans-serif",
    fontSize: 13,
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: '#5a6e56',
    fontFamily: "'Outfit', sans-serif",
    marginBottom: 8,
  };

  const titles: Record<Mode, string> = {
    login: 'Connexion',
    register: 'Créer un compte',
    forgot: 'Mot de passe oublié',
    reset: 'Nouveau mot de passe',
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#f5f3ee' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6" style={{ fontFamily: "'Cormorant Garant', serif", fontSize: '1.5rem', fontWeight: 700, color: '#1a2617', letterSpacing: '0.08em' }}>
            DOMAINE FENDRI
          </Link>
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Cormorant Garant', serif", color: '#1a2617' }}>
            {titles[mode]}
          </h1>
          {mode === 'forgot' && (
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: '#9ca3af', marginTop: 6 }}>
              Entrez votre email pour recevoir un lien de réinitialisation.
            </p>
          )}
          {mode === 'reset' && (
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: '#9ca3af', marginTop: 6 }}>
              Choisissez un nouveau mot de passe sécurisé.
            </p>
          )}
        </div>

        <div className="rounded-2xl overflow-hidden shadow-sm" style={{ background: '#ffffff', border: '1px solid #e8e8e4' }}>
          <div style={{ height: '3px', background: 'linear-gradient(to right, #1a2617, #d4af37, #1a2617)' }} />
          <div className="p-8">

            {error && (
              <div className="mb-5 p-3 rounded-xl text-sm" style={{ color: '#b91c1c', background: '#fef2f2', border: '1px solid rgba(239,68,68,0.2)', fontFamily: "'Outfit', sans-serif" }}>
                {error}
              </div>
            )}
            {success && (
              <div className="mb-5 p-3 rounded-xl text-sm" style={{ color: '#166534', background: '#f0fdf4', border: '1px solid rgba(74,222,128,0.3)', fontFamily: "'Outfit', sans-serif" }}>
                {success}
              </div>
            )}

            {/* ── Login / Register ── */}
            {(mode === 'login' || mode === 'register') && (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {mode === 'register' && (
                  <div>
                    <label style={labelStyle}>Nom complet <span style={{ color: '#d4af37' }}>*</span></label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      required
                      style={inputBase}
                      onFocus={(e) => (e.target.style.borderColor = '#d4af37')}
                      onBlur={(e) => (e.target.style.borderColor = '#e8e8e4')}
                    />
                  </div>
                )}

                <div>
                  <label style={labelStyle}>Email <span style={{ color: '#d4af37' }}>*</span></label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    required
                    style={inputBase}
                    onFocus={(e) => (e.target.style.borderColor = '#d4af37')}
                    onBlur={(e) => (e.target.style.borderColor = '#e8e8e4')}
                  />
                </div>

                <div>
                  <label style={labelStyle}>
                    Mot de passe <span style={{ color: '#d4af37' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                      required
                      autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                      style={{ ...inputBase, paddingRight: 42 }}
                      onFocus={(e) => (e.target.style.borderColor = '#d4af37')}
                      onBlur={(e) => (e.target.style.borderColor = '#e8e8e4')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex', alignItems: 'center', padding: 0 }}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {mode === 'login' && (
                    <div style={{ textAlign: 'right', marginTop: 6 }}>
                      <button
                        type="button"
                        onClick={() => switchMode('forgot')}
                        style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: '#d4af37', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 600 }}
                      >
                        Mot de passe oublié ?
                      </button>
                    </div>
                  )}
                </div>

                {mode === 'register' && (
                  <div>
                    <label style={labelStyle}>Téléphone</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      placeholder="+216 XX XXX XXX"
                      style={inputBase}
                      onFocus={(e) => (e.target.style.borderColor = '#d4af37')}
                      onBlur={(e) => (e.target.style.borderColor = '#e8e8e4')}
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-full font-bold uppercase tracking-widest text-sm transition-all duration-300 hover:-translate-y-0.5 cursor-pointer disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #1a2617 0%, #2f4229 100%)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.2)', fontFamily: "'Outfit', sans-serif" }}
                >
                  {loading ? '...' : mode === 'login' ? 'Se connecter' : "S'inscrire"}
                </button>
              </form>
            )}

            {/* ── Forgot password ── */}
            {mode === 'forgot' && !success && (
              <form onSubmit={handleForgot} className="flex flex-col gap-5">
                <div>
                  <label style={labelStyle}>Votre adresse email <span style={{ color: '#d4af37' }}>*</span></label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    placeholder="exemple@email.com"
                    style={inputBase}
                    onFocus={(e) => (e.target.style.borderColor = '#d4af37')}
                    onBlur={(e) => (e.target.style.borderColor = '#e8e8e4')}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-full font-bold uppercase tracking-widest text-sm transition-all duration-300 hover:-translate-y-0.5 cursor-pointer disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #1a2617 0%, #2f4229 100%)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.2)', fontFamily: "'Outfit', sans-serif" }}
                >
                  {loading ? '...' : 'Envoyer le lien'}
                </button>
              </form>
            )}

            {/* ── Reset password ── */}
            {mode === 'reset' && !success && (
              <form onSubmit={handleReset} className="flex flex-col gap-5">
                <div>
                  <label style={labelStyle}>Nouveau mot de passe <span style={{ color: '#d4af37' }}>*</span></label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showReset ? 'text' : 'password'}
                      value={resetPassword}
                      onChange={(e) => setResetPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                      placeholder="8 caractères minimum"
                      style={{ ...inputBase, paddingRight: 42 }}
                      onFocus={(e) => (e.target.style.borderColor = '#d4af37')}
                      onBlur={(e) => (e.target.style.borderColor = '#e8e8e4')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowReset((v) => !v)}
                      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex', alignItems: 'center', padding: 0 }}
                    >
                      {showReset ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Confirmer le mot de passe <span style={{ color: '#d4af37' }}>*</span></label>
                  <input
                    type="password"
                    value={resetConfirm}
                    onChange={(e) => setResetConfirm(e.target.value)}
                    required
                    autoComplete="new-password"
                    style={{ ...inputBase, borderColor: resetConfirm && resetConfirm !== resetPassword ? 'rgba(239,68,68,0.5)' : '#e8e8e4' }}
                    onFocus={(e) => (e.target.style.borderColor = '#d4af37')}
                    onBlur={(e) => (e.target.style.borderColor = resetConfirm && resetConfirm !== resetPassword ? 'rgba(239,68,68,0.5)' : '#e8e8e4')}
                  />
                  {resetConfirm && resetConfirm !== resetPassword && (
                    <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: '#b91c1c', marginTop: 6 }}>
                      Les mots de passe ne correspondent pas.
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-full font-bold uppercase tracking-widest text-sm transition-all duration-300 hover:-translate-y-0.5 cursor-pointer disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #1a2617 0%, #2f4229 100%)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.2)', fontFamily: "'Outfit', sans-serif" }}
                >
                  {loading ? '...' : 'Réinitialiser le mot de passe'}
                </button>
              </form>
            )}

            {/* ── Bottom links ── */}
            <div className="text-center mt-6" style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: '#9ca3af' }}>
              {(mode === 'login' || mode === 'forgot') && (
                <p>
                  {mode === 'login' ? "Pas encore de compte ?" : "Vous vous souvenez ?"}{' '}
                  <button onClick={() => switchMode(mode === 'login' ? 'register' : 'login')} className="cursor-pointer font-semibold" style={{ color: '#d4af37', background: 'none', border: 'none' }}>
                    {mode === 'login' ? "S'inscrire" : 'Se connecter'}
                  </button>
                </p>
              )}
              {mode === 'register' && (
                <p>
                  Déjà un compte ?{' '}
                  <button onClick={() => switchMode('login')} className="cursor-pointer font-semibold" style={{ color: '#d4af37', background: 'none', border: 'none' }}>
                    Se connecter
                  </button>
                </p>
              )}
              {mode === 'forgot' && !success && (
                <p className="mt-3">
                  <button onClick={() => switchMode('login')} style={{ color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12 }}>
                    ← Retour à la connexion
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>

        <p className="text-center text-sm mt-4">
          <Link to="/" style={{ color: '#9ca3af', fontFamily: "'Outfit', sans-serif" }}>← Retour à l'accueil</Link>
        </p>
      </div>
    </div>
  );
}
