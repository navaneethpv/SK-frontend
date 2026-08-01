import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import Header from '@/components/common/Header';
import Hero from '@/components/home/Hero';
import CategoryList from '@/components/product/CategoryList';
import TrendingProducts from '@/components/home/TrendingProducts';
import Footer from '@/components/common/Footer';
import DealOfTheDay from '@/components/home/DealOfTheDay';
import TrustBar from '@/components/common/TrustBar';
import BrandFlare from '@/components/home/BrandFlare';
import ReviewsSection from '@/components/product/ReviewsSection';
import ProductCarousel, { ItemCard } from '@/components/product/ProductCarousel';
import CategoryProductsFilter from '@/components/home/CategoryProductsFilter';
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
  const [activeMainTab, setActiveMainTab] = useState<'bestsellers' | 'popular'>('bestsellers');
  const [bestsellerItems, setBestsellerItems] = useState<ItemCard[]>([]);
  const [popularProducts, setPopularProducts] = useState<ItemCard[]>([]);

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
    productAPI.getPopularProductsHome()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPopularProducts(data.map((p, idx) => mapProductToCard(p, `/hero cards/${(idx % 6) + 1}.png`)));
        }
      })
      .catch((err) => console.warn('New arrivals API warning:', err));
  }, []);

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

  const handlePopularProductsTabClick = () => {
    setActiveMainTab('popular');
    productAPI.getPopularProductsHome()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPopularProducts(data.map((p, idx) => mapProductToCard(p, `/hero cards/${(idx % 6) + 1}.png`)));
        }
      })
      .catch((err) => console.warn('Popular products API warning:', err));
  };

  const displayedMainItems = activeMainTab === 'bestsellers' ? bestsellerItems : popularProducts;

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
                  onClick={handlePopularProductsTabClick}
                  className={`bg-none border-none text-[1.05rem] sm:text-[1.2rem] md:text-[1.45rem] font-bold cursor-pointer pb-0.5 border-b-2 transition-colors ${
                    activeMainTab === 'popular' ? 'text-[#121316] border-[#121316]' : 'text-[#4B5563] border-transparent hover:text-[#121316]'
                  }`}
                >
                  Popular Products
                </button>
              </div>
              <Link
                href={activeMainTab === 'bestsellers' ? '/shop?filter=bestseller' : '/shop?filter=popular'}
                className="text-[0.72rem] sm:text-[0.78rem] md:text-[0.88rem] font-medium text-[#4B5563] inline-flex items-center gap-1 hover:text-[#121316] transition-colors"
              >
                <span>View all</span>
                <ChevronRight size={16} />
              </Link>
            </div>

            <ProductCarousel items={displayedMainItems} />
          </div>
        </section>

        {/* 2. Trending Products Section — API: trending-products */}
        <TrendingProducts />

        {/* 3. Deal of the Day — API: Home/deal-of-the-day-home */}
        <DealOfTheDay />

        {/* 4. Shop by Category Section */}
        <CategoryProductsFilter />

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
