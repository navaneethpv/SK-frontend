import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { productAPI } from '@/api/services/productAPI';

interface CategoryTile {
  id: number;
  name: string;
  slug: string;
}

const PLACEHOLDER_IMAGE = '/hero cards/4.png';

export default function CategoryList() {
  const [categories, setCategories] = useState<CategoryTile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    productAPI.getCategories()
      .then((data: any[]) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped: CategoryTile[] = data.map((cat: any, idx: number) => {
            const computedSlug = cat.slug || (cat.name ? cat.name.toLowerCase().trim().replace(/\s+/g, '-') : `cat-${cat.id || idx}`);
            return {
              id: cat.id || idx + 1,
              name: cat.name || `Category ${idx + 1}`,
              slug: computedSlug
            };
          });
          setCategories(mapped);
        } else {
          setCategories([]);
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch categories from backend API:', err);
        setCategories([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!loading && categories.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-white py-12 lg:py-16 border-b border-[#EEEEEE]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Navigation Controls */}
        <div className="flex items-end justify-between mb-8 lg:mb-10">
          <div className="flex flex-col gap-1">
            <span className="text-[0.72rem] font-extrabold tracking-[0.15em] text-[#C39F68] uppercase">
              DISCOVER
            </span>
            <h2 className="text-[1.5rem] lg:text-[2rem] font-bold tracking-tight text-[#121316]">
              Curated Collections
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleScroll('left')}
              className="w-10 h-10 rounded-full border border-[#E5E7EB] bg-white flex items-center justify-center text-[#121316] hover:bg-[#121316] hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="w-10 h-10 rounded-full border border-[#E5E7EB] bg-white flex items-center justify-center text-[#121316] hover:bg-[#121316] hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </button>
            <Link
              href="/shop"
              className="hidden sm:flex items-center gap-2 text-[0.85rem] font-bold text-[#121316] no-underline transition-colors hover:text-[#C39F68] ml-2"
            >
              <span>Explore All</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Sliding Category Carousel */}
        {loading ? (
          <div className="text-center py-12 text-[#6B7280]">
            <div className="w-8 h-8 border-2 border-[#C39F68] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-medium">Loading collections...</p>
          </div>
        ) : (
          <div
            ref={scrollContainerRef}
            className={`flex gap-4 lg:gap-6 overflow-x-auto scroll-smooth pb-4 pt-1 no-scrollbar ${
              categories.length < 4 ? 'justify-center' : ''
            }`}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="shrink-0 w-[200px] sm:w-[220px] lg:w-[240px] transition-transform duration-300 hover:-translate-y-1.5"
              >
                <Link
                  href={`/shop?category=${encodeURIComponent(cat.slug)}`}
                  className="group block rounded-2xl overflow-hidden bg-[#FAF8F5] border border-[#EAE5DC] no-underline transition-all duration-300 hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] hover:border-[#C39F68]"
                >
                  <div className="w-full aspect-[0.85] overflow-hidden relative">
                    <img
                      src={PLACEHOLDER_IMAGE}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    />

                    {/* Bottom Overlay Category Name */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 pt-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-center">
                      <span className="text-white text-[0.95rem] font-bold tracking-wide text-center drop-shadow-md group-hover:text-[#C39F68] transition-colors">
                        {cat.name}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
