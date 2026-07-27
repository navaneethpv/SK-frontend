import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '@/SK/components/Header';
import Footer from '@/SK/components/Footer';
import ProductCard from '@/SK/components/ProductCard';
import { productAPI } from '@/SK/Api/Services/productAPI';
import { IProduct } from '@/SK/Pages/Interfaces/product';
import { getImageUrl } from '@/SK/utils/imageHelper';
import { getProductSlug } from '@/SK/utils/slugHelper';

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

function mapProductToShopItem(prod: IProduct, fallbackImg: string): ShopProduct {
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
    title: prod.alias || prod.slug || 'SK Luxury Item',
    slug: getProductSlug(prod),
    category: (prod as any).category?.slug || (prod as any).category_name || 'all',
    price: numericPrice,
    originalPrice: originalPriceNum > numericPrice ? originalPriceNum : undefined,
    rating: prod.rating ? prod.rating.toFixed(1) : '4.8',
    reviewsCount: prod.review_count || 45,
    badgeText: discountBadge || 'Best Seller',
    badgeType: discountBadge ? 'green' : 'gold',
    img: getImageUrl(rawImg, fallbackImg)
  };
}

export default function ShopPage() {
  const router = useRouter();
  const { category, filter, search } = router.query;

  const [products, setProducts] = useState<ShopProduct[]>(DEFAULT_PRODUCTS);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    productAPI.getProducts()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((prod: IProduct, idx: number) =>
            mapProductToShopItem(prod, DEFAULT_PRODUCTS[idx % DEFAULT_PRODUCTS.length].img)
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

      <div className="shop-page-wrapper">
        <Header />

        <main className="shop-main-content">
          <div className="container">
            {/* Header Title */}
            <div className="shop-header-box">
              <span className="section-subtag">CATALOGUE</span>
              <h1 className="shop-title">
                {filter
                  ? `${(filter as string).replace('-', ' ').toUpperCase()} COLLECTION`
                  : category
                  ? `${(category as string).toUpperCase()} COLLECTION`
                  : 'CURATED CATALOGUE'}
              </h1>
              <p className="shop-subtitle">Discover premium lifestyle, fragrance, and organic grooming essentials.</p>
            </div>

            {/* Filter Tabs */}
            <div className="category-tabs-row">
              {categoriesList.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`tab-btn ${activeCategory === tab.id ? 'active' : ''}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading shop collection...</p>
              </div>
            ) : (
              <div className="shop-grid">
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

      <style jsx>{`
        .shop-page-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background-color: #FAFAFA;
        }

        .shop-main-content {
          flex: 1;
          padding: 8rem 0 6rem 0;
        }

        .container {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .shop-header-box {
          text-align: center;
          margin-bottom: 3rem;
        }

        .section-subtag {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          color: #C5A059;
          display: block;
          margin-bottom: 0.4rem;
        }

        .shop-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: #111111;
          letter-spacing: 0.04em;
          margin-bottom: 0.6rem;
        }

        .shop-subtitle {
          font-size: 0.95rem;
          color: #666666;
        }

        .category-tabs-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 3rem;
          flex-wrap: wrap;
        }

        .tab-btn {
          background-color: #ffffff;
          border: 1px solid #EAEAEA;
          padding: 0.65rem 1.4rem;
          border-radius: 20px;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #666666;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .tab-btn:hover {
          border-color: #111111;
          color: #111111;
        }

        .tab-btn.active {
          background-color: #111111;
          border-color: #111111;
          color: #ffffff;
        }

        .shop-grid {
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
          .shop-grid { grid-template-columns: repeat(3, 1fr); }
        }

        @media (max-width: 768px) {
          .shop-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 480px) {
          .shop-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
