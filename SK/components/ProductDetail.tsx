import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { ShieldCheck, ChevronDown, ChevronUp, ShoppingBag, Zap, Truck, RefreshCw, CheckCircle2, ChevronRight } from 'lucide-react';
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
  categoryName?: string;
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
    specifications: false,
    shipping: false
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
        const originalPriceNum = parseFloat(backendProd.price) || numericPrice * 1.25;
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
          title: backendProd.alias || backendProd.slug || 'SK Premium Selection',
          subtag: 'OFFICIAL SK SELECTION',
          tagline: backendProd.sdescription || 'Authentic & Premium Quality Book',
          price: numericPrice,
          originalPrice: originalPriceNum,
          discountBadge: discountBadge || 'LIMITED EDITION',
          rating: backendProd.rating ? backendProd.rating.toFixed(1) : '4.9',
          reviewsCount: backendProd.review_count || 64,
          mainImg: images[0],
          gallery: images,
          description: backendProd.description,
          categoryName: (backendProd as any).category_id || backendProd.product_group ? 'Books & Literature' : 'SK Collection'
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
          <title>Loading Product | SK Selection</title>
        </Head>
        <Header />
        <main className="product-detail-main">
          <div className="skeleton-container">
            <div className="skeleton-grid">
              <div className="skeleton-box img-skeleton" />
              <div className="skeleton-info">
                <div className="skeleton-line short" />
                <div className="skeleton-line title" />
                <div className="skeleton-line medium" />
                <div className="skeleton-line price" />
                <div className="skeleton-box btn-skeleton" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
        <style jsx>{`
          .product-detail-wrapper { min-height: 100vh; display: flex; flex-direction: column; background-color: #ffffff; }
          .product-detail-main { flex: 1; padding: 8rem 0 5rem 0; }
          .skeleton-container { max-width: 1440px; margin: 0 auto; padding: 0 2rem; }
          .skeleton-grid { display: grid; grid-template-columns: 1fr 1.1fr; gap: 4rem; }
          .skeleton-box { border-radius: 12px; background: linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%); background-size: 200% 100%; animation: pulse 1.5s infinite; }
          .img-skeleton { height: 480px; width: 100%; }
          .btn-skeleton { height: 52px; width: 100%; margin-top: 2rem; }
          .skeleton-info { display: flex; flex-direction: column; gap: 1.2rem; }
          .skeleton-line { height: 16px; border-radius: 4px; background: linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%); background-size: 200% 100%; animation: pulse 1.5s infinite; }
          .short { width: 30%; }
          .title { width: 85%; height: 32px; }
          .medium { width: 60%; }
          .price { width: 40%; height: 28px; }
          @keyframes pulse { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
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
      img: productData.gallery[selectedImgIndex] || productData.mainImg
    }, quantity, true);
  };

  const handleBuyNowClick = () => {
    addToCart({
      id: productData.id,
      title: productData.title,
      price: productData.price,
      originalPrice: productData.originalPrice,
      img: productData.gallery[selectedImgIndex] || productData.mainImg
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
            {/* Breadcrumb Bar */}
            <div className="breadcrumb-nav">
              <Link href="/" className="crumb-link">Home</Link>
              <ChevronRight size={13} color="#9CA3AF" />
              <Link href="/products" className="crumb-link">Catalogue</Link>
              <ChevronRight size={13} color="#9CA3AF" />
              <span className="crumb-active">{productData.title}</span>
            </div>

            {/* Top Detail Grid */}
            <div className="product-top-grid">
              {/* Left Column: Product Image Gallery */}
              <div className="gallery-left-col">
                <div className="main-display-box">
                  {productData.discountBadge && (
                    <span className="discount-badge-tag">{productData.discountBadge}</span>
                  )}
                  <img
                    src={productData.gallery[selectedImgIndex] || productData.mainImg}
                    alt={productData.title}
                    className="main-display-img"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/hero cards/4.png';
                    }}
                  />
                </div>

                {productData.gallery.length > 1 && (
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
                )}
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
                  <span className="reviews-cnt">{productData.reviewsCount} Verified Reviews</span>
                  <span className="sep">|</span>
                  <span className="in-stock-badge">
                    <CheckCircle2 size={13} color="#15803D" />
                    <span>In Stock</span>
                  </span>
                </div>

                {/* Pricing Block */}
                <div className="price-block">
                  <div className="price-values">
                    <span className="selling-price">₹{productData.price * quantity}</span>
                    {productData.originalPrice > productData.price && (
                      <span className="original-price">₹{productData.originalPrice * quantity}</span>
                    )}
                  </div>
                  <span className="taxes-subtext">Inclusive of all taxes & free shipping across India</span>
                </div>

                <div className="divider-line" />

                {/* Quantity Selector Row */}
                <div className="qty-selector-row">
                  <span className="qty-label">Quantity</span>
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
                    <ShoppingBag size={18} />
                    <span>ADD TO CART</span>
                    <span className="btn-price-divider">|</span>
                    <span>₹{productData.price * quantity}</span>
                  </button>

                  <button
                    onClick={handleBuyNowClick}
                    className="buy-now-main-btn"
                  >
                    <Zap size={18} />
                    <span>BUY NOW</span>
                  </button>
                </div>

                {/* Trust Guarantee Cards Row */}
                <div className="product-trust-strip">
                  <div className="trust-mini-card">
                    <Truck size={18} color="#C5A059" />
                    <span>Free Express Shipping</span>
                  </div>
                  <div className="trust-mini-card">
                    <ShieldCheck size={18} color="#C5A059" />
                    <span>100% Authentic Product</span>
                  </div>
                  <div className="trust-mini-card">
                    <RefreshCw size={18} color="#C5A059" />
                    <span>Easy 7-Day Replacement</span>
                  </div>
                </div>

                {/* Accordions Block */}
                <div className="accordions-wrapper">
                  <div className="accordion-item">
                    <button onClick={() => toggleAccordion('description')} className="accordion-header">
                      <span>PRODUCT DESCRIPTION</span>
                      {openAccordions.description ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    {openAccordions.description && (
                      <div className="accordion-body">
                        <p>{productData.description || 'Malabar Veerasmruthikal is an authentic, inspiring historical book highlighting courage, legacy, and timeless stories of freedom fighters. Published with high quality archival paper and durable binding for avid readers and collectors alike.'}</p>
                      </div>
                    )}
                  </div>

                  <div className="accordion-item">
                    <button onClick={() => toggleAccordion('specifications')} className="accordion-header">
                      <span>SPECIFICATIONS & DETAILS</span>
                      {openAccordions.specifications ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    {openAccordions.specifications && (
                      <div className="accordion-body">
                        <ul className="spec-list">
                          <li><strong>Language:</strong> Malayalam</li>
                          <li><strong>Binding:</strong> Premium Paperback</li>
                          <li><strong>Publisher:</strong> SK Publications</li>
                          <li><strong>Quality:</strong> 100% Guaranteed Official Edition</li>
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="accordion-item">
                    <button onClick={() => toggleAccordion('shipping')} className="accordion-header">
                      <span>SHIPPING & RETURNS</span>
                      {openAccordions.shipping ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    {openAccordions.shipping && (
                      <div className="accordion-body">
                        <p>Orders are dispatched within 24 hours via express air courier. Delivered within 3-5 business days across India. 7-day hassle-free replacement promise for damaged or incorrect deliveries.</p>
                      </div>
                    )}
                  </div>
                </div>
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

        /* Breadcrumbs */
        .breadcrumb-nav {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: #6B7280;
          margin-bottom: 2rem;
        }

        .crumb-link {
          color: #6B7280;
          text-decoration: none;
          transition: color 0.15s ease;
        }

        .crumb-link:hover { color: #121316; }
        .crumb-active { color: #121316; font-weight: 600; }

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
          position: sticky;
          top: 110px;
          align-self: flex-start;
        }

        .main-display-box {
          position: relative;
          width: 100%;
          aspect-ratio: 0.92;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2.5rem;
          background-color: #ffffff;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
          overflow: hidden;
        }

        .discount-badge-tag {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background-color: #15803D;
          color: #ffffff;
          font-size: 0.68rem;
          font-weight: 800;
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
          letter-spacing: 0.05em;
          z-index: 2;
        }

        .main-display-img {
          max-width: 90%;
          max-height: 90%;
          object-fit: contain;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .main-display-box:hover .main-display-img {
          transform: scale(1.05);
        }

        .thumbnails-row {
          display: flex;
          gap: 1rem;
        }

        .thumb-box {
          width: 76px;
          height: 76px;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          padding: 0.4rem;
          background: #ffffff;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .thumb-box.active {
          border-color: #C5A059;
          box-shadow: 0 0 0 2px rgba(197, 160, 89, 0.3);
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
          gap: 1.1rem;
        }

        .category-subtag {
          font-size: 0.72rem;
          font-weight: 800;
          color: #C5A059;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .product-main-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: #121316;
          line-height: 1.25;
          letter-spacing: 0.01em;
        }

        .product-tagline {
          font-size: 0.95rem;
          color: #4B5563;
          line-height: 1.5;
        }

        .rating-row {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.85rem;
        }

        .star-gold { color: #F59E0B; font-weight: 800; }
        .sep { color: #E5E7EB; }
        .reviews-cnt { color: #4B5563; font-weight: 500; }
        
        .in-stock-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          color: #15803D;
          font-size: 0.8rem;
          font-weight: 700;
        }

        .price-block {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          margin-top: 0.4rem;
        }

        .price-values {
          display: flex;
          align-items: baseline;
          gap: 0.8rem;
        }

        .selling-price {
          font-size: 2.4rem;
          font-weight: 800;
          color: #121316;
        }

        .original-price {
          font-size: 1.25rem;
          color: #9CA3AF;
          text-decoration: line-through;
        }

        .taxes-subtext {
          font-size: 0.78rem;
          color: #6B7280;
        }

        .divider-line {
          width: 100%;
          height: 1px;
          background-color: #F0F0F0;
          margin: 0.4rem 0;
        }

        .qty-selector-row {
          display: flex;
          align-items: center;
          gap: 1.2rem;
        }

        .qty-label {
          font-size: 0.88rem;
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
          width: 38px;
          height: 38px;
          border: none;
          background: #F9FAFB;
          color: #121316;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: background-color 0.15s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .qty-step-btn:hover { background-color: #E5E7EB; }

        .qty-display-val {
          width: 44px;
          text-align: center;
          font-weight: 700;
          font-size: 0.95rem;
          color: #121316;
        }

        .action-buttons-group {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 1rem;
          margin-top: 0.8rem;
        }

        .add-to-cart-main-btn {
          background: #121316;
          color: #ffffff;
          border: 1px solid transparent;
          font-size: 0.85rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          padding: 0.95rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
        }

        .add-to-cart-main-btn:hover {
          border-color: #C5A059;
          box-shadow: 0 8px 22px rgba(197, 160, 89, 0.25);
        }

        .add-to-cart-main-btn:active {
          transform: scale(0.98);
        }

        .btn-price-divider { opacity: 0.4; }

        .buy-now-main-btn {
          background: #C5A059;
          color: #111111;
          border: none;
          font-size: 0.85rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          padding: 0.95rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          box-shadow: 0 4px 14px rgba(197, 160, 89, 0.3);
        }

        .buy-now-main-btn:hover {
          background: #111111;
          color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(0, 0, 0, 0.25);
        }

        .buy-now-main-btn:active {
          transform: scale(0.98);
        }

        /* Trust Strip */
        .product-trust-strip {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.8rem;
          margin-top: 1rem;
          padding: 1rem;
          background: #FAF8F5;
          border: 1px solid #F0EDE8;
          border-radius: 10px;
        }

        .trust-mini-card {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          font-weight: 700;
          color: #121316;
        }

        /* Accordions */
        .accordions-wrapper {
          display: flex;
          flex-direction: column;
          border-top: 1px solid #E5E7EB;
          margin-top: 1.5rem;
        }

        .accordion-item {
          border-bottom: 1px solid #E5E7EB;
        }

        .accordion-header {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.2rem 0;
          background: none;
          border: none;
          font-size: 0.88rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: #121316;
          cursor: pointer;
        }

        .accordion-body {
          padding-bottom: 1.2rem;
          font-size: 0.9rem;
          color: #4B5563;
          line-height: 1.6;
        }

        .spec-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .spec-list li {
          font-size: 0.88rem;
          color: #4B5563;
        }

        @media (max-width: 1024px) {
          .product-main-content { padding: 5.2rem 0 2.5rem 0; }
          .product-top-grid {
            grid-template-columns: 1fr 1fr;
            gap: 1.8rem;
            margin-bottom: 3rem;
          }
          .main-display-box {
            padding: 1rem;
            max-height: 300px;
            aspect-ratio: 1;
          }
          .main-display-img { max-height: 250px; }
          .thumb-box { width: 56px; height: 56px; padding: 0.25rem; }
          .category-subtag { font-size: 0.68rem; }
          .product-main-title { font-size: 1.45rem; line-height: 1.25; }
          .product-tagline { font-size: 0.82rem; }
          .rating-row { font-size: 0.78rem; gap: 0.4rem; }
          .selling-price { font-size: 1.65rem; }
          .original-price { font-size: 1rem; }
          .taxes-subtext { font-size: 0.72rem; }
          .qty-label { font-size: 0.8rem; }
          .qty-step-btn { width: 32px; height: 32px; font-size: 0.95rem; }
          .qty-display-val { width: 36px; font-size: 0.85rem; }
          .add-to-cart-main-btn, .buy-now-main-btn {
            padding: 0.7rem 0.6rem;
            font-size: 0.74rem;
          }
          .gallery-left-col { position: relative; top: 0; }
          .product-trust-strip {
            grid-template-columns: repeat(3, 1fr);
            gap: 0.4rem;
            padding: 0.75rem 0.5rem;
          }
          .trust-mini-card { font-size: 0.66rem; gap: 0.3rem; }
          .accordion-header { padding: 0.9rem 0; font-size: 0.8rem; }
          .accordion-body { font-size: 0.82rem; }
        }

        @media (max-width: 768px) {
          .product-top-grid {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
          .product-trust-strip { grid-template-columns: 1fr; }
        }

        @media (max-width: 640px) {
          .product-main-content { padding: 6rem 0 3rem 0; }
          .action-buttons-group { grid-template-columns: 1fr; }
          .selling-price { font-size: 1.8rem; }
          .product-main-title { font-size: 1.5rem; }
        }
      `}</style>
    </>
  );
}
