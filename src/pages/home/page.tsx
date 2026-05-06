import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/feature/Header';
import Footer from '@/components/feature/Footer';
import Hero from './components/Hero';
import About from './components/About';
import Product from './components/Product';
import Factory from './components/Factory';
import Awards from './components/Awards';
import Values from './components/Values';
import Contact from './components/Contact';
import ReaddyAgent from '@/components/feature/ReaddyAgent';

export default function HomePage() {
  const location = useLocation();
  const [banner, setBanner] = useState('');

  useEffect(() => {
    const state = location.state as { scrollTo?: string; loggedOut?: boolean } | null;
    if (state?.loggedOut) {
      setBanner('Vous avez été déconnecté avec succès. À bientôt !');
      const t = setTimeout(() => setBanner(''), 4000);
      return () => clearTimeout(t);
    }
    const scrollTo = state?.scrollTo;
    if (scrollTo) {
      setTimeout(() => {
        document.getElementById(scrollTo)?.scrollIntoView({ behavior: 'smooth' });
      }, 120);
    } else {
      window.scrollTo({ top: 0 });
    }
  }, [location.state]);

  return (
    <>
      {banner && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          background: 'rgba(20,32,18,0.96)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          color: '#fff',
          textAlign: 'center',
          padding: '14px 24px',
          fontFamily: "'Outfit', sans-serif",
          fontSize: 14,
          fontWeight: 500,
          letterSpacing: '0.04em',
          boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          animation: 'slideDown 0.3s ease',
        }}>
          <i className="ri-checkbox-circle-line" style={{ fontSize: 18, color: '#8fc98f' }} />
          {banner}
        </div>
      )}
      <Header />
      <main>
        <Hero />
        <About />
        <Product />
        <Factory />
        <Awards />
        <Values />
        <Contact />
      </main>
      <Footer />
      <ReaddyAgent />
    </>
  );
}
