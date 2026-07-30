import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import { getImageUrl } from '@/utils/imageHelper';
import { productAPI } from '@/api/services/productAPI';

interface CategoryTile {
  id: number;
  name: string;
  slug: string;
  img: string;
  isComingSoon?: boolean;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const tileVariants: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

export default function CategoryList() {
  const [categories, setCategories] = useState<CategoryTile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    productAPI.getCategories()
      .then((data: any[]) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped: CategoryTile[] = data.map((cat: any, idx: number) => {
            const fallback = `/images/category_tile_${(idx % 6) + 1}.png`;
            return {
              id: cat.id || idx + 1,
              name: cat.name || `Category ${idx + 1}`,
              slug: cat.slug || cat.name?.toLowerCase().replace(/\s+/g, '-') || 'all',
              img: getImageUrl(cat.icon || cat.image, fallback),
              isComingSoon: Boolean(cat.is_coming_soon)
            };
          });
          setCategories(mapped);
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch categories from backend API:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className="w-full bg-white py-12 lg:py-20 border-b border-[#EEEEEE]"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div variants={tileVariants} className="flex items-end justify-between mb-8 lg:mb-12">
          <div className="flex flex-col gap-1">
            <span className="text-[0.72rem] font-extrabold tracking-[0.15em] text-[#C39F68] uppercase">
              DISCOVER
            </span>
            <h2 className="text-[1.5rem] lg:text-[2rem] font-bold tracking-tight text-[#121316]">
              Curated Collections
            </h2>
          </div>

          <Link
            href="/shop"
            className="flex items-center gap-2 text-[0.85rem] font-bold text-[#121316] no-underline transition-colors hover:text-[#C39F68]"
          >
            <span>Explore All Categories</span>
            <ArrowRight size={16} />
          </Link>
        </motion.div>

        {/* Category Tiles Grid */}
        {loading ? (
          <div className="text-center py-16 text-[#6B7280]">
            <div className="w-8 h-8 border-2 border-[#C39F68] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-medium">Loading collections...</p>
          </div>
        ) : (
          <motion.div variants={containerVariants} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
            {categories.map((cat, idx) => (
              <motion.div key={cat.id} variants={tileVariants} whileHover={{ y: -6 }}>
                <Link
                  href={`/shop?category=${cat.slug}`}
                  className="group block rounded-2xl overflow-hidden bg-[#FAF8F5] border border-[#EAE5DC] no-underline transition-all duration-300 hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] hover:border-[#C39F68]"
                >
                  <div className="w-full aspect-[0.85] overflow-hidden relative">
                    {cat.isComingSoon && (
                      <span className="absolute top-2.5 right-2.5 bg-[#121316]/90 backdrop-blur-md text-[#C39F68] border border-[#C39F68]/40 text-[0.58rem] font-extrabold px-2 py-0.5 rounded tracking-wider z-10 uppercase shadow-sm">
                        COMING SOON
                      </span>
                    )}

                    <img
                      src={cat.img}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getImageUrl(`/images/category_tile_${(idx % 6) + 1}.png`);
                      }}
                    />

                    {/* Bottom Overlay Category Name */}
                    <div className="absolute bottom-0 left-0 right-0 p-3.5 pt-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-center">
                      <span className="text-white text-[0.9rem] font-bold tracking-wide text-center drop-shadow-md group-hover:text-[#C39F68] transition-colors">
                        {cat.name}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
