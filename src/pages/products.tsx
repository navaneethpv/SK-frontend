import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import ProductCard from '@/components/product/ProductCard';
import { productAPI } from '@/api/services/productAPI';
import { IProduct } from '@/types/product';
import { getImageUrl } from '@/utils/imageHelper';
import { formatProductTitle } from '@/utils/slugHelper';

interface ProductItem {
  id: number;
  title: string;
  price: number;
  originalPrice?: number;
  rating: string;
  reviewsCount: number;
  discountBadge?: string;
  badgeText?: string;
  badgeType?: 'green' | 'gold';
  img: string;
}

// Mock DEFAULT_PRODUCTS commented out to rely on real API data
/*
const DEFAULT_PRODUCTS: ProductItem[] = [
  { id: 1, title: 'Noir Premium Fragrance - 50ml', price: 499, originalPrice: 2499, rating: '4.8', reviewsCount: 49, discountBadge: '80% OFF', badgeText: 'Best Seller', badgeType: 'gold', img: '/hero cards/1.png' },
  { id: 2, title: 'SK Herbal Hair Oil - 100ml', price: 335, originalPrice: 399, rating: '4.8', reviewsCount: 131, discountBadge: '16% OFF', badgeText: 'Best Seller', badgeType: 'gold', img: '/hero cards/2.png' },
  { id: 3, title: 'Vitamin C Brightening Face Wash', price: 199, originalPrice: 259, rating: '4.9', reviewsCount: 160, discountBadge: '23% OFF', badgeText: 'Best Seller', badgeType: 'gold', img: '/hero cards/3.png' },
  { id: 4, title: 'Eau De Parfum | Amber Oud', price: 899, originalPrice: 1499, rating: '4.7', reviewsCount: 88, discountBadge: '40% OFF', badgeText: 'Best Seller', badgeType: 'gold', img: '/hero cards/4.png' }
];
*/

function mapProductToItem(prod: IProduct, fallbackImg: string = '/hero cards/1.png'): ProductItem {
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
    title: formatProductTitle(prod.alias || prod.slug || 'SK Product'),
    price: numericPrice,
    originalPrice: originalPriceNum > numericPrice ? originalPriceNum : undefined,
    rating: prod.rating ? prod.rating.toFixed(1) : '4.8',
    reviewsCount: prod.review_count || 45,
    discountBadge: discountBadge || undefined,
    badgeText: prod.is_active ? 'Best Seller' : undefined,
    badgeType: 'gold',
    img: getImageUrl(rawImg, fallbackImg)
  };
}

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    productAPI.getProducts()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((prod: IProduct, idx: number) =>
            mapProductToItem(prod, `/hero cards/${(idx % 6) + 1}.png`)
          );
          setProducts(mapped);
        }
      })
      .catch((err) => {
        console.warn('Failed to load products from backend:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Head>
        <title>All Products | SK Luxury Grooming & Lifestyle</title>
        <meta name="description" content="Browse full range of SK organic hair care, artisanal perfumes, face serums, and leather accessories." />
      </Head>

      <Header />

      <main className="flex-1">
        <div className="bg-[#111111] text-white pt-24 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-6 text-center">
          <div className="max-w-[800px] mx-auto">
            <span className="inline-block text-[0.72rem] sm:text-[0.75rem] font-bold tracking-[0.14em] text-[#C5A059] mb-3">SK CATALOGUE</span>
            <h1 className="text-2xl sm:text-4xl font-extrabold mb-3 tracking-wide">ALL PRODUCTS</h1>
            <p className="text-[0.88rem] sm:text-[0.95rem] text-[#A3A3A3] leading-relaxed">
              Explore our full collection of organic grooming formulations and lifestyle essentials.
            </p>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#EAEAEA]">
            <span className="text-[0.82rem] sm:text-[0.85rem] font-bold tracking-wider text-[#666666]">Showing {products.length} Products</span>
          </div>

          {loading ? (
            <div className="text-center py-20 text-[#6B7280]">
              <div className="w-10 h-10 border-3 border-[#E5E7EB] border-t-[#111111] rounded-full animate-spin mx-auto mb-4" />
              <p>Loading products catalogue...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((item) => (
                <ProductCard
                  key={item.id}
                  id={item.id}
                  name={item.title}
                  img={item.img}
                  price={item.price}
                  originalPrice={item.originalPrice}
                  rating={item.rating}
                  reviewsCount={item.reviewsCount}
                  badgeText={item.discountBadge || item.badgeText}
                  badgeType={item.discountBadge ? 'green' : 'gold'}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
