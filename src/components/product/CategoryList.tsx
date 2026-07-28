import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

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
    <section className="w-full bg-white py-12 lg:py-[4.5rem] border-b border-[#EEEEEE]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="flex items-end justify-between mb-8">
          <div className="flex flex-col gap-[0.3rem]">
            <span className="text-[0.65rem] lg:text-[0.72rem] font-bold tracking-[0.14em] text-[#C5A059]">DISCOVER</span>
            <h2 className="text-[1.25rem] lg:text-[1.5rem] font-extrabold tracking-[0.04em] text-[#111111]">CURATED COLLECTIONS</h2>
          </div>
          <Link href="/shop" className="flex items-center gap-[0.4rem] text-[0.76rem] lg:text-[0.82rem] font-bold tracking-[0.04em] text-[#111111] no-underline transition-colors hover:text-[#C5A059]">
            <span>Explore All Categories</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-[1.2rem]">
          {CURATED_CATEGORY_TILES.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group block rounded-lg overflow-hidden shadow-[0_4px_14px_rgba(0,0,0,0.05)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] bg-[#F7F7F7] border border-[#EAEAEA] no-underline hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.1)] hover:border-[#C5A059] focus-visible:outline-2 focus-visible:outline-[#C5A059] focus-visible:outline-offset-2"
            >
              <div className="w-full aspect-[0.82] overflow-hidden relative">
                {cat.isComingSoon && (
                  <span className="absolute top-[0.6rem] right-[0.6rem] bg-[#111111]/90 backdrop-blur-[4px] text-[#C5A059] border border-[#C5A059]/40 text-[0.58rem] font-extrabold px-2 py-0.8 rounded tracking-[0.08em] z-10 uppercase">
                    COMING SOON
                  </span>
                )}
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-108"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/hero cards/4.png';
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-3 pt-[1.2rem] bg-gradient-to-t from-black/75 to-transparent flex items-end justify-center">
                  <span className="text-white text-[0.8rem] lg:text-[0.88rem] font-bold tracking-[0.04em] drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)] text-center">
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
