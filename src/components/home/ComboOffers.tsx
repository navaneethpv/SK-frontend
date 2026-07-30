import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { getImageUrl } from '@/utils/imageHelper';

interface BundleCard {
  id: number;
  tag: string;
  title: string;
  subtitle: string;
  price: number;
  originalPrice: number;
  discountBadge: string;
  img: string;
  slug: string;
}

const BUNDLE_ITEMS: BundleCard[] = [
  {
    id: 901,
    tag: 'ORGANIC CARE',
    title: 'Essential Grooming Kit',
    subtitle: 'Organic Hair Oil + Vitamin C Face Wash + Derma Roller',
    price: 1099,
    originalPrice: 1499,
    discountBadge: '27% OFF',
    img: '/bundle - combo offer/1.png',
    slug: 'essential-grooming-kit'
  },
  {
    id: 902,
    tag: 'LUXURY LIFESTYLE',
    title: 'Premium Lifestyle Collection',
    subtitle: 'SK Noir Eau De Parfum + Leather Belt + Leather Wallet',
    price: 1499,
    originalPrice: 2299,
    discountBadge: '35% OFF',
    img: '/bundle - combo offer/2.png',
    slug: 'premium-lifestyle-collection'
  },
  {
    id: 903,
    tag: 'EXECUTIVE COLLECTION',
    title: 'Executive Essentials Set',
    subtitle: 'Full-Grain Leather Briefcase + Wristwatch + Leather Wallet',
    price: 2999,
    originalPrice: 3999,
    discountBadge: '25% OFF',
    img: '/bundle - combo offer/3.png',
    slug: 'executive-essentials-set'
  }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1
    }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

export default function ComboOffers() {
  const { addToCart } = useCart();

  const handleAddBundle = (bundle: BundleCard) => {
    addToCart(
      {
        id: bundle.id,
        title: bundle.title,
        price: bundle.price,
        originalPrice: bundle.originalPrice,
        img: bundle.img
      },
      1,
      true
    );
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className="w-full py-12 lg:py-20 bg-[#FAF8F5] border-t border-b border-[#F0EDE8]"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div variants={cardVariants} className="flex flex-col md:flex-row md:items-end justify-between mb-8 lg:mb-12 gap-4">
          <div>
            <span className="text-[0.72rem] font-extrabold tracking-[0.15em] text-[#C39F68] block mb-1 uppercase">
              SPECIAL VALUE BUNDLES
            </span>
            <h2 className="text-[1.5rem] sm:text-[1.8rem] lg:text-[2.2rem] font-bold text-[#121316] tracking-tight">
              Build Your Bundle
            </h2>
            <p className="text-[0.88rem] sm:text-[0.95rem] text-[#6B7280] mt-1">
              Curated luxury box combinations — <span className="font-bold text-[#121316]">Save up to 35% OFF</span>
            </p>
          </div>

          <Link
            href="/shop?filter=bundle"
            className="inline-flex items-center gap-2 text-[0.85rem] font-bold text-[#121316] hover:text-[#C39F68] transition-colors no-underline self-start md:self-auto"
          >
            <span>Explore All Bundles</span>
            <ArrowRight size={16} />
          </Link>
        </motion.div>

        {/* 3 Main Bundle Cards */}
        <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {BUNDLE_ITEMS.map((bundle) => (
            <motion.div
              key={bundle.id}
              variants={cardVariants}
              whileHover={{ y: -8 }}
              className="group bg-white border border-[#EAE5DC] rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:border-[#C39F68]"
            >
              <Link href={`/shop?bundle=${bundle.slug}`} className="flex flex-col h-full no-underline">
                {/* Bundle Image Container */}
                <div className="relative w-full aspect-[1.05] bg-[#FAF8F5] overflow-hidden">
                  <img
                    src={getImageUrl(bundle.img)}
                    alt={bundle.title}
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {/* Category Tag Badge */}
                  <div className="absolute top-3.5 left-3.5 flex items-center gap-2 z-10">
                    <span className="bg-[#121316]/90 backdrop-blur-md text-white text-[0.65rem] font-extrabold px-2.5 py-1 rounded-md tracking-wider uppercase">
                      {bundle.tag}
                    </span>
                    <span className="bg-[#C39F68] text-white text-[0.65rem] font-extrabold px-2.5 py-1 rounded-md tracking-wider uppercase shadow-sm">
                      {bundle.discountBadge}
                    </span>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-5 flex flex-col gap-2 flex-1">
                  <h3 className="text-[1.1rem] font-bold text-[#121316] leading-snug transition-colors group-hover:text-[#C39F68]">
                    {bundle.title}
                  </h3>
                  <p className="text-[0.82rem] text-[#6B7280] leading-relaxed line-clamp-2">
                    {bundle.subtitle}
                  </p>

                  <div className="flex items-baseline gap-2 mt-auto pt-3 border-t border-[#F1F5F9]">
                    <span className="text-[1.2rem] font-extrabold text-[#121316]">₹{bundle.price}</span>
                    <span className="text-[0.85rem] text-[#9CA3AF] line-through font-normal">₹{bundle.originalPrice}</span>
                  </div>
                </div>
              </Link>

              {/* Action Button */}
              <div className="px-5 pb-5 pt-0">
                <button
                  type="button"
                  onClick={() => handleAddBundle(bundle)}
                  className="w-full h-11 bg-[#121316] text-white border-none rounded-xl text-[0.8rem] font-extrabold tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:bg-[#C39F68] hover:shadow-md active:scale-98"
                >
                  <ShoppingBag size={15} />
                  <span>BUILD BUNDLE</span>
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
