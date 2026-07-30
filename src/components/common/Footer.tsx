import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Facebook, Instagram, Youtube, Twitter, Share2, Phone, Mail, MapPin, Globe, MessageCircle } from 'lucide-react';
import { productAPI } from '@/api/services/productAPI';
import { getImageUrl } from '@/utils/imageHelper';
import { ISocialMedia } from '@/types/home';

export default function Footer() {
  const router = useRouter();
  const currentPath = router.pathname;
  const [socials, setSocials] = useState<ISocialMedia[]>([]);

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  useEffect(() => {
    productAPI.getSocialMedias()
      .then((data: ISocialMedia[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setSocials(data);
        }
      })
      .catch((err) => {
        console.warn('Social media API notice:', err);
      });
  }, []);

  const renderSocialIcon = (soc: ISocialMedia) => {
    const titleLower = (soc.title || soc.name || '').toLowerCase();
    const linkUrl = soc.link || soc.url || '#';

    let IconComp = Share2;
    if (titleLower.includes('facebook')) IconComp = Facebook;
    else if (titleLower.includes('instagram')) IconComp = Instagram;
    else if (titleLower.includes('youtube')) IconComp = Youtube;
    else if (titleLower.includes('twitter') || titleLower.includes('x')) IconComp = Twitter;

    return (
      <a 
        key={soc.id} 
        href={linkUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="w-9 h-9 rounded-full bg-[#1E1F24] text-[#A1A1AA] flex items-center justify-center transition-all duration-200 hover:bg-[#C5A059] hover:text-white hover:-translate-y-0.5" 
        aria-label={soc.title || 'Social Link'}
      >
        {soc.icon && typeof soc.icon === 'string' && soc.icon.startsWith('http') ? (
          <img src={getImageUrl(soc.icon)} alt={soc.title || 'icon'} className="w-4 h-4 object-contain" />
        ) : (
          <IconComp size={16} />
        )}
      </a>
    );
  };

  return (
    <footer className="w-full bg-[#0D0E11] text-white border-t border-[#1F2026]">
      {/* Main Footer Container */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1.5fr_1.3fr] gap-10 lg:gap-16">
          
          {/* Column 1: Brand Info */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="inline-block">
              <img src={getImageUrl('/SK Logo.svg')} alt="SK Logo" className="h-[46px] w-auto object-contain" />
            </Link>
            <p className="text-[0.85rem] text-[#9CA3AF] leading-relaxed">
              SK EURO LIFESTYLE crafts premium organic hair care, luxury fragrances, and lifestyle products with uncompromising quality.
            </p>
            <div className="flex gap-2.5 mt-2">
              {socials.length > 0 ? (
                socials.map((soc) => renderSocialIcon(soc))
              ) : (
                <>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-[#1E1F24] text-[#A1A1AA] flex items-center justify-center transition-all duration-200 hover:bg-[#C5A059] hover:text-white hover:-translate-y-0.5" aria-label="Facebook">
                    <Facebook size={16} />
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-[#1E1F24] text-[#A1A1AA] flex items-center justify-center transition-all duration-200 hover:bg-[#C5A059] hover:text-white hover:-translate-y-0.5" aria-label="Instagram">
                    <Instagram size={16} />
                  </a>
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-[#1E1F24] text-[#A1A1AA] flex items-center justify-center transition-all duration-200 hover:bg-[#C5A059] hover:text-white hover:-translate-y-0.5" aria-label="Youtube">
                    <Youtube size={16} />
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Column 2: Quick Links (2 Columns Layout) */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[0.82rem] font-bold tracking-[0.12em] text-[#C5A059] uppercase">QUICK LINKS</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
              <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
                <li><Link href="/" className={`text-[0.88rem] no-underline transition-colors hover:text-white hover:translate-x-1 inline-block ${isActive('/') ? 'text-[#C5A059] font-bold' : 'text-[#9CA3AF]'}`}>Home</Link></li>
                <li><Link href="/shop" className={`text-[0.88rem] no-underline transition-colors hover:text-white hover:translate-x-1 inline-block ${isActive('/shop') ? 'text-[#C5A059] font-bold' : 'text-[#9CA3AF]'}`}>Shop</Link></li>
                <li><Link href="/categories" className={`text-[0.88rem] no-underline transition-colors hover:text-white hover:translate-x-1 inline-block ${isActive('/categories') ? 'text-[#C5A059] font-bold' : 'text-[#9CA3AF]'}`}>Categories</Link></li>
                <li><Link href="/best-sellers" className={`text-[0.88rem] no-underline transition-colors hover:text-white hover:translate-x-1 inline-block ${isActive('/best-sellers') ? 'text-[#C5A059] font-bold' : 'text-[#9CA3AF]'}`}>Best Sellers</Link></li>
              </ul>
              <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
                <li><Link href="/products" className={`text-[0.88rem] no-underline transition-colors hover:text-white hover:translate-x-1 inline-block ${isActive('/products') ? 'text-[#C5A059] font-bold' : 'text-[#9CA3AF]'}`}>All Products</Link></li>
                <li><Link href="/about" className={`text-[0.88rem] no-underline transition-colors hover:text-white hover:translate-x-1 inline-block ${isActive('/about') ? 'text-[#C5A059] font-bold' : 'text-[#9CA3AF]'}`}>About Us</Link></li>
                <li><Link href="/cart" className={`text-[0.88rem] no-underline transition-colors hover:text-white hover:translate-x-1 inline-block ${isActive('/cart') ? 'text-[#C5A059] font-bold' : 'text-[#9CA3AF]'}`}>My Cart</Link></li>
                <li><Link href="/checkout" className={`text-[0.88rem] no-underline transition-colors hover:text-white hover:translate-x-1 inline-block ${isActive('/checkout') ? 'text-[#C5A059] font-bold' : 'text-[#9CA3AF]'}`}>Checkout</Link></li>
              </ul>
            </div>
          </div>

          {/* Column 3: Contact & Company Details */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[0.82rem] font-bold tracking-[0.12em] text-[#C5A059] uppercase">COMPANY & CONTACT</h3>
            
            <div className="flex flex-col gap-2 text-[0.85rem] text-[#9CA3AF]">
              <div className="font-bold text-white text-[0.92rem]">SK EURO LIFESTYLE</div>
              <div className="flex items-start gap-2 text-[0.82rem] text-[#9CA3AF] leading-snug">
                <MapPin size={16} className="text-[#C5A059] shrink-0 mt-0.5" />
                <span>Choorakode - 679336 Palakkad Dt, Kerala, India</span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 text-[0.85rem] text-[#9CA3AF] pt-1">
              <a href="tel:+914662236207" className="flex items-center gap-2.5 hover:text-white transition-colors">
                <Phone size={15} className="text-[#C5A059] shrink-0" />
                <span>+91 466 2236 207</span>
              </a>
              <a href="https://wa.me/919072171712" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 hover:text-white transition-colors">
                <MessageCircle size={15} className="text-[#25D366] shrink-0" />
                <span>+91 9072 17 17 12</span>
              </a>
              <a href="mailto:support@skeurolifestyle.com" className="flex items-center gap-2.5 hover:text-white transition-colors">
                <Mail size={15} className="text-[#C5A059] shrink-0" />
                <span>support@skeurolifestyle.com</span>
              </a>
              <a href="https://www.skeurolifestyle.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 hover:text-white transition-colors">
                <Globe size={15} className="text-[#C5A059] shrink-0" />
                <span>www.skeurolifestyle.com</span>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Legal / Copyright Bar */}
      <div className="border-t border-[#1E1F24] py-6 bg-[#08090B]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-[0.8rem] text-[#6B7280]">
            © {new Date().getFullYear()} SK EURO LIFESTYLE. All Rights Reserved.
          </p>
          <p className="text-[0.8rem] text-[#6B7280]">
            Manufactured & Marketed by <span className="text-white font-medium">SK EURO LIFESTYLE</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
