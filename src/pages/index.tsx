import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import Header from '@/components/common/Header';
import Hero from '@/components/home/Hero';
import CategoryList from '@/components/product/CategoryList';
import ComboOffers from '@/components/home/ComboOffers';
import Footer from '@/components/common/Footer';
import DealOfTheDay from '@/components/home/DealOfTheDay';
import TrustBar from '@/components/common/TrustBar';
import BrandFlare from '@/components/home/BrandFlare';
import ReviewsSection from '@/components/product/ReviewsSection';
import ProductCarousel, { ItemCard } from '@/components/product/ProductCarousel';
import { productAPI } from '@/api/services/productAPI';
import { IProduct } from '@/types/product';
import { getImageUrl } from '@/utils/imageHelper';
import { getProductSlug } from '@/utils/slugHelper';

// Mock DEFAULT_BESTSELLER_ITEMS commented out to rely on real API data
/*
const DEFAULT_BESTSELLER_ITEMS: ItemCard[] = [
  { id: 1, title: 'Noir Premium Fragrance - 50ml', rating: '4.8', reviewsCount: 49, discountBadge: '80% OFF', price: '₹499', originalPrice: '₹2,499', img: '/hero cards/4.png', actionText: 'Add To Cart' },
  { id: 2, title: 'SK Hair Oil - 100ml', rating: '4.8', reviewsCount: 131, discountBadge: '16% OFF', price: '₹335', originalPrice: '₹399', img: '/bundle - combo offer/1.png', actionText: 'Choose Options' },
  { id: 3, title: 'Vitamin C Face Wash | Brightening & Hydrating', rating: '4.9', reviewsCount: 160, discountBadge: '23% OFF', price: '₹199', originalPrice: '₹259', img: '/hero cards/6.png', actionText: 'Choose Options' },
  { id: 4, title: 'Minimalist Black Mesh Watch', price: 'Coming Soon...', img: '/hero cards/2.png', actionText: 'Add To Cart' },
  { id: 5, title: 'Eau De Parfum | Amber', discountBadge: '40% OFF', price: '₹899', originalPrice: '₹1,499', img: '/hero cards/1.png', actionText: 'Add To Cart' }
];

// Mock DEFAULT_NEW_ARRIVALS_ITEMS commented out to rely on real API data
const DEFAULT_NEW_ARRIVALS_ITEMS: ItemCard[] = [
  { id: 101, title: '0.25mm Derma Roller | Face, Beard & Hair Care', rating: '4.8', reviewsCount: 131, discountBadge: '16% OFF', price: '₹335', originalPrice: '₹399', badgeText: 'New Launches', badgeType: 'green', img: '/hero cards/6.png', actionText: 'Add To Cart' },
  { id: 103, title: 'Premium Fragrance - 50ml', discountBadge: '18% OFF', price: '₹324', originalPrice: '₹399', badgeText: 'New Launches', badgeType: 'green', img: '/hero cards/4.png', actionText: 'Add To Cart' },
  { id: 105, title: 'Leather Wallet | Premium Quality Material', discountBadge: '23% OFF', price: '₹699', originalPrice: '₹259', badgeText: 'New Launches', badgeType: 'green', img: '/hero cards/5.png', actionText: 'Add To Cart' }
];
*/

function mapProductToCard(prod: IProduct, fallbackImg: string = '/hero cards/4.png'): ItemCard {
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
    title: prod.alias || prod.slug || 'SK Product',
    slug: getProductSlug(prod),
    rating: prod.rating ? prod.rating.toFixed(1) : '4.8',
    reviewsCount: prod.review_count || 45,
    discountBadge: discountBadge || undefined,
    price: `₹${numericPrice}`,
    originalPrice: originalPriceNum > numericPrice ? `₹${originalPriceNum}` : undefined,
    badgeText: prod.is_active ? 'Best Seller' : undefined,
    badgeType: 'gold',
    img: getImageUrl(rawImg, fallbackImg),
    actionText: 'Add To Cart'
  };
}

export default function Home() {
  const [activeMainTab, setActiveMainTab] = useState<'bestsellers' | 'newarrivals'>('bestsellers');
  const [bestsellerItems, setBestsellerItems] = useState<ItemCard[]>([]);
  const [newArrivalItems, setNewArrivalItems] = useState<ItemCard[]>([]);
  const [categoryItems, setCategoryItems] = useState<{ id: number; name: string; slug: string; img: string }[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [activeCategoryProducts, setActiveCategoryProducts] = useState<ItemCard[]>([]);
  const [catProductsLoading, setCatProductsLoading] = useState(false);

  useEffect(() => {
    // Fetch Best Sellers Home from API on page load
    productAPI.getBestSellersHome()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setBestsellerItems(data.map((p, idx) => mapProductToCard(p, `/hero cards/${(idx % 6) + 1}.png`)));
        } else {
          productAPI.getBestSellers().then((fallback) => {
            if (Array.isArray(fallback) && fallback.length > 0) {
              setBestsellerItems(fallback.map((p, idx) => mapProductToCard(p, `/hero cards/${(idx % 6) + 1}.png`)));
            }
          });
        }
      })
      .catch(() => {
        productAPI.getBestSellers()
          .then((fallback) => {
            if (Array.isArray(fallback) && fallback.length > 0) {
              setBestsellerItems(fallback.map((p, idx) => mapProductToCard(p, `/hero cards/${(idx % 6) + 1}.png`)));
            }
          })
          .catch((err) => console.warn('Best sellers API warning:', err));
      });

    // Fetch New Arrivals from API
    productAPI.getNewArrivals()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setNewArrivalItems(data.map((p, idx) => mapProductToCard(p, `/hero cards/${(idx % 6) + 1}.png`)));
        }
      })
      .catch((err) => console.warn('New arrivals API warning:', err));

    // Fetch Categories and load first category's products
    productAPI.getCategories()
      .then(async (data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((cat: any, idx: number) => ({
            id: cat.id || idx + 1,
            name: cat.name || `Category ${idx + 1}`,
            slug: cat.slug || cat.name?.toLowerCase().replace(/\s+/g, '-') || 'all',
            img: getImageUrl(cat.icon || cat.image, `/images/category_tile_${(idx % 6) + 1}.png`)
          }));
          setCategoryItems(mapped);
          // Auto-load first category products
          const first = mapped[0];
          setActiveCategoryId(first.id);
          setCatProductsLoading(true);
          try {
            const products = await productAPI.getProducts({ category_id: String(first.id) });
            if (Array.isArray(products) && products.length > 0) {
              setActiveCategoryProducts(products.map((p, i) => mapProductToCard(p, `/hero cards/${(i % 6) + 1}.png`)));
            } else {
              const all = await productAPI.getProducts();
              if (Array.isArray(all) && all.length > 0) {
                setActiveCategoryProducts(all.slice(0, 8).map((p, i) => mapProductToCard(p, `/hero cards/${(i % 6) + 1}.png`)));
              }
            }
          } catch {
            // silent fallback
          } finally {
            setCatProductsLoading(false);
          }
        }
      })
      .catch((err) => console.warn('Categories section API warning:', err));
  }, []);

  const handleCategoryPillClick = async (cat: { id: number; name: string; slug: string; img: string }) => {
    if (activeCategoryId === cat.id) return;
    setActiveCategoryId(cat.id);
    setCatProductsLoading(true);
    setActiveCategoryProducts([]);
    try {
      const products = await productAPI.getProducts({ category_id: String(cat.id) });
      if (Array.isArray(products) && products.length > 0) {
        setActiveCategoryProducts(products.map((p, i) => mapProductToCard(p, `/hero cards/${(i % 6) + 1}.png`)));
      } else {
        const all = await productAPI.getProducts();
        if (Array.isArray(all) && all.length > 0) {
          setActiveCategoryProducts(all.slice(0, 8).map((p, i) => mapProductToCard(p, `/hero cards/${(i % 6) + 1}.png`)));
        }
      }
    } catch {
      // silent fallback
    } finally {
      setCatProductsLoading(false);
    }
  };

  const handleBestsellersTabClick = () => {
    setActiveMainTab('bestsellers');
    productAPI.getBestSellersHome()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setBestsellerItems(data.map((p, idx) => mapProductToCard(p, `/hero cards/${(idx % 6) + 1}.png`)));
        } else {
          productAPI.getBestSellers().then((fallback) => {
            if (Array.isArray(fallback) && fallback.length > 0) {
              setBestsellerItems(fallback.map((p, idx) => mapProductToCard(p, `/hero cards/${(idx % 6) + 1}.png`)));
            }
          });
        }
      })
      .catch(() => {
        productAPI.getBestSellers().then((fallback) => {
          if (Array.isArray(fallback) && fallback.length > 0) {
            setBestsellerItems(fallback.map((p, idx) => mapProductToCard(p, `/hero cards/${(idx % 6) + 1}.png`)));
          }
        });
      });
  };

  const handleNewArrivalsTabClick = () => {
    setActiveMainTab('newarrivals');
    productAPI.getNewArrivals()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setNewArrivalItems(data.map((p, idx) => mapProductToCard(p, `/hero cards/${(idx % 6) + 1}.png`)));
        }
      })
      .catch((err) => console.warn('New arrivals API warning:', err));
  };

  const displayedMainItems = activeMainTab === 'bestsellers' ? bestsellerItems : newArrivalItems;

  return (
    <>
      <Head>
        <title>SK | Nourish. Strengthen. Shine.</title>
        <meta name="description" content="Explore SK hair care, premium fragrances, leather accessories, and luxury grooming essentials." />
      </Head>

      <div className="w-full min-h-screen bg-white">
        <Header />
        <Hero />
        <TrustBar />
        <CategoryList />

        {/* 1. Bestsellers | New Arrivals Section */}
        <section className="w-full py-8 md:py-12 bg-white">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex items-center justify-between mb-5 md:mb-7">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleBestsellersTabClick}
                  className={`bg-none border-none text-[1.05rem] sm:text-[1.2rem] md:text-[1.45rem] font-bold cursor-pointer pb-0.5 border-b-2 transition-colors ${
                    activeMainTab === 'bestsellers' ? 'text-[#121316] border-[#121316]' : 'text-[#4B5563] border-transparent hover:text-[#121316]'
                  }`}
                >
                  Bestsellers
                </button>
                <span className="text-[#D4D4D8] font-light text-[1.05rem] sm:text-[1.2rem] md:text-[1.45rem]">|</span>
                <button
                  type="button"
                  onClick={handleNewArrivalsTabClick}
                  className={`bg-none border-none text-[1.05rem] sm:text-[1.2rem] md:text-[1.45rem] font-bold cursor-pointer pb-0.5 border-b-2 transition-colors ${
                    activeMainTab === 'newarrivals' ? 'text-[#121316] border-[#121316]' : 'text-[#4B5563] border-transparent hover:text-[#121316]'
                  }`}
                >
                  New Arrivals
                </button>
              </div>
              <Link
                href={activeMainTab === 'bestsellers' ? '/shop?filter=bestseller' : '/shop?filter=newarrivals'}
                className="text-[0.72rem] sm:text-[0.78rem] md:text-[0.88rem] font-medium text-[#4B5563] inline-flex items-center gap-1 hover:text-[#121316] transition-colors"
              >
                <span>View all</span>
                <ChevronRight size={16} />
              </Link>
            </div>

            <ProductCarousel items={displayedMainItems} />
          </div>
        </section>

        {/* 2. Build Your Bundle Section */}
        <ComboOffers />

        {/* 3. Deal of the Day — API: Home/deal-of-the-day-home */}
        <DealOfTheDay />

        {/* 4. Shop by Category Section */}
        {categoryItems.length > 0 && (
          <section className="w-full py-8 md:py-12 bg-[#FAF8F5]">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative">
              <h2 className="text-[1.05rem] sm:text-[1.2rem] md:text-[1.45rem] font-bold text-[#121316] mb-5 md:mb-7">Categories</h2>

              {/* Category pills */}
              <div className="flex gap-2 sm:gap-3 mb-6 overflow-x-auto flex-nowrap sm:flex-wrap pb-2">
                {categoryItems.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryPillClick(cat)}
                    className={`px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full border text-[0.68rem] sm:text-[0.75rem] font-bold tracking-wider cursor-pointer shrink-0 transition-all duration-200 ${
                      activeCategoryId === cat.id
                        ? 'border-[#121316] text-[#121316] bg-white shadow-sm'
                        : 'border-[#E5E7EB] bg-white text-[#4B5563] hover:border-[#121316]'
                    }`}
                  >
                    {cat.name.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Products for selected category */}
              <div className="min-h-[220px]">
                {catProductsLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 min-h-[220px] py-2">
                    <div className="w-full h-[280px] rounded-lg bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse" />
                    <div className="w-full h-[280px] rounded-lg bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse" />
                    <div className="w-full h-[280px] rounded-lg bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse" />
                    <div className="w-full h-[280px] rounded-lg bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse" />
                  </div>
                ) : activeCategoryProducts.length > 0 ? (
                  <ProductCarousel items={activeCategoryProducts} />
                ) : (
                  <p className="text-center text-gray-400 text-[0.9rem] py-12">No products found for this category.</p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* 5. Brand Story & Craftsmanship Flare Section */}
        <BrandFlare />

        {/* 6. Loved by Customers - Testimonials */}
        <ReviewsSection />

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
