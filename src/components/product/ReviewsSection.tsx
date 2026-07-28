import React from 'react';
import { Star, CheckCircle2, Quote } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

interface Review {
  id: number;
  name: string;
  avatar: string;
  location: string;
  verified: boolean;
  rating: number;
  headline: string;
  comment: string;
  productName: string;
  productImg: string;
}

const REVIEWS: Review[] = [
  {
    id: 1,
    name: 'Ananya Krishnan',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    location: 'Kochi, Kerala',
    verified: true,
    rating: 5,
    headline: 'Smells divine & lasts literally all day!',
    comment: 'The SK Noir Eau De Parfum exceeds every expectation. The rich woody amber notes settle beautifully on the skin. I receive compliments every time I wear it!',
    productName: 'SK Noir Luxury Eau De Parfum',
    productImg: '/hero cards/4.png'
  },
  {
    id: 2,
    name: 'Rahul Menath',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    location: 'Bengaluru',
    verified: true,
    rating: 5,
    headline: 'Noticeable hair density in just 3 weeks!',
    comment: 'SK Organic Hair Oil changed my hair routine completely. Non-sticky, lightweight, and deeply nourishing. My hair feels significantly thicker and healthier.',
    productName: 'SK Herbal Hair Oil 200ml',
    productImg: '/bundle - combo offer/1.png'
  },
  {
    id: 3,
    name: 'Priya Sundaram',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    location: 'Chennai',
    verified: true,
    rating: 5,
    headline: 'Gentle, brightens skin from first wash!',
    comment: 'The Vitamin C Face Wash is super gentle yet powerful. Skin feels refreshed, bright, and deeply hydrated without any tightness. Absolutely love the citrus fragrance!',
    productName: 'Vitamin C Brightening Wash',
    productImg: '/hero cards/3.png'
  }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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

export default function ReviewsSection() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className="w-full py-16 lg:py-24 bg-[#FAF8F5] border-t border-b border-[#F0EDE8] relative overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Top Social Proof Rating Summary */}
        <motion.div variants={cardVariants} className="flex flex-col items-center text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 bg-[#C39F68]/10 border border-[#C39F68]/30 px-3.5 py-1.5 rounded-full mb-4">
            <span className="text-[0.72rem] font-extrabold tracking-[0.14em] text-[#C39F68] uppercase">
              VERIFIED CUSTOMER REVIEWS
            </span>
          </div>

          <h2 className="text-[1.8rem] sm:text-[2.2rem] lg:text-[2.6rem] font-bold text-[#121316] tracking-tight mb-4">
            Loved By Thousands
          </h2>

          {/* Aggregate Rating Badge Bar */}
          <div className="flex items-center gap-4 flex-wrap justify-center bg-white border border-[#EAE5DC] px-6 py-3 rounded-2xl shadow-sm">
            <div className="flex items-center gap-1 text-[#C39F68]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} className="fill-[#C39F68] text-[#C39F68]" />
              ))}
            </div>

            <span className="text-[1.1rem] font-extrabold text-[#121316]">4.9 / 5.0</span>
            <span className="text-[#D1D5DB]">•</span>

            {/* Overlapping Avatars Stack */}
            <div className="flex items-center -space-x-2.5">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Customer"
                className="w-7 h-7 rounded-full border-2 border-white object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                alt="Customer"
                className="w-7 h-7 rounded-full border-2 border-white object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80"
                alt="Customer"
                className="w-7 h-7 rounded-full border-2 border-white object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
                alt="Customer"
                className="w-7 h-7 rounded-full border-2 border-white object-cover"
              />
            </div>

            <span className="text-[0.85rem] font-semibold text-[#4B5563]">
              Based on <strong className="text-[#121316]">2,450+</strong> verified reviews
            </span>
          </div>
        </motion.div>

        {/* 3 Testimonial Cards */}
        <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {REVIEWS.map((rev) => (
            <motion.div
              key={rev.id}
              variants={cardVariants}
              whileHover={{ y: -6 }}
              className="group bg-white border border-[#EAE5DC] rounded-2xl p-6 lg:p-8 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] hover:border-[#C39F68] relative"
            >
              <Quote className="absolute top-6 right-6 text-[#C39F68]/15 w-10 h-10 pointer-events-none group-hover:text-[#C39F68]/30 transition-colors" />

              <div>
                {/* Reviewer Info */}
                <div className="flex items-center gap-3.5 mb-4">
                  <img
                    src={rev.avatar}
                    alt={rev.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#EAE5DC] group-hover:border-[#C39F68] transition-colors"
                  />
                  <div className="flex flex-col">
                    <h3 className="text-[0.95rem] font-bold text-[#121316] leading-tight">
                      {rev.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <CheckCircle2 size={13} className="text-[#15803D]" />
                      <span className="text-[0.72rem] font-bold text-[#15803D]">Verified Buyer</span>
                      <span className="text-[0.72rem] text-[#9CA3AF]">• {rev.location}</span>
                    </div>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={15} className="fill-[#C39F68] text-[#C39F68]" />
                  ))}
                </div>

                {/* Headline & Body */}
                <h4 className="text-[1.02rem] font-bold text-[#121316] leading-snug mb-2">
                  "{rev.headline}"
                </h4>
                <p className="text-[0.88rem] text-[#4B5563] leading-relaxed italic mb-6">
                  {rev.comment}
                </p>
              </div>

              {/* Purchased Item Footer Badge */}
              <div className="flex items-center gap-3 pt-4 border-t border-[#F1F5F9] bg-[#FAF8F5] p-3 rounded-xl">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-white shrink-0 p-1 border border-[#EAE5DC]">
                  <img src={rev.productImg} alt={rev.productName} className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-[0.68rem] font-bold text-[#9CA3AF] uppercase">PURCHASED ITEM</span>
                  <span className="text-[0.82rem] font-bold text-[#121316] truncate">{rev.productName}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
