import React from 'react';
import Head from 'next/head';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import TrustBar from '@/components/common/TrustBar';
import { getImageUrl } from '@/utils/imageHelper';
import { Building2, MapPin, Phone, MessageCircle, Mail, Globe, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About Us | SK EURO LIFESTYLE</title>
        <meta 
          name="description" 
          content="Discover SK EURO LIFESTYLE - Luxury organic hair care, artisanal fragrances, and lifestyle essentials crafted in Kerala, India." 
        />
      </Head>

      <Header />

      <main className="min-h-screen bg-[#FAF8F5] pt-20 pb-20 text-[#121316]">
        
        {/* Luxury Hero Banner */}
        <section className="w-full bg-[#121316] text-white pt-16 pb-20 px-6 sm:px-12 text-center relative overflow-hidden">
          <div className="max-w-[840px] mx-auto relative z-10 space-y-4">
            <span className="inline-flex items-center gap-2 text-[0.75rem] font-bold tracking-[0.2em] text-[#C5A059] uppercase bg-[#1E1F24] px-4 py-1.5 rounded-full border border-[#2E3038]">
              <Sparkles size={14} className="text-[#C5A059]" />
              LUXURY GROOMING & LIFESTYLE
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
              The Story of SK EURO LIFESTYLE
            </h1>
            <p className="text-base sm:text-lg text-[#9CA3AF] max-w-2xl mx-auto leading-relaxed font-light">
              Crafting high-performance organic hair oils, artisanal Eau De Parfum fragrances, and lifestyle accessories designed for uncompromising quality.
            </p>
          </div>
          {/* Background glow effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#C5A059]/10 blur-[100px] rounded-full pointer-events-none" />
        </section>

        {/* Main Content Layout */}
        <div className="max-w-[960px] mx-auto px-4 sm:px-8 -mt-10 relative z-20 space-y-10">
          
          {/* Main Story Container */}
          <div className="bg-white rounded-2xl overflow-hidden border border-[#EAE6DF] shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
            
            {/* Feature Image Header (Replacing the Logo) */}
            <div className="relative w-full h-[280px] sm:h-[400px] overflow-hidden bg-[#18191C]">
              <img 
                src={getImageUrl('/banners/banner1.png')} 
                alt="SK EURO LIFESTYLE Products" 
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getImageUrl('/images/category_tile_6.png');
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[0.72rem] font-bold tracking-[0.16em] text-[#C5A059] uppercase block mb-1">
                  ESTABLISHED IN KERALA, INDIA
                </span>
                <h2 className="text-xl sm:text-2xl font-bold">
                  Pure Ingredients • Master Craftsmanship
                </h2>
              </div>
            </div>

            {/* Editorial Article Body */}
            <div className="p-6 sm:p-12 space-y-8">
              
              {/* Introduction */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-[#121316] tracking-tight">
                  Our Origins & Heritage
                </h3>
                <p className="text-gray-700 text-base sm:text-[1.05rem] leading-relaxed font-normal">
                  <strong className="text-[#121316] font-semibold">SK EURO LIFESTYLE</strong> was established with a singular vision: to create authentic, organic grooming products that combine traditional herbal wisdom with modern aesthetic elegance. Rooted in Palakkad, Kerala—a land celebrated for its rich botanical heritage—our formulations represent the perfect harmony of nature and science.
                </p>
              </div>

              {/* Quote Highlight */}
              <div className="my-8 p-6 sm:p-8 bg-[#FAF8F5] border-l-4 border-[#C5A059] rounded-r-xl space-y-2">
                <p className="text-lg sm:text-xl font-medium text-[#121316] italic leading-relaxed">
                  "True luxury is not defined by excess, but by purity of intent, raw quality, and real efficacy."
                </p>
                <span className="text-xs font-bold tracking-widest text-[#C5A059] uppercase block">
                  — SK EURO LIFESTYLE Brand Philosophy
                </span>
              </div>

              {/* Detailed Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-[#F0EDE8]">
                <div className="space-y-3">
                  <h4 className="text-lg font-bold text-[#121316]">Organic Hair & Beard Care</h4>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    Our flagship organic hair oils and beard serums are prepared using cold-pressed botanical oils and natural extracts. Free from harsh chemicals, synthetic fillers, or artificial parabens, each batch is crafted to nourish from root to tip.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-lg font-bold text-[#121316]">Artisanal Fragrances</h4>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    Our Eau De Parfum collection is designed for individuals who appreciate distinct olfactory signatures. Blending rich amber, oud, citrus, and floral notes, our scents offer lasting elegance and depth.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Official Manufactured & Marketed By Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-10 border border-[#EAE6DF] shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-6">
            <div className="flex items-center gap-4 border-b border-[#F0EDE8] pb-5">
              <div className="w-12 h-12 rounded-xl bg-[#FDF8F0] border border-[#F5E6CD] flex items-center justify-center text-[#C5A059] shrink-0">
                <Building2 size={24} />
              </div>
              <div>
                <span className="text-[0.72rem] font-bold tracking-[0.16em] text-[#C5A059] uppercase block mb-0.5">
                  MANUFACTURED & MARKETED BY
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#121316]">
                  SK EURO LIFESTYLE
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[#333333]">
              {/* Address */}
              <div className="bg-[#FAF8F5] p-5 rounded-xl border border-[#F0EDE8] flex items-start gap-3.5">
                <MapPin className="text-[#C5A059] shrink-0 mt-0.5" size={20} />
                <div>
                  <h3 className="text-xs font-bold text-[#888888] uppercase tracking-wider mb-1">Registered Address</h3>
                  <p className="text-sm font-medium text-gray-800 leading-relaxed">
                    Choorakode - 679336 Palakkad Dt,<br />
                    Kerala, India
                  </p>
                </div>
              </div>

              {/* Customer Care Contacts */}
              <div className="bg-[#FAF8F5] p-5 rounded-xl border border-[#F0EDE8] space-y-3">
                <h3 className="text-xs font-bold text-[#888888] uppercase tracking-wider mb-2">Customer Care & Support</h3>
                
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="text-[#C5A059] shrink-0" size={17} />
                  <a href="tel:+914662236207" className="text-gray-800 hover:text-[#C5A059] font-semibold transition-colors">
                    +91 466 2236 207
                  </a>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <MessageCircle className="text-[#25D366] shrink-0" size={17} />
                  <a href="https://wa.me/919072171712" target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-[#C5A059] font-semibold transition-colors">
                    +91 9072 17 17 12
                  </a>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Mail className="text-[#C5A059] shrink-0" size={17} />
                  <a href="mailto:support@skeurolifestyle.com" className="text-gray-800 hover:text-[#C5A059] font-semibold transition-colors">
                    support@skeurolifestyle.com
                  </a>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Globe className="text-[#C5A059] shrink-0" size={17} />
                  <a href="https://www.skeurolifestyle.com" target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-[#C5A059] font-semibold transition-colors">
                    www.skeurolifestyle.com
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Store Trust Features */}
        <div className="mt-20">
          <TrustBar />
        </div>
      </main>

      <Footer />
    </>
  );
}
