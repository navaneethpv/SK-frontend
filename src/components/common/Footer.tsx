import React, { useState } from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="w-full bg-[#111111] text-white">
      <div className="pt-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 pb-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-[2.5rem] lg:gap-[3rem]">
          {/* Brand Column */}
          <div className="flex flex-col gap-[1.2rem]">
            <Link href="/" className="inline-block">
              <img src="/SK Logo.svg" alt="SK Logo" className="h-[52px] w-auto object-contain" />
            </Link>
            <p className="text-[0.85rem] text-[#A3A3A3] leading-[1.6]">
              SK is a luxury grooming and lifestyle brand crafting high-performance organic hair oils, artisanal fragrances, and lifestyle accessories designed for uncompromising quality.
            </p>
            <div className="flex gap-[0.8rem] mt-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-[36px] h-[36px] rounded-full bg-[#222222] text-[#CCCCCC] flex items-center justify-center transition-all duration-200 hover:bg-[#C5A059] hover:text-white hover:-translate-y-0.5" aria-label="Facebook">
                <Facebook size={16} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-[36px] h-[36px] rounded-full bg-[#222222] text-[#CCCCCC] flex items-center justify-center transition-all duration-200 hover:bg-[#C5A059] hover:text-white hover:-translate-y-0.5" aria-label="Instagram">
                <Instagram size={16} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-[36px] h-[36px] rounded-full bg-[#222222] text-[#CCCCCC] flex items-center justify-center transition-all duration-200 hover:bg-[#C5A059] hover:text-white hover:-translate-y-0.5" aria-label="Youtube">
                <Youtube size={16} />
              </a>
            </div>
          </div>

          {/* Column 2: Collections */}
          <div className="flex flex-col gap-[1.2rem]">
            <h3 className="text-[0.8rem] font-bold tracking-[0.12em] text-[#C5A059] uppercase">COLLECTIONS</h3>
            <ul className="list-none p-0 m-0 flex flex-col gap-[0.8rem]">
              <li><Link href="/best-sellers" className="text-[0.85rem] text-[#A3A3A3] no-underline transition-colors hover:text-white">Best Sellers</Link></li>
              <li><Link href="/products" className="text-[0.85rem] text-[#A3A3A3] no-underline transition-colors hover:text-white">All Products</Link></li>
              <li><Link href="/shop?category=haircare" className="text-[0.85rem] text-[#A3A3A3] no-underline transition-colors hover:text-white">Hair Care Solutions</Link></li>
              <li><Link href="/shop?category=fragrances" className="text-[0.85rem] text-[#A3A3A3] no-underline transition-colors hover:text-white">Eau De Parfum</Link></li>
              <li><Link href="/shop?category=grooming" className="text-[0.85rem] text-[#A3A3A3] no-underline transition-colors hover:text-white">Face & Body Serums</Link></li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div className="flex flex-col gap-[1.2rem]">
            <h3 className="text-[0.8rem] font-bold tracking-[0.12em] text-[#C5A059] uppercase">CUSTOMER CARE</h3>
            <ul className="list-none p-0 m-0 flex flex-col gap-[0.8rem]">
              <li><Link href="/about" className="text-[0.85rem] text-[#A3A3A3] no-underline transition-colors hover:text-white">About SK</Link></li>
              <li><Link href="/checkout" className="text-[0.85rem] text-[#A3A3A3] no-underline transition-colors hover:text-white">Track Order</Link></li>
              <li><Link href="/privacy-policy" className="text-[0.85rem] text-[#A3A3A3] no-underline transition-colors hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="text-[0.85rem] text-[#A3A3A3] no-underline transition-colors hover:text-white">Terms of Service</Link></li>
              <li><Link href="/refund-policy" className="text-[0.85rem] text-[#A3A3A3] no-underline transition-colors hover:text-white">Refund & Return Policy</Link></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[0.8rem] font-bold tracking-[0.12em] text-[#C5A059] uppercase">JOIN THE CLUB</h3>
            <p className="text-[0.85rem] text-[#A3A3A3] leading-[1.5]">
              Subscribe to receive private sale invitations, luxury gift launches, and grooming advice.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2 mt-1.5">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-[42px] px-4 bg-[#1A1A1A] border border-[#333333] rounded-md text-white text-[0.82rem] outline-none transition-colors focus:border-[#C5A059]"
                required
              />
              <button type="submit" className="h-[42px] px-[1.2rem] bg-[#C5A059] text-white border-none rounded-md text-[0.78rem] font-bold tracking-[0.08em] cursor-pointer transition-colors hover:bg-[#B08D46]">
                JOIN
              </button>
            </form>
            {subscribed && (
              <p className="text-[0.78rem] text-[#10B981] font-semibold">Thank you for subscribing to SK!</p>
            )}
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="border-t border-[#222222] py-6 bg-[#0A0A0A]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <p className="text-[0.78rem] text-[#737373]">
              © {new Date().getFullYear()} SK Luxury Grooming & Lifestyle. All Rights Reserved.
            </p>
            <div className="flex items-center gap-[0.8rem]">
              <Link href="/privacy-policy" className="text-[0.78rem] text-[#737373] no-underline transition-colors hover:text-white">Privacy Policy</Link>
              <span className="text-[#404040] text-[0.7rem]">•</span>
              <Link href="/terms-of-service" className="text-[0.78rem] text-[#737373] no-underline transition-colors hover:text-white">Terms of Service</Link>
              <span className="text-[#404040] text-[0.7rem]">•</span>
              <Link href="/refund-policy" className="text-[0.78rem] text-[#737373] no-underline transition-colors hover:text-white">Refund Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
