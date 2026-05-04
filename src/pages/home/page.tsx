import { useEffect } from 'react';
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

  useEffect(() => {
    const scrollTo = (location.state as { scrollTo?: string } | null)?.scrollTo;
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
