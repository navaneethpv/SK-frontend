import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '@/SK/components/Header';
import Footer from '@/SK/components/Footer';
import { useCart } from '@/SK/context/CartContext';
import { productAPI } from '@/SK/Api/Services/productAPI';
import { IProduct } from '@/SK/Pages/Interfaces/product';
import { getImageUrl } from '@/SK/utils/imageHelper';
import { getProductSlug } from '@/SK/utils/slugHelper';

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
    <div className="bestsellers-page-wrapper">
      <Head>
        <title>Best Sellers | SK Luxury Grooming & Lifestyle</title>
        <meta name="description" content="Shop SK's top-rated best selling hair oils, fragrances, skincare, and luxury lifestyle accessories." />
      </Head>

      <Header />

      <main className="bestsellers-main">
        <div className="page-header-banner">
          <div className="banner-content">
            <span className="sub-tag">MOST LOVED & TOP RATED</span>
            <h1 className="main-title">SK Bestsellers</h1>
            <p className="description-text">
              Discover customer favorites—handpicked luxury hair care, long-lasting fragrances, and premium leather essentials.
            </p>
          </div>
        </div>

        <div className="content-container">
          <div className="filter-bar-row">
            <span className="results-count">Showing {products.length} Best Sellers</span>
            <div className="sort-box">
              <label htmlFor="sort-select">Sort by:</label>
              <select id="sort-select" className="sort-dropdown" defaultValue="popular">
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="bestseller-skeleton-grid">
              <div className="skeleton-card" />
              <div className="skeleton-card" />
              <div className="skeleton-card" />
              <div className="skeleton-card" />
            </div>
          ) : (
            <div className="products-grid">
              {products.map((item) => (
                <div key={item.id} className="product-card">
                  <Link href={`/product/${getProductSlug(item)}`} className="card-link">
                    <div className="img-frame">
                      {item.badgeText && (
                        <span className={`badge-pill ${item.badgeType || 'gold'}`}>{item.badgeText}</span>
                      )}
                      <img
                        src={item.img}
                        alt={item.title}
                        className="product-img"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/hero cards/4.png';
                        }}
                      />
                    </div>

                    <div className="info-frame">
                      <div className="rating-row">
                        <span className="star-gold">★ {item.rating}</span>
                        <span className="sep-pipe">|</span>
                        <span className="reviews">{item.reviewsCount} Reviews</span>
                      </div>

                      <h3 className="product-title">{item.title}</h3>

                      <div className="price-row">
                        <span className="curr-price">₹{item.price}</span>
                        {item.originalPrice && (
                          <span className="orig-price">₹{item.originalPrice}</span>
                        )}
                      </div>
                    </div>
                  </Link>

                  <div className="btn-container">
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
                      className="add-to-cart-btn"
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

      <style jsx>{`
        .bestsellers-page-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background-color: #FAF8F5;
        }

        .bestsellers-main {
          flex: 1;
        }

        .page-header-banner {
          background-color: #121316;
          color: #ffffff;
          padding: 4rem 2rem;
          text-align: center;
        }

        .banner-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .sub-tag {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: #EAB308;
          margin-bottom: 0.8rem;
        }

        .main-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
          letter-spacing: -0.02em;
        }

        .description-text {
          font-size: 1rem;
          color: #9CA3AF;
          line-height: 1.6;
        }

        .content-container {
          max-width: 1440px;
          margin: 0 auto;
          padding: 3rem 2rem 5rem 2rem;
        }

        .filter-bar-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #E5E7EB;
        }

        .results-count {
          font-size: 0.9rem;
          font-weight: 600;
          color: #4B5563;
        }

        .sort-box {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.88rem;
          color: #374151;
        }

        .sort-dropdown {
          padding: 0.4rem 0.8rem;
          border: 1px solid #D1D5DB;
          border-radius: 6px;
          background-color: #ffffff;
          font-size: 0.88rem;
          outline: none;
          cursor: pointer;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        .product-card {
          background-color: #ffffff;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: all 0.25s ease;
        }

        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 28px rgba(0, 0, 0, 0.08);
          border-color: #C5A059;
        }

        .product-card:hover .product-img {
          transform: scale(1.06);
        }

        .card-link {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .img-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 0.95;
          padding: 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #ffffff;
          overflow: hidden;
        }

        .badge-pill {
          position: absolute;
          top: 0.8rem;
          left: 0.8rem;
          padding: 0.25rem 0.6rem;
          font-size: 0.68rem;
          font-weight: 700;
          border-radius: 3px;
          text-transform: uppercase;
          z-index: 1;
        }

        .badge-pill.gold {
          background-color: #EAB308;
          color: #ffffff;
        }

        .product-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .info-frame {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          flex: 1;
        }

        .rating-row {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.72rem;
        }

        .star-gold { color: #F59E0B; font-weight: 700; }
        .sep-pipe { color: #D1D5DB; }

        .reviews {
          color: #6B7280;
        }

        .product-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: #121316;
          line-height: 1.35;
        }

        .price-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.4rem;
        }

        .curr-price {
          font-size: 1rem;
          font-weight: 800;
          color: #121316;
        }

        .orig-price {
          font-size: 0.82rem;
          color: #9CA3AF;
          text-decoration: line-through;
        }

        .btn-container {
          padding: 0 1rem 1rem 1rem;
        }

        .add-to-cart-btn {
          width: 100%;
          background-color: #121316;
          color: #ffffff;
          border: 1px solid transparent;
          padding: 0.75rem 0;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .add-to-cart-btn:hover {
          background-color: #2D3036;
          border-color: #C5A059;
        }

        .add-to-cart-btn:active {
          transform: scale(0.97);
        }

        .bestseller-skeleton-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        .skeleton-card {
          width: 100%;
          height: 320px;
          border-radius: 8px;
          background: linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%);
          background-size: 200% 100%;
          animation: pulse-shimmer 1.5s infinite ease-in-out;
        }

        @keyframes pulse-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .loading-state {
          text-align: center;
          padding: 5rem 0;
          color: #6B7280;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #E5E7EB;
          border-top-color: #121316;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 1rem auto;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 1024px) {
          .products-grid { grid-template-columns: repeat(3, 1fr); }
        }

        @media (max-width: 768px) {
          .products-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 480px) {
          .products-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
