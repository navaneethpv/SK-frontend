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

const DEFAULT_CATEGORIES: CategoryTile[] = [
  { id: 1, name: 'Bags & Luggage', slug: 'bags', img: '/images/category_tile_1.png' },
  { id: 2, name: 'Luxury Watches', slug: 'watches', img: '/images/category_tile_2.png' },
  { id: 3, name: 'Footwear Collection', slug: 'footwear', img: '/images/category_tile_3.png' },
  { id: 4, name: 'Perfumes & Eau De Parfum', slug: 'perfume', img: '/images/category_tile_4.png' },
  { id: 5, name: 'Wallet & Belt Collection', slug: 'wallet-belt', img: '/images/category_tile_5.png' },
  { id: 6, name: 'Hair Care & Nourishment', slug: 'haircare', img: '/images/category_tile_6.png' }
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryTile[]>(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    productAPI.getCategories()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((cat: any, idx: number) => {
            const fallback = DEFAULT_CATEGORIES[idx % DEFAULT_CATEGORIES.length].img;
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
    <div className="categories-page-wrapper">
      <Head>
        <title>Product Categories | SK Luxury Grooming & Lifestyle</title>
        <meta name="description" content="Explore SK product categories: Bags, Watches, Footwear, Perfumes, Belts, and Hair Care." />
      </Head>

      <Header />

      <main className="categories-main">
        <div className="page-header-banner">
          <div className="banner-content">
            <span className="sub-tag">EXPLORE BY CATEGORY</span>
            <h1 className="main-title">Product Categories</h1>
            <p className="description-text">
              Browse our curated luxury categories designed for your hair care, fragrance, and lifestyle needs.
            </p>
          </div>
        </div>

        <div className="content-container">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading categories...</p>
            </div>
          ) : (
            <div className="categories-grid">
              {categories.map((cat, idx) => (
                <Link key={cat.id} href={`/shop?category=${cat.slug}`} className="category-card">
                  <div className="img-wrapper">
                    <img
                      src={cat.img}
                      alt={cat.name}
                      className="category-img"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_CATEGORIES[idx % DEFAULT_CATEGORIES.length].img;
                      }}
                    />
                    <div className="overlay-gradient"></div>
                  </div>
                  <div className="card-caption">
                    <h3 className="cat-title">{cat.name}</h3>
                    <span className="shop-link-text">Shop Collection →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .categories-page-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background-color: #FAF8F5;
        }

        .categories-main {
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

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.8rem;
        }

        .category-card {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          background-color: #ffffff;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
          transition: all 0.3s ease;
        }

        .category-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.14);
        }

        .img-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 1.1;
          overflow: hidden;
        }

        .category-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .category-card:hover .category-img {
          transform: scale(1.06);
        }

        .overlay-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0) 65%);
        }

        .card-caption {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 1.5rem;
          color: #ffffff;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .cat-title {
          font-size: 1.25rem;
          font-weight: 700;
        }

        .shop-link-text {
          font-size: 0.85rem;
          font-weight: 600;
          color: #EAB308;
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

        @media (max-width: 900px) {
          .categories-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 600px) {
          .categories-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
