import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

const contentVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' }
  }
};

export default function BrandFlare() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ once: true, margin: '-50px' }}
      className="w-full py-8 lg:py-14 bg-white"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative w-full h-[380px] sm:h-[480px] md:h-[580px] lg:h-[650px] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-[#EAE5DC] group">
          {/* Background Image */}
          <img
            src="/banners/flare_banner.png"
            alt="SK Luxury Collection Showcase"
            className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
          />

          {/* Dark Gradient Overlay for Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/20 md:to-transparent" />

          {/* Hero-Style Content Overlay */}
          <div className="absolute inset-0 flex items-center p-6 sm:p-10 md:p-16 lg:p-20">
            <motion.div
              variants={contentVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="max-w-xl flex flex-col items-start gap-3 sm:gap-4 md:gap-5 text-white z-10"
            >
              <span className="text-[0.68rem] sm:text-[0.78rem] font-extrabold tracking-[0.2em] text-[#C39F68] uppercase bg-[#121316]/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#C39F68]/30">
                THE ART OF LUXURY
              </span>

              <h2 className="text-[1.8rem] sm:text-[2.6rem] md:text-[3.2rem] lg:text-[3.6rem] font-bold text-white leading-[1.1] tracking-tight drop-shadow-md">
                Purity Meets Unrivaled Craftsmanship
              </h2>

              <p className="text-[0.88rem] sm:text-[1rem] md:text-[1.1rem] text-gray-200 leading-relaxed font-medium drop-shadow-sm max-w-lg">
                Explore our signature organic hair care, fine fragrances & handcrafted leather accessories engineered for timeless elegance.
              </p>

              <div className="pt-2">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2.5 bg-[#C39F68] text-white text-[0.8rem] sm:text-[0.88rem] font-extrabold px-6 sm:px-8 py-3 sm:py-4 rounded-xl tracking-wider uppercase no-underline transition-all duration-300 hover:bg-white hover:text-[#121316] hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:-translate-y-0.5"
                >
                  <span>Explore Collection</span>
                  <ArrowRight size={18} />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
