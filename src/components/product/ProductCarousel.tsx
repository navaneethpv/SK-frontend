import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getProductSlug } from '@/utils/slugHelper';

export interface ItemCard {
  id: number;
  title: string;
  slug?: string;
  rating?: string;
  reviewsCount?: number;
  discountBadge?: string;
  price: string;
  originalPrice?: string;
  badgeText?: string;
  badgeType?: 'green' | 'gold' | 'none';
  img: string;
  actionText: string;
}

export function RenderProductCard({ item }: { item: ItemCard }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const rawPrice = item.price.replace(/[^\d.]/g, '');
    const numericPrice = parseFloat(rawPrice);
    const rawOrig = item.originalPrice ? item.originalPrice.replace(/[^\d.]/g, '') : '';
    const numericOrig = parseFloat(rawOrig);

    addToCart({
      id: item.id,
      title: item.title,
      price: isNaN(numericPrice) ? 499 : numericPrice,
      originalPrice: isNaN(numericOrig) ? undefined : numericOrig,
      img: item.img
    });
  };

  return (
    <div className="card-box">
      <Link href={`/product/${getProductSlug(item)}`} className="card-link">
        <div className="img-frame">
          {item.badgeText && item.badgeType && (
            <span className={`badge-pill ${item.badgeType}`}>{item.badgeText}</span>
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
          <div className="info-top-block">
            <div className="rating-slot">
              {item.rating && (
                <div className="rating-row">
                  <span className="star-gold">★ {item.rating}</span>
                  <span className="sep-pipe">|</span>
                  <span className="reviews-cnt">{item.reviewsCount} Reviews</span>
                </div>
              )}
            </div>

            <h3 className="title-text">{item.title}</h3>

            <div className="discount-slot">
              {item.discountBadge && <span className="discount-badge">{item.discountBadge}</span>}
            </div>

            <div className="price-slot">
              {item.price && (
                <div className="price-row">
                  <span className="curr-price">{item.price}</span>
                  {item.originalPrice && <span className="orig-price">{item.originalPrice}</span>}
                </div>
              )}
            </div>
          </div>

          <div className="btn-slot">
            <button onClick={handleAddToCart} className="action-btn">{item.actionText}</button>
          </div>
        </div>
      </Link>

      <style jsx>{`
        .card-box {
          background-color: #ffffff;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          height: 100%;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .card-box:hover {
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
          border-color: #D1D5DB;
          transform: translateY(-4px);
        }

        .card-box:hover .product-img {
          transform: scale(1.06);
        }

        .card-link {
          display: flex;
          flex-direction: column;
          height: 100%;
          flex: 1;
        }

        .img-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 0.95;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          background-color: #ffffff;
        }

        .product-img {
          max-width: 85%;
          max-height: 85%;
          object-fit: contain;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .badge-pill {
          position: absolute;
          top: 0.6rem;
          left: 0.6rem;
          font-size: 0.62rem;
          font-weight: 700;
          padding: 0.2rem 0.5rem;
          border-radius: 3px;
          z-index: 2;
        }

        .badge-pill.green {
          background-color: #15803D;
          color: #ffffff;
        }

        .badge-pill.gold {
          background-color: #C5A059;
          color: #ffffff;
        }

        .info-frame {
          padding: 0.8rem 1rem 1rem 1rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex: 1;
        }

        .info-top-block {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .rating-slot {
          min-height: 18px;
          display: flex;
          align-items: center;
        }

        .rating-row {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.72rem;
        }

        .star-gold { color: #F59E0B; font-weight: 700; }
        .sep-pipe { color: #D1D5DB; }
        .reviews-cnt { color: #4B5563; font-weight: 500; }

        .title-text {
          font-size: 0.86rem;
          font-weight: 700;
          color: #121316;
          line-height: 1.35;
          margin-top: 0.1rem;
          min-height: 2.3rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .discount-slot {
          min-height: 18px;
          display: flex;
          align-items: center;
        }

        .discount-badge {
          color: #15803D;
          font-size: 0.72rem;
          font-weight: 700;
        }

        .price-slot {
          min-height: 22px;
          display: flex;
          align-items: center;
        }

        .price-row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          margin: 0.1rem 0;
        }

        .curr-price {
          font-size: 0.95rem;
          font-weight: 800;
          color: #121316;
        }

        .orig-price {
          font-size: 0.75rem;
          color: #9CA3AF;
          text-decoration: line-through;
        }

        .btn-slot {
          margin-top: auto;
          padding-top: 0.6rem;
        }

        .action-btn {
          width: 100%;
          background: linear-gradient(180deg, #27272A 0%, #121316 100%);
          color: #ffffff;
          border: 1px solid transparent;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.65rem 0.5rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-btn:hover {
          border-color: #C5A059;
          box-shadow: 0 4px 12px rgba(197, 160, 89, 0.2);
        }

        .action-btn:active {
          transform: scale(0.98);
        }

        @media (max-width: 640px) {
          .info-frame { padding: 0.6rem; }
          .title-text { font-size: 0.78rem; min-height: 2.1rem; line-height: 1.28; }
          .curr-price { font-size: 0.88rem; }
          .orig-price { font-size: 0.7rem; }
          .badge-pill { font-size: 0.58rem; padding: 0.15rem 0.4rem; }
          .action-btn { font-size: 0.68rem; padding: 0.5rem 0.4rem; }
        }
      `}</style>
    </div>
  );
}

export default function ProductCarousel({ items }: { items: ItemCard[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [items]);

  const maxIndex = Math.max(0, items.length - 4);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  };

  return (
    <div className="carousel-outer-wrapper">
      {items.length > 4 && (
        <button onClick={handlePrev} className="nav-arrow arrow-left" aria-label="Previous">
          <ChevronLeft size={16} color="#71717A" />
        </button>
      )}

      <div className="carousel-clip-container">
        <div
          className="carousel-smooth-track"
          style={{
            transform: `translateX(-${currentIndex * 24.5}%)`,
          }}
        >
          {items.map((item) => (
            <div key={item.id} className="carousel-card-item">
              <RenderProductCard item={item} />
            </div>
          ))}
        </div>
      </div>

      {items.length > 4 && (
        <button onClick={handleNext} className="nav-arrow arrow-right" aria-label="Next">
          <ChevronRight size={16} color="#71717A" />
        </button>
      )}

      <style jsx>{`
        .carousel-outer-wrapper {
          position: relative;
          width: 100%;
        }

        .carousel-clip-container {
          overflow: hidden;
          width: 100%;
          padding: 0.5rem 0;
        }

        .carousel-smooth-track {
          display: flex;
          gap: 1.2rem;
          transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
          will-change: transform;
        }

        .carousel-card-item {
          flex: 0 0 calc((100% - 3.6rem) / 4.25);
          min-width: calc((100% - 3.6rem) / 4.25);
        }

        .nav-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #ffffff;
          border: 1px solid #E4E4E7;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 30;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
          transition: all 0.2s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .nav-arrow:hover {
          background: #121316;
          border-color: #121316;
          transform: translateY(-50%) scale(1.08);
        }

        .nav-arrow:hover :global(svg) {
          color: #ffffff !important;
          stroke: #ffffff !important;
        }

        .arrow-left {
          left: -16px;
        }

        .arrow-right {
          right: -16px;
        }

        @media (max-width: 1100px) {
          .carousel-card-item {
            flex: 0 0 calc((100% - 2.4rem) / 3.25);
            min-width: calc((100% - 2.4rem) / 3.25);
          }
          .arrow-left { left: 4px; }
          .arrow-right { right: 4px; }
        }

        @media (max-width: 650px) {
          .carousel-card-item {
            flex: 0 0 calc((100% - 1.2rem) / 2.2);
            min-width: calc((100% - 1.2rem) / 2.2);
          }
        }
      `}</style>
    </div>
  );
}
