import { Link } from 'react-router-dom';

export default function CheckoutCancel() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#f5f3ee' }}>
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(239,68,68,0.08)' }}>
          <i className="ri-close-circle-line" style={{ fontSize: '2.5rem', color: '#ef4444' }} />
        </div>
        <h1 className="text-3xl font-bold mb-3" style={{ fontFamily: "'Cormorant Garant', serif", color: '#1a2617' }}>
          Paiement annulé
        </h1>
        <p className="text-base mb-8" style={{ color: '#6b7280', fontFamily: "'Outfit', sans-serif" }}>
          Votre paiement a été annulé. Votre panier est toujours disponible.
        </p>
        <Link
          to="/products"
          className="inline-block px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm"
          style={{ background: 'linear-gradient(135deg, #1a2617 0%, #2f4229 100%)', color: '#d4af37', fontFamily: "'Outfit', sans-serif" }}
        >
          Retour aux produits
        </Link>
      </div>
    </div>
  );
}
