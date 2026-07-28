import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

interface CategoryTile {
  id: number;
  name: string;
  slug: string;
  isComingSoon: boolean;
  img: string;
}

const CURATED_CATEGORY_TILES: CategoryTile[] = [
  { id: 1, name: 'Bags', slug: 'bags', isComingSoon: true, img: '/images/category_tile_1.png' },
  { id: 2, name: 'Watches', slug: 'watches', isComingSoon: true, img: '/images/category_tile_2.png' },
  { id: 3, name: 'Footwear', slug: 'footwear', isComingSoon: true, img: '/images/category_tile_3.png' },
  { id: 4, name: 'Perfumes', slug: 'perfumes', isComingSoon: false, img: '/images/category_tile_4.png' },
  { id: 5, name: 'Belts & Wallets', slug: 'wallet-belt', isComingSoon: true, img: '/images/category_tile_5.png' },
  { id: 6, name: 'Hair Care', slug: 'haircare', isComingSoon: false, img: '/images/category_tile_6.png' }
];

export default function CategoryList() {
  return (
    <section className="w-full bg-white py-12 lg:py-20 border-b border-[#EEEEEE]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-8 lg:mb-12">
          <div className="flex flex-col gap-1">
            <span className="text-[0.72rem] font-extrabold tracking-[0.15em] text-[#C39F68] uppercase flex items-center gap-1.5">
              <Sparkles size={14} /> DISCOVER
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
        </div>

        {/* 6 Category Tiles Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
          {CURATED_CATEGORY_TILES.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group block rounded-2xl overflow-hidden bg-[#FAF8F5] border border-[#EAE5DC] no-underline transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] hover:border-[#C39F68]"
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
                    (e.target as HTMLImageElement).src = '/hero cards/4.png';
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
          ))}
        </div>
      </div>
    </section>
  );
}
