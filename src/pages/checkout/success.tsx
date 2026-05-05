import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CheckoutSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/'), 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#f5f3ee' }}>
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(26,38,23,0.08)', color: '#1a2617' }}>
          <i className="ri-checkbox-circle-line" style={{ fontSize: '2.5rem', color: '#3a6040' }} />
        </div>
        <h1 className="text-3xl font-bold mb-3" style={{ fontFamily: "'Cormorant Garant', serif", color: '#1a2617' }}>
          Commande confirmée !
        </h1>
        <p className="text-base mb-4" style={{ color: '#6b7280', fontFamily: "'Outfit', sans-serif" }}>
          Merci pour votre commande. Vous recevrez une confirmation par email sous peu.
        </p>
        <p className="text-sm mb-8" style={{ color: '#9aaa96', fontFamily: "'Outfit', sans-serif" }}>
          Redirection vers l'accueil dans 3 secondes…
        </p>
        <button
          onClick={() => navigate('/')}
          className="inline-block px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm cursor-pointer border-none"
          style={{ background: 'linear-gradient(135deg, #1a2617 0%, #2f4229 100%)', color: '#d4af37', fontFamily: "'Outfit', sans-serif" }}
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}
