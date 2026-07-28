import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

const contentVariants: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut' }
  }
};

export default function BrandFlare() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ once: true, margin: '-50px' }}
      className="w-screen relative bg-[#111111] overflow-hidden my-0"
      style={{ marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)' }}
    >
      <div className="relative w-full h-[340px] md:h-[460px] lg:h-[600px] xl:h-[700px] overflow-hidden group">
        {/* Background Image */}
        <img
          src="/banners/flare_banner.png"
          alt="SK Collection Showcase"
          className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-103"
        />

        {/* Dark Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

        {/* Minimalist Overlay Content */}
        <div className="absolute inset-0 flex items-center max-w-[1440px] mx-auto px-6 sm:px-10 md:px-16 lg:px-20">
          <motion.div
            variants={contentVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-lg flex flex-col items-start gap-3 sm:gap-4 text-white z-10"
          >
            <span className="text-[0.72rem] sm:text-[0.8rem] font-bold tracking-[0.2em] text-[#C39F68] uppercase">
              SK SIGNATURE COLLECTION
            </span>

            <h2 className="text-[2rem] sm:text-[2.8rem] md:text-[3.5rem] font-bold text-white leading-[1.15] tracking-tight">
              Crafted Without Compromise
            </h2>

            <p className="text-[0.9rem] sm:text-[1.05rem] text-gray-200 leading-relaxed font-normal">
              Pure organic formulations and handcrafted leather essentials designed for daily elegance.
            </p>

            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2.5 bg-[#121316] text-white border border-[#C39F68]/50 text-[0.82rem] font-bold px-7 py-3.5 rounded-xl tracking-wider uppercase no-underline transition-all duration-300 hover:bg-[#C39F68] hover:border-[#C39F68] hover:shadow-lg"
              >
                <span>Shop Collection</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
