import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { useCart } from '@/context/CartContext';
import { productAPI } from '@/api/services/productAPI';
import { IProduct } from '@/types/product';
import { getImageUrl } from '@/utils/imageHelper';
import { getProductSlug } from '@/utils/slugHelper';

interface ProductItem {
  id: number;
  title: string;
  slug?: string;
  price: number;
  originalPrice?: number;
  rating: string;
  reviewsCount: number;
  discountBadge?: string;
  badgeText?: string;
  badgeType?: 'green' | 'gold';
  img: string;
}

const DEFAULT_BESTSELLERS: ProductItem[] = [
  { id: 1, title: 'Noir Premium Fragrance - 50ml', price: 499, originalPrice: 2499, rating: '4.8', reviewsCount: 49, discountBadge: '80% OFF', badgeText: 'Best Seller', badgeType: 'gold', img: '/hero cards/1.png' },
  { id: 2, title: 'SK Herbal Hair Oil - 100ml', price: 335, originalPrice: 399, rating: '4.8', reviewsCount: 131, discountBadge: '16% OFF', badgeText: 'Best Seller', badgeType: 'gold', img: '/hero cards/2.png' },
  { id: 3, title: 'Vitamin C Brightening Face Wash', price: 199, originalPrice: 259, rating: '4.9', reviewsCount: 160, discountBadge: '23% OFF', badgeText: 'Best Seller', badgeType: 'gold', img: '/hero cards/3.png' },
  { id: 4, title: 'Eau De Parfum | Amber Oud', price: 899, originalPrice: 1499, rating: '4.7', reviewsCount: 88, discountBadge: '40% OFF', badgeText: 'Best Seller', badgeType: 'gold', img: '/hero cards/4.png' }
];

function mapProductToItem(prod: IProduct, fallbackImg: string): ProductItem {
  const numericPrice = typeof prod.selling_price === 'number' && prod.selling_price > 0
    ? prod.selling_price
    : parseFloat(prod.price) || 499;
  const originalPriceNum = parseFloat(prod.price) || 0;
  const discountVal = parseFloat(prod.discount) || 0;

  let discountBadge = '';
  if (discountVal > 0 && originalPriceNum > 0) {
    const percent = Math.round((discountVal / originalPriceNum) * 100);
    if (percent > 0) discountBadge = `${percent}% OFF`;
  }

  const rawImg = prod.icon || (prod.img && prod.img[0]?.image);

  return {
    id: prod.id,
    title: prod.alias || prod.slug || 'SK Bestseller',
    slug: getProductSlug(prod),
    price: numericPrice,
    originalPrice: originalPriceNum > numericPrice ? originalPriceNum : undefined,
    rating: prod.rating ? prod.rating.toFixed(1) : '4.8',
    reviewsCount: prod.review_count || 45,
    discountBadge: discountBadge || undefined,
    badgeText: 'Best Seller',
    badgeType: 'gold',
    img: getImageUrl(rawImg, fallbackImg)
  };
}

export default function BestSellersPage() {
  const [products, setProducts] = useState<ProductItem[]>(DEFAULT_BESTSELLERS);
  const [loading, setLoading] = useState<boolean>(true);
  const { addToCart } = useCart();

  useEffect(() => {
    productAPI.getBestSellersHome()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((prod: IProduct, idx: number) =>
            mapProductToItem(prod, DEFAULT_BESTSELLERS[idx % DEFAULT_BESTSELLERS.length].img)
          );
          setProducts(mapped);
        } else {
          productAPI.getBestSellers().then((fallbackData) => {
            if (Array.isArray(fallbackData) && fallbackData.length > 0) {
              const mapped = fallbackData.map((prod: IProduct, idx: number) =>
                mapProductToItem(prod, DEFAULT_BESTSELLERS[idx % DEFAULT_BESTSELLERS.length].img)
              );
              setProducts(mapped);
            }
          });
        }
      })
      .catch((err) => {
        console.warn('Failed to load best sellers from backend:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Head>
        <title>Best Sellers | SK Luxury Grooming & Lifestyle</title>
        <meta name="description" content="Shop SK's top-rated best selling hair oils, fragrances, skincare, and luxury lifestyle accessories." />
      </Head>

      <Header />

      <main className="flex-1">
        <div className="bg-[#121316] text-white py-16 px-6 text-center">
          <div className="max-w-[800px] mx-auto">
            <span className="inline-block text-[0.75rem] font-bold tracking-[0.15em] text-[#C39F68] mb-3">MOST LOVED & TOP RATED</span>
            <h1 className="text-[2.5rem] font-extrabold mb-4 tracking-tight">SK Bestsellers</h1>
            <p className="text-[1rem] text-[#9CA3AF] leading-relaxed">
              Discover customer favorites—handpicked luxury hair care, long-lasting fragrances, and premium leather essentials.
            </p>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-6 py-12 lg:py-20">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E5E7EB]">
            <span className="text-[0.9rem] font-semibold text-[#4B5563]">Showing {products.length} Best Sellers</span>
            <div className="flex items-center gap-2.5 text-[0.88rem] text-[#374151]">
              <label htmlFor="sort-select">Sort by:</label>
              <select id="sort-select" className="px-3 py-1.5 border border-[#D1D5DB] rounded-md bg-white text-[0.88rem] outline-none cursor-pointer" defaultValue="popular">
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="w-full h-[320px] rounded-lg bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((item) => (
                <div key={item.id} className="group bg-white border border-[#E5E7EB] rounded-lg overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(0,0,0,0.08)] hover:border-[#C39F68]">
                  <Link href={`/product/${getProductSlug(item)}`} className="flex flex-col h-full no-underline">
                    <div className="relative w-full aspect-[0.95] p-5 flex items-center justify-center bg-white overflow-hidden">
                      {item.badgeText && (
                        <span className="absolute top-3 left-3 px-2 py-1 text-[0.68rem] font-bold rounded bg-[#C39F68] text-white uppercase z-10">{item.badgeText}</span>
                      )}
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-full h-full object-contain transition-transform duration-400 ease-out group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/hero cards/4.png';
                        }}
                      />
                    </div>

                    <div className="p-4 flex flex-col gap-1.5 flex-1">
                      <div className="flex items-center gap-1 text-[0.72rem]">
                        <span className="text-[#F59E0B] font-bold">★ {item.rating}</span>
                        <span className="text-[#D1D5DB]">|</span>
                        <span className="text-[#6B7280]">{item.reviewsCount} Reviews</span>
                      </div>

                      <h3 className="text-[0.9rem] font-bold text-[#121316] leading-snug line-clamp-2">{item.title}</h3>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[1rem] font-extrabold text-[#121316]">₹{item.price}</span>
                        {item.originalPrice && (
                          <span className="text-[0.82rem] text-[#9CA3AF] line-through">₹{item.originalPrice}</span>
                        )}
                      </div>
                    </div>
                  </Link>

                  <div className="p-4 pt-0">
                    <button
                      onClick={() =>
                        addToCart({
                          id: item.id,
                          title: item.title,
                          price: item.price,
                          originalPrice: item.originalPrice,
                          img: item.img
                        })
                      }
                      className="w-full bg-[#121316] text-white border border-transparent py-2.5 rounded-md text-[0.85rem] font-bold cursor-pointer transition-all duration-200 hover:bg-[#2D3036] hover:border-[#C39F68] active:scale-97"
                    >
                      Add To Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
