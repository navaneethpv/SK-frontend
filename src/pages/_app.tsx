import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import "@/styles/globals.css";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/cart/CartDrawer";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isRouteMatching, setIsRouteMatching] = useState(false);

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;

      // If Nginx / Apache / serve served index.html or 404.html for a dynamic subpath, recover route via Next client router
      if (
        currentPath &&
        currentPath !== "/" &&
        currentPath !== "/index.html" &&
        currentPath !== "/404" &&
        (router.pathname === "/" || router.pathname === "/404")
      ) {
        router
          .replace(currentPath)
          .then(() => {
            setIsRouteMatching(true);
          })
          .catch(() => {
            setIsRouteMatching(true);
          });
      } else {
        setIsRouteMatching(true);
      }
    }
  }, [router]);

  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen bg-white text-[#121316]">
        <Component {...pageProps} />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}
