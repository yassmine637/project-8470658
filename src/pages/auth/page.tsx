import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';

type Mode = 'login' | 'register';

export default function AuthPage() {
  const { t } = useTranslation();
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await register({ name: form.name, email: form.email, password: form.password, phone: form.phone });
      }
      navigate('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  const field = (key: keyof typeof form, label: string, type = 'text', required = true) => (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#5a6e56', fontFamily: "'Outfit', sans-serif" }}>
        {label} {required && <span style={{ color: '#d4af37' }}>*</span>}
      </label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        required={required}
        className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
        style={{ border: '1.5px solid #e8e8e4', background: '#fafaf8', color: '#1a2617', fontFamily: "'Outfit', sans-serif" }}
        onFocus={(e) => { e.target.style.borderColor = '#d4af37'; }}
        onBlur={(e) => { e.target.style.borderColor = '#e8e8e4'; }}
      />
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#f5f3ee' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6" style={{ fontFamily: "'Cormorant Garant', serif", fontSize: '1.5rem', fontWeight: 700, color: '#1a2617', letterSpacing: '0.08em' }}>
            DOMAINE FENDRI
          </Link>
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Cormorant Garant', serif", color: '#1a2617' }}>
            {mode === 'login' ? 'Connexion' : 'Créer un compte'}
          </h1>
        </div>

        <div className="rounded-2xl overflow-hidden shadow-sm" style={{ background: '#ffffff', border: '1px solid #e8e8e4' }}>
          <div style={{ height: '3px', background: 'linear-gradient(to right, #1a2617, #d4af37, #1a2617)' }} />
          <div className="p-8">
            {error && (
              <div className="mb-5 p-3 rounded-xl text-sm text-red-700 bg-red-50" style={{ border: '1px solid rgba(239,68,68,0.2)' }}>
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {mode === 'register' && field('name', 'Nom complet')}
              {field('email', 'Email', 'email')}
              {field('password', 'Mot de passe', 'password')}
              {mode === 'register' && field('phone', 'Téléphone', 'tel', false)}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full font-bold uppercase tracking-widest text-sm transition-all duration-300 hover:-translate-y-0.5 cursor-pointer disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #1a2617 0%, #2f4229 100%)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.2)', fontFamily: "'Outfit', sans-serif" }}
              >
                {loading ? '...' : mode === 'login' ? 'Se connecter' : "S'inscrire"}
              </button>
            </form>

            <p className="text-center text-sm mt-6" style={{ color: '#9ca3af', fontFamily: "'Outfit', sans-serif" }}>
              {mode === 'login' ? "Pas encore de compte ?" : "Déjà un compte ?"}{' '}
              <button
                onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
                className="cursor-pointer font-semibold"
                style={{ color: '#d4af37' }}
              >
                {mode === 'login' ? "S'inscrire" : 'Se connecter'}
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-sm mt-4">
          <Link to="/" style={{ color: '#9ca3af', fontFamily: "'Outfit', sans-serif" }}>← Retour à l'accueil</Link>
        </p>
      </div>
    </div>
  );
}
