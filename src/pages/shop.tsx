import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import ProductCard from '@/components/product/ProductCard';
import { productAPI } from '@/api/services/productAPI';
import { IProduct } from '@/types/product';
import { getImageUrl } from '@/utils/imageHelper';
import { getProductSlug, formatProductTitle } from '@/utils/slugHelper';

interface ShopProduct {
  id: number;
  title: string;
  slug?: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: string;
  reviewsCount: number;
  badgeText?: string;
  badgeType?: 'green' | 'gold' | 'none';
  img: string;
}

// Mock DEFAULT_PRODUCTS commented out to rely on real API data
/*
const DEFAULT_PRODUCTS: ShopProduct[] = [
  { id: 1, title: 'Noir Premium Fragrance - 50ml', category: 'perfumes', price: 499, originalPrice: 2499, rating: '4.8', reviewsCount: 49, badgeText: '80% OFF', badgeType: 'green', img: '/hero cards/4.png' },
  { id: 2, title: 'SK Hair Oil - 200ml', category: 'haircare', price: 335, originalPrice: 399, rating: '4.8', reviewsCount: 131, badgeText: 'Best Seller', badgeType: 'gold', img: '/bundle - combo offer/1.png' },
  { id: 3, title: 'Classic Full-Grain Leather Belt', category: 'accessories', price: 699, originalPrice: 899, rating: '4.9', reviewsCount: 160, badgeText: 'New Launch', badgeType: 'green', img: '/bundle - combo offer/2.png' },
  { id: 4, title: 'Minimalist Black Mesh Watch', category: 'watches', price: 3499, originalPrice: 3999, rating: '4.7', reviewsCount: 83, badgeText: 'Best Seller', badgeType: 'gold', img: '/hero cards/2.png' },
  { id: 5, title: 'Amber Gold Fragrance - 50ml', category: 'perfumes', price: 899, originalPrice: 1499, rating: '4.9', reviewsCount: 64, badgeText: '40% OFF', badgeType: 'green', img: '/hero cards/1.png' },
  { id: 6, title: '0.25mm Hair & Beard Derma Roller', category: 'haircare', price: 335, originalPrice: 399, rating: '4.8', reviewsCount: 112, badgeText: 'Value Deal', badgeType: 'gold', img: '/hero cards/6.png' },
  { id: 7, title: 'Vitamin C Brightening Body Wash', category: 'bodycare', price: 299, originalPrice: 399, rating: '4.8', reviewsCount: 95, badgeText: 'New Launch', badgeType: 'green', img: '/hero cards/3.png' },
  { id: 8, title: 'Executive Leather Briefcase Bag', category: 'accessories', price: 2999, originalPrice: 3499, rating: '4.9', reviewsCount: 42, badgeText: 'Best Seller', badgeType: 'gold', img: '/bundle - combo offer/3.png' }
];
*/

function mapProductToShopItem(prod: IProduct, fallbackImg: string = '/hero cards/4.png'): ShopProduct {
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
    slug: getProductSlug(prod),
    category: (typeof prod.product_group === 'object' && prod.product_group ? ((prod.product_group as any).slug || (prod.product_group as any).alias || 'all') : 'all').toLowerCase(),
    price: numericPrice,
    originalPrice: originalPriceNum > numericPrice ? originalPriceNum : undefined,
    rating: prod.rating ? prod.rating.toFixed(1) : '4.8',
    reviewsCount: prod.review_count || 45,
    badgeText: discountBadge || (prod.is_active ? 'Best Seller' : undefined),
    badgeType: discountBadge ? 'green' : 'gold',
    img: getImageUrl(rawImg, fallbackImg)
  };
}

export default function ShopPage() {
  const router = useRouter();
  const { category, filter, search } = router.query;

  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    productAPI.getProducts()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((prod: IProduct, idx: number) =>
            mapProductToShopItem(prod, `/hero cards/${(idx % 6) + 1}.png`)
          );
          setProducts(mapped);
        }
      })
      .catch((err) => {
        console.warn('Failed to load shop products:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const categoriesList = [
    { id: 'all', label: 'ALL PRODUCTS' },
    { id: 'haircare', label: 'HAIR CARE' },
    { id: 'perfumes', label: 'PERFUMES' },
    { id: 'accessories', label: 'ACCESSORIES' },
    { id: 'watches', label: 'WATCHES' }
  ];

  const filteredProducts = products.filter((product) => {
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      if (!product.title.toLowerCase().includes(q)) return false;
    }
    if (activeCategory !== 'all') {
      const catSlug = product.category.toLowerCase();
      if (!catSlug.includes(activeCategory) && !product.title.toLowerCase().includes(activeCategory)) {
        return false;
      }
    }
    return true;
  });

  return (
    <>
      <Head>
        <title>Shop Luxury Collection | SK</title>
        <meta name="description" content="Explore SK luxury fragrances, hair care oils, leather accessories, and body care products." />
      </Head>

      <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
        <Header />

        <main className="flex-1 pt-28 pb-20">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-8">
            {/* Header Title */}
            <div className="text-center mb-10">
              <span className="text-[0.72rem] font-bold tracking-[0.14em] text-[#C39F68] block mb-1.5 uppercase">CATALOGUE</span>
              <h1 className="text-[2.2rem] font-extrabold text-[#111111] tracking-wide mb-2">
                {filter
                  ? `${(filter as string).replace('-', ' ').toUpperCase()} COLLECTION`
                  : category
                  ? `${(category as string).toUpperCase()} COLLECTION`
                  : 'CURATED CATALOGUE'}
              </h1>
              <p className="text-[0.95rem] text-[#666666]">Discover premium lifestyle, fragrance, and organic grooming essentials.</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center justify-center gap-3 mb-12 flex-wrap">
              {categoriesList.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-5 py-2.5 rounded-full text-[0.78rem] font-bold tracking-wider cursor-pointer transition-all duration-200 border ${
                    activeCategory === tab.id
                      ? 'bg-[#111111] text-white border-[#111111]'
                      : 'bg-white text-[#666666] border-[#EAEAEA] hover:border-[#111111] hover:text-[#111111]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="text-center py-20 text-[#6B7280]">
                <div className="w-10 h-10 border-3 border-[#E5E7EB] border-t-[#111111] rounded-full animate-spin mx-auto mb-4" />
                <p>Loading shop collection...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.title}
                    img={product.img}
                    price={product.price}
                    originalPrice={product.originalPrice}
                    rating={product.rating}
                    reviewsCount={product.reviewsCount}
                    badgeText={product.badgeText}
                    badgeType={product.badgeType}
                  />
                ))}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
