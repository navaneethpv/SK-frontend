import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import ProductCard from '@/components/product/ProductCard';
import { productAPI } from '@/api/services/productAPI';
import { IProduct } from '@/types/product';
import { getImageUrl } from '@/utils/imageHelper';

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

const DEFAULT_PRODUCTS: ProductItem[] = [
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
    title: prod.alias || prod.slug || 'SK Product',
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

export default function AllProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>(DEFAULT_PRODUCTS);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    productAPI.getProducts()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((prod: IProduct, idx: number) =>
            mapProductToItem(prod, DEFAULT_PRODUCTS[idx % DEFAULT_PRODUCTS.length].img)
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
    <div className="products-page-wrapper">
      <Head>
        <title>All Products | SK Luxury Grooming & Lifestyle</title>
        <meta name="description" content="Browse full range of SK organic hair care, artisanal perfumes, face serums, and leather accessories." />
      </Head>

      <Header />

      <main className="products-main">
        <div className="page-header-banner">
          <div className="banner-content">
            <span className="sub-tag">SK CATALOGUE</span>
            <h1 className="main-title">ALL PRODUCTS</h1>
            <p className="description-text">
              Explore our full collection of organic grooming formulations and lifestyle essentials.
            </p>
          </div>
        </div>

        <div className="content-container">
          <div className="filter-bar-row">
            <span className="results-count">Showing {products.length} Products</span>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading products catalogue...</p>
            </div>
          ) : (
            <div className="products-grid">
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

      <style jsx>{`
        .products-page-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background-color: #FAFAFA;
        }

        .products-main {
          flex: 1;
        }

        .page-header-banner {
          background-color: #111111;
          color: #ffffff;
          padding: 7rem 2rem 4rem 2rem;
          text-align: center;
        }

        .banner-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .sub-tag {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          color: #C5A059;
          margin-bottom: 0.8rem;
        }

        .main-title {
          font-size: 2.2rem;
          font-weight: 800;
          margin-bottom: 0.8rem;
          letter-spacing: 0.04em;
        }

        .description-text {
          font-size: 0.95rem;
          color: #A3A3A3;
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
          border-bottom: 1px solid #EAEAEA;
        }

        .results-count {
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: #666666;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
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
          border-top-color: #111111;
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
