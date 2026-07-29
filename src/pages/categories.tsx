import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { productAPI } from '@/api/services/productAPI';
import { getImageUrl } from '@/utils/imageHelper';

interface CategoryTile {
  id: number;
  name: string;
  slug: string;
  img: string;
}

// Mock DEFAULT_CATEGORIES commented out to rely on real API data
/*
const DEFAULT_CATEGORIES: CategoryTile[] = [
  { id: 1, name: 'Bags & Luggage', slug: 'bags', img: '/images/category_tile_1.png' },
  { id: 2, name: 'Luxury Watches', slug: 'watches', img: '/images/category_tile_2.png' },
  { id: 3, name: 'Footwear Collection', slug: 'footwear', img: '/images/category_tile_3.png' },
  { id: 4, name: 'Perfumes & Eau De Parfum', slug: 'perfume', img: '/images/category_tile_4.png' },
  { id: 5, name: 'Wallet & Belt Collection', slug: 'wallet-belt', img: '/images/category_tile_5.png' },
  { id: 6, name: 'Hair Care & Nourishment', slug: 'haircare', img: '/images/category_tile_6.png' }
];
*/

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryTile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    productAPI.getCategories()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((cat: any, idx: number) => {
            const fallback = `/images/category_tile_${(idx % 6) + 1}.png`;
            return {
              id: cat.id || idx + 1,
              name: cat.name || `Category ${idx + 1}`,
              slug: cat.slug || cat.name?.toLowerCase().replace(/\s+/g, '-') || 'all',
              img: getImageUrl(cat.icon || cat.image, fallback)
            };
          });
          setCategories(mapped);
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch categories from backend:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Head>
        <title>Product Categories | SK Luxury Grooming & Lifestyle</title>
        <meta name="description" content="Explore SK product categories: Bags, Watches, Footwear, Perfumes, Belts, and Hair Care." />
      </Head>

      <Header />

      <main className="flex-1">
        <div className="bg-[#121316] text-white py-16 px-6 text-center">
          <div className="max-w-[800px] mx-auto">
            <span className="inline-block text-[0.75rem] font-bold tracking-[0.15em] text-[#C39F68] mb-3">EXPLORE BY CATEGORY</span>
            <h1 className="text-[2.5rem] font-extrabold mb-4 tracking-tight">Product Categories</h1>
            <p className="text-[1rem] text-[#9CA3AF] leading-relaxed">
              Browse our curated luxury categories designed for your hair care, fragrance, and lifestyle needs.
            </p>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-6 py-12 lg:py-20">
          {loading ? (
            <div className="text-center py-20 text-[#6B7280]">
              <div className="w-10 h-10 border-3 border-[#E5E7EB] border-t-[#121316] rounded-full animate-spin mx-auto mb-4" />
              <p>Loading categories...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {categories.map((cat, idx) => (
                <Link key={cat.id} href={`/shop?category=${cat.slug}`} className="group relative rounded-xl overflow-hidden bg-white shadow-[0_4px_15px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.14)] hover:-translate-y-1.5 transition-all duration-300">
                  <div className="relative w-full aspect-[1.1] overflow-hidden">
                    <img
                      src={cat.img}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `/images/category_tile_${(idx % 6) + 1}.png`;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white flex flex-col gap-1">
                    <h3 className="text-[1.25rem] font-bold">{cat.name}</h3>
                    <span className="text-[0.85rem] font-semibold text-[#C39F68]">Shop Collection →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
