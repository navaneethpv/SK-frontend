import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import Header from '@/SK/components/Header';
import Hero from '@/SK/components/Hero';
import CategoryList from '@/SK/components/CategoryList';
import ComboOffers from '@/SK/components/ComboOffers';
import Footer from '@/SK/components/Footer';
import DealOfTheDay from '@/SK/components/DealOfTheDay';
import TrustBar from '@/SK/components/TrustBar';
import ReviewsSection from '@/SK/components/ReviewsSection';
import ProductCarousel, { ItemCard } from '@/SK/components/ProductCarousel';
import { productAPI } from '@/SK/Api/Services/productAPI';
import { IProduct } from '@/SK/Pages/Interfaces/product';
import { getImageUrl } from '@/SK/utils/imageHelper';
import { getProductSlug } from '@/SK/utils/slugHelper';

// Bestseller Products default fallback
const DEFAULT_BESTSELLER_ITEMS: ItemCard[] = [
  { id: 1, title: 'Noir Premium Fragrance - 50ml', rating: '4.8', reviewsCount: 49, discountBadge: '80% OFF', price: '₹499', originalPrice: '₹2,499', img: '/hero cards/4.png', actionText: 'Add To Cart' },
  { id: 2, title: 'SK Hair Oil - 100ml', rating: '4.8', reviewsCount: 131, discountBadge: '16% OFF', price: '₹335', originalPrice: '₹399', img: '/bundle - combo offer/1.png', actionText: 'Choose Options' },
  { id: 3, title: 'Vitamin C Face Wash | Brightening & Hydrating', rating: '4.9', reviewsCount: 160, discountBadge: '23% OFF', price: '₹199', originalPrice: '₹259', img: '/hero cards/6.png', actionText: 'Choose Options' },
  { id: 4, title: 'Minimalist Black Mesh Watch', price: 'Coming Soon...', img: '/hero cards/2.png', actionText: 'Add To Cart' },
  { id: 5, title: 'Eau De Parfum | Amber', discountBadge: '40% OFF', price: '₹899', originalPrice: '₹1,499', img: '/hero cards/1.png', actionText: 'Add To Cart' }
];

// New Arrivals default fallback
const DEFAULT_NEW_ARRIVALS_ITEMS: ItemCard[] = [
  { id: 101, title: '0.25mm Derma Roller | Face, Beard & Hair Care', rating: '4.8', reviewsCount: 131, discountBadge: '16% OFF', price: '₹335', originalPrice: '₹399', badgeText: 'New Launches', badgeType: 'green', img: '/hero cards/6.png', actionText: 'Add To Cart' },
  { id: 103, title: 'Premium Fragrance - 50ml', discountBadge: '18% OFF', price: '₹324', originalPrice: '₹399', badgeText: 'New Launches', badgeType: 'green', img: '/hero cards/4.png', actionText: 'Add To Cart' },
  { id: 105, title: 'Leather Wallet | Premium Quality Material', discountBadge: '23% OFF', price: '₹699', originalPrice: '₹259', badgeText: 'New Launches', badgeType: 'green', img: '/hero cards/5.png', actionText: 'Add To Cart' }
];

function mapProductToCard(prod: IProduct, fallbackImg: string): ItemCard {
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
  const [bestsellerItems, setBestsellerItems] = useState<ItemCard[]>(DEFAULT_BESTSELLER_ITEMS);
  const [newArrivalItems, setNewArrivalItems] = useState<ItemCard[]>(DEFAULT_NEW_ARRIVALS_ITEMS);
  const [categoryItems, setCategoryItems] = useState<{ id: number; name: string; slug: string; img: string }[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [activeCategoryProducts, setActiveCategoryProducts] = useState<ItemCard[]>([]);
  const [catProductsLoading, setCatProductsLoading] = useState(false);

  useEffect(() => {
    // Fetch Best Sellers Home from API on page load
    productAPI.getBestSellersHome()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setBestsellerItems(data.map((p, idx) => mapProductToCard(p, DEFAULT_BESTSELLER_ITEMS[idx % DEFAULT_BESTSELLER_ITEMS.length].img)));
        } else {
          productAPI.getBestSellers().then((fallback) => {
            if (Array.isArray(fallback) && fallback.length > 0) {
              setBestsellerItems(fallback.map((p, idx) => mapProductToCard(p, DEFAULT_BESTSELLER_ITEMS[idx % DEFAULT_BESTSELLER_ITEMS.length].img)));
            }
          });
        }
      })
      .catch(() => {
        productAPI.getBestSellers()
          .then((fallback) => {
            if (Array.isArray(fallback) && fallback.length > 0) {
              setBestsellerItems(fallback.map((p, idx) => mapProductToCard(p, DEFAULT_BESTSELLER_ITEMS[idx % DEFAULT_BESTSELLER_ITEMS.length].img)));
            }
          })
          .catch((err) => console.warn('Best sellers API warning:', err));
      });

    // Fetch New Arrivals from API
    productAPI.getNewArrivals()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setNewArrivalItems(data.map((p, idx) => mapProductToCard(p, DEFAULT_NEW_ARRIVALS_ITEMS[idx % DEFAULT_NEW_ARRIVALS_ITEMS.length].img)));
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
              setActiveCategoryProducts(products.map((p, i) => mapProductToCard(p, DEFAULT_BESTSELLER_ITEMS[i % DEFAULT_BESTSELLER_ITEMS.length].img)));
            } else {
              const all = await productAPI.getProducts();
              if (Array.isArray(all) && all.length > 0) {
                setActiveCategoryProducts(all.slice(0, 8).map((p, i) => mapProductToCard(p, DEFAULT_BESTSELLER_ITEMS[i % DEFAULT_BESTSELLER_ITEMS.length].img)));
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
        setActiveCategoryProducts(products.map((p, i) => mapProductToCard(p, DEFAULT_BESTSELLER_ITEMS[i % DEFAULT_BESTSELLER_ITEMS.length].img)));
      } else {
        const all = await productAPI.getProducts();
        if (Array.isArray(all) && all.length > 0) {
          setActiveCategoryProducts(all.slice(0, 8).map((p, i) => mapProductToCard(p, DEFAULT_BESTSELLER_ITEMS[i % DEFAULT_BESTSELLER_ITEMS.length].img)));
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
          setBestsellerItems(data.map((p, idx) => mapProductToCard(p, DEFAULT_BESTSELLER_ITEMS[idx % DEFAULT_BESTSELLER_ITEMS.length].img)));
        } else {
          productAPI.getBestSellers().then((fallback) => {
            if (Array.isArray(fallback) && fallback.length > 0) {
              setBestsellerItems(fallback.map((p, idx) => mapProductToCard(p, DEFAULT_BESTSELLER_ITEMS[idx % DEFAULT_BESTSELLER_ITEMS.length].img)));
            }
          });
        }
      })
      .catch(() => {
        productAPI.getBestSellers().then((fallback) => {
          if (Array.isArray(fallback) && fallback.length > 0) {
            setBestsellerItems(fallback.map((p, idx) => mapProductToCard(p, DEFAULT_BESTSELLER_ITEMS[idx % DEFAULT_BESTSELLER_ITEMS.length].img)));
          }
        });
      });
  };

  const handleNewArrivalsTabClick = () => {
    setActiveMainTab('newarrivals');
    productAPI.getNewArrivals()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setNewArrivalItems(data.map((p, idx) => mapProductToCard(p, DEFAULT_NEW_ARRIVALS_ITEMS[idx % DEFAULT_NEW_ARRIVALS_ITEMS.length].img)));
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

      <div className="home-wrapper">
        <Header />
        <Hero />
        <TrustBar />
        <CategoryList />

        {/* 1. Bestsellers | New Arrivals Section */}
        <section className="product-row-section">
          <div className="section-container">
            <div className="section-header-row">
              <div className="section-title-tab">
                <button
                  type="button"
                  onClick={handleBestsellersTabClick}
                  className={`tab-btn-title ${activeMainTab === 'bestsellers' ? 'active' : ''}`}
                >
                  Bestsellers
                </button>
                <span className="tab-divider">|</span>
                <button
                  type="button"
                  onClick={handleNewArrivalsTabClick}
                  className={`tab-btn-title ${activeMainTab === 'newarrivals' ? 'active' : ''}`}
                >
                  New Arrivals
                </button>
              </div>
              <Link
                href={activeMainTab === 'bestsellers' ? '/shop?filter=bestseller' : '/shop?filter=newarrivals'}
                className="view-all-link"
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
          <section className="product-row-section bg-light-section">
            <div className="section-container">
              <h2 className="simple-section-title margin-bottom">Categories</h2>

              {/* Category pills — same style as Shop by Occasion */}
              <div className="occasion-pills-row">
                {categoryItems.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryPillClick(cat)}
                    className={`pill-btn ${activeCategoryId === cat.id ? 'active' : ''}`}
                  >
                    {cat.name.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Products for selected category */}
              <div className="cat-products-area">
                {catProductsLoading ? (
                  <div className="cat-products-loading-skeleton">
                    <div className="skeleton-card" />
                    <div className="skeleton-card" />
                    <div className="skeleton-card" />
                    <div className="skeleton-card" />
                  </div>
                ) : activeCategoryProducts.length > 0 ? (
                  <ProductCarousel items={activeCategoryProducts} />
                ) : (
                  <p className="cat-empty-msg">No products found for this category.</p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* 5. Loved by Customers - Testimonials */}
        <ReviewsSection />

        {/* Footer */}
        <Footer />
      </div>

      <style jsx>{`
        .home-wrapper {
          width: 100%;
          min-height: 100vh;
          background-color: #ffffff;
        }

        .product-row-section {
          width: 100%;
          padding: 3rem 0;
          background-color: #ffffff;
        }

        .bg-light-section {
          background-color: #FAF8F5;
        }

        .section-container {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 2rem;
          position: relative;
        }

        .section-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.8rem;
        }

        .section-title-tab {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }

        .tab-btn-title {
          background: none;
          border: none;
          font-family: var(--font-sans);
          font-size: 1.45rem;
          font-weight: 700;
          color: #4B5563;
          cursor: pointer;
          padding: 0 0 2px 0;
          margin: 0;
          transition: color 0.2s ease, border-color 0.2s ease;
          border-bottom: 2px solid transparent;
        }

        .tab-btn-title:hover {
          color: #121316;
        }

        .tab-btn-title.active {
          color: #121316;
          border-bottom-color: #121316;
        }

        .tab-active { color: #121316; }
        .tab-divider { color: #D4D4D8; font-weight: 300; font-size: 1.45rem; }
        .tab-inactive { color: #4B5563; font-weight: 400; }

        .simple-section-title {
          font-family: var(--font-sans);
          font-size: 1.45rem;
          font-weight: 700;
          color: #121316;
        }

        .margin-bottom {
          margin-bottom: 1.8rem;
        }

        @media (max-width: 1024px) {
          .product-row-section { padding: 2.2rem 0; }
          .section-header-row { margin-bottom: 1.2rem; }
          .tab-btn-title { font-size: 1.2rem; }
          .tab-divider { font-size: 1.2rem; }
          .simple-section-title { font-size: 1.2rem; }
          .view-all-link { font-size: 0.78rem; }
          .section-container { padding: 0 1.5rem; }
        }

        .view-all-link {
          font-family: var(--font-sans);
          font-size: 0.88rem;
          font-weight: 500;
          color: #4B5563;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
        }

        .blue-play-arrow {
          font-size: 0.7rem;
          color: #2563EB;
          margin-left: 2px;
        }

        .carousel-wrapper {
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
        }

        .cards-5-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1.2rem;
          width: 100%;
        }

        .nav-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #ffffff;
          border: 1px solid #E4E4E7;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .arrow-left { left: -16px; }
        .arrow-right { right: -16px; }

        .pagination-text {
          text-align: center;
          font-size: 0.8rem;
          color: #9CA3AF;
          margin-top: 1.5rem;
        }

        /* Studios Section */
        .studios-section {
          width: 100%;
          padding: 3.5rem 0;
          background-color: #ffffff;
        }

        .studios-4-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.2rem;
        }

        .studio-video-card {
          aspect-ratio: 0.7;
          border-radius: 12px;
          overflow: hidden;
          background-color: #000000;
          position: relative;
        }

        .video-card-bg {
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: flex-end;
          padding: 1.2rem;
        }

        .studio-card-footer {
          width: 100%;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 6px;
          padding: 0.6rem 0.8rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .studio-item-name {
          font-size: 0.75rem;
          font-weight: 600;
          color: #121316;
        }

        .studio-item-price {
          font-size: 0.75rem;
          font-weight: 700;
          color: #121316;
        }

        .studio-item-price del {
          font-size: 0.65rem;
          color: #9CA3AF;
        }

        /* Occasion Filter Pills */
        .occasion-pills-row {
          display: flex;
          gap: 0.8rem;
          margin-bottom: 2rem;
        }

        .pill-btn {
          padding: 0.45rem 1.2rem;
          border-radius: 20px;
          border: 1px solid #E5E7EB;
          background-color: #ffffff;
          color: #4B5563;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.03em;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pill-btn.active {
          border-color: #121316;
          color: #121316;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        }

        /* Trust Bar Section */
        .trust-bar-section {
          width: 100%;
          background-color: #FAF8F5;
          padding: 1.8rem 0;
          border-top: 1px solid #F0EDE8;
          border-bottom: 1px solid #F0EDE8;
        }

        .trust-bar-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        .trust-item {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }

        .trust-icon-box {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background-color: #ffffff;
          border: 1px solid #EAE6DF;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .trust-text-block {
          display: flex;
          flex-direction: column;
        }

        .trust-title {
          font-size: 0.82rem;
          font-weight: 700;
          color: #121316;
          line-height: 1.2;
        }

        .trust-desc {
          font-size: 0.72rem;
          color: #6B7280;
          margin-top: 2px;
        }

        /* Reviews Section */
        .reviews-section {
          width: 100%;
          padding: 4.5rem 0 5rem 0;
          background-color: #FAF8F5;
          border-top: 1px solid #F0EDE8;
        }

        .reviews-header-block {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .reviews-subtag {
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.14em;
          color: #C5A059;
          display: block;
          margin-bottom: 0.3rem;
        }

        .reviews-main-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: #121316;
          letter-spacing: 0.04em;
        }

        .reviews-3-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .review-card {
          background-color: #ffffff;
          border: 1px solid #EAE6DF;
          border-radius: 12px;
          padding: 1.8rem;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .review-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
          border-color: #C5A059;
        }

        .reviewer-header {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }

        .avatar-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #121316 0%, #27272A 100%);
          color: #C5A059;
          font-size: 0.82rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .reviewer-info {
          display: flex;
          flex-direction: column;
        }

        .reviewer-name {
          font-size: 0.9rem;
          font-weight: 700;
          color: #121316;
        }

        .verified-tag {
          font-size: 0.68rem;
          font-weight: 600;
          color: #15803D;
        }

        .stars-gold {
          color: #F59E0B;
          font-size: 0.9rem;
          letter-spacing: 0.1em;
        }

        .review-quote {
          font-size: 0.86rem;
          color: #4B5563;
          line-height: 1.55;
          font-style: italic;
        }

        @media (max-width: 1024px) {
          .trust-bar-grid { grid-template-columns: repeat(2, 1fr); }
          .reviews-3-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 640px) {
          .trust-bar-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 1100px) {
          .cards-5-grid { grid-template-columns: repeat(3, 1fr); }
          .studios-4-grid { grid-template-columns: repeat(2, 1fr); }
          .reviews-3-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 650px) {
          .cards-5-grid { grid-template-columns: repeat(2, 1fr); }
          .studios-4-grid { grid-template-columns: 1fr; }
        }

        /* Category tiles strip (interactive) */
        .cat-tiles-strip {
          display: flex;
          gap: 1rem;
          overflow-x: auto;
          padding-bottom: 0.5rem;
          margin-bottom: 1.8rem;
          scrollbar-width: none;
        }
        .cat-tiles-strip::-webkit-scrollbar { display: none; }

        .cat-tile-btn {
          flex: 0 0 auto;
          width: 110px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.55rem;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          transition: transform 0.2s ease;
        }

        .cat-tile-btn:hover { transform: translateY(-3px); }

        .cat-tile-img-wrap {
          width: 110px;
          aspect-ratio: 0.82;
          border-radius: 10px;
          overflow: hidden;
          background-color: #f0ede8;
          position: relative;
          box-shadow: 0 3px 10px rgba(0,0,0,0.07);
          transition: box-shadow 0.2s ease;
          border: 2px solid transparent;
        }

        .cat-tile-btn.active .cat-tile-img-wrap {
          border-color: #121316;
          box-shadow: 0 6px 18px rgba(0,0,0,0.15);
        }

        .cat-tile-btn:hover .cat-tile-img-wrap {
          box-shadow: 0 8px 20px rgba(0,0,0,0.13);
        }

        .cat-tile-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.35s ease;
        }

        .cat-tile-btn:hover .cat-tile-img { transform: scale(1.04); }

        .cat-tile-active-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: #121316;
        }

        .cat-tile-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: #121316;
          text-align: center;
          line-height: 1.3;
        }

        .cat-tile-btn.active .cat-tile-label { color: #121316; }
        .cat-tile-btn:not(.active) .cat-tile-label { color: #6B7280; }

        /* Products area under category */
        .cat-products-area {
          min-height: 220px;
        }

        .cat-products-loading {
          display: flex;
          align-items: center;
          justify-content: center;
        .cat-products-loading-skeleton {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.2rem;
          min-height: 220px;
          padding: 0.5rem 0;
        }

        .skeleton-card {
          width: 100%;
          height: 280px;
          border-radius: 8px;
          background: linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%);
          background-size: 200% 100%;
          animation: pulse-shimmer 1.5s infinite ease-in-out;
        }

        @keyframes pulse-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .cat-empty-msg {
          text-align: center;
          color: #9CA3AF;
          font-size: 0.9rem;
          padding: 3rem 0;
        }

        @media (max-width: 650px) {
          .cat-tile-btn { width: 80px; }
          .cat-tile-img-wrap { width: 80px; }
        }
      `}</style>
    </>
  );
}


