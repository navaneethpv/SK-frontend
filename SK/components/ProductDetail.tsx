import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ShieldCheck, ChevronDown, ChevronUp, ShoppingBag, Zap } from 'lucide-react';
import Header from '@/SK/components/Header';
import Footer from '@/SK/components/Footer';
import DealOfTheDay from '@/SK/components/DealOfTheDay';
import { useCart } from '@/SK/context/CartContext';
import { productAPI } from '@/SK/Api/Services/productAPI';
import { getImageUrl } from '@/SK/utils/imageHelper';
import { getProductSlug, slugify } from '@/SK/utils/slugHelper';
import { IProduct } from '@/SK/Pages/Interfaces/product';

interface ProductData {
  id: number;
  title: string;
  subtag: string;
  tagline: string;
  price: number;
  originalPrice: number;
  discountBadge: string;
  rating: string;
  reviewsCount: number;
  mainImg: string;
  gallery: string[];
  description?: string;
}

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [productData, setProductData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImgIndex, setSelectedImgIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);

  const { addToCart } = useCart();

  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    description: true,
    howToUse: false,
    faqs: false,
    ingredients: false,
    info: false
  });

  const toggleAccordion = (sec: string) => {
    setOpenAccordions(prev => ({ ...prev, [sec]: !prev[sec] }));
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      const strId = String(id).trim();
      const numId = Number(strId);

      const mapAndSetProduct = (backendProd: IProduct) => {
        const numericPrice = typeof backendProd.selling_price === 'number' && backendProd.selling_price > 0
          ? backendProd.selling_price
          : parseFloat(backendProd.price) || 499;
        const originalPriceNum = parseFloat(backendProd.price) || numericPrice * 1.2;
        const discountVal = parseFloat(backendProd.discount) || 0;
        let discountBadge = '';
        if (discountVal > 0 && originalPriceNum > 0) {
          const percent = Math.round((discountVal / originalPriceNum) * 100);
          if (percent > 0) discountBadge = `${percent}% OFF`;
        }

        const images = backendProd.img && backendProd.img.length > 0
          ? backendProd.img.map(i => getImageUrl(i.image, '/hero cards/4.png'))
          : [getImageUrl(backendProd.icon, '/hero cards/4.png')];

        const readableSlug = getProductSlug(backendProd);
        if (readableSlug && readableSlug !== strId && typeof window !== 'undefined') {
          router.replace(`/product/${readableSlug}`, undefined, { shallow: true });
        }

        setProductData({
          id: backendProd.id,
          title: backendProd.alias || backendProd.slug || 'SK Premium Product',
          subtag: 'LUXURY GROOMING & LIFESTYLE',
          tagline: backendProd.sdescription || 'Nourish. Strengthen. Shine.',
          price: numericPrice,
          originalPrice: originalPriceNum,
          discountBadge: discountBadge || 'SPECIAL OFFER',
          rating: backendProd.rating ? backendProd.rating.toFixed(1) : '4.8',
          reviewsCount: backendProd.review_count || 50,
          mainImg: images[0],
          gallery: images,
          description: backendProd.description
        });
      };

      if (!isNaN(numId) && String(numId) === strId) {
        productAPI.getProductById(numId)
          .then((backendProd) => {
            if (backendProd && backendProd.id) {
              mapAndSetProduct(backendProd);
            }
          })
          .catch((err) => console.warn('Get single product API error:', err))
          .finally(() => setLoading(false));
      } else {
        productAPI.getProducts()
          .then((allProducts) => {
            if (Array.isArray(allProducts) && allProducts.length > 0) {
              const matched = allProducts.find((p) => {
                const aliasSlug = slugify(p.alias || p.slug);
                return aliasSlug === strId || p.alias === strId || p.slug === strId || String(p.id) === strId;
              });

              if (matched && matched.id) {
                productAPI.getProductById(matched.id)
                  .then((detail) => mapAndSetProduct(detail || matched))
                  .catch(() => mapAndSetProduct(matched));
              } else {
                mapAndSetProduct(allProducts[0]);
              }
            }
          })
          .catch((err) => console.warn('Alias resolution error:', err))
          .finally(() => setLoading(false));
      }
    }
  }, [id]);

  if (loading || !productData) {
    return (
      <div className="product-detail-wrapper">
        <Head>
          <title>Loading Product | SK Luxury Grooming</title>
        </Head>
        <Header />
        <main className="product-detail-main">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading product details...</p>
          </div>
        </main>
        <Footer />
        <style jsx>{`
          .product-detail-wrapper { min-height: 100vh; display: flex; flex-direction: column; background-color: #FAF8F5; }
          .product-detail-main { flex: 1; display: flex; align-items: center; justify-content: center; min-height: 60vh; }
          .loading-state { text-align: center; color: #6B7280; }
          .spinner { width: 40px; height: 40px; border: 3px solid #E5E7EB; border-top-color: #121316; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1rem auto; }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  const handleAddToCartClick = () => {
    addToCart({
      id: productData.id,
      title: productData.title,
      price: productData.price,
      originalPrice: productData.originalPrice,
      img: productData.gallery[selectedImgIndex] || productData.mainImg,
      variant: '50ml'
    }, quantity, true);
  };

  const handleBuyNowClick = () => {
    addToCart({
      id: productData.id,
      title: productData.title,
      price: productData.price,
      originalPrice: productData.originalPrice,
      img: productData.gallery[selectedImgIndex] || productData.mainImg,
      variant: '50ml'
    }, quantity, false);
    router.push('/checkout');
  };

  return (
    <>
      <Head>
        <title>{productData.title} | SK</title>
        <meta name="description" content={productData.tagline} />
      </Head>

      <div className="product-page-wrapper">
        <Header />

        <main className="product-main-content">
          <div className="product-container">
            {/* Top Detail Grid */}
            <div className="product-top-grid">
              {/* Left Column: Product Image Gallery */}
              <div className="gallery-left-col">
                <div className="main-display-box">
                  <img
                    src={productData.gallery[selectedImgIndex] || productData.mainImg}
                    alt={productData.title}
                    className="main-display-img"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/hero cards/4.png';
                    }}
                  />
                </div>

                <div className="thumbnails-row">
                  {productData.gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImgIndex(idx)}
                      className={`thumb-box ${selectedImgIndex === idx ? 'active' : ''}`}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column: Product Information & Purchase Form */}
              <div className="info-right-col">
                <span className="category-subtag">{productData.subtag}</span>
                <h1 className="product-main-title">{productData.title}</h1>
                <p className="product-tagline">{productData.tagline}</p>

                {/* Rating Row */}
                <div className="rating-row">
                  <span className="star-gold">★ {productData.rating}</span>
                  <span className="sep">|</span>
                  <span className="reviews-cnt">{productData.reviewsCount} Verified reviews</span>
                  <ShieldCheck size={16} className="verified-blue-icon" />
                </div>

                {/* Pricing Block */}
                <div className="price-block">
                  <span className="discount-badge-green">{productData.discountBadge}</span>
                  <div className="price-values">
                    <span className="selling-price">₹{productData.price * quantity}</span>
                    <span className="original-price">₹{productData.originalPrice * quantity}</span>
                  </div>
                  <span className="taxes-subtext">Inclusive of all taxes</span>
                </div>

                {/* Quantity Control Row */}
                <div className="qty-selector-row">
                  <span className="qty-label">Quantity:</span>
                  <div className="qty-box-group">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="qty-step-btn"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="qty-display-val">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="qty-step-btn"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons Row */}
                <div className="action-buttons-group">
                  <button
                    onClick={handleAddToCartClick}
                    className="add-to-cart-main-btn"
                  >
                    {/* <ShoppingBag size={18} /> */}
                    <span>ADD TO CART</span>
                    <span className="btn-price-divider">|</span>
                    <span>₹{productData.price * quantity}</span>
                  </button>

                  <button
                    onClick={handleBuyNowClick}
                    className="buy-now-main-btn"
                  >
                    {/* <Zap size={18} /> */}
                    <span>BUY NOW</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Accordions List */}
            <div className="accordions-wrapper">
              <div className="accordion-item">
                <button onClick={() => toggleAccordion('description')} className="accordion-header">
                  <span>DESCRIPTION</span>
                  {openAccordions.description ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {openAccordions.description && (
                  <div className="accordion-body">
                    <p>{productData.description || 'Experience a rich blend of premium organic formulations designed to keep you feeling confident all day long. Crafted with natural cold-pressed essential oils in high concentration for maximum longevity.'}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Deal of the Day Section */}
            <DealOfTheDay />
          </div>
        </main>

        <Footer />
      </div>

      <style jsx>{`
        .product-page-wrapper {
          width: 100%;
          min-height: 100vh;
          background-color: #ffffff;
        }

        .product-main-content {
          padding: 8rem 0 5rem 0;
        }

        .product-container {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .product-top-grid {
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          gap: 4rem;
          margin-bottom: 5rem;
        }

        /* Left Gallery */
        .gallery-left-col {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .main-display-box {
          width: 100%;
          aspect-ratio: 0.95;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background-color: #ffffff;
        }

        .main-display-img {
          max-width: 90%;
          max-height: 90%;
          object-fit: contain;
        }

        .thumbnails-row {
          display: flex;
          gap: 1rem;
        }

        .thumb-box {
          width: 70px;
          height: 70px;
          border: 1px solid #E5E7EB;
          border-radius: 6px;
          padding: 0.4rem;
          background: #ffffff;
          cursor: pointer;
          transition: border-color 0.2s ease;
        }

        .thumb-box.active {
          border-color: #121316;
          border-width: 2px;
        }

        .thumb-box img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        /* Right Info */
        .info-right-col {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .category-subtag {
          font-size: 0.75rem;
          font-weight: 700;
          color: #6B7280;
          letter-spacing: 0.05em;
        }

        .product-main-title {
          font-family: var(--font-sans);
          font-size: 2rem;
          font-weight: 700;
          color: #121316;
        }

        .product-tagline {
          font-size: 0.95rem;
          color: #4B5563;
        }

        .rating-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
        }

        .star-gold { color: #F59E0B; font-weight: 700; }
        .sep { color: #D1D5DB; }
        .reviews-cnt { color: #4B5563; }
        :global(.verified-blue-icon) { color: #0284C7; }

        /* Price block */
        .price-block {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          margin-top: 0.4rem;
        }

        .discount-badge-green {
          display: inline-block;
          border: 1px solid #10B981;
          color: #10B981;
          font-size: 0.68rem;
          font-weight: 700;
          padding: 0.2rem 0.5rem;
          border-radius: 3px;
          align-self: flex-start;
        }

        .price-values {
          display: flex;
          align-items: baseline;
          gap: 0.8rem;
        }

        .selling-price {
          font-size: 2.2rem;
          font-weight: 800;
          color: #121316;
        }

        .original-price {
          font-size: 1.2rem;
          color: #9CA3AF;
          text-decoration: line-through;
        }

        .taxes-subtext {
          font-size: 0.75rem;
          color: #9CA3AF;
        }

        /* Quantity selector */
        .qty-selector-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 0.8rem 0 0.2rem 0;
        }

        .qty-label {
          font-size: 0.85rem;
          font-weight: 700;
          color: #121316;
        }

        .qty-box-group {
          display: flex;
          align-items: center;
          border: 1px solid #D1D5DB;
          border-radius: 8px;
          overflow: hidden;
          background: #ffffff;
        }

        .qty-step-btn {
          width: 36px;
          height: 36px;
          border: none;
          background: #F3F4F6;
          color: #121316;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: background-color 0.15s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .qty-step-btn:hover {
          background: #E5E7EB;
        }

        .qty-display-val {
          min-width: 40px;
          text-align: center;
          font-size: 0.95rem;
          font-weight: 800;
          color: #121316;
        }

        .action-buttons-group {
          display: flex;
          gap: 1rem;
          margin-top: 0.5rem;
          width: 100%;
        }

        .add-to-cart-main-btn {
          flex: 1;
          height: 50px;
          background-color: #121316;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.8rem;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .add-to-cart-main-btn:hover {
          background-color: #334155;
        }

        .buy-now-main-btn {
          flex: 1;
          height: 50px;
          background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
          color: #ffffff;
          border: none;
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .buy-now-main-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(37, 211, 102, 0.4);
        }

        .btn-price-divider {
          opacity: 0.4;
        }

        /* Accordions */
        .accordions-wrapper {
          border-top: 1px solid #E5E7EB;
          margin-bottom: 5rem;
        }

        .accordion-item {
          border-bottom: 1px solid #E5E7EB;
        }

        .accordion-header {
          width: 100%;
          padding: 1.4rem 0;
          background: none;
          border: none;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.9rem;
          font-weight: 700;
          color: #121316;
          letter-spacing: 0.05em;
          cursor: pointer;
        }

        .accordion-body {
          padding-bottom: 1.4rem;
          font-size: 0.88rem;
          color: #4B5563;
          line-height: 1.6;
        }

        /* Reviews Section */
        .reviews-section {
          width: 100%;
          margin-bottom: 5rem;
        }

        .reviews-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #121316;
          margin-bottom: 0.5rem;
        }

        .reviews-score-row {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          margin-bottom: 2rem;
        }

        .score-number {
          font-size: 0.9rem;
          color: #4B5563;
          font-weight: 600;
        }

        .stars-gold {
          color: #F59E0B;
          font-size: 1rem;
        }

        .stars-gold.small {
          font-size: 0.85rem;
        }

        .reviews-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .review-entry {
          border-bottom: 1px solid #E5E7EB;
          padding-bottom: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .entry-header {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .reviewer-name {
          font-size: 0.9rem;
          font-weight: 700;
          color: #121316;
        }

        .entry-date {
          font-size: 0.75rem;
          color: #9CA3AF;
        }

        .review-headline {
          font-size: 0.9rem;
          font-weight: 700;
          color: #121316;
        }

        .review-comment {
          font-size: 0.85rem;
          color: #4B5563;
          line-height: 1.5;
        }

        @media (max-width: 1024px) {
          .product-top-grid {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
        }
      `}</style>
    </>
  );
}
