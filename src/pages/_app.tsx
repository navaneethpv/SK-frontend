import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import '@/styles/globals.css';
import { CartProvider } from '@/context/CartContext';
import CartDrawer from '@/components/cart/CartDrawer';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    let rafId: number;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <CartProvider>
      <div className="site-wrapper">
        <Component {...pageProps} />
        <CartDrawer />
        
        <style jsx global>{`
          .site-wrapper {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            background-color: hsl(var(--background));
            color: hsl(var(--foreground));
          }
        `}</style>
      </div>
    </CartProvider>
  );
}
