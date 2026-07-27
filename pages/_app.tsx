import type { AppProps } from 'next/app';
import '@/SK/styles/globals.css';
import { CartProvider } from '@/SK/context/CartContext';
import CartDrawer from '@/SK/components/CartDrawer';

export default function App({ Component, pageProps }: AppProps) {
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
